import os
from djoser.email import PasswordResetEmail

class CustomPasswordResetEmail(PasswordResetEmail):
    def get_context_data(self):
        context = super().get_context_data()
        uid = context.get("uid")
        token = context.get("token")
        frontend_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
        context["url"] = f"{frontend_url}/reset-password/{uid}/{token}/"
        return context
