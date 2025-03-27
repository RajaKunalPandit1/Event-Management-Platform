import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer
from .models import Event, RSVP
from .event_serializer import EventSerializer  # Import event serializer
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from rest_framework.views import APIView
from django.conf import settings
from .permissions import IsAdminUser
import random
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from api.models import CustomUser  # Update with your actual user model path


CustomUser = get_user_model()

# ======================= User Views ===========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Welcome {request.user.username} to Home Page!"}, status=status.HTTP_200_OK)

# @api_view(["POST"])
# @permission_classes([AllowAny])
# def register_user(request):
#     # print("Received data:", request.data)  # Debug request data
#     serializer = RegisterSerializer(data=request.data)

#     if serializer.is_valid():
#         print("Valid data:", serializer.validated_data)  # Debug valid data
#         serializer.save()
#         return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

#     # print("Errors:", serializer.errors)  # Debug errors
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    request.data["role"] = "guest"  # Force all frontend registrations as 'guest'
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully as Guest"}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)  # Uses EmailBackend

    if user:
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Login successful!",
                "username": user.username,  
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "role": user.role  
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Fetch the currently authenticated user's details."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
# @csrf_exempt
# def reset_password(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             email = data.get("email")

#             if not email or "@" not in email:
#                 return JsonResponse({"error": "Invalid email format"}, status=400)

#             try:
#                 user = CustomUser.objects.get(email=email)

#                 # Generate password reset token
#                 token = default_token_generator.make_token(user)
#                 uid = urlsafe_base64_encode(force_bytes(user.pk))
                
#                 # Construct password reset link
#                 reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

#                 # Send email
#                 send_mail(
#                     "Password Reset Request",
#                     f"Click the link to reset your password: {reset_link}",
#                     "noreply@example.com",
#                     [email],
#                     fail_silently=False,
#                 )

#                 return JsonResponse({"message": "Password reset link sent to your email."}, status=200)

#             except CustomUser.DoesNotExist:
#                 return JsonResponse({"error": "User with this email does not exist"}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email or "@" not in email:
                return JsonResponse({"error": "Invalid email format"}, status=400)

            try:
                user = CustomUser.objects.get(email=email)

                new_password = generate_random_password()

                user.password = make_password(new_password)
                user.save()

                send_mail(
                    "Password Reset Request",
                    "Your Password Has Been Reset",
                    f"Your new password is: {new_password}",
                    "noreply@example.com",
                    [email],
                    fail_silently=False,
                )

                return JsonResponse({"message": "A new password has been sent to your email."}, status=200)

            except CustomUser.DoesNotExist:
                return JsonResponse({"error": "User with this email does not exist"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

# 🔹 Helper Function to Generate Secure Random Password
def generate_random_password():
    """Generate a 6-character password with 5 alphanumeric and 1 special character."""
    alphanumeric_chars = string.ascii_letters + string.digits
    special_chars = "!@#$%^&*()"

    password_chars = random.choices(alphanumeric_chars, k=5) + random.choices(special_chars, k=1)
    random.shuffle(password_chars)  # Shuffle to mix characters
    return "".join(password_chars)


# @csrf_exempt
# def reset_password(request): #reset password function
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)  # Parse JSON request
#             email = data.get("email")

#             if not email or "@" not in email:
#                 return JsonResponse({"error": "Invalid email format"}, status=400)

#             try:
#                 user = CustomUser.objects.get(email=email)

#                 username_part = "".join(filter(str.isalpha, email.split("@")[0]))
#                 if not username_part:
#                     return JsonResponse({"error": "Invalid username in email"}, status=400)

#                 temp_password = (
#                     username_part[-6:][::-1] if len(username_part) >= 6 else username_part[::-1]
#                 )

#                 # Set new password
#                 user.set_password(temp_password)
#                 user.save()

#                 return JsonResponse(
#                     {"message": "Temporary password set. Please check your email."}, status=200
#                 )

#             except CustomUser.DoesNotExist:
#                 return JsonResponse({"error": "User with this email does not exist"}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

# @csrf_exempt
# def confirm_reset_password(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             uidb64 = data.get("uid")
#             token = data.get("token")
#             new_password = data.get("new_password")

#             if not uidb64 or not token or not new_password:
#                 return JsonResponse({"error": "Invalid request"}, status=400)

#             try:
#                 uid = urlsafe_base64_decode(uidb64).decode()
#                 user = CustomUser.objects.get(pk=uid)

#                 if not default_token_generator.check_token(user, token):
#                     return JsonResponse({"error": "Invalid or expired token"}, status=400)

#                 # Set new password
#                 user.set_password(new_password)
#                 user.save()

#                 return JsonResponse({"message": "Password reset successful"}, status=200)

#             except (CustomUser.DoesNotExist, ValueError):
#                 return JsonResponse({"error": "Invalid user"}, status=400)

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     return JsonResponse({"error": "Only POST requests are allowed"}, status=405)



#========================= Event Views ===================================

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can create events
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can update
def update_event(request, event_id):
    try:
        # event = Event.objects.get(pk=event_id,hosted_by=request.user)
        if request.user.is_superuser:
            event = Event.objects.get(pk=event_id)  # Admins can edit any event
        else:
            event = Event.objects.get(pk=event_id, hosted_by=request.user)

    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = EventSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can delete
def delete_event(request, event_id):
    try:
        event = Event.objects.get(pk=event_id,hosted_by=request.user)
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])  # Only authenticated users can fetch events
# def get_user_events(request):
#     user = request.user  # Get the logged-in user
#     events = Event.objects.filter(hosted_by=user)  # Fetch events where user is a host
#     serializer = EventSerializer(events, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)

