import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const moodConfig = {
    default: {
        gradient: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 50%, #fce4ec 100%)",
        accent: "#e07b54",
        soft: "#f9d5c8",
        tag: "#f4a07a",
        icon: "🌿",
        title: "Take a gentle pause",
        subtitle: "Your mind deserves kindness right now",
    },
    sad: {
        gradient: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f3e8ff 100%)",
        accent: "#7c6fcd",
        soft: "#d6d0f5",
        tag: "#a89ce0",
        icon: "🌙",
        title: "Rest & Restore",
        subtitle: "Small steps toward feeling better",
    },
    anxious: {
        gradient: "linear-gradient(135deg, #f0faf5 0%, #e0f5ea 50%, #f5fce8 100%)",
        accent: "#3d9970",
        soft: "#b8e8d2",
        tag: "#6ec49a",
        icon: "🍃",
        title: "Breathe & Unwind",
        subtitle: "Let calm find its way back to you",
    },
    tired: {
        gradient: "linear-gradient(135deg, #fffbf0 0%, #fff3d6 50%, #ffebd0 100%)",
        accent: "#c4893a",
        soft: "#fad9a8",
        tag: "#e6a85a",
        icon: "☀️",
        title: "Recharge Gently",
        subtitle: "You've done enough for now",
    },
};

const activityIcons = {
    walk: "🚶", meditat: "🧘", music: "🎵", sleep: "😴",
    nap: "😴", breath: "🌬️", journal: "📓", water: "💧",
    stretch: "🤸", read: "📖", tea: "🍵", nature: "🌳",
    friend: "💬", draw: "🎨", bath: "🛁", rest: "🛋️",
};

function getIcon(activity) {
    const lower = activity.toLowerCase();
    for (const [key, icon] of Object.entries(activityIcons)) {
        if (lower.includes(key)) return icon;
    }
    return "✨";
}

function getMoodConfig(mood) {
    const lower = (mood || "").toLowerCase();
    if (lower.includes("sad") || lower.includes("down") || lower.includes("unhappy")) return moodConfig.sad;
    if (lower.includes("anxi") || lower.includes("stress") || lower.includes("worried")) return moodConfig.anxious;
    if (lower.includes("tired") || lower.includes("exhaust") || lower.includes("fatigue")) return moodConfig.tired;
    return moodConfig.default;
}

const RestSuggestionPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    if (!state) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Georgia, serif", color: "#888" }}>
            No mood data available.
        </div>
    );

    const config = getMoodConfig(state.detectedMood);
    const activities = state.activities || [];

    const toggleCheck = (i) => {
        setCheckedItems(prev =>
            prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
        );
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: config.gradient,
            fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
            padding: "0",
            position: "relative",
            overflow: "hidden",
        }}>
            <div style={{
                position: "fixed", top: "-80px", right: "-80px",
                width: "320px", height: "320px", borderRadius: "50%",
                background: config.soft, opacity: 0.45, pointerEvents: "none",
                filter: "blur(60px)",
            }} />
            <div style={{
                position: "fixed", bottom: "-60px", left: "-60px",
                width: "260px", height: "260px", borderRadius: "50%",
                background: config.soft, opacity: 0.35, pointerEvents: "none",
                filter: "blur(50px)",
            }} />

            <div style={{
                maxWidth: "560px", margin: "0 auto", padding: "48px 28px 64px",
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
            }}>

                <button
                    onClick={() => navigate("/tasks")}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                        color: config.accent, fontSize: "14px", fontFamily: "inherit",
                        letterSpacing: "0.04em", padding: "0", marginBottom: "40px", opacity: 0.8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}
                >
                    ← Back to Tasks
                </button>

                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)",
                    border: `1.5px solid ${config.soft}`,
                    borderRadius: "100px", padding: "6px 16px",
                    fontSize: "13px", color: config.accent, letterSpacing: "0.06em",
                    marginBottom: "28px", textTransform: "uppercase", fontWeight: "500",
                }}>
                    <span style={{ fontSize: "16px" }}>{config.icon}</span>
                    Mood detected: {state.detectedMood}
                </div>

                <h1 style={{
                    fontSize: "clamp(28px, 6vw, 42px)", fontWeight: "400",
                    color: "#2d2218", lineHeight: "1.2", margin: "0 0 10px", letterSpacing: "-0.01em",
                }}>
                    {config.title}
                </h1>
                <p style={{
                    fontSize: "16px", color: "#7a6a5a", margin: "0 0 36px",
                    lineHeight: "1.6", fontStyle: "italic",
                }}>
                    {config.subtitle}
                </p>

                <div style={{
                    background: `linear-gradient(135deg, ${config.soft}55, rgba(255,255,255,0.7))`,
                    border: `1px solid ${config.soft}`,
                    borderLeft: `3px solid ${config.accent}`,
                    borderRadius: "12px", padding: "16px 20px",
                    marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px",
                }}>
                    <span style={{ fontSize: "22px" }}>💛</span>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b5b4e", lineHeight: "1.5" }}>
                        Before jumping into tasks, it's okay to pause. These activities can help restore your energy.
                    </p>
                </div>

                <h2 style={{
                    fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em",
                    color: config.accent, margin: "0 0 16px", fontWeight: "600",
                    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",
                }}>
                    Suggested for you
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "40px" }}>
                    {activities.map((activity, i) => {
                        const checked = checkedItems.includes(i);
                        return (
                            <div
                                key={i}
                                onClick={() => toggleCheck(i)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "14px",
                                    background: checked
                                        ? `linear-gradient(135deg, ${config.soft}80, rgba(255,255,255,0.9))`
                                        : "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(6px)",
                                    border: `1.5px solid ${checked ? config.tag : "rgba(255,255,255,0.8)"}`,
                                    borderRadius: "14px", padding: "14px 18px",
                                    cursor: "pointer",
                                    transition: "all 0.25s ease",
                                    transform: checked ? "scale(0.99)" : "scale(1)",
                                    boxShadow: checked ? "none" : "0 2px 12px rgba(0,0,0,0.05)",
                                }}
                            >
                                <div style={{
                                    width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                                    border: `2px solid ${checked ? config.accent : "#d4c4b8"}`,
                                    background: checked ? config.accent : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s ease",
                                }}>
                                    {checked && <span style={{ color: "white", fontSize: "12px", lineHeight: 1 }}>✓</span>}
                                </div>

                                <span style={{ fontSize: "22px", flexShrink: 0 }}>{getIcon(activity)}</span>

                                <span style={{
                                    fontSize: "15px", color: checked ? "#7a6a5a" : "#3d2e24",
                                    textDecoration: checked ? "line-through" : "none",
                                    textDecorationColor: config.accent,
                                    transition: "all 0.2s ease", lineHeight: "1.4",
                                }}>
                  {activity}
                </span>

                                {i === 0 && !checked && (
                                    <span style={{
                                        marginLeft: "auto", fontSize: "11px", background: config.soft,
                                        color: config.accent, padding: "3px 10px", borderRadius: "100px",
                                        letterSpacing: "0.04em", fontFamily: "sans-serif", flexShrink: 0,
                                    }}>
                    Start here
                  </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {checkedItems.length > 0 && (
                    <div style={{
                        textAlign: "center", color: config.accent, fontSize: "14px",
                        marginBottom: "28px", fontStyle: "italic",
                    }}>
                        {checkedItems.length === activities.length
                            ? "You've done them all — wonderful! 🌟"
                            : `${checkedItems.length} of ${activities.length} done — keep going 🌱`}
                    </div>
                )}

                <button
                    onClick={() => navigate("/tasks")}
                    style={{
                        width: "100%", padding: "16px", borderRadius: "14px",
                        background: config.accent, color: "white", border: "none",
                        fontSize: "15px", fontFamily: "inherit", cursor: "pointer",
                        letterSpacing: "0.04em", fontWeight: "500",
                        boxShadow: `0 6px 24px ${config.soft}`,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = `0 10px 30px ${config.soft}`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = `0 6px 24px ${config.soft}`;
                    }}
                >
                    I'm ready to work →
                </button>

                <p style={{
                    textAlign: "center", color: "#b0a090", fontSize: "12px",
                    marginTop: "16px", fontStyle: "italic",
                }}>
                    No pressure — come back when you feel ready.
                </p>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};

export default RestSuggestionPage;