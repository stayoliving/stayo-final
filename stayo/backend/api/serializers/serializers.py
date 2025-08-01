from core.models import Bed, CustomUser, Payment, Property, Booking
from django.contrib.auth import authenticate
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "password", "phone_number"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            phone_number=validated_data["phone_number"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "phone_number"]


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "id",
            "name",
            "city",
            "area",
            "address",
            "food_available",
            "nearby_locations",
            "photos",
            "bed_photos",
            "amenities",
        ]


class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "user",
            "bed",
            "amount",
            "payment_type",
            "for_month",
            "payment_date",
            "status",
        ]
        read_only_fields = ["id", "timestamp", "status", "user"]


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
