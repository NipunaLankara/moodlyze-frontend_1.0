import { useState } from "react";
import {
    detectImageEmotion,
    detectSpeechEmotion,
    detectTextEmotion
} from "../services/emotion.service";
import WebcamCapture from "./WebcamCapture";
import AudioRecorder from "./AudioRecorder";
import "./css/EmotionDetector.css";

type Props = {
    onDetected: (emotion: string) => void;
    mode: "BEFORE" | "AFTER";
};

type EmotionType = "FACE" | "VOICE" | "TEXT";

const EMOTION_TYPES: { type: EmotionType; icon: string; label: string; desc: string }[] = [
    { type: "FACE",  icon: "📸", label: "Face",  desc: "Use camera or photo" },
    { type: "VOICE", icon: "🎙️", label: "Voice", desc: "Record or upload audio" },
    { type: "TEXT",  icon: "✍️", label: "Text",  desc: "Describe how you feel" },
];

const EmotionDetector = ({ onDetected, mode }: Props) => {
    const [emotionType, setEmotionType] = useState<EmotionType | null>(null);
    const [textInput, setTextInput]     = useState("");
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [loading, setLoading]         = useState(false);
    const [capturedLabel, setCapturedLabel] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        setCapturedFile(file);
        setCapturedLabel(file.name);
    };

    const handleDetect = async () => {
        if (!emotionType) return;
        try {
            setLoading(true);
            let res;
            if (emotionType === "FACE"  && capturedFile) res = await detectImageEmotion(capturedFile);
            if (emotionType === "VOICE" && capturedFile) res = await detectSpeechEmotion(capturedFile);
            if (emotionType === "TEXT"  && textInput.trim()) res = await detectTextEmotion({ prompt: textInput });
            if (res) {
                const data = res.data.data;
                onDetected(typeof data === "string" ? data : data.emotion);
            }
        } catch {
            alert("Emotion detection failed");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setEmotionType(null);
        setCapturedFile(null);
        setCapturedLabel("");
        setTextInput("");
    };

    const canDetect =
        (emotionType === "TEXT"  && textInput.trim().length > 0) ||
        (emotionType !== "TEXT"  && capturedFile !== null);

    return (
        <div className="ed-card">

            {/* Header */}
            <div className="ed-header">
                <div className="ed-header__icon-ring">
                    {mode === "BEFORE" ? "🧠" : "📊"}
                </div>
                <div>
                    <h3 className="ed-header__title">
                        {mode === "BEFORE" ? "How are you feeling?" : "Analyze your mood"}
                    </h3>
                    <p className="ed-header__sub">
                        {mode === "BEFORE"
                            ? "Detect your emotion before adding tasks"
                            : "Analyze your emotion after completing tasks"}
                    </p>
                </div>
            </div>

            {/* Type selector */}
            <div className="ed-type-row">
                {EMOTION_TYPES.map(({ type, icon, label, desc }) => (
                    <button
                        key={type}
                        className={`ed-type-btn ${emotionType === type ? "ed-type-btn--active" : ""}`}
                        onClick={() => { setEmotionType(type); setCapturedFile(null); setCapturedLabel(""); setTextInput(""); }}
                    >
                        <span className="ed-type-btn__icon">{icon}</span>
                        <span className="ed-type-btn__label">{label}</span>
                        <span className="ed-type-btn__desc">{desc}</span>
                    </button>
                ))}
            </div>

            {/* FACE */}
            {emotionType === "FACE" && (
                <div className="ed-panel" key="face">
                    <div className="ed-panel__section">
                        <p className="ed-panel__section-label">📷 Take a photo</p>
                        <WebcamCapture onCapture={(file) => { setCapturedFile(file); setCapturedLabel("Photo captured ✓"); }} />
                    </div>
                    <div className="ed-divider"><span>or upload</span></div>
                    <label className="ed-upload-label">
                        <span className="ed-upload-label__icon">🖼️</span>
                        <span className="ed-upload-label__text">
                            {capturedLabel || "Choose image file"}
                        </span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="ed-upload-input" />
                    </label>
                </div>
            )}

            {/* VOICE */}
            {emotionType === "VOICE" && (
                <div className="ed-panel" key="voice">
                    <div className="ed-panel__section">
                        <p className="ed-panel__section-label">🎙️ Record your voice</p>
                        <AudioRecorder onRecorded={(file) => { setCapturedFile(file); setCapturedLabel("Recording ready ✓"); }} />
                    </div>
                    <div className="ed-divider"><span>or upload</span></div>
                    <label className="ed-upload-label">
                        <span className="ed-upload-label__icon">🎵</span>
                        <span className="ed-upload-label__text">
                            {capturedLabel || "Choose audio file"}
                        </span>
                        <input type="file" accept="audio/*" onChange={handleFileUpload} className="ed-upload-input" />
                    </label>
                </div>
            )}

            {/* TEXT */}
            {emotionType === "TEXT" && (
                <div className="ed-panel" key="text">
                    <p className="ed-panel__section-label">✍️ Describe how you feel</p>
                    <textarea
                        className="ed-textarea"
                        placeholder="e.g. I'm feeling a bit overwhelmed but trying to stay focused…"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={4}
                    />
                    <div className="ed-textarea-counter">{textInput.length} characters</div>
                </div>
            )}

            {/* Action buttons */}
            {emotionType && (
                <div className="ed-actions">
                    <button className="ed-cancel-btn" onClick={reset}>
                        ✕ Cancel
                    </button>
                    <button
                        className="ed-detect-btn"
                        onClick={handleDetect}
                        disabled={loading || !canDetect}
                    >
                        {loading ? (
                            <><span className="ed-spinner" /> Detecting…</>
                        ) : (
                            <>🔍 Detect Emotion</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmotionDetector;