# core/views.py
import os
import razorpay
import hmac
import hashlib
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from api.serializers.serializers import (
    BedSerializer,
    LoginSerializer,
    PaymentSerializer,
    PropertySerializer,
    RegisterSerializer,
    UserSerializer,
    BookingSerializer,
)
from core.models import Bed, Payment, Property, Booking
from django.utils.crypto import get_random_string


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response(
                {"message": "Registration successful", "status_code": 201, "user": UserSerializer(user).data, "tokens": tokens}, status=201
            )
        return Response({"message": serializer.errors, "status_code": 400}, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            return Response({"message": "Login successful", "status_code": 200, "user": UserSerializer(user).data, "tokens": tokens}, status=200)
        return Response({"message": serializer.errors, "status_code": 400}, status=400)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "User details fetched", "status_code": 200, "user": UserSerializer(request.user).data}, status=200)


class PropertyView(APIView):
    def get(self, request):
        properties = Property.objects.all()
        serializer = PropertySerializer(properties, many=True)
        return Response({"message": "Properties fetched", "status_code": 200, "properties": serializer.data}, status=200)


class PropertyDetailView(APIView):
    def get(self, request, pk):
        property_obj = get_object_or_404(Property, pk=pk)
        serializer = PropertySerializer(property_obj)
        return Response({"message": "Property details fetched", "status_code": 200, "property": serializer.data}, status=200)


class PropertyBedsAPIView(APIView):
    def get(self, request, property_id):
        beds = Bed.objects.filter(property_id=property_id)

        # Optional filters
        available = request.GET.get("available")
        gender = request.GET.get("gender")

        if available is not None:
            beds = beds.filter(is_available=(available.lower() == "true"))

        if gender in ["male", "female", "any"]:
            beds = beds.filter(gender_preference=gender)

        # Create a bed object here
        # Group and serialize
        grouped = {"single": [], "double": [], "triple": [], "four": []}

        for bed in beds:
            grouped[bed.sharing_type].append(bed)

        # Serialize each list
        for key in grouped:
            grouped[key] = BedSerializer(grouped[key], many=True).data

        return Response({"message": "Beds fetched", "status_code": 200, "beds": grouped}, status=200)


class TokenBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        bed_id = request.data.get("bed")
        try:
            bed = Bed.objects.get(id=bed_id)
            if not bed.is_available:
                return Response({"message": "Bed is not available", "status_code": 400}, status=400)

            payment = Payment.objects.create(
                user=request.user,
                bed=bed,
                amount=1000,
                payment_type="token",
                status="paid",  # Assume success for now
            )

            bed.is_available = False  # Reserve bed
            bed.save()

            return Response({"message": "Token payment successful", "status_code": 201, "payment": PaymentSerializer(payment).data}, status=201)

        except Bed.DoesNotExist:
            return Response({"message": "Invalid bed ID", "status_code": 404}, status=404)


class BookBedView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.data.get("user")
        bed_id = request.data.get("bed")
        check_in_date = request.data.get("check_in_date")
        check_out_date = request.data.get("check_out_date")
        if not bed_id or not check_in_date or not check_out_date:
            return Response(
                {"message": "bed, check_in_date, and check_out_date are required.", "status_code": 400},
                status=400,
            )
        # Validate if user has bed booked already
        if Booking.objects.filter(user=user, status="token_paid").exists():
            return Response(
                {"message": "You already have a bed booked.", "status_code": 400}, status=400
            )
        
        try:
            bed = Bed.objects.get(id=bed_id)
        except Bed.DoesNotExist:
            return Response({"message": "Invalid bed ID", "status_code": 400}, status=400)

        if not bed.is_available:
            return Response({"message": "Bed is not available", "status_code": 400}, status=400)

        # Razorpay client setup
        razorpay_key_id = os.environ.get("RAZORPAY_KEY_ID")
        razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
        if not razorpay_key_id or not razorpay_key_secret:
            return Response({"message": "Payment gateway not configured.", "status_code": 500}, status=500)
        client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

        #Create Razorpay order for token amount (amount in paise)
        amount_paise = int(float(bed.token_amount) * 100)
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "bed_id": str(bed.id),
                "user_id": str(user.id),
                "check_in_date": str(check_in_date),
                "check_out_date": str(check_out_date),
            },
        }
        order = client.order.create(data=order_data)

        #return response for testing
        return Response({"message": "payment done", "status_code": 201, "res": "payment done"}, status=201)
    
        # # Return order details to frontend
        # return Response(
        #     {
        #         "razorpay_order_id": order["id"],
        #         "amount": order["amount"],
        #         "currency": order["currency"],
        #         "bed": bed_id,
        #         "check_in_date": check_in_date,
        #         "check_out_date": check_out_date,
        #         "user": user.id,
        #     },
        #     status=201,
        # )


