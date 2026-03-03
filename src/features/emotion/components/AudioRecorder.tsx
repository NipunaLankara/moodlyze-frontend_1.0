import { useState, useRef } from "react";
import "./css/AudioRecorder.css";

interface Props {
    onRecorded: (file: File) => void;
}

const AudioRecorder = ({ onRecorded }: Props) => {
    const [recording, setRecording]   = useState(false);
    const [recorded, setRecorded]     = useState(false);
    const [seconds, setSeconds]       = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks           = useRef<Blob[]>([]);
    const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: "audio/wav" });
                const file = new File([blob], "voice.wav");
                onRecorded(file);
                chunks.current = [];
                setRecorded(true);
            };

            mediaRecorder.start();
            setRecording(true);
            setRecorded(false);
            setSeconds(0);

            // Timer
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);

        } catch {
            alert("Microphone access denied. Please allow microphone permission.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const retake = () => {
        setRecorded(false);
        setSeconds(0);
    };

    const formatTime = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="ar-wrapper">

            {/* Idle — not started */}
            {!recording && !recorded && (
                <button className="ar-start-btn" onClick={startRecording}>
                    <span className="ar-mic-icon">🎙️</span>
                    Start Recording
                </button>
            )}

            {/* Recording active */}
            {recording && (
                <div className="ar-recording-box">
                    <div className="ar-recording-indicator">
                        <span className="ar-pulse" />
                        <span className="ar-rec-label">REC</span>
                        <span className="ar-timer">{formatTime(seconds)}</span>
                    </div>
                    <div className="ar-waveform">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="ar-wave-bar"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            />
                        ))}
                    </div>
                    <button className="ar-stop-btn" onClick={stopRecording}>
                        <span className="ar-stop-icon" />
                        Stop Recording
                    </button>
                </div>
            )}

            {/* Done */}
            {recorded && !recording && (
                <div className="ar-done-box">
                    <div className="ar-done-badge">
                        <span>🎵</span>
                        <span>Recording ready</span>
                        <span className="ar-done-time">{formatTime(seconds)}</span>
                    </div>
                    <button className="ar-retake-btn" onClick={retake}>
                        🔄 Record again
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;