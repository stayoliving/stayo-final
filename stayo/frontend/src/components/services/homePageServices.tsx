import {
  IBedDetails,
  IBedList,
  ILoginAccountPayload,
  IPropertiesDetails,
  IRegisterAccountPayload,
} from "../../types/homePageTypes";
import { apiRequest } from "./apiBase";

export const getProperties = (): Promise<IPropertiesDetails> => {
  return apiRequest("/api/properties/", "GET");
};

export const getBedList = (propertyId: number): Promise<IBedDetails> => {
  return apiRequest(`/api/properties/${propertyId}/beds/`, "GET");
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
