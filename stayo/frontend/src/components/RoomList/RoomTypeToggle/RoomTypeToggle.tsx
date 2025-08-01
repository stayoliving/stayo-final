import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { bedOptions } from "../../common/Constant";
import { IBedDetails } from "../../../types/homePageTypes";
interface RoomTypeToggleProps {
  bedDetails: IBedDetails | undefined;
  selectedSharingType: Function;
}

const RoomTypeToggle: React.FC<RoomTypeToggleProps> = ({
  bedDetails,
  selectedSharingType,
}) => {
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const availableBeds =
      bedDetails &&
      Object.keys(bedDetails.beds).filter(
        (bedType) => bedDetails.beds[bedType].length > 0,
      );
    if (availableBeds && availableBeds?.length > 0) {
      setSelected(availableBeds[0]);
      selectedSharingType(availableBeds[0]);
    }
  }, [bedDetails]);

  const handleSharingType = (sharingType: string) => {
    setSelected(sharingType);
    selectedSharingType(sharingType);
  };

  return (
    <Box display="flex" gap={2}>
      {bedDetails &&
          Object.keys(bedDetails?.beds).map(
          (bedType) =>
            bedDetails?.beds[bedType].length > 0 && (
              <Button
                key={bedType}
                onClick={() => handleSharingType(bedType as string)}
                variant="contained"
                disableElevation
                className="room-type-btn"
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  backgroundColor: selected === bedType ? "#a9e5e5" : "#cbcece",
                  color: "#333030",
                  fontWeight: 500,
                  minWidth: "120px",
                }}
              >
                {bedOptions[bedType as keyof typeof bedOptions]}
              </Button>
            ),
        )}
      {/* {options.map((option) => (
        <Button
          key={option}
          onClick={() => setSelected(option)}
          variant="contained"
          disableElevation
          className='room-type-btn'
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            backgroundColor:
              selected === option ? '#a9e5e5' : '#cbcece',
            color: '#333030',
            fontWeight: 500,
            minWidth: '120px',
          }}
        >
          {option}
        </Button>
      ))} */}
    </Box>
  );
};

export default RoomTypeToggle;
