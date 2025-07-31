import { Alert, Snackbar } from "@mui/material";

interface AlertNotificationProps {
  isAlertOpen: boolean;
  alertMessage: string;
  alertType: string;
}
const AlertNotification: React.FC<AlertNotificationProps> = ({ isAlertOpen, alertMessage, alertType }) => {
  return (
    <Snackbar
      open={isAlertOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={alertType as any} variant="filled" sx={{ width: "100%" }}>
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};
export default AlertNotification;
