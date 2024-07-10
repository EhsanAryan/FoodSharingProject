"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards, EffectCoverflow } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/swiper-bundle.css";
import Image from "next/image";


const CustomSlider = ({
    items,
    className,
    slideClasses,
    imageClasses,
    autoplay,
    duration = 3000,
    navigation = true,
    pagination = true,
    slidesPerView = 1,
    onClick,
    effect = "slide"
}) => {

    return effect === "cards" ? (
        <Swiper
            className={`${className || "w-full h-full"}`}
            slidesPerView={slidesPerView}
            loop={true}
            centeredSlides={true}
            modules={autoplay ?
                [Pagination, Navigation, EffectCards, Autoplay] :
                [Pagination, Navigation, EffectCards]
            }
            autoplay={autoplay ? { delay: duration, disableOnInteraction: false } : false}
            navigation={navigation}
            pagination={pagination ? { clickable: true } : false}
            grabCursor={true}
            effect="cards"
            // cardsEffect={{
            //     rotate: 50,
            //     slideShadows: true,
            // }}
        >
            {items.map((item, index) => (
                <SwiperSlide key={`slide_${index}`} onClick={onClick ? () => onClick(item) : () => {}}>
                    <div className={`w-full h-full flex justify-center ${slideClasses || ""}`}>
                        <Image
                            src={item}
                            className={`w-full h-full object-cover ${imageClasses || ""}`}
                            fill
                            alt={`Slide pic ${index + 1}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    ) : effect === "coverflow" ? (
        <Swiper
            className={`${className || "w-full h-full"}`}
            slidesPerView={slidesPerView}
            loop={true}
            centeredSlides={true}
            modules={autoplay ?
                [Pagination, Navigation, EffectCoverflow, Autoplay] :
                [Pagination, Navigation, EffectCoverflow]
            }
            autoplay={autoplay ? { delay: duration, disableOnInteraction: false } : false}
            navigation={navigation}
            pagination={pagination ? { clickable: true } : false}
            grabCursor={true}
            effect="coverflow"
            // coverflowEffect={{
            //     rotate: 50,
            //     stretch: 0,
            //     depth: 100,
            //     modifier: 1,
            //     slideShadows: true,
            // }}
        >
            {items.map((item, index) => (
                <SwiperSlide key={`slide_${index}`} onClick={onClick ? () => onClick(item) : () => {}}>
                    <div className={`w-full h-full flex justify-center ${slideClasses || ""}`}>
                        <Image
                            src={item}
                            className={`w-full h-full object-cover ${imageClasses || ""}`}
                            fill
                            alt={`Slide pic ${index + 1}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    ) : (
        <Swiper
            className={`${className || "w-full h-full"}`}
            slidesPerView={slidesPerView}
            loop={true}
            centeredSlides={true}
            modules={autoplay ?
                [Pagination, Navigation, Autoplay] :
                [Pagination, Navigation]
            }
            autoplay={autoplay ? { delay: duration, disableOnInteraction: false } : false}
            navigation={navigation}
            pagination={pagination ? { clickable: true } : false}
            grabCursor={true}
        >
            {items.map((item, index) => (
                <SwiperSlide key={`slide_${index}`} onClick={onClick ? () => onClick(item) : () => {}}>
                    <div className={`w-full h-full flex justify-center ${slideClasses || ""}`}>
                        <Image
                            src={item}
                            className={`w-full h-full object-cover ${imageClasses || ""}`}
                            fill
                            alt={`Slide pic ${index + 1}`}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default CustomSlider;