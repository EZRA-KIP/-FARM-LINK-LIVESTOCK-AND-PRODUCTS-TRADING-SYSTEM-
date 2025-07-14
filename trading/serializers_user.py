from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import (
    UserCreateSerializer as BaseUserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)

User = get_user_model()


# Custom serializer for user registration
class CustomUserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }


# Custom serializer for user details
class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username')


# Custom serializer for password reset
class CustomPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    _user = None  # temporary cache of the found user

    def validate_email(self, value):
        """
        Validate that an active user exists with the given email address.
        """
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")

        if not user.is_active:
            raise serializers.ValidationError("This user is not active.")

        self._user = user  # store the user for later
        return value

    def get_user(self):
        return self._user
