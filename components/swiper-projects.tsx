/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper w-full h-full"
      >
        {images.map((url, index) => {
          const isVideo = url.endsWith(".mp4") || url.endsWith(".webm");

          return (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center bg-black"
            >
              {isVideo ? (
                <video
                  src={url}
                  controls
                  className="w-full h-full object-contain max-h-[80vh]"
                >
                  Tu navegador no soporta el video.
                </video>
              ) : (
                <img
                  src={url}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