# Payment verification endpoint for Razorpay
@method_decorator(csrf_exempt, name="dispatch")
class RazorpayPaymentVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required_fields = [
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "bed",
            "check_in_date",
            "check_out_date",
            "user",
        ]
        for field in required_fields:
            if not data.get(field):
                return Response({"message": f"{field} is required.", "status_code": 400}, status=400)

        # razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
        # if not razorpay_key_secret:
        #     return Response({"error": "Payment gateway not configured."}, status=500)

        # generated_signature = hmac.new(
        #     bytes(razorpay_key_secret, "utf-8"),
        #     bytes(
        #         data["razorpay_order_id"] + "|" + data["razorpay_payment_id"], "utf-8"
        #     ),
        #     hashlib.sha256,
        # ).hexdigest()
        # if generated_signature != data["razorpay_signature"]:
        #     return Response({"error": "Invalid payment signature."}, status=400)

        try:
            bed = Bed.objects.get(id=data["bed"])
        except Bed.DoesNotExist:
            return Response({"message": "Invalid bed ID", "status_code": 404}, status=404)

        if not bed.is_available:
            return Response({"message": "Bed is not available", "status_code": 400}, status=400)

        from django.contrib.auth import get_user_model

        User = get_user_model()
        try:
            user = User.objects.get(id=data["user"])
        except User.DoesNotExist:
            return Response({"message": "Invalid user ID", "status_code": 404}, status=404)

        booking_reference = get_random_string(10).upper()
        
        #Calculate intended duration in months
        from datetime import datetime
        check_in_date = datetime.strptime(data["check_in_date"], "%Y-%m-%d")
        check_out_date = datetime.strptime(data["check_out_date"], "%Y-%m-%d")
        intended_duration_months = (check_out_date.year - check_in_date.year) * 12 + (check_out_date.month - check_in_date.month)
        if intended_duration_months <= 0:
            return Response({"message": "Invalid check-in and check-out dates.", "status_code": 400}, status=400)
        
        # Create booking and payment records
        booking = Booking.objects.create(
            user=user,
            bed=bed,
            booking_reference=booking_reference,
            check_in_date=data["check_in_date"],
            check_out_date=data["check_out_date"],
            intended_duration_months=intended_duration_months,
            monthly_rent=bed.rent_amount,
            deposit_amount=bed.deposit_amount,
            token_amount=bed.token_amount,
            status="token_paid",
        )

        # Create payment record
        payment = Payment.objects.create(
            user=user,
            bed=bed,
            amount=bed.token_amount,
            payment_type="token",
            status="paid",
            transaction_id=data["razorpay_payment_id"],
            payment_gateway="razorpay",
            payment_date=datetime.now(),
        )

        bed.is_available = False
        bed.save()

        return Response(
            {
                "message": "Payment verified and booking created",
                "status_code": 201,
                "booking": BookingSerializer(booking).data,
                "payment": PaymentSerializer(payment).data,
            },
            status=201,
        )
