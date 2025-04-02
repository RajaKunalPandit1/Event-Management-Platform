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
from django.utils.encoding import force_bytes, force_str
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer
from .models import Event, RSVP
from .event_serializer import EventSerializer, RSVPSerializer  # Import event serializer
from django.shortcuts import get_object_or_404
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

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def protected_view(request):
#     return Response({"message": f"Welcome {request.user.username} to Home Page!"}, status=status.HTTP_200_OK)

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

#                 new_password = generate_random_password()

#                 user.password = make_password(new_password)
#                 user.save()

#                 send_mail(
#                     subject="Password Reset Request",
#                     message=f"Your new password is: {new_password}",
#                     from_email="noreply@example.com",
#                     recipient_list=[email],
#                     fail_silently=False,
#                 )

#                 return JsonResponse({"message": "A new password has been sent to your email."}, status=200)

#             except CustomUser.DoesNotExist:
#                 return JsonResponse({"error": "User with this email does not exist"}, status=404)

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format"}, status=400)

#     return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

# def generate_random_password():
#     """Generates a 6-character password with 5 alphanumeric and 1 special character."""
#     alphanumeric_chars = string.ascii_letters + string.digits
#     special_chars = "!@#$%^&*()"

#     password_chars = random.choices(alphanumeric_chars, k=5) + random.choices(special_chars, k=1)
#     random.shuffle(password_chars)  # Shuffle to mix characters
#     return "".join(password_chars)


@csrf_exempt
def request_password_reset(request):
    """Generate a reset token and send an email with the password reset link."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            if not email or "@" not in email:
                return JsonResponse({"error": "Invalid email format"}, status=400)

            user = get_object_or_404(CustomUser, email=email)

            # Generate token and encode user ID
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            # Send email
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password:\n\n{reset_link}",
                from_email="noreply@example.com",
                recipient_list=[email],
                fail_silently=False,
            )

            return JsonResponse({"message": "Password reset link sent to your email."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)


@csrf_exempt
def reset_password_confirm(request, uidb64, token):
    """Verify the token and reset the password."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            new_password = data.get("new_password")

            if not new_password or len(new_password) < 6:
                return JsonResponse({"error": "Password must be at least 6 characters long."}, status=400)

            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = CustomUser.objects.get(pk=uid)

                if not default_token_generator.check_token(user, token):
                    return JsonResponse({"error": "Invalid or expired token"}, status=400)

                user.password = make_password(new_password)
                user.save()

                return JsonResponse({"message": "Password reset successful."}, status=200)

            except (CustomUser.DoesNotExist, ValueError):
                return JsonResponse({"error": "Invalid request"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

#========================= Event Views ===================================

# @api_view(["POST"])
# @permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can create events
# def create_event(request):
#     serializer = EventSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can create events
def create_event(request):
    serializer = EventSerializer(data=request.data)  # Include request.FILES
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["PUT"])
# @permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can update
# def update_event(request, event_id):
#     try:
#         # event = Event.objects.get(pk=event_id,hosted_by=request.user)
#         if request.user.is_superuser:
#             event = Event.objects.get(pk=event_id,hosted_by=request.user)  # Admins can edit their event
#         else:
#             event = Event.objects.get(pk=event_id, hosted_by=request.user) #fetches the event by its primary key (id)

#     except Event.DoesNotExist:
#         return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

#     serializer = EventSerializer(event, data=request.data, partial=True) #Loads the existing event.Updates it with new data from request.data. 
#     #partial=True allows updating only some fields (not all are required).

#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can update
def update_event(request, event_id):
    try:
        # Allow any admin to update any event
        event = Event.objects.get(pk=event_id)
        
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure request.FILES is used properly
    data = request.data.copy()
    image = request.FILES.get("image")  # Get the uploaded image

    if image:
        data["image"] = image  # If a new image is provided, update it

    serializer = EventSerializer(event, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])  # Only Admins can delete
def delete_event(request, event_id):
    try:
        event = Event.objects.get(pk=event_id) # Fetch event by ID and user
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    
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
    """
    Retrieve all events with optional filters for date and location.
    """
    date = request.GET.get("date")
    location = request.GET.get("location")

    # Start with all events
    queryset = Event.objects.all()

    # Apply filters if present
    if date:
        queryset = queryset.filter(date=date)
    if location:
        queryset = queryset.filter(location__icontains=location)

    # Serialize and return the filtered events
    serializer = EventSerializer(queryset, many=True) # multiple instances of the model
    return Response(serializer.data)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        is_admin = event.hosted_by == request.user
        
        # Check if user has RSVP status
        rsvp = RSVP.objects.filter(user=request.user, event=event).first()
        is_rsvped = bool(rsvp)  # True if RSVP exists, else False
        rsvp_status = rsvp.status if rsvp else None  # Fetch status if exists

        serializer = EventSerializer(event)
        return Response({
            "event": serializer.data,
            "is_admin": is_admin,
            "is_rsvped": is_rsvped,
            "rsvp_status": rsvp_status  # Include RSVP status
        }, status=status.HTTP_200_OK)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def my_rsvp_events(request):
#     """Fetch events the authenticated user has RSVPed to"""
#     user = request.user

#     # Fetch events where the user is in rsvp_users (ManyToMany field)
#     events = Event.objects.filter(rsvp_users=user)

#     serialized_events = EventSerializer(events, many=True)
#     return Response({"events": serialized_events.data})

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def rsvp_event(request, event_id):
#     try:
#         event = Event.objects.get(id=event_id)
#         user = request.user  # Ensure the authenticated user is a CustomUser instance
        
