import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./ReviewUserStories.css";
import "./ProcessUserStories.css";
import Collapsible from "./Collapsible";
import Spinner from "./Spinner";

interface UserStory {
    id: string;
    key: string;
    project: string;
    summary: string;
    description: string;
}

const ProcessUserStories: React.FC = () => {
    const [stories, setStories] = useState<UserStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
    const [openProject, setOpenProject] = useState<string | null>(null);
    const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());

    const storiesByProject = stories.reduce((acc, story) => {
        if (!acc[story.project]) acc[story.project] = [];
        acc[story.project].push(story);
        return acc;
    }, {} as { [project: string]: UserStory[] });

    useEffect(() => {
        setLoading(false);
        const fetchStories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("https://ai-devcrew-back.onrender.com/get-all-stories");
                if (!response.ok) throw new Error("Failed to fetch user stories");
                const data = await response.json();

                setStories(data || []);
            } catch (err: any) {
                setError(err.message || "Error loading user stories");
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleSelectStory = (storyId: string) => {
        setSelectedStories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(storyId)) {
                newSet.delete(storyId);
            } else {
                newSet.add(storyId);
            }
            return newSet;
        });
    };

    const handleProcessUserStories = async () => {
        setProcessing(true);
        try {
            const storiesToProcess = stories.filter(story => selectedStories.has(story.id));
            const response = await fetch("https://ai-devcrew-back.onrender.com/process-user-stories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(storiesToProcess),
            });
            if (!response.ok) throw new Error("Failed to process user stories");
            setProcessing(false);
        } catch (err: any) {
            alert(err.message || "Error processing user stories");
        }
    }

    return (
        <div className="pfv-bg">
            <AppHeader />
            <div className="pfv-title-section">
                <h1 className="pfv-title">Generate code</h1>
                <p className="pfv-description">
                    Select the user stories you want to generate code for. Expand each project to view and choose individual stories using the checkbox on the right.
                </p>
            </div>
            <main className="user-stories-main">
                <div className="user-stories-list-card">
                    {loading && <div className="user-stories-loading">Loading...</div>}
                    {error && <div className="user-stories-error">{error}</div>}
                    {!loading && !error && stories.length === 0 && (
                        <div className="user-stories-empty">No user stories found.</div>
                    )}
                    <ul className="user-stories-list">
                        {Object.entries(storiesByProject).map(([project, projectStories]) => (
                            <li key={project}>
                                <Collapsible
                                    title={
                                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            {project}
                                        </span>
                                    }
                                    open={openProject === project}
                                    onToggle={() => setOpenProject(openProject === project ? null : project)}
                                >
                                    <ul className="user-stories-list" style={{ marginTop: 8 }}>
                                        {projectStories.map((story, idx) => {
                                            const key = story.id || String(idx);
                                            return (
                                                <li key={key}>
                                                    <Collapsible
                                                        title={
                                                            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                                {story.summary}
                                                            </span>
                                                        }
                                                        open={openCollapsible === key}
                                                        onToggle={() => setOpenCollapsible(openCollapsible === key ? null : key)}
                                                        actions={
                                                            <input
                                                                type="checkbox"
                                                                className="large-checkbox"
                                                                checked={selectedStories.has(story.id)}
                                                                onChange={() => handleSelectStory(story.id)}
                                                            />
                                                        }
                                                    >
                                                        <div className="review-modal-description">
                                                            {story.description}
                                                        </div>
                                                    </Collapsible>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Collapsible>
                            </li>
                        ))}
                    </ul>
                    {!loading &&
                        <button
                            className="review-modal-btn"
                            onClick={() => handleProcessUserStories()}
                            disabled={selectedStories.size === 0 || processing}
                        >
                            {processing ? (
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                    <Spinner size={18} />
                                    Processing user stories...
                                </span>
                            ) : (
                                "Process"
                            )}
                        </button>
                    }
                </div>
            </main>
            <AppFooter />
        </div>
    );
};

export default ProcessUserStories;