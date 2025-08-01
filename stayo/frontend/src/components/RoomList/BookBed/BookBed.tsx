import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import RoomTypeToggle from "../RoomTypeToggle/RoomTypeToggle";
import { IBed, IBedDetails, IProperties } from "../../../types/homePageTypes";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useMemo } from 'react';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../services/homePageServices';

import { useSelector } from 'react-redux';

interface BookBedProps {
  propertyDetails: IProperties | undefined;
  bedDetails: IBedDetails | undefined;
  onOpenSidebar?: () => void; // Add prop to open sidebar
}

const BookBed: React.FC<BookBedProps> = ({ bedDetails, onOpenSidebar }) => {
  // Get user from Redux
  const user = useSelector((state: any) => state.user.userDetails);
  const [selectedRooms, setSelectedRooms] = useState<{
    [key: number]: boolean;
  }>({});
  const [availableBeds, setAvailableBeds] = useState<IBed[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  // Allow check-in date: 1st–5th of any month up to 12 months ahead
  const today = moment();
  const checkInOptions: string[] = [];
  for (let i = 0; i < 12; i++) {
    const m = today.clone().add(i, 'month');
    for (let d = 1; d <= 5; d++) {
      checkInOptions.push(m.clone().date(d).format('YYYY-MM-DD'));
    }
  }
  const [checkInDate, setCheckInDate] = useState(checkInOptions[0]);

  // Allow check-out date: last 5 days of any month, at least 1 month after check-in, up to 12 months after
  const checkOutOptions: string[] = [];
  const checkInMoment = moment(checkInDate);
  for (let i = 1; i <= 12; i++) {
    const m = checkInMoment.clone().add(i, 'month');
    const daysInMonth = m.daysInMonth();
    for (let d = daysInMonth - 4; d <= daysInMonth; d++) {
      checkOutOptions.push(m.clone().date(d).format('YYYY-MM-DD'));
    }
  }
  const [checkOutDate, setCheckOutDate] = useState(checkOutOptions[0]);

  // When check-in date changes, reset check-out date to first valid option
  const handleCheckInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckInDate(e.target.value);
    const newCheckInMoment = moment(e.target.value);
    const newCheckOutOptions: string[] = [];
    for (let i = 1; i <= 12; i++) {
      const m = newCheckInMoment.clone().add(i, 'month');
      const daysInMonth = m.daysInMonth();
      for (let d = daysInMonth - 4; d <= daysInMonth; d++) {
        newCheckOutOptions.push(m.clone().date(d).format('YYYY-MM-DD'));
      }
    }
    setCheckOutDate(newCheckOutOptions[0]);
  };
  const [loading, setLoading] = useState(false);

  const getSharingType = (sharingType: string) => {
    console.log("selectedSharingType===", sharingType);
    
    setSelectedRooms({});
    const bedsAvailable = bedDetails && bedDetails.beds[sharingType];
    setAvailableBeds(bedsAvailable ?? []);
  };

  const handleChange = (id: number, checked: boolean) => {
    setSelectedRooms(() => ({
      [id]: checked,
    }));
  };
  console.log(
    "selectedRooms=====",
    bedDetails && Object.values(bedDetails).every((arr) => arr.length === 0),
  );
  const isNoData =
    bedDetails && Object.values(bedDetails).every((arr) => arr.length === 0);
  const isRoomSelected = Object.values(selectedRooms).some(Boolean);
  // Find the selected bed (room)
  const selectedBed = availableBeds.find(bed => selectedRooms[bed.bed_number]);
  return (
    <>
      {!isNoData ? (
        <>
          <Typography sx={{ mb: 1 }} variant="h6">
            Select Sharing Type
          </Typography>
          <RoomTypeToggle
            bedDetails={bedDetails}
            selectedSharingType={getSharingType}
          ></RoomTypeToggle>
          <Typography sx={{ mt: 2 }} variant="subtitle1">
            Select Room Type
          </Typography>
          {availableBeds.map((bed, index) => (
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #00B0FF",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
              key={bed.id}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selectedRooms[bed.bed_number]}
                          onChange={(e) =>
                            handleChange(bed.bed_number, e.target.checked)
                          }
                          name={`${bed.id}`}
                        />
                      }
                      label={`Room Type ${index + 1}`}
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              <Box>
                <Typography fontWeight={600}>{`₹${bed.rent_amount}/month`}</Typography>
                {bed.token_amount && (
                  <Typography fontSize={14} color="text.secondary">
                    Token: ₹{bed.token_amount}
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
          {/* Book Now Button */}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!isRoomSelected}
              sx={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                px: 4,
                py: 1.5,
                background: isRoomSelected ? "#00B0FF" : "#cbcece",
                color: "#fff",
                boxShadow: "none",
                '&:hover': {
                  background: isRoomSelected ? "#0099cc" : "#cbcece",
                  boxShadow: "none",
                },
              }}
              onClick={() => {
                if (!user) {
                  if (onOpenSidebar) onOpenSidebar();
                  return;
                }
                // Check Razorpay key before opening dialog
                if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
                  alert('Payment configuration error: Razorpay key is missing. Please contact support.');
                  return;
                }
                setOpenDialog(true);
              }}
            >
              Book Now
            </Button>
          </Box>
          {/* Payment Confirmation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogContent>
              {selectedBed ? (
                <>
                  <Typography>Room Number: {selectedBed.room_number}</Typography>
                  <Typography>Token Amount: ₹{selectedBed.token_amount}</Typography>
                  <Box mt={2} display="flex" gap={2}>
                    <TextField
                      select
                      label="Check-in Date"
                      value={checkInDate}
                      onChange={handleCheckInDateChange}
                      sx={{ minWidth: 180 }}
                      InputLabelProps={{ shrink: true }}
                    >
                      {checkInOptions.map(date => (
                        <MenuItem key={date} value={date}>
                          {moment(date).format('D MMMM YYYY')}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Check-out Date"
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
                      sx={{ minWidth: 180 }}
                      InputLabelProps={{ shrink: true }}
                    >
                      {checkOutOptions.map(date => (
                        <MenuItem key={date} value={date}>
                          {moment(date).format('D MMMM YYYY')}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    Proceed to pay the token amount to confirm your booking.
                  </Typography>
                </>
              ) : (
                <Typography>No room selected.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedBed) return;
                  setLoading(true);
                  try {
                    if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
                      throw new Error('Payment configuration error: Razorpay key is missing. Please contact support.');
                    }
                    const order = await createRazorpayOrder(
                      selectedBed.id,
                      checkInDate,
                      checkOutDate,
                      user ? user.user.id : undefined,
                    ).then(res => {
                      console.log("Razorpay order response:", res);
                      if (res.status === 201) {
                          verifyRazorpayPayment({
                            razorpay_order_id: "12345",
                            razorpay_payment_id: "56789",
                            razorpay_signature: "signature123",
                            bed: selectedBed.id,
                            check_in_date: checkInDate,
                            check_out_date: checkOutDate,
                            user: user ? user.user.id : undefined,
                        } as any).then(data => {
                          console.log("Payment verification response:", data);
                          if (data.status !== 200) {
                            throw new Error('Payment verification failed');
                          }
                        })
                      }
                      return res.data;
                    });
                    console.log("Razorpay order created:", order);
                    setOpenDialog(false);
                    // Razorpay options
                    const options = {
                      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                      amount: order.amount,
                      currency: order.currency,
                      name: 'Stayo Booking',
                      description: 'Token Payment',
                      order_id: order.razorpay_order_id,
                      handler: function (response: any) {
                        // TODO: Call backend to verify payment
                        alert('Payment successful! Razorpay Payment ID: ' + response.razorpay_payment_id);
                      },
                      prefill: {},
                      notes: order.notes || {},
                      theme: { color: '#00B0FF' },
                      method: 'upi',
                      upi: {
                        flow: 'collect',
                      },
                    };
                    // @ts-ignore
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                  } catch (err: any) {
                    alert(err.message || 'Failed to create order');
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="contained"
                color="primary"
                disabled={!selectedBed || loading}
              >
                {loading ? 'Processing...' : 'Pay Token'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="h5" sx={{ padding: "5%" }}>
          Sorry, No Beds Available!!
        </Typography>
      )}
    </>
  );
};

export default BookBed;
