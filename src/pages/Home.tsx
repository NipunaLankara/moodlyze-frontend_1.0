import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Home.css";

function Home() {
    return (
        <>
            <Navbar />

            <div className="home">
                <div className="home__content">
                    <h1 className="home__title">
                        Understand Your Mood with <span>Moodlyze</span>
                    </h1>

                    <p className="home__subtitle">
                        Track, analyze, and improve your mental well-being with smart insights.
                    </p>

                    <div className="home__actions">
                        <Link to="/sign_up" className="home__btn primary">
                            Get Started
                        </Link>
                        <Link to="/login" className="home__btn secondary">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
