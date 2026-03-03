export interface ScheduleItem {
    id: number,        // scheduleId (VERY IMPORTANT)
    taskId: number,
    displayTitle: string,
    partNumber?: number,
    isBreak: boolean,
    startTime: string,
    endTime: string
}
export interface AnalysisResponse {
    state: "REST_REQUIRED" | "READY_TO_WORK";
    detectedMood: string;
    message: string;
    taskData: ScheduleItem[] | null;
}