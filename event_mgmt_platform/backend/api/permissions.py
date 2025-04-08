from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminUser(BasePermission):
    """
    Allows only admins to create/edit events.
    Guests can only read events.
    """
    def has_permission(self, request, view):
        # Allow read-only methods for everyone
        if request.method in SAFE_METHODS:
            return True
        
        # Allow write operations only for admins
        return request.user.is_authenticated and getattr(request.user, "role", None) == "admin"