# #fetch single event

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_events(request):
    user_id = request.user.id  # Get logged-in user's ID
    events = Event.objects.filter(hosted_by=user_id)  # Filter events by user ID
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def all_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        is_admin = event.hosted_by == request.user
        is_rsvped = request.user in event.rsvp_users.all()
        serializer = EventSerializer(event)
        return Response({
            "event": serializer.data,
            "is_admin": is_admin,
            "is_rsvped": is_rsvped
        }, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def my_rsvp_events(request):
#     """Fetch events the authenticated user has RSVPed to"""
#     user = request.user
#     rsvp_events = RSVP.objects.filter(user=user).select_related("event")
#     events = [rsvp.event for rsvp in rsvp_events]

#     serialized_events = EventSerializer(events, many=True)
#     return Response({"events": serialized_events.data})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_rsvp_events(request):
    """Fetch events the authenticated user has RSVPed to"""
    user = request.user

    # Fetch events where the user is in rsvp_users (ManyToMany field)
    events = Event.objects.filter(rsvp_users=user)

    serialized_events = EventSerializer(events, many=True)
    return Response({"events": serialized_events.data})


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def rsvp_event(request, event_id):
#     try:
#         event = Event.objects.get(id=event_id)
#         event.rsvp_users.add(request.user)
#         return Response({"message": "RSVP successful"}, status=status.HTTP_200_OK)
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rsvp_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        user = request.user  # Ensure the authenticated user is a CustomUser instance
        
        print(f"Event: {event.title} | Current RSVPs: {event.rsvp_users.all()}")
        
        if user in event.rsvp_users.all():
            return Response({"message": "Already RSVPed"}, status=status.HTTP_400_BAD_REQUEST)
        
        event.rsvp_users.add(user)
        event.save()
        
        print(f"Updated RSVPs: {event.rsvp_users.all()}")  # Debugging print
        
        return Response({"message": "RSVP successful"}, status=status.HTTP_200_OK)
    
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_rsvp(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.rsvp_users.remove(request.user)
        return Response({"message": "RSVP removed"}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Only logged-in users can access
def create_admin(request):
    if not request.user.is_superuser:
        return Response({"error": "Only superusers can create admins"}, status=status.HTTP_403_FORBIDDEN)

    request.data["role"] = "admin"  # Force role as 'admin'
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Admin created successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    events = Event.objects.all()
    serialized_events = EventSerializer(events, many=True).data

    return Response({
        "events": serialized_events,
        "message": "Events Will Come Soon" if not events.exists() else None
    })

