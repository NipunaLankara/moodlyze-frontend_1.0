type Props = {
    onSelect: (mode: "BEFORE" | "AFTER") => void;
};

const EmotionFlowSelector = ({ onSelect }: Props) => {
    return (
        <div>
            <h2>Select Emotion Detection Mode</h2>

            <button onClick={() => onSelect("BEFORE")}>
                Detect Emotion Before Adding
            </button>

            <button onClick={() => onSelect("AFTER")}>
                Detect Emotion After Adding
            </button>
        </div>
    );
};

export default EmotionFlowSelector;