import { Card, CardContent, CardHeader, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getBedList } from "../services/homePageServices";
import { IBedDetails, IBedList, IProperties } from "../../types/homePageTypes";
import "./RoomList.css";
import BedDetails from "./BedDetails/BedDetails";
import BookBed from "./BookBed/BookBed";

const RoomList = ({ onOpenSidebar }: { onOpenSidebar?: () => void }) => {
  const location = useLocation();
  const [bedList, setBedList] = useState<IBedDetails>();
  const [propertyDetails, setPropertyDetails] = useState<IProperties>();
  useEffect(() => {
    const propertyId = location.state?.id;
    setPropertyDetails(location.state);
    // getBedList(propertyId, true).then(
    //   (data) => {
    //     if (data) {
    //       setBedList(data);
    //     }
    //   },
    //   (error) => {
    //     console.log("error=====", error);
    //   },
    // );
  }, []);
  return (
    <>
      <div>
        <div style={{ width: "56%" }}>
          <BedDetails
            propertyDetails={propertyDetails}
            // bedDetails={bedList}
          ></BedDetails>
        </div>
        <div className="room-details-form-container">
          <BookBed
            propertyDetails={propertyDetails}
            // bedDetails={bedList}
            onOpenSidebar={onOpenSidebar}
          />
        </div>
      </div>
    </>
  );
};

export default RoomList;
