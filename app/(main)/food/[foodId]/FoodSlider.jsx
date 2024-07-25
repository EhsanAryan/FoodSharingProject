"use client";

import CustomSlider from '@/components/CustomSlider';
import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import { base_api_url } from '@/services/httpService';
import Image from 'next/image';
import React, { useState } from 'react';

const FoodSlider = ({ images }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageURL, setImageURL] = useState("");

    return (
        <>
            {images.length > 1 ? (
                <div className="w-full">
                    <CustomSlider
                        items={images}
                        className="w-[85%] max-w-[500px] h-[300px] md:h-[350px] mx-auto rounded-xl"
                        imageClasses="rounded-xl"
                        autoplay={true}
                        effect="cards"
                        navigation={false}
                        onClick={(image) => {
                            setImageURL(image);
                            setIsOpen(true);
                        }}
                    />
                </div>
            ) : (
                <div className="relative w-full max-w-[500px] h-[300px] md:h-[350px] mx-auto rounded-xl">
                    <Image
                        src={images[0]?.startsWith("blob") ? images[0] : `${base_api_url}${images[0]}`}
                        alt="Food Image"
                        fill
                        className="object-cover top-appear
                        rounded-xl shadow-lg shadow-gray-700 cursor-pointer"
                        onClick={() => {
                            setImageURL(images[0]);
                            setIsOpen(true);
                        }}
                    />
                </div>
            )}

            {/* Image modal */}
            <ModalContainerWithoutHeader
                isOpen={isOpen && imageURL}
                setIsOpen={setIsOpen}
                blur
                className="bg-transparent text-white rounded-xl max-w-[90vw] max-h-[90vh]"
            >
                {/* eslint-disable  */}
                <img
                    src={imageURL}
                    alt="Modal Image"
                    className="rounded-xl max-w-[90vw] max-h-[90vh]"
                />
                {/* eslint-enable */}
            </ModalContainerWithoutHeader>
        </>
    );
}

export default FoodSlider;
