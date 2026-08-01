import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "https://img.29cm.co.kr/cms/202607/11f18c86e77310828148f775621bb8ee.png?width=1080&format=webp",
    title: "CAYL",
    description: "도시와 자연을 연결하는 새로운 컬렉션",
  },
  {
    id: 2,
    image: "https://img.29cm.co.kr/cms/202607/11f18bb93f44cc4196453f36ad7f8426.png?width=1080&format=webp",
    title: "NEW COLLECTION",
    description: "이번 시즌에 주목할 스타일",
  },
  {
    id: 3,
    image: "https://img.29cm.co.kr/cms/202607/11f18bb919940e308148759d32418289.png?width=1080&format=webp",
    title: "SEASON EDIT",
    description: "일상을 새롭게 만드는 아이템",
  },
];

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y, Autoplay]}
      slidesPerView={1}
      pagination={{ clickable: true }}
      navigation
      speed={800}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      loop
      keyboard
      className="h-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full min-h-[560px] overflow-hidden bg-black lg:min-h-[780px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;