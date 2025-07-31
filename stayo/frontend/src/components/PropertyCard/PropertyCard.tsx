import React from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CarouselImages from "../common/Carousel/CarouselImages";
import { IBedList, IProperties } from "../../types/homePageTypes";
import { Link } from "@mui/material";

type PropertyRoomCardProps = {
  property: IProperties;
};

const PropertyRoomCard: React.FC<PropertyRoomCardProps> = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/room-list", { state: property });
  };
  return (
    <Card onClick={handleClick} sx={{ padding: "17px" }}>
      {/* <CardHeader
        title={property.name}
      /> */}
      <CardMedia component={CarouselImages} images={property?.photos} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <Link href="#" underline="hover">
            {property.name}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyRoomCard;
