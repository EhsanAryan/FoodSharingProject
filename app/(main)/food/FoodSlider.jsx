"use client";

import CustomSlider from '@/components/CustomSlider';
import ModalContainerWithoutHeader from '@/components/ModalContainerWithoutHeader';
import Image from 'next/image';
import React, { useState } from 'react';

const FoodSlider = ({ images }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageURL, setImageURL] = useState("");

    return (
        <div className="w-full">
            <CustomSlider
                items={images}
                className="w-[85%] max-w-[500px] h-[300px] md:h-[350px] rounded-lg"
                autoplay={true}
                effect="cards"
                navigation={false}
                onClick={(image) => {
                    setImageURL(image);
                    setIsOpen(true);
                }}
            />

            {/* Image modal */}
            <ModalContainerWithoutHeader
                isOpen={isOpen && imageURL}
                setIsOpen={setIsOpen}
                blur
                className="bg-transparent text-white rounded-xl w-[75vw] h-[85vh]
                border-2 border-gray-200"
            >
                <Image
                    src={imageURL}
                    alt="Modal Image"
                    className="rounded-xl object-cover"
                    fill
                />
            </ModalContainerWithoutHeader>
        </div>
    );
}

export default FoodSlider;
