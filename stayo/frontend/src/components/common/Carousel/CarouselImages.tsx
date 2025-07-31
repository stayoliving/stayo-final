import Carousel from "react-material-ui-carousel";
import CarouselItem from "./CarouselItem";
import banner from "../../../assets/images/banner.jpg";
import React from "react";
export interface CustomMediaProps {
  images: string[];
  imgHeight?: string;
}
const CarouselImages = React.forwardRef<HTMLDivElement, CustomMediaProps>(
  (props) => {
    const { images, imgHeight = "400px" } = props;

    return (
      <Carousel>
        {images.map((item, i) => (
          <CarouselItem key={i} item={item} imgHeight={imgHeight} />
        ))}
      </Carousel>
    );
  },
);

export default CarouselImages;
