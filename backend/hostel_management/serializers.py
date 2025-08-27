from rest_framework import serializers
from .models import Room, Booking
from django.contrib.auth.models import User
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            'id', 'number', 'type', 'capacity', 'price_per_night',
            'status', 'description', 'amenities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    room_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'room', 'room_id', 'check_in_date', 'check_out_date',
            'status', 'total_price', 'special_requests', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'room', 'total_price', 'created_at', 'updated_at']
    
    def validate(self, data):
        """
        Validate booking dates and room availability.
        """
        check_in = data.get('check_in_date')
        check_out = data.get('check_out_date')
        
        if check_in and check_out:
            if check_in >= check_out:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )
            
            if check_in < timezone.now().date():
                raise serializers.ValidationError(
                    "Check-in date cannot be in the past."
                )
        
        return data
    
    def create(self, validated_data):
        """
        Create booking and calculate total price.
        """
        room_id = validated_data.pop('room_id')
        room = Room.objects.get(id=room_id)
        
        # Calculate total price
        nights = (validated_data['check_out_date'] - validated_data['check_in_date']).days
        validated_data['total_price'] = room.price_per_night * nights
        
        return super().create(validated_data)
