import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const photos = [
  "https://t3.ftcdn.net/jpg/05/69/81/88/360_F_569818893_ph01fzGNwgIBf0pzcwyJ3IwsRzQTpmpN.jpg",
  "https://img.freepik.com/premium-photo/happy-children-playing-with-bubbles-forest_705284-59843.jpg",
  "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?cs=srgb&dl=pexels-fauxels-3184416.jpg&fm=jpg",
  "https://images.pexels.com/photos/7669142/pexels-photo-7669142.jpeg",
];

const fadeDuration = 2; // Duration of the fade in seconds

const PhotoSlider = () => {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevious(current);
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 5000); // 5s per photo (2s fade + 3s display)
    return () => clearInterval(interval);
  }, [current]);

  return (
<div className="w-full h-[32rem] overflow-hidden relative">
{previous !== null && (
        <motion.img
          key={`previous-${previous}`}
          src={photos[previous]}
          alt={``}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: fadeDuration, ease: "easeInOut" }}
          className="absolute w-full h-full object-cover"
        />
      )}
      <motion.img
        key={`current-${current}`}
        src={photos[current]}
        alt={`Slide ${current + 1}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: fadeDuration, ease: "easeInOut" }}
        className="absolute w-full h-full object-cover"
      />

      {/* Cursive Text Overlapping the Bottom */}

    </div>
  );
};

export default PhotoSlider;
