import { Paper, Button } from "@mui/material";

function CarouselItem({ item, imgHeight }: any) {
  return (
    <Paper>
      <img
        src={item}
        alt={item.title}
        style={{ width: "100%", height: imgHeight }}
      ></img>
    </Paper>
  );
}

export default CarouselItem;
