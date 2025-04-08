from rest_framework.pagination import PageNumberPagination

class CustomEventPagination(PageNumberPagination):
    page_size = 6  # Fixed number of events per page
    page_size_query_param = 'page_size'  # Optional, frontend can control this
    max_page_size = 100  # Optional limit
