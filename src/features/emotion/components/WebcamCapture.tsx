import Webcam from "react-webcam";
import { useRef } from "react";

interface Props {
    onCapture: (file: File) => void;
}

const WebcamCapture = ({ onCapture }: Props) => {
    const webcamRef = useRef<Webcam>(null);

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();

        if (!imageSrc) return;

        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                onCapture(file);
            });
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <button onClick={capture}>Capture</button>
        </div>
    );
};

export default WebcamCapture;