import API from "../../../config/axiosinstance";
import type { TextEmotionRequest } from "../types/emotion.types";

/* TEXT */
export const detectTextEmotion = (data: TextEmotionRequest) =>
    API.post("/emotion/text", data);

/* IMAGE */
export const detectImageEmotion = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/emotion/image", formData);
};

/* SPEECH */
export const detectSpeechEmotion = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/emotion/speech", formData);
};