import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Home.css";
import "../styles/global.css";

function Home() {
    return (
        <div className="app-shell">
            <Navbar />
            {/* No sidebar on public landing page */}
            <main className="home" style={{ marginLeft: 0, paddingTop: "var(--navbar-height)" }}>
                <div className="home__content">

                    <div className="home__eyebrow">
                        ✨ AI-Powered Emotion Detection
                    </div>

                    <h1 className="home__title">
                        Understand Your Mood,<br />
                        Master Your Tasks with <span>Moodlyze</span>
                    </h1>

                    <p className="home__subtitle">
                        Track emotions, analyze your mental state, and receive
                        personalized task recommendations to maximize your productivity
                        and well-being every day.
                    </p>

                    <div className="home__actions">
                        <Link to="/sign_up" className="home__btn primary">
                            🚀 Get Started Free
                        </Link>
                        <Link to="/login" className="home__btn secondary">
                            Login
                        </Link>
                    </div>

                    <div className="home__features">
                        <div className="home__feature-card">
                            <span className="home__feature-icon">🧠</span>
                            <h4>Emotion Detection</h4>
                            <p>AI analyzes your mood in real time</p>
                        </div>
                        <div className="home__feature-card">
                            <span className="home__feature-icon">📋</span>
                            <h4>Smart Tasks</h4>
                            <p>Tasks adapted to your current state</p>
                        </div>
                        <div className="home__feature-card">
                            <span className="home__feature-icon">😌</span>
                            <h4>Rest Suggestions</h4>
                            <p>Know when and how to recharge</p>
                        </div>
                        <div className="home__feature-card">
                            <span className="home__feature-icon">📅</span>
                            <h4>Schedule Planning</h4>
                            <p>Auto-plan your day by energy levels</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Home;