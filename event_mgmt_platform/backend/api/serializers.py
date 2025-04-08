from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()  # Get user model dynamically

# Custom JWT Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["email"] = self.user.email  # Use email instead of username
        data["role"] = self.user.role  # Include user role
        return data # returns token with mail and role

# User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer): # Handles user registration (including password hashing).
    class Meta:
        model = User
        fields = ["username", "email", "password"]   # Required Fields
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """Check if the email already exists in the database"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def create(self, validated_data): #overriding the create method
        validated_data["password"] = make_password(validated_data["password"])  # Hash password
        return User.objects.create(**validated_data)  # Unpacks and creates the user

# Serializer for fetching current user details
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"] 