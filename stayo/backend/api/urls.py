from api.views.views import (
    LoginView,
    MeView,
    PropertyBedsAPIView,
    PropertyDetailView,
    PropertyView,
    RegisterView,
    TokenBookingView,
    BookBedView,
    RazorpayPaymentVerifyView,
)
from django.urls import path

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("properties/", PropertyView.as_view(), name="property"),
    path("properties/<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path("properties/<int:property_id>/beds/", PropertyBedsAPIView.as_view()),
    path("beds/<int:bed_id>/book/", TokenBookingView.as_view(), name="bed-booking"),
    path("book-bed/", BookBedView.as_view(), name="book-bed"),
    path(
        "razorpay-verify/", RazorpayPaymentVerifyView.as_view(), name="razorpay-verify"
    ),
]
