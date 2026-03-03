export type EmotionType = "FACE" | "VOICE" | "TEXT";

export interface EmotionResult {
    emotion: string;
    confidence?: number;
}

export interface StandardResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface TextEmotionRequest {
    text: string;
}