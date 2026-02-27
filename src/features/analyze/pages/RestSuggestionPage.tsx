import { useLocation, useNavigate } from "react-router-dom";

const RestSuggestionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const data = location.state;

    return (
        <div style={{ padding: "40px" }}>
            <h2>Your Mood: {data.detectedMood}</h2>

            <h3 style={{ color: "red" }}>You Need Rest Before Working</h3>

            <ul style={{ marginTop: "20px" }}>
                <li>Take a 20-minute walk 🚶</li>
                <li>Practice deep breathing 🧘</li>
                <li>Listen to calming music 🎵</li>
                <li>Drink water and refresh 💧</li>
            </ul>

            <button
                style={{ marginTop: "30px" }}
                onClick={() => navigate("/tasks")}
            >
                Back to Tasks
            </button>
        </div>
    );
};

export default RestSuggestionPage;