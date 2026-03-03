import { useLocation, useNavigate } from "react-router-dom";

const RestSuggestionPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <p>No data</p>;

    return (
        <div style={{ padding: "40px" }}>
            <h2>Your Mood: {state.detectedMood}</h2>
            <h3 style={{ color: "red" }}>You Need Rest Before Working</h3>

            <ul style={{ marginTop: "20px" }}>
                {state.activities.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                ))}
            </ul>

            <button onClick={() => navigate("/tasks")}>
                Back to Tasks
            </button>
        </div>
    );
};
export default RestSuggestionPage;