#         print(f"Event: {event.title} | Current RSVPs: {event.rsvp_users.all()}")
        
#         if user in event.rsvp_users.all():
#             return Response({"message": "Already RSVPed"}, status=status.HTTP_400_BAD_REQUEST)
        
#         event.rsvp_users.add(user)
#         event.save()
        
#         print(f"Updated RSVPs: {event.rsvp_users.all()}")  # Debugging print
        
#         return Response({"message": "RSVP successful"}, status=status.HTTP_200_OK)
    
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def remove_rsvp(request, event_id):
#     try:
#         event = Event.objects.get(id=event_id)
#         event.rsvp_users.remove(request.user)
#         return Response({"message": "RSVP removed"}, status=status.HTTP_200_OK)
#     except Event.DoesNotExist:
#         return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    events = Event.objects.all()
    serialized_events = EventSerializer(events, many=True).data

    return Response({
        "events": serialized_events,
        "message": "Events Will Come Soon" if not events.exists() else None
    })

# =-=-=-=-=-=-=-=-=-

# RSVP to an event (Create or Update)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rsvp_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    status_value = request.data.get("status")

    if status_value not in ["going", "not_going", "maybe"]:
        return Response({"error": "Invalid RSVP status"}, status=status.HTTP_400_BAD_REQUEST)

    rsvp, created = RSVP.objects.update_or_create(
        user=request.user, event=event, defaults={"status": status_value}
    )

    return Response(
        {"message": "RSVP updated successfully", "status": rsvp.status},
        status=status.HTTP_200_OK
    )

# Delete RSVP
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_rsvp(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    rsvp = RSVP.objects.filter(user=request.user, event=event).first()

    if not rsvp:
        return Response({"error": "RSVP not found"}, status=status.HTTP_404_NOT_FOUND)

    rsvp.delete()
    return Response({"message": "RSVP removed successfully"}, status=status.HTTP_204_NO_CONTENT)

# Fetch RSVP guest list based on status
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_guest_list(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    rsvp_data = {
        "going": list(event.rsvps.filter(status="going").values_list("user__username","user__email")),
        "not_going": list(event.rsvps.filter(status="not_going").values_list("user__username", "user__email")),
        "maybe": list(event.rsvps.filter(status="maybe").values_list("user__username",  "user__email")),
    }
    return Response(rsvp_data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_rsvp_events(request):
    user = request.user

    # Get events categorized by RSVP status
    rsvp_events = {
        "going": list(Event.objects.filter(rsvps__user=user, rsvps__status="going").values("id", "title", "date", "location")),
        "not_going": list(Event.objects.filter(rsvps__user=user, rsvps__status="not_going").values("id", "title", "date", "location")),
        "maybe": list(Event.objects.filter(rsvps__user=user, rsvps__status="maybe").values("id", "title", "date", "location")),
    }

    return Response(rsvp_events, status=status.HTTP_200_OK)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def fetch_event_rsvp_users(request, event_id):
#     event = get_object_or_404(Event, id=event_id)

#     # Ensure only admins or event hosts can view RSVPs
#     if not request.user.is_staff and request.user != event.hosted_by:
#         return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

#     # Get RSVPed users categorized by status
#     rsvp_users = {
#         "going": list(event.rsvps.filter(status="going").values("user__id", "user__username", "status")),
#         "not_going": list(event.rsvps.filter(status="not_going").values("user__id", "user__username", "status")),
#         "maybe": list(event.rsvps.filter(status="maybe").values("user__id", "user__username", "status")),
#     }

#     return Response(rsvp_users, status=status.HTTP_200_OK)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def fetch_event_rsvp_users(request, event_id):
#     event = get_object_or_404(Event, id=event_id)

#     # Ensure only admins or event hosts can view RSVPs
#     if not request.user.is_staff and request.user != event.hosted_by:
#         return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

#     # Get RSVPed users categorized by status, including email
#     rsvp_users = {
#         "going": list(event.rsvps.filter(status="going").values("user__id", "user__username", "user__email", "status")),
#         "not_going": list(event.rsvps.filter(status="not_going").values("user__id", "user__username", "user__email", "status")),
#         "maybe": list(event.rsvps.filter(status="maybe").values("user__id", "user__username", "user__email", "status")),
#     }

#     return Response(rsvp_users, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def fetch_event_rsvp_users(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # Ensure only admins or event hosts can view RSVPs
    if not request.user.role == 'admin' and request.user != event.hosted_by:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # Get RSVPed users categorized by status, including email
    rsvp_users = {
        "going": list(event.rsvps.filter(status="going").values("user__id", "user__username", "user__email", "status")),
        "not_going": list(event.rsvps.filter(status="not_going").values("user__id", "user__username", "user__email", "status")),
        "maybe": list(event.rsvps.filter(status="maybe").values("user__id", "user__username", "user__email", "status")),
    }

    return Response(rsvp_users, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_user_rsvp(request, event_id, user_id):
    event = get_object_or_404(Event, id=event_id)

    # Ensure only admins or the event host can remove RSVPs
    if not request.user.role == 'admin' and request.user != event.hosted_by:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # Check if the RSVP exists
    try:
        rsvp = RSVP.objects.get(event_id=event_id, user_id=user_id)
        rsvp.delete()
        return Response({"message": "User's RSVP removed successfully"}, status=status.HTTP_204_NO_CONTENT)
    except RSVP.DoesNotExist:
        return Response({"error": "RSVP not found"}, status=status.HTTP_404_NOT_FOUND)