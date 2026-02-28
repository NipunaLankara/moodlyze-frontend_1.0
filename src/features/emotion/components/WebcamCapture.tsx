import Webcam from "react-webcam";
import { useRef, useState } from "react";
import "./css/WebcamCapture.css";

interface Props {
    onCapture: (file: File) => void;
}

const WebcamCapture = ({ onCapture }: Props) => {
    const webcamRef = useRef<Webcam>(null);
    const [captured, setCaptured] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [cameraOn, setCameraOn] = useState(false);

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) return;

        setPreview(imageSrc);

        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                onCapture(file);
                setCaptured(true);
                setCameraOn(false);
            });
    };

    const retake = () => {
        setCaptured(false);
        setPreview(null);
        setCameraOn(true);
    };

    return (
        <div className="wc-wrapper">
            {/* Not started */}
            {!cameraOn && !captured && (
                <button className="wc-open-btn" onClick={() => setCameraOn(true)}>
                    <span>📷</span> Open Camera
                </button>
            )}

            {/* Camera active */}
            {cameraOn && !captured && (
                <div className="wc-camera-box">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="wc-webcam"
                    />
                    <div className="wc-camera-actions">
                        <button className="wc-capture-btn" onClick={capture}>
                            <span className="wc-shutter" />
                            Capture
                        </button>
                        <button className="wc-close-btn" onClick={() => setCameraOn(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Preview after capture */}
            {captured && preview && (
                <div className="wc-preview-box">
                    <img src={preview} alt="Captured" className="wc-preview-img" />
                    <div className="wc-preview-badge">✅ Photo captured</div>
                    <button className="wc-retake-btn" onClick={retake}>
                        🔄 Retake
                    </button>
                </div>
            )}
        </div>
    );
};

export default WebcamCapture;