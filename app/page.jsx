"use client";

import React, { useContext, useEffect } from 'react';
import Loading from '@/components/Loading';
import HomeUser from './HomeUser';
import { useRouter } from 'next/navigation';
import { MainContext } from '@/context/MainContextContainer';
import HomeAdmin from './HomeAdmin';

const Home = () => {
	const { isLogin, isAdmin, isLoading } = useContext(MainContext);

	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (isAdmin && !isLogin) {
				router.push("/login")
			}
		}
	}, [isLogin, isLoading]);

	return (
		<>
			{isLoading ? (
				<Loading
					size={50}
					className="my-14"
				/>
			) : isAdmin ? (
				<HomeAdmin />
			) : (
				<HomeUser />
			)}
		</>
	);
}

export default Home;
