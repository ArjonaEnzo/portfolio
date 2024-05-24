/* eslint-disable @next/next/no-img-element */
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { EffectFade, Navigation, Pagination } from "swiper/modules";

type SwiperImage = { images: string[] };

export default function SwiperProjects({ images }: SwiperImage) {
  React.useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-[90%] h-[80%] ">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper w-[90%] h-[100vh] object-contain"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt="Project image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
