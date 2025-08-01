//export type IPropertiesDetails = IProperties[];

export interface IPropertiesDetails {
  message: string
  status_code: number
  properties: IProperties[]
}

export interface IProperties {
  id: number;
  name: string;
  city: string;
  area: string;
  address: string;
  food_available: boolean;
  nearby_locations: string;
  photos: string[];
  amenities: string[];
  bed_photos: string[];
}
export type IBedList = IBed[];

export interface IBed {
  id: number;
  bed_number: number;
  sharing_type: string;
  gender_preference: string;
  is_available: boolean;
  rent_amount: string;
  deposit_amount: string;
  property: number;
}

export interface IBedDetails {
  message: string
  status_code: number
  beds: IBedType
}

export interface IBedType {
  [key: string]: IBed[];
}

export interface IBed {
  id: number
  room_number: string
  bed_number: number
  sharing_type: string
  gender_preference: string
  is_available: boolean
  rent_amount: string
  deposit_amount: string
  token_amount: string
  property: number
}

export interface IRegisterAccountPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}
export interface ILoginAccountPayload {
  email: string;
  password: string;
}
