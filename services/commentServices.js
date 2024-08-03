import httpService from "./httpService"

export const getCommentsService = (foodId, page = 1, pageSize = 20) => {
    return httpService(`/api/comments/${foodId}/${page}?page_size=${pageSize}`, "get");
}

export const addNewCommentService = (foodId, data) => {
    return httpService(`/api/comment/${foodId}`, "post", data);
}

export const deleteCommentService = (commentId) => {
    return httpService(`/api/comment/delete/${commentId}`, "delete");
}