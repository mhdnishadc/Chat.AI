from rest_framework import serializers
from .models import ChatThread, ChatMessage
from django.contrib.auth.models import User

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "content", "timestamp"]

class ThreadSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    class Meta:
        model = ChatThread
        fields = ["id", "title", "created_at", "messages"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
