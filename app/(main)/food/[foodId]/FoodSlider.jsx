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
                        className="w-[85%] max-w-[500px] h-[300px] md:h-[350px] rounded-xl"
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
                <div className="relative w-full max-w-[500px] h-[300px] md:h-[350px] rounded-xl mx-auto">
                    <Image
                        src={images[0]?.startsWith("blob") ? images[0] : `${base_api_url}/${images[0]}`}
                        alt="Food Image"
                        fill
                        className="object-cover top-appear
                        rounded-xl shadow-lg shadow-gray-700"
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
                className="bg-transparent text-white rounded-xl w-[75vw] h-[85vh]
                border-2 border-gray-200"
            >
                <Image
                    src={imageURL?.startsWith("blob") ? imageURL : `${base_api_url}/${imageURL}`}
                    alt="Modal Image"
                    className="rounded-xl object-cover"
                    fill
                />
            </ModalContainerWithoutHeader>
        </>
    );
}

export default FoodSlider;
