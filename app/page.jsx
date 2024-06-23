"use client";

import { getFoodsService } from '@/services/foodServices';
import { Alert } from '@/utils/popupWindows';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/Loading';


export const dynamic = 'force-dynamic';

const Home = () => {
	const [foods, setFoods] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pagesCount, setPagesCount] = useState(1);

	const handleSetCurrentPage = (ev, newPage) => {
		setPage(newPage);
	}

	const getFoodsHandler = async () => {
		setLoading(true);
		try {
			const response = await getFoodsService(page, 20);
			if (response.status === 200) {
				setFoods(response.data.data);
				setPagesCount(response.data.pagesCount);
			}
		} catch (error) {
			if (error?.response?.status === 404) {
				Alert("خطا!", error.response.data.message, "error");
			} else {
				Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
			}
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getFoodsHandler();
	}, [page])

	return (
		<div>
			{loading ? (
				<Loading
					size={50}
					className="mt-12"
				/>
			) : foods.length ? (
				<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
				gap-y-8 sm:gap-x-6">
					{foods.map((item, index) => (
						<div
							key={`food_${item._id}_${index}`}
							className="bg-slate-800 rounded-lg overflow-hidden
							normal-transition hover:translate-y-[-10px]"
						>
							<div className="relative w-full h-[300px]">
								<Image
									src={item.image}
									alt={item.name}
									fill
									className="object-cover"
								/>
							</div>
							<div className="px-2 pt-4 pb-5">
								<h4 className="text-xl text-center">{item.name}</h4>
								<div className="mt-2 mb-8">
									{item.summary}
								</div>
								<div>
									<Link
										href={`/food/${item._id}`}
										className="bg-primary px-4 py-2 rounded-lg box-hoverable"
									>
										مشاهده جزئیات
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="mt-12 text-red-500 text-3xl text-center">
					غذایی برای نمایش موجود نیست!
				</div>
			)
			}
			{pagesCount > 1 && (
				<div className={`mt-8 w-full
                  flex justify-center items-center
                  ${loading ? "pointer-events-none" : ""}`}>
					<Pagination
						count={pagesCount}
						page={page}
						boundaryCount={1}
						onChange={(ev, newPage) => handleSetCurrentPage(ev, newPage)}
						color="primary"
						sx={{
							direction: "ltr !important",
							"& .MuiPagination-ul": {
								direction: "ltr !important",
							},
							"& .MuiPagination-ul li>:is(button, div)": {
								color: "white"
							},
							"& button.MuiButtonBase-root.MuiPaginationItem-root.Mui-selected:not(.MuiPaginationItem-previousNext)": {
								backgroundColor: "#343840 !important",
							}
						}}
					/>
				</div>
			)}
		</div >
	);
}

export default Home;