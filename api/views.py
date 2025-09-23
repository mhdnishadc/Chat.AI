import os
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from .models import ChatThread, ChatMessage
from .serializers import ThreadSerializer
from dotenv import load_dotenv
load_dotenv()

# Groq client
from groq import Groq
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# ----------------------------
# User Signup
# ----------------------------
@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response({"error": "username and password required"}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({"error": "username taken"}, status=400)
    User.objects.create_user(username=username, password=password)
    return Response({"message": "created"}, status=201)

# ----------------------------
# Thread List / Create
# ----------------------------
class ThreadListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ThreadSerializer

    def get_queryset(self):
        return ChatThread.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ----------------------------
# Thread Retrieve (single with messages)
# ----------------------------
class ThreadRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ThreadSerializer

    def get_queryset(self):
        return ChatThread.objects.filter(user=self.request.user)

# ----------------------------
# Chat endpoint (auto-create thread if needed)
# ----------------------------
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def post_message(request, thread_id=None):
    user = request.user
    user_content = (request.data.get("content") or "").strip()
    if not user_content:
        return Response({"error": "empty message"}, status=400)

    # If thread_id is given -> use it, else auto-create a new thread
    if thread_id:
        try:
            thread = ChatThread.objects.get(id=thread_id, user=user)
            if not thread.title:
                thread.title = user_content[:30]
                thread.save()
        except ChatThread.DoesNotExist:
            return Response({"error": "thread not found"}, status=404)
    else:
        thread = ChatThread.objects.create(user=user, title=user_content[:30])  # title = first few words

    # Save user message
    ChatMessage.objects.create(thread=thread, sender="user", content=user_content)

    # Get last 20 messages for context
    last_msgs = thread.messages.all().order_by("-timestamp")[:20][::-1]
    messages_payload = [{"role": "system", "content": "You are a helpful assistant."}]
    for m in last_msgs:
        role = "user" if m.sender == "user" else "assistant"
        messages_payload.append({"role": role, "content": m.content})

    # Call Groq (LLM)
    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_payload,
            temperature=0.2,
        )
        assistant_text = resp.choices[0].message.content
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    # Save assistant reply
    ChatMessage.objects.create(thread=thread, sender="assistant", content=assistant_text)

    return Response(
        {"assistant": assistant_text, "thread_id": thread.id},
        status=200,
    )
