
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAccount } from "../services/homePageServices";
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../../features/userSlice';

type FormField = "email" | "password";
interface FormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [K in keyof FormData]?: string }>({});
  const dispatch = useDispatch();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("formdata====", formData);

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
    };
    loginAccount(payload).then(
      (data) => {
        if (data) {
          // Store user data in Redux
          dispatch(loginAction(data));
          // Optionally navigate or close sidebar
          if (onLoginSuccess) onLoginSuccess();
        }
      },
      (error) => {
        console.log("error====", error);
      },
    );
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(value))
          return "Password must include uppercase, lowercase, number, and special character";
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

  const handleRegister = () => {
    navigate("/register");
  };
  const isValidInput =
    Object.values(errors).every((item) => item === "") &&
    Object.values(formData).every((item) => item !== "");
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        // width: '100%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        background: '#fff',
        borderRadius: 3,
        boxShadow: '0 2px 16px 0 #e0e7ef',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            background: '#e3f2fd',
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <svg width="32" height="32" fill="#00B0FF" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
        </Box>
        <Typography variant="h6" fontWeight={700} color="#00B0FF">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Sign in to your account
        </Typography>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 1 }}
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
        sx={{ mb: 1 }}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{
          mt: 1,
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: 2,
          background: '#00B0FF',
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            background: '#0099cc',
            boxShadow: 'none',
          },
          "&.Mui-disabled": {
            backgroundColor: "#7eb6ef",
            color: "#ebe7e7",
          },
        }}
        disabled={!isValidInput}
      >
        Login
      </Button>
    </Box>
  );
};
export default LoginForm;
