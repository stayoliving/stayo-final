export const validateField = (name: string, value: string) => {
  switch (name) {
    case "first_name":
      if (!value.trim()) return "First Name is required";
      break;
    case "last_name":
      if (!value.trim()) return "Last Name is required";
      break;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      break;
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      break;
    case "confirmPassword":
      if (!value) return "Confirm Password is required";
      // if (value !== formData.password) return "Passwords do not match";
      break;
    case "phone_number":
      if (!value.trim()) return "Phone Number is required";
      if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
      break;
    default:
      return "";
  }
  return "";
};
