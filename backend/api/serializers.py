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
        return data

# User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]  # Added 'role' field
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        """Check if the email already exists in the database"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])  # Hash password
        return User.objects.create(**validated_data)  # Unpacks and creates the user

# # Custom JWT Token Serializer
# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         data["email"] = self.user.email  # Use email instead of username
#         return data

# # User Registration Serializer
# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["username", "email", "password"]
#         extra_kwargs = {"password": {"write_only": True}} # Prevents the password from being sent back in API responses.

#     def validate_email(self, value):
#         """Check if the email already exists in the database"""
#         if User.objects.filter(email=value).exists():
#             raise serializers.ValidationError("Email already in use")
#         return value
#     def create(self, validated_data):
#         validated_data["password"] = make_password(validated_data["password"])  # Hash password
#         return User.objects.create(**validated_data) #unpacks the dictionary and passes it as keyword arguments to create the user

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["username", "email", "password"]
#         extra_kwargs = {"password": {"write_only": True}}  # Hide password in responses


#     def create(self, validated_data):
#         """Create user with hashed password"""
#         validated_data["password"] = make_password(validated_data["password"])
#         return User.objects.create(**validated_data)  # Create user with validated data
