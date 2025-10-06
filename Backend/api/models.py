from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class ChatThread(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="threads")
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.id}"

class ChatMessage(models.Model):
    thread = models.ForeignKey(ChatThread, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=20)  # "user" or "assistant"
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

