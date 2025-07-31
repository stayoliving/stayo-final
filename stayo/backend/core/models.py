from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


def default_amenities():
    return [
        "Parking",
        "TV",
        "Wifi",
        "Refrigerator",
        "Power Backup",
        "Almirah",
        "Bed Sheet",
        "CCTV",
        "House Keeping",
        "Security",
        "Pillow",
        "Lift",
        "Drinking Water",
        "Gym",
        "Reception",
        "Bathroom",
        "Wash",
    ]


def default_months():
    return [
        ("Jan", "January"),
        ("Feb", "February"),
        ("Mar", "March"),
        ("Apr", "April"),
        ("May", "May"),
        ("Jun", "June"),
        ("Jul", "July"),
        ("Aug", "August"),
        ("Sep", "September"),
        ("Oct", "October"),
        ("Nov", "November"),
        ("Dec", "December"),
    ]


class Property(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    address = models.TextField()

    food_available = models.BooleanField(default=False)
    nearby_locations = models.TextField(
        blank=True, help_text="Comma-separated landmarks or places"
    )

    photos = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    bed_photos = models.JSONField(
        default=list, blank=True, help_text="List of image URLs"
    )
    amenities = models.JSONField(
        default=default_amenities, blank=True, help_text="List of amenities"
    )

    def __str__(self):
        return f"{self.name} - {self.city}/{self.area}"


class Bed(models.Model):
    SHARING_TYPE_CHOICES = [
        ("single", "Single"),
        ("double", "Double"),
        ("triple", "Triple"),
        ("four", "Four"),
    ]

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("any", "Any"),
    ]

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="beds"
    )

    room_number = models.CharField(max_length=20, blank=True, null=True)
    bed_number = models.PositiveIntegerField()

    sharing_type = models.CharField(max_length=10, choices=SHARING_TYPE_CHOICES)
    gender_preference = models.CharField(
        max_length=10, choices=GENDER_CHOICES, default="male"
    )
    is_available = models.BooleanField(default=True)

    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    token_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ("property", "room_number", "bed_number")

    def __str__(self):
        return f"{self.sharing_type.title()} Bed {self.bed_number} in Room {self.room_number or 'N/A'} of {self.property.name}"


class Payment(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ("token", "Token"),
        ("deposit", "Deposit"),
        ("rent", "Rent"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    for_month = models.CharField(max_length=10, choices=default_months, blank=True)
    payment_date = models.DateTimeField()
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_gateway = models.CharField(
        max_length=20,
        choices=[("razorpay", "Razorpay"), ("payu", "PayU")],
        default="razorpay",
    )

    def __str__(self):
        label = f"{self.payment_type.title()} ₹{self.amount:.2f}"
        if self.payment_type == "rent" and self.for_month:
            label += f" for {self.for_month.strftime('%B %Y')}"
        return f"{label} [{self.status}]"


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending_token", "Pending Token"),
        ("token_paid", "Token Paid"),
        ("confirmed", "Confirmed"),
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE)
    booking_reference = models.CharField(max_length=50, unique=True)
    check_in_date = models.DateField()
    actual_check_in_date = models.DateField(null=True, blank=True)
    check_out_date = models.DateField(null=True, blank=True)
    intended_duration_months = models.PositiveIntegerField()
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2)
    token_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending_token"
    )
    cancel_reason = models.TextField(blank=True, null=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.booking_reference

    @property
    def bed_number(self):
        return self.bed.bed_number


class RentSchedule(models.Model):
    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("due", "Due"),
        ("paid", "Paid"),
        ("overdue", "Overdue"),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    rent_month = models.DateField()  # e.g. 2024-06-01
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="upcoming")
    reminder_sent_count = models.IntegerField(default=0)
    last_reminder_sent = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment = models.ForeignKey(
        Payment, null=True, blank=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("booking", "rent_month")

    def __str__(self):
        return f"{self.booking.booking_reference} - {self.rent_month.strftime('%B %Y')}"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        # extra_fields.setdefault("username", email)  # required by AbstractUser
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        # extra_fields.setdefault("username", email)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, blank=True, null=True
    )
    profile_photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)

    # Login will be via email
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone_number", "first_name", "last_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
