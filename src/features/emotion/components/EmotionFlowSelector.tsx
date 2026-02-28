import "./css/EmotionFlowSelector.css";

type Props = {
    onSelect: (mode: "BEFORE" | "AFTER") => void;
};

const EmotionFlowSelector = ({ onSelect }: Props) => {
    return (
        <div className="efs-wrapper">

            <div className="efs-header">
                <div className="efs-header__icon">🧠</div>
                <h2 className="efs-header__title">When do you want to detect?</h2>
                <p className="efs-header__sub">
                    Choose when to analyze your emotion for best task recommendations
                </p>
            </div>

            <div className="efs-options">

                <button className="efs-option efs-option--before" onClick={() => onSelect("BEFORE")}>
                    <div className="efs-option__icon">⚡</div>
                    <div className="efs-option__body">
                        <h3 className="efs-option__title">Before Adding Tasks</h3>
                        <p className="efs-option__desc">
                            Detect your current mood first, then get task recommendations
                            tailored to how you're feeling right now.
                        </p>
                    </div>
                    <span className="efs-option__arrow">→</span>
                </button>

                <button className="efs-option efs-option--after" onClick={() => onSelect("AFTER")}>
                    <div className="efs-option__icon">📊</div>
                    <div className="efs-option__body">
                        <h3 className="efs-option__title">After Adding Tasks</h3>
                        <p className="efs-option__desc">
                            Add your tasks first, then detect emotion to analyze
                            workload vs. mood balance and get rest or schedule suggestions.
                        </p>
                    </div>
                    <span className="efs-option__arrow">→</span>
                </button>
            </div>
        </div>
    );
};

export default EmotionFlowSelector;