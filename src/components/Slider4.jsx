// import React from "react";
// import ImageCursorTrail from "./ui/image-cursortrail";
// const images = [
//   // 🖼️ Local images
//   "/Classic/classic1.jpg",
//   "/Luximg/Lux1.jpg",
//   "/Classic/classic2.jpg",
//   "/Luximg/Lux4.jpg",
//   "/Classic/classic13.jpg",
//   "/Classic/classic14.jpg",
//   "/Classic/classic15.jpg",
//   "/Classic/classic16.jpg",
//   "/Classic/classic3.jpg",
//   "/Classic/classic4.jpg",
//   "/Luximg/Lux2.jpg",
//   "/Classic/classic5.jpg",
//   "/Luximg/Lux3.jpg",
//   "/Classic/classic6.jpg",
//   "/Classic/classic1.jpg",
//   "/Luximg/Lux1.jpg",
//   "/Classic/classic2.jpg",
//   "/Luximg/Lux4.jpg",
//   "/Classic/classic3.jpg",
//   "/Luximg/Lux5.jpg",
//   "/Classic/classic4.jpg",
//   "/Luximg/Lux2.jpg",
//   "/Classic/classic10.jpg",
//   "/Classic/classic11.jpg",
//   "/Classic/classic12.jpg",
//   "/Classic/classic5.jpg",
//   "/Classic/classic6.jpg",
//   "/Classic/classic7.jpg",
//   "/Luximg/Lux6.jpg",
//   "/Classic/classic8.jpg",
//   "/Classic/classic9.jpg",
//   "/Classic/classic6.jpg",
// ];

// const Slider4 = () => {
//   return (
//     <ImageCursorTrail
//       items={images}
//       maxNumberOfImages={5}
//       distance={25}
//       imgClass="sm:w-40 w-28 sm:h-48 h-36  "
//       className=" max-w-full rounded-3xl"
//     ></ImageCursorTrail>
//   );
// };

// export default Slider4;
import React from "react";
import ImageCursorTrail from "./ui/image-cursortrail";

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
