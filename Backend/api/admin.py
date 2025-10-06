from django.contrib import admin
from .models import ChatThread, ChatMessage  # import your models

# Register models
admin.site.register(ChatThread)
admin.site.register(ChatMessage)

