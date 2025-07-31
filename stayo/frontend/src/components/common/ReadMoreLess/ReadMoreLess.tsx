import { Typography } from "@mui/material";
import React, { useState } from "react";

interface ReadMoreLessProps {
  text: string;
}
const ReadMoreLess: React.FC<ReadMoreLessProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <Typography
        variant="body2"
        gutterBottom
        onClick={toggleReadMore}
        style={{ color: "blue", cursor: "pointer" }}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </Typography>
    </p>
  );
};

export default ReadMoreLess;
