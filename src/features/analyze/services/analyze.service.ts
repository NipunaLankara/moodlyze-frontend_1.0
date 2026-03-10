import API from "../../../config/axiosinstance";
import type {AnalysisResponse} from "../types/analyze.types.ts";

export const processAnalysis = () =>
    API.get("/analyze/process");

export const completeSchedulePart = (scheduleId: number) =>
    API.put(`/analyze/schedule/${scheduleId}/complete`);

export const fetchTodaysSchedule = async (): Promise<AnalysisResponse> => {
    const res = await API.get("/analyze/today", {
        headers: { "X-User-Id": 123 }
    });
    return res.data.data;
};