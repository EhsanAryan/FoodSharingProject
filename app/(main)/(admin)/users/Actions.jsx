"use client";

import Link from 'next/link';
import React, { useContext, useState } from 'react';
import SubjectIcon from '@mui/icons-material/Subject';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Confirm } from '@/utils/popupWindows';
import { MainContext } from '@/context/MainContextContainer';
import KeyIcon from '@mui/icons-material/Key';
import PasswordModal from './modals/PasswordModal';
import InfoModal from './modals/InfoModal';

const Actions = ({ rowData, setForceRequest }) => {
    const { setIsLogin, setIsAdmin } = useContext(MainContext);

    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className={`flex items-center justify-center gap-4
        ${loading ? "pointer-events-none" : ""}`}>
                {/* <Link
                href={`/food/${rowData._id}`}
                className="px-4 py-1.5 rounded-lg green-btn
                flex justify-center items-center gap-2"
            >
                <SubjectIcon />
                <span>جزئیات</span>
            </Link>
            <Link
                href={`/sharing-food/${rowData._id}`}
                className="px-4 py-1.5 rounded-lg yellow-btn
                flex justify-center items-center gap-2"
            >
                
            </Link> */}
                <button
                    type="button"
                    className="px-4 py-1.5 rounded-lg blue-btn
                flex justify-center items-center gap-2"
                    onClick={() => setPasswordModalOpen(true)}
                >
                    <KeyIcon />
                    <span>تغییر رمز</span>
                </button>
                <button
                    type="button"
                    className="px-4 py-1.5 rounded-lg yellow-btn
                flex justify-center items-center gap-2"
                    onClick={() => setInfoModalOpen(true)}
                >
                    <EditIcon />
                    <span>ویرایش</span>
                </button>
            </div>

            {/* Change password modal */}
            <PasswordModal
                isOpen={passwordModalOpen}
                setIsOpen={setPasswordModalOpen}
                rowData={rowData}
            />

            {/* Change info modal */}
            <InfoModal
                isOpen={infoModalOpen}
                setIsOpen={setInfoModalOpen}
                rowData={rowData}
                setForceRequest={setForceRequest}
            />
            
        </>
    );
}

export default Actions;
