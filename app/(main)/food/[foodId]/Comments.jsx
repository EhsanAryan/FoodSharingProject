import Loading from '@/components/Loading';
import { addNewCommentService, deleteCommentService, getCommentsService } from '@/services/commentServices';
import { Alert, Confirm } from '@/utils/popupWindows';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { logoutAction } from '@/app/actions/actions';
import { MainContext } from '@/context/MainContextContainer';
import { useRouter } from 'next/navigation';

const Comments = ({ food }) => {
    const { isLogin, setIsLogin, setIsAdmin } = useContext(MainContext);

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);

    const [text, setText] = useState("");
    const [addLoading, setAddLoading] = useState(false);

    const [deletingComment, setDeletingComment] = useState(null);

    const router = useRouter();

    const getCommentsHandler = async () => {
        setLoading(true);
        try {
            const response = await getCommentsService(food._id.toString(), page, 10);
            if (response.status === 200) {
                if (page === 1) {
                    setComments(response.data.data);
                } else {
                    setComments(prevValue => [...prevValue, ...response.data.data]);
                }
                setPagesCount(response.data.pagesCount);
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    const deleteCommentHandler = async (commentId) => {
        const confirm = await Confirm("تایید عملیات", "آیا از حذف این نظر مطمئن هستید؟", "warning", true, "لغو", "بله");
        if (!confirm) return;
        setDeletingComment(commentId);
        try {
            const response = await deleteCommentService(commentId);
            if (response.status === 200) {
                setComments(prevValue => prevValue.filter(item => item._id !== commentId));
                Alert(null, "نظر شما نظر با موفقیت حذف شد", "success");
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                await Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
                if (error.response.status === 401) {
                    await logoutAction();
                    setIsLogin(false);
                    setIsAdmin(0);
                }
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setDeletingComment(null);
        }
    }

    const addNewCommentHandler = async () => {
        if (!text.trim()) return Alert("خطا!", "لطفاً ابتدا نظر خود را بنویسید", "error");
        setAddLoading(true);
        try {
            const data = { text: text.trim() };
            const response = await addNewCommentService(food._id.toString(), data);
            if (response.status === 200) {
                if (page === pagesCount) {
                    setComments(prevValue => [...prevValue, response.data]);
                }
                setText("");
                Alert(null, "نظر شما با موفقیت ثبت شد.", "success");
            }
        } catch (error) {
            if (error?.response?.status && error?.response?.data?.message) {
                Alert(`خطا ${error.response.status}!`, error.response.data.message, "error");
            } else {
                Alert("خطا!", "مشکلی از سمت سرور رخ داده است!\nلطفاً چند لحظه دیگر مجدداً تلاش کنید.", "error");
            }
        } finally {
            setAddLoading(false);
        }
    }

    useEffect(() => {
        getCommentsHandler();
    }, [page])

    return (
        <>
            {/* Comments */}
            <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 py-5 max-w-screen-xl 
            my-10 mx-auto top-appear">
                <h1 className="text-3xl font-bold text-primary">
                    نظرات
                </h1>
                <div
                    className="w-full h-[1.5px] rounded-full bg-primary mt-2 mb-8"
                ></div>
                <div className="flex flex-col gap-6 px-4 pb-3">
                    {(loading && page === 1 && comments.length === 0) ? (
                        <Loading
                            size={50}
                            className="my-10"
                        />
                    ) : comments.length ? (
                        comments.map((item, index) => (
                            <div
                                key={`comment_${index}`}
                                className="bg-slate-800 rounded-md px-5 py-6"
                            >
                                <div className="flex justify-between items-center gap-8">
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            src={item?.user?.avatar || ""}
                                            alt="Comment Creator avatar"
                                            sx={{
                                                width: "65px",
                                                height: "65px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => router.push(`/user/${item?.user?._id}`)}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <small>
                                                {item?.user?.username}
                                            </small>
                                            <small>
                                                {`${item?.user?.first_name || ""} ${item?.user?.last_name || ""}`}
                                            </small>
                                        </div>
                                    </div>
                                    {item.is_owner && (
                                        <div>
                                            {deletingComment === item._id ? (
                                                <div className="px-3">
                                                    <Loading
                                                        size={30}
                                                        color="#dc2626"
                                                        noText
                                                    />
                                                </div>
                                            ) : (
                                                <Tooltip
                                                    title="حذف نظر"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <IconButton
                                                        onClick={() => deleteCommentHandler(item._id)}
                                                    >
                                                        <DeleteIcon
                                                            sx={{
                                                                color: "#dc2626",
                                                                fontSize: "2rem"
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="divider mt-3 mb-4"></div>
                                <div
                                    className="px-2 break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: item.text.replaceAll("\n", "<br />")
                                    }}
                                ></div>
                            </div>
                        ))
                    ) : (
                        <h3 className="text-2xl text-center py-4">
                            هنوز نظری ثبت نشده است!
                        </h3>
                    )}

                    {comments.length > 0 && (
                        <>
                            {loading ? (
                                <div className="mt-5 mb-3">
                                    <Loading
                                        size={35}
                                        color="#fff"
                                        noText
                                    />
                                </div>
                            ) : (pagesCount > 1 && page < pagesCount) ? (
                                <div
                                    className="mt-2 w-full flex justify-center items-center"
                                >
                                    <button
                                        className="w-full max-w-[170px] blue-btn px-4 py-3 rounded-lg"
                                        onClick={() => setPage(prevValue => prevValue + 1)}
                                    >
                                        مشاهده بیشتر
                                    </button>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>

            {/* Add comment */}
            <div className="w-full bg-slate-900 rounded-md px-4 md:px-6 pt-6 pb-4 max-w-screen-xl 
            my-10 mx-auto bottom-appear">
                {isLogin ? (
                    <>
                        <div className={`w-full flex flex-col gap-2.5 text-white`}>
                            <label
                                htmlFor="comment"
                                className={`bg-transparent whitespace-nowrap px-3`}
                            >
                                نظر شما
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                placeholder="نظر خود را بنویسید"
                                rows={4}
                                className={`bg-slate-800 w-full
                                border outline-none rounded-md resize-none
                                placeholder:text-sm px-3 py-2`}
                                value={text}
                                onChange={(ev) => setText(ev.target.value)}
                            ></textarea>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-lg yellow-btn
                                ${addLoading ? "pointer-events-none" : "pointer-events-auto"}`}
                                onClick={addNewCommentHandler}
                            >
                                {addLoading ? (
                                    <Loading
                                        size={25}
                                        color="#fff"
                                        noText
                                    />
                                ) : (
                                    "ثبت نظر"
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-xl">
                        برای ثبت نظر، باید وارد حساب کاربری خود شوید
                    </div>
                )}
            </div>
        </>
    );
}

export default Comments;
