import { useState, useRef } from "react";

interface Props {
    onRecorded: (file: File) => void;
}

const AudioRecorder = ({ onRecorded }: Props) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks.current, { type: "audio/wav" });
            const file = new File([blob], "voice.wav");
            onRecorded(file);
            chunks.current = [];
        };

        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <div>
            {recording ? (
                <button onClick={stopRecording}>Stop</button>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
        </div>
    );
};

export default AudioRecorder;