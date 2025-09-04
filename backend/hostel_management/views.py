from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.core.cache import cache
from django.conf import settings
import time
import redis
from .models import Room, Booking
from .serializers import RoomSerializer, BookingSerializer


class RoomListView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]


class BookingListView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_redis_api(request):
    """
    API endpoint to test Redis connectivity from frontend
    """
    try:
        # Test Django cache
        test_key = f'api_redis_test_{int(time.time())}'
        test_value = {
            'message': 'Redis test from API',
            'timestamp': time.time(),
            'client_ip': request.META.get('REMOTE_ADDR')
        }
        
        # Set and get cache
        cache.set(test_key, test_value, 60)
        cached_value = cache.get(test_key)
        
        if not cached_value:
            return Response({
                'status': 'error',
                'message': 'Cache set/get failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Test direct Redis connection
        redis_url = getattr(settings, 'REDIS_URL', 'redis://redis:6379/0')
        r = redis.from_url(redis_url)
        
        # Ping test
        ping_result = r.ping()
        
        # Get Redis info
        redis_info = r.info()
        
        # Clean up
        cache.delete(test_key)
        
        return Response({
            'status': 'success',
            'message': 'Redis connectivity test passed',
            'data': {
                'cache_test': 'passed',
                'direct_connection': 'passed',
                'ping_result': ping_result,
                'redis_version': redis_info.get('redis_version'),
                'connected_clients': redis_info.get('connected_clients'),
                'used_memory_human': redis_info.get('used_memory_human'),
                'test_data': cached_value
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Redis test failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
