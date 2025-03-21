import json
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

# will set it afterwards

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def example_view(request, format=None):
#     content = {
#         'status': 'request was permitted'
#     }
#     return Response(content)

CustomUser = get_user_model()


@csrf_exempt
def register_user(request): # Register user function
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON request body
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            # phone_number = data.get("phone_number","")
            # role = data.get("role", "guest")  # Default role: guest

            if not username or not email or not password:
                return JsonResponse({"error": "Missing fields"}, status=400)

            # Check if email already exists
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already in use"}, status=400)

            # Check if username already exists
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken"}, status=400)

            # Create and save user
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                # phone_number=phone_number,
                # role=role
            )
            user.save()

            return JsonResponse({"message": "User registered successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)

@csrf_exempt
def login_user(request): #login User function
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON request
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            # Fetch user by email
            try:
                user = CustomUser.objects.get(email=email)
                authenticated_user = authenticate(username=user.username, password=password)

                if authenticated_user is not None:
                    return JsonResponse({"message": "Login successful!"}, status=200)
                else:
                    return JsonResponse({"error": "Invalid email or password"}, status=401)

            except CustomUser.DoesNotExist:
                return JsonResponse({"error": "User with this email does not exist"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

@csrf_exempt
def reset_password(request): #reset password function
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse JSON request
            email = data.get("email")

            if not email or "@" not in email:
                return JsonResponse({"error": "Invalid email format"}, status=400)

            try:
                user = CustomUser.objects.get(email=email)

                username_part = "".join(filter(str.isalpha, email.split("@")[0]))
                if not username_part:
                    return JsonResponse({"error": "Invalid username in email"}, status=400)

                temp_password = (
                    username_part[-6:][::-1] if len(username_part) >= 6 else username_part[::-1]
                )

                # Set new password
                user.set_password(temp_password)
                user.save()

                return JsonResponse(
                    {"message": "Temporary password set. Please check your email."}, status=200
                )

            except CustomUser.DoesNotExist:
                return JsonResponse({"error": "User with this email does not exist"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

# def home_view(request):
#     return HttpResponse("This page is under construction.")