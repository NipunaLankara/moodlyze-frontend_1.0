import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchTodaysSchedule,
    completeSchedulePart
} from "../services/analyze.service";
import type { AnalysisResponse, ScheduleItem } from "../types/analyze.types";

const SchedulePage = () => {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch today's schedule on mount
    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const freshAnalysis = await fetchTodaysSchedule();
                setAnalysis(freshAnalysis);
                setSchedule(freshAnalysis.taskData || []);
            } catch (err: any) {
                console.error("Failed to load schedule", err);
                if (err.response?.status === 404) {
                    alert("No schedule found for today");
                    navigate("/tasks/add");
                }
            } finally {
                setLoading(false);
            }
        };
        loadSchedule();
    }, []);

    // Watch schedule: redirect if empty
    useEffect(() => {
        if (!loading && schedule.length === 0) {
            navigate("/tasks/add");
        }
    }, [schedule, loading, navigate]);

    if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

    if (!analysis) return null;

    const formatTime = (dateString: string) =>
        new Date(dateString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    const handleComplete = async (scheduleId?: number) => {
        if (!scheduleId) return;

        try {
            await completeSchedulePart(scheduleId);

            // Remove only this schedule part
            setSchedule(prev => prev.filter(item => item.id !== scheduleId));

        } catch (err) {
            alert("Failed to complete schedule part");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Today's Smart Schedule</h2>
            <p>Mood: {analysis.detectedMood}</p>

            <div style={{ marginTop: "30px" }}>
                {schedule.map(item => (
                    <div
                        key={item.id}
                        style={{
                            padding: "15px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            background: item.isBreak ? "#fef3c7" : "#e0f2fe"
                        }}
                    >
                        <h4>
                            {item.isBreak
                                ? "Break"
                                : `${item.displayTitle}${item.partNumber ? ` (Part ${item.partNumber})` : ""}`}
                        </h4>
                        <p>{formatTime(item.startTime)} - {formatTime(item.endTime)}</p>

                        {!item.isBreak && (
                            <button onClick={() => handleComplete(item.id)}>
                                Complete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchedulePage;