import { useState } from "react";
import {
    detectImageEmotion,
    detectSpeechEmotion,
    detectTextEmotion
} from "../services/emotion.service";
import WebcamCapture from "./WebcamCapture";
import AudioRecorder from "./AudioRecorder";

type Props = {
    onDetected: (emotion: string) => void;
    mode: "BEFORE" | "AFTER";
};

const EmotionDetector = ({ onDetected, mode }: Props) => {

    const [emotionType, setEmotionType] =
        useState<"FACE" | "VOICE" | "TEXT" | null>(null);

    const [textInput, setTextInput] = useState("");
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    /* ---------------- FILE UPLOAD HANDLER ---------------- */

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setCapturedFile(e.target.files[0]);
    };

    /* ---------------- DETECT HANDLER ---------------- */

    const handleDetect = async () => {
        if (!emotionType) return;

        try {
            setLoading(true);

            let res;

            if (emotionType === "FACE" && capturedFile) {
                res = await detectImageEmotion(capturedFile);
            }

            if (emotionType === "VOICE" && capturedFile) {
                res = await detectSpeechEmotion(capturedFile);
            }

            if (emotionType === "TEXT" && textInput.trim()) {
                res = await detectTextEmotion({ prompt: textInput });
            }

            if (res) {
                const responseData = res.data.data;

                if (typeof responseData === "string") {
                    onDetected(responseData);
                } else {
                    onDetected(responseData.emotion);
                }
            }

        } catch (error) {
            alert("Emotion detection failed");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setEmotionType(null);
        setCapturedFile(null);
        setTextInput("");
    };

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                background: "#ffffff"
            }}
        >
            <h3 style={{ marginBottom: "15px" }}>
                {mode === "BEFORE"
                    ? "Detect Emotion Before Adding Task"
                    : "Analyze Emotion After Tasks"}
            </h3>

            {/* SELECT TYPE */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button onClick={() => setEmotionType("FACE")}>Face</button>
                <button onClick={() => setEmotionType("VOICE")}>Voice</button>
                <button onClick={() => setEmotionType("TEXT")}>Text</button>
            </div>

            {/* FACE OPTIONS */}
            {emotionType === "FACE" && (
                <div style={{ marginBottom: "15px" }}>
                    <h4>Take Picture or Upload Image</h4>

                    {/* Take Photo */}
                    <WebcamCapture
                        onCapture={(file) => setCapturedFile(file)}
                    />

                    <p style={{ margin: "10px 0" }}>OR</p>

                    {/* Upload Image */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </div>
            )}

            {/* VOICE OPTIONS */}
            {emotionType === "VOICE" && (
                <div style={{ marginBottom: "15px" }}>
                    <h4>Record Voice or Upload Audio</h4>

                    {/* Record */}
                    <AudioRecorder
                        onRecorded={(file) => setCapturedFile(file)}
                    />

                    <p style={{ margin: "10px 0" }}>OR</p>

                    {/* Upload Audio */}
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                    />
                </div>
            )}

            {/* TEXT */}
            {emotionType === "TEXT" && (
                <textarea
                    placeholder="How do you feel today?"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc"
                    }}
                />
            )}

            {/* ACTION BUTTONS */}
            {emotionType && (
                <div
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        gap: "10px"
                    }}
                >
                    <button
                        onClick={handleDetect}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#2563eb",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Detecting..." : "Detect Emotion"}
                    </button>

                    <button
                        onClick={reset}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            background: "#f3f4f6",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmotionDetector;