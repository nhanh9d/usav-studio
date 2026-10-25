'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  autoplay?: boolean;
  loop?: boolean;
}

export default function Carousel({ children, autoplay = true, loop = true }: CarouselProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
      loop={loop}
      className="w-full rounded-xl overflow-hidden"
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
