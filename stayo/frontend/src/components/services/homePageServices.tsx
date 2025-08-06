import {
  IBedDetails,
  IBedList,
  IBookingDetails,
  ILoginAccountPayload,
  IPropertiesDetails,
  IRegisterAccountPayload,
} from "../../types/homePageTypes";
import { apiRequest } from "./apiBase";

export const getProperties = (): Promise<IPropertiesDetails> => {
  return apiRequest("/api/properties/", "GET");
};

export const getBedList = (propertyId: number, param?: boolean): Promise<IBedDetails> => {
  return apiRequest(`/api/properties/${propertyId}/beds/${param ? '?available=true':''}`, "GET");
};

export const registerAccount = (
  payload: IRegisterAccountPayload,
): Promise<IRegisterAccountPayload> => {
  return apiRequest("/api/register/", "POST", payload);
};
export const loginAccount = (
  payload: ILoginAccountPayload,
): Promise<ILoginAccountPayload> => {
  return apiRequest("/api/login/", "POST", payload);
};
export const createRazorpayOrder = (
  bed: number,
  check_in_date: string,
  check_out_date: string,
  user?: number,
) => {
  return apiRequest("/api/book-bed/", "POST", {
    bed,
    check_in_date,
    check_out_date,
    user,
  });
};

//Add verify payment endpoint
// "razorpay_order_id",
            // "razorpay_payment_id",
            // "razorpay_signature",
            // "bed",
            // "check_in_date",
            // "check_out_date",
            // "user",
export const verifyRazorpayPayment = (
  payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string , bed: number, check_in_date: string, check_out_date: string, user?: number },
): Promise<any> => {
  return apiRequest("/api/verify-payment/", "POST", payload);
};

export const getBookingDetails = (userMailId: string): Promise<IBookingDetails> => {
  return apiRequest(`/api/bookingDetails/${userMailId}/`, "GET");
};