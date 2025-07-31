import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { registerAccount } from "../services/homePageServices";
import { useNavigate } from "react-router-dom";
import AlertNotification from "../common/Alert/Alert";

type FormField =
  | "first_name"
  | "last_name"
  | "email"
  | "password"
  | "confirmPassword"
  | "phone_number";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
}

interface RegistrationFormProps {
  onRegisterSuccess?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState<{ [K in keyof FormData]?: string }>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "first_name":
        if (!value.trim()) return "First Name is required";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Enter valid first name";
        break;
      case "last_name":
        if (!value.trim()) return "Last Name is required";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Enter valid last name";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(value))
          return "Password must include uppercase, lowercase, number, and special character";
        break;
      case "confirmPassword":
        if (!value) return "Confirm Password is required";
        if (value !== formData.password) return "Passwords do not match";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    const fieldName = name as FormField;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newErrors: {
      [key: string]: string;
    } = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    let payload = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
    };
    registerAccount(payload).then(
      (data) => {
        if (data) {
          setAlertMessage("Account Registered Successfully");
          setAlertType("success");
          setAlertOpen(true);
          setTimeout(() => {
            setAlertOpen(false);
            if (onRegisterSuccess) onRegisterSuccess();
          }, 2000);
        }
      },
      (error) => {
        setAlertMessage("Registration failed");
        setAlertType("error");
        setAlertOpen(true);
        console.log("error===", error);
      },
    );
  };
  const isValidInput =
    Object.values(errors).every((item) => item === "") &&
    Object.values(formData).every((item) => item !== "");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            color="#212020"
            fontWeight="bold"
          >
            REGISTER NEW ACCOUNT
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Last Name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="phone_number"
              type="number"
              value={formData.phone_number}
              onChange={handleChange}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
          </Grid>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              "&.Mui-disabled": {
                backgroundColor: "#7eb6ef",
                color: "#ebe7e7",
              },
            }}
            disabled={!isValidInput}
          >
            REGISTER
          </Button>
        </Box>
      </Paper>
      <AlertNotification
        isAlertOpen={alertOpen}
        alertMessage={alertMessage}
        alertType={alertType}
      />
    </Box>
  );
};

export default RegistrationForm;
