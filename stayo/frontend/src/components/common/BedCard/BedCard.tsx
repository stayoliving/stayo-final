import React from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CarouselImages from "../Carousel/CarouselImages";
import { IBed } from "../../../types/homePageTypes";
import { Link } from "@mui/material";

type BedCardProps = {
  bedDetails: IBed;
};

const BedCard: React.FC<BedCardProps> = ({ bedDetails }) => {
  return (
    <Card sx={{ padding: "17px" }}>
      {/* <CardHeader
        title={property.name}
      /> */}
      {/* <CardMedia component={CarouselImages} /> */}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <Link href="#" underline="hover">
            {bedDetails.id}
          </Link>
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography> */}
      </CardContent>
    </Card>
  );
};

export default BedCard;
