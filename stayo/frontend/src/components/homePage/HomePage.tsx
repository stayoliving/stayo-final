import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import banner from "../../assets/images/banner.jpg";
import "./HomePage.css";
import { getProperties } from "../services/homePageServices";
import PropertyRoomCard from "../PropertyCard/PropertyCard";
import { IPropertiesDetails } from "../../types/homePageTypes";
import { error } from "console";

const HomePage = () => {
  const [properties, setProperties] = useState<IPropertiesDetails>([]);
  useEffect(() => {
    getProperties().then(
      (data) => {
        if (data) {
          setProperties(data);
        }
      },
      (error) => {
        console.log("error===", error);
      },
    );
  }, []);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={12}>
          <div className="banner-img-container">
            <img className="banner-img" src={banner} alt="Banner_image"></img>
            <Button className="book-now-btn" variant="contained">
              Book Now
            </Button>
          </div>
        </Grid>
        <Grid container size={12}>
          <Grid size={12}>
            <p className="properties-header">Our Properties</p>
          </Grid>
          {properties?.map((property) => (
            <Grid size={4}>
              <PropertyRoomCard property={property}></PropertyRoomCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
