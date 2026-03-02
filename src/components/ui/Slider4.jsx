import React from "react";
import ImageCursorTrail from "./image-cursortrail";

// Generate 15 classic saree images
const images = Array.from({ length: 15 }, (_, index) => {
  return `/Classic/classicsarees${index + 1}.jpg`;
});

const Slider4 = () => {
  return (
    <ImageCursorTrail
      items={images}
      maxNumberOfImages={5}
      distance={25}
      imgClass="sm:w-40 w-28 sm:h-48 h-36 object-cover"
      className="max-w-full rounded-3xl"
    />
  );
};

export default Slider4;
