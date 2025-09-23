from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("signup/", views.signup),
    path("threads/", views.ThreadListCreateView.as_view()),
    path("threads/<int:pk>/", views.ThreadRetrieveView.as_view()),
    path("threads/<int:thread_id>/messages/", views.post_message),
    path("messages/", views.post_message),              # first message → auto-create thread


        # signin (JWT)
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]
