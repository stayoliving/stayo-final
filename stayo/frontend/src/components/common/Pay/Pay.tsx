import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Paper,
  Typography,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getBookingDetails } from "../../services/homePageServices";

interface PayProps {
  onOpenSidebar: () => void;
}
const Pay: React.FC<PayProps>  = ({onOpenSidebar}) => {
    const user = useSelector((state: any) => state.user.userDetails);
    console.log("user===", user);
  const [formData, setFormData] = useState({
    userName: user ?`${user?.user?.first_name} ${user?.user?.last_name}`:"",
    bedNumber: "3",
    rentAmount: "1000",
    month: "",
    paymentType: "Deposit",
  });
   

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
      if(!user){
          onOpenSidebar();
      }
  },[])
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userName: `${user?.user?.first_name} ${user?.user?.last_name}`,
      }));

      getBookingDetails(user?.user?.email).then((res) => {
        // setFormData((prev) => ({
        //   ...prev,
        //   bedNumber: res?.bed_number,
        //   rentAmount: res?.rent_amount,
        //   paymentType: res?.payment_type,
        // }));
      });

    }
    
  }, [user]);

  // For TextFields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user){
        onOpenSidebar();
        return
    }
    const isValidForm = Object.values(formData).every((value) => value !== "");
    if (!isValidForm) {
      return;
    }
    console.log("Form submitted:", formData);
  };
  

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, mx: "auto", mt: 5,}}>
      <Typography variant="h5" gutterBottom>
        Rent Payment Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="User Name"
          name="userName"
          fullWidth
          margin="normal"
          value={formData.userName}
          onChange={handleInputChange}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          required
        />

        <TextField
          label="Bed Number"
          name="bedNumber"
          fullWidth
          margin="normal"
          value={formData.bedNumber}
          onChange={handleInputChange}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          required
        />

        <TextField
          label="Rent/Deposit Amount"
          name="rentAmount"
          fullWidth
          margin="normal"
          type="number"
          value={formData.rentAmount}
          onChange={handleInputChange}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Month</InputLabel>
          <Select
            name="month"
            value={formData.month}
            onChange={handleSelectChange}
            required
            label="Month"
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Payment Type"
          name="paymentType"
          fullWidth
          margin="normal"
          value={formData.paymentType}
          onChange={handleInputChange}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          required
        />
        {/* <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Payment Type</FormLabel>
          <RadioGroup
            name="paymentType"
            value={formData.paymentType}
            onChange={handleInputChange}
            row
          >
            <FormControlLabel value="Online" control={<Radio />} label="Online" />
            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
          </RadioGroup>
        </FormControl> */}

        <Box mt={3}>
          <Button type="submit" variant="contained" fullWidth>
            Pay
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Pay;
