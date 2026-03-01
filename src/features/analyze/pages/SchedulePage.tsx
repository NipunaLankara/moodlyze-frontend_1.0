import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchTodaysSchedule,
    completeSchedulePart
} from "../services/analyze.service";
import type { AnalysisResponse, ScheduleItem } from "../types/analyze.types";
import "./SchedulePage.css";

const MOOD_CONFIG: Record<string, { icon: string; cls: string }> = {
    HAPPY:    { icon: "😊", cls: "mood--happy"   },
    CALM:     { icon: "😌", cls: "mood--calm"    },
    FOCUSED:  { icon: "🎯", cls: "mood--focused" },
    STRESSED: { icon: "😤", cls: "mood--stress"  },
    ANXIOUS:  { icon: "😰", cls: "mood--anxious" },
    SAD:      { icon: "😔", cls: "mood--sad"     },
    TIRED:    { icon: "😴", cls: "mood--tired"   },
    ANGRY:    { icon: "😠", cls: "mood--angry"   },
    NEUTRAL:  { icon: "😐", cls: "mood--calm"    },
};

// Backend sends "break" field, not "isBreak"
const isBreakItem = (item: ScheduleItem) =>
    (item as any).break === true || item.isBreak === true;

const SchedulePage = () => {
    const navigate    = useNavigate();
    const [schedule,   setSchedule]   = useState<ScheduleItem[]>([]);
    const [analysis,   setAnalysis]   = useState<AnalysisResponse | null>(null);
    const [loading,    setLoading]    = useState(true);
    const [completing, setCompleting] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchTodaysSchedule();
                setAnalysis(res);
                setSchedule(res.taskData || []);
            } catch (err: any) {
                if (err.response?.status === 404) navigate("/tasks/add");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!loading && schedule.length === 0) navigate("/tasks/add");
    }, [schedule, loading]);

    const formatTime = (d: string) =>
        new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // ✅ ALL items (tasks + breaks) can be completed
    const handleComplete = async (id?: number) => {
        if (!id) return;
        setCompleting(id);
        try {
            await completeSchedulePart(id);
            setSchedule(prev => prev.filter(i => i.id !== id));
        } catch {
            alert("Failed to complete this slot");
        } finally {
            setCompleting(null);
        }
    };

    if (loading) return (
        <div className="sp-loading">
            <div className="sp-loading__ring" />
            <p>Building your smart schedule…</p>
        </div>
    );

    if (!analysis) return null;

    const moodKey  = (analysis.detectedMood || "").toUpperCase();
    const mood     = MOOD_CONFIG[moodKey] || { icon: "🧠", cls: "mood--calm" };
    const tasksCnt = schedule.filter(i => !isBreakItem(i)).length;
    const brksCnt  = schedule.filter(i =>  isBreakItem(i)).length;

    return (
        <div className="sp-body">

            {/* ── Page header ── */}
            <div className="sp-header">
                <div>
                    <h1 className="sp-header__title">📅 Today's Smart Schedule</h1>
                    <p className="sp-header__date">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
                <button className="sp-back-btn" onClick={() => navigate("/tasks")}>
                    ← Dashboard
                </button>
            </div>

            {/* ── Stats ── */}
            <div className="sp-stats">
                <div className={`sp-stat sp-stat--mood ${mood.cls}`}>
                    <span className="sp-stat__big-icon">{mood.icon}</span>
                    <div>
                        <div className="sp-stat__val">{analysis.detectedMood}</div>
                        <div className="sp-stat__lbl">Detected mood</div>
                    </div>
                </div>
                <div className="sp-stat sp-stat--blue">
                    <span className="sp-stat__icon">📋</span>
                    <div>
                        <div className="sp-stat__val">{tasksCnt}</div>
                        <div className="sp-stat__lbl">Tasks left</div>
                    </div>
                </div>
                <div className="sp-stat sp-stat--green">
                    <span className="sp-stat__icon">☕</span>
                    <div>
                        <div className="sp-stat__val">{brksCnt}</div>
                        <div className="sp-stat__lbl">Breaks left</div>
                    </div>
                </div>
                <div className="sp-stat sp-stat--purple">
                    <span className="sp-stat__icon">⏱</span>
                    <div>
                        <div className="sp-stat__val">{schedule.length}</div>
                        <div className="sp-stat__lbl">Total slots</div>
                    </div>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div className="sp-section">
                <h2 className="sp-section__title">Your schedule for today</h2>

                <div className="sp-timeline">
                    {schedule.map((item, i) => {
                        const isBreak = isBreakItem(item);
                        const isProcessing = completing === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`sp-item ${isBreak ? "sp-item--break" : "sp-item--task"}`}
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                {/* Dot + connector line */}
                                <div className="sp-item__track">
                                    <div className={`sp-item__dot ${isBreak ? "sp-item__dot--break" : "sp-item__dot--task"}`}>
                                        {isBreak ? "☕" : "📌"}
                                    </div>
                                    {i < schedule.length - 1 && <div className="sp-item__line" />}
                                </div>

                                {/* Card */}
                                <div className="sp-item__card">
                                    <div className="sp-item__card-head">
                                        <div>
                                            <p className="sp-item__time">
                                                {formatTime(item.startTime)} — {formatTime(item.endTime)}
                                            </p>
                                            <h4 className="sp-item__title">
                                                {isBreak
                                                    ? item.displayTitle || "Short Break"
                                                    : `${item.displayTitle}${item.partNumber ? ` · Part ${item.partNumber}` : ""}`
                                                }
                                            </h4>
                                        </div>
                                        <span className={`sp-badge ${isBreak ? "sp-badge--break" : "sp-badge--task"}`}>
                                            {isBreak ? "☕ Rest" : "📋 Task"}
                                        </span>
                                    </div>

                                    {/* Shimmer bar */}
                                    <div className="sp-item__bar">
                                        <div className={`sp-item__bar-fill ${isBreak ? "sp-item__bar-fill--break" : ""}`} />
                                    </div>

                                    {/* ✅ Complete button shown for BOTH tasks AND breaks */}
                                    <div className="sp-item__footer">
                                        <button
                                            className={`sp-complete-btn ${isBreak ? "sp-complete-btn--break" : ""}`}
                                            onClick={() => handleComplete(item.id)}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <><span className={`sp-spinner ${isBreak ? "sp-spinner--break" : ""}`} /> {isBreak ? "Finishing break…" : "Completing…"}</>
                                            ) : (
                                                isBreak ? "✓ Done with break" : "✓ Mark Complete"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;