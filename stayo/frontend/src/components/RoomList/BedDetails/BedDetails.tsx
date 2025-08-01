import React from "react";
import Grid from "@mui/material/Grid";
import "./BedDetails.css";
import { IBedDetails, IProperties } from "../../../types/homePageTypes";
import { Button, Icon, Typography } from "@mui/material";
import CarouselImages from "../../common/Carousel/CarouselImages";
import ReadMoreLess from "../../common/ReadMoreLess/ReadMoreLess";
import { aminitiesDetails, bedOptions } from "../../common/Constant";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import WifiIcon from "@mui/icons-material/Wifi";
import KitchenIcon from "@mui/icons-material/KitchenOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoomOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import LinkedCameraOutlinedIcon from "@mui/icons-material/LinkedCameraOutlined";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";

interface BedDetailsProps {
  propertyDetails: IProperties | undefined;
  bedDetails: IBedDetails | undefined;
}
const BedDetails: React.FC<BedDetailsProps> = ({
  propertyDetails,
  bedDetails,
}) => {
  const iconMap: Record<string, React.ElementType> = {
    LocalParkingIcon,
    WifiIcon,
    KitchenIcon,
    MeetingRoomIcon,
    RedeemOutlinedIcon,
    LocalLaundryServiceOutlinedIcon,
    LinkedCameraOutlinedIcon,
    CleaningServicesIcon,
    LocalDrinkOutlinedIcon,
    FitnessCenterOutlinedIcon,
    BathtubOutlinedIcon,
    // Add other mappings
  };
  const getAmenities = () =>
    aminitiesDetails.map((amenity, index) => {
      if (propertyDetails && propertyDetails.amenities.includes(amenity.name)) {
        const IconComponent = iconMap[amenity.iconName];
        return (
          <Grid size={3} key={index}>
            {IconComponent && (
              <div className="amenity-container">
                <Grid size={3} key={index}>
                  <IconComponent sx={{ fontSize: 24 }} />{" "}
                </Grid>
                <Grid size={9} key={index}>
                  <div className="amenity-name">{amenity.name}</div>
                </Grid>
              </div>
            )}
          </Grid>
        );
      }
    });

  return (
    <div className="bed-details-container">
      <Typography variant="h5" gutterBottom>
        {propertyDetails?.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={7}>
          <Typography variant="body2" gutterBottom>
            {propertyDetails?.address}
          </Typography>
        </Grid>
        <Grid size={12}>
          <CarouselImages
            images={propertyDetails?.bed_photos ?? []}
            imgHeight="500px"
          ></CarouselImages>
        </Grid>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom>
            About the Property
          </Typography>
          <ReadMoreLess
            text="Looking for a premium abode in Pune? Opt for Stayo living
            to enhance your lifestyle beyond a nearby PG. Indulge in
            fully-furnished, meticulously-kept lodgings and access services like
            WiFi, Power Backup, and Housekeeping. Immerse yourself in luxury
            with furnished rooms and an assortment of recreational facilities.
            Also, take advantage of the proximity to IT companies and colleges."
          ></ReadMoreLess>
        </Grid>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom>
            Room Details
          </Typography>
          <Typography variant="body2" gutterBottom>
            All room type have some variants that are larger in size or have
            extra Amenities.
          </Typography>
        </Grid>
        {bedDetails &&
          Object.keys(bedDetails.beds).map(
            (bedType) => (
              // bedDetails[bedType].length > 0 && (
              <Grid size={4}>
                <div className="room-card">
                  <div className="room-title">
                    {bedOptions[bedType as keyof typeof bedOptions]}
                  </div>
                  <div className="room-subtext">starting from</div>
                  <div>
                    <span className="room-price">
                      
                      {bedDetails?.beds[bedType].length > 0 &&
                        Math.min(
                          ...bedDetails?.beds[bedType].map((bed) =>
                            parseFloat(bed.rent_amount),
                          ),
                        )}
                    </span>
                    <span className="room-unit">/month</span>
                  </div>
                </div>
              </Grid>
            ),
            // ),
          )}
        <Grid size={12}>
          <Typography variant="h5" style={{ marginTop: "15px" }} gutterBottom>
            Amazing Amenities
          </Typography>
        </Grid>
        {getAmenities()}
      </Grid>
      {/* <Grid spacing={2}>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom>
            Amazing Amenities
          </Typography>
        </Grid>
        {getAmenities()}
      </Grid> */}
    </div>
  );
};
export default BedDetails;
