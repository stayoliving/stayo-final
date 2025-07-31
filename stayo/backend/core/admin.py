from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import Bed, Booking, CustomUser, Payment, Property, RentSchedule

# -----------------------
# Property Admin
# -----------------------


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "area", "food_available")
    search_fields = ("name", "city", "area")
    list_filter = ("city", "food_available")


# -----------------------
# Bed Admin
# -----------------------


@admin.register(Bed)
class BedAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "room_number",
        "bed_number",
        "sharing_type",
        "gender_preference",
        "is_available",
    )
    list_filter = ("sharing_type", "gender_preference", "is_available")
    search_fields = ("property__name", "room_number", "bed_number")


# -----------------------
# Booking Admin
# -----------------------


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_reference",
        "user",
        "bed",
        "status",
        "check_in_date",
        "actual_check_in_date",
    )
    list_filter = ("status",)
    search_fields = ("booking_reference", "user__email", "bed__property__name")
    readonly_fields = ("booking_reference",)
    autocomplete_fields = ("user", "bed")


# -----------------------
# Payment Admin
# -----------------------


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("user", "payment_type", "amount", "status", "payment_date")
    list_filter = ("payment_type", "status", "payment_gateway")
    search_fields = ("user__email", "transaction_id", "booking__booking_reference")
    autocomplete_fields = ("user", "bed")


# -----------------------
# RentSchedule Admin
# -----------------------


@admin.register(RentSchedule)
class RentScheduleAdmin(admin.ModelAdmin):
    list_display = ("booking", "rent_month", "amount", "status", "due_date", "paid_at")
    list_filter = ("status",)
    search_fields = ("booking__booking_reference",)
    autocomplete_fields = ("booking", "payment")


# -----------------------
# Register CustomUser
# -----------------------
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    ordering = ("email",)

    list_display = (
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "is_verified",
        "is_staff",
    )
    search_fields = ("email", "phone_number", "first_name", "last_name")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone_number",
                    "gender",
                    "profile_photo",
                    "emergency_contact_name",
                    "emergency_contact_phone",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Verification"), {"fields": ("is_verified",)}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "gender",
                    "profile_photo",
                    "emergency_contact_name",
                    "emergency_contact_phone",
                    "is_verified",
                ),
            },
        ),
    )
