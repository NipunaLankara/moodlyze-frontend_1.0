import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Home.css";

function Home() {
    return (
        <div className="app-shell">
            <Navbar />

            <div className="home__bg" aria-hidden="true">
                <div className="home__bg-orb home__bg-orb--1" />
                <div className="home__bg-orb home__bg-orb--2" />
                <div className="home__bg-orb home__bg-orb--3" />
                <div className="home__bg-orb home__bg-orb--4" />
            </div>

            <span className="home__float home__float--1" aria-hidden="true">🌿</span>
            <span className="home__float home__float--2" aria-hidden="true">✨</span>
            <span className="home__float home__float--3" aria-hidden="true">🧠</span>
            <span className="home__float home__float--4" aria-hidden="true">📋</span>

            <main className="home" style={{ marginLeft: 0, paddingTop: "var(--navbar-height)" }}>
                <div className="home__content">

                    <div className="home__eyebrow">
                        <span className="home__eyebrow-dot" />
                        AI-Powered Emotion Detection
                    </div>

                    <h1 className="home__title">
                        Understand Your Mood,<br />
                        Master Your Tasks with{" "}
                        <span className="home__title-accent">Moodlyze</span>
                    </h1>

                    <p className="home__subtitle">
                        Track emotions, analyze your mental state, and receive
                        personalized task recommendations to maximize your productivity
                        and well-being — every single day.
                    </p>

                    <div className="home__mood-row" aria-label="Mood examples">
                        <span className="home__mood-pill home__mood-pill--happy">😊 Happy</span>
                        <span className="home__mood-pill home__mood-pill--calm">😌 Calm</span>
                        <span className="home__mood-pill home__mood-pill--focus">🎯 Focused</span>
                        <span className="home__mood-pill home__mood-pill--tired">😴 Tired</span>
                        <span className="home__mood-pill home__mood-pill--stress">😰 Stressed</span>
                        <span className="home__mood-arrow">→</span>
                        <span className="home__mood-result">✦ Smart Tasks Assigned</span>
                    </div>

                    <div className="home__actions">
                        <Link to="/sign_up" className="home__btn primary">
                            🚀 Get Started Free
                        </Link>
                        <Link to="/login" className="home__btn secondary">
                            Login →
                        </Link>
                    </div>

                    <p className="home__features-label">Everything you need</p>

                    <div className="home__features">
                        <div className="home__feature-card">
                            <div className="home__feature-icon-wrap">🧠</div>
                            <h4>Emotion Detection</h4>
                            <p>AI reads your mood in real time through natural input</p>
                        </div>
                        <div className="home__feature-card">
                            <div className="home__feature-icon-wrap">📋</div>
                            <h4>Smart Tasks</h4>
                            <p>Tasks dynamically adapted to your current mental state</p>
                        </div>
                        <div className="home__feature-card">
                            <div className="home__feature-icon-wrap">😌</div>
                            <h4>Rest Suggestions</h4>
                            <p>Know exactly when and how to recharge your energy</p>
                        </div>
                        <div className="home__feature-card">
                            <div className="home__feature-icon-wrap">📅</div>
                            <h4>Schedule Planning</h4>
                            <p>Auto-plan your entire day based on your energy curve</p>
                        </div>
                    </div>

                    <div className="home__trust">
                        <span className="home__trust-item"><span>🔒</span> Private & Secure</span>
                        <span className="home__trust-divider" />
                        <span className="home__trust-item"><span>⚡</span> Real-time Analysis</span>
                        <span className="home__trust-divider" />
                        <span className="home__trust-item"><span>🌱</span> Built for Well-being</span>
                        <span className="home__trust-divider" />
                        <span className="home__trust-item"><span>🆓</span> Free to Start</span>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Home;