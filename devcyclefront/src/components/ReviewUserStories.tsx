import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./ReviewUserStories.css";
import Collapsible from "./Collapsible";
import UserStoryMenuPortal from "./UserStoryMenuPortal";
import Spinner from "./Spinner";

interface UserStory {
    id: string;
    key: string;
    project: string;
    summary: string;
    description: string;
}

const ReviewUserStories: React.FC = () => {
    const [stories, setStories] = useState<UserStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [viewStory, setViewStory] = useState<UserStory | null>(null);
    const [deleteStory, setDeleteStory] = useState<UserStory | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [sendingToJira, setSendingToJira] = useState<{ [key: string]: boolean }>({});
    
    // States to manage review functionality
    const [reviewOutput, setReviewOutput] = useState<{
        [key: string]: {
            story: string;
            validation?: string;
            issues?: string[];
            suggestions?: string[];
            acceptance_criteria_check?: string;
            qa_testability?: string;
        }
    }>({});
    const [reviewLoading, setReviewLoading] = useState<{ [key: string]: boolean }>({});
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
    const [openProject, setOpenProject] = useState<string | null>(null);

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

    const handleReview = async (story: UserStory) => {
        const key = story.id;
        if (reviewOutput[key]) {
            setOpenCollapsible(key);
            return;
        }
        setReviewLoading(prev => ({ ...prev, [key]: true }));
        try {
            const payload = {
                ids: [key],
                model: "gpt-4"
            };
            const response = await fetch("https://ai-devcrew-back.onrender.com/validate-jira-stories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to fetch review output");
            const data = await response.json();
            setReviewOutput(prev => ({
                ...prev,
                [key]: {
                    story: data[0].story,
                    validation: data[0].validation,
                    issues: data[0].issues,
                    suggestions: data[0].suggestions,
                    acceptance_criteria_check: data[0].acceptance_criteria_check,
                    qa_testability: data[0].qa_testability
                }
            }));
            setOpenCollapsible(key);
        } catch {
            alert("Error loading review output.");
        } finally {
            setReviewLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="pfv-bg">
            <AppHeader />
            <div className="pfv-title-section">
                <h1 className="pfv-title">Review user stories</h1>
                <p className="pfv-description">
                    Here you can view and manage all your created user stories, grouped by project. Click the project name to expand its stories, and use the menu on the right of each story for more options.
                </p>
            </div>
            {successMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: 24,
                        right: 24,
                        zIndex: 2000,
                        background: "#22c55e",
                        color: "#fff",
                        padding: "16px 32px",
                        borderRadius: 12,
                        boxShadow: "0 4px 24px 0 rgba(34,197,94,0.13)",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        animation: "fadeInSuccess 0.3s"
                    }}
                >
                    <span style={{ fontSize: 22 }}>✅</span>
                    {successMessage}
                    <button
                        style={{
                            marginLeft: 18,
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: 18,
                            cursor: "pointer"
                        }}
                        onClick={() => setSuccessMessage(null)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            )}
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
                                                                {reviewLoading[key] && (
                                                                    <span style={{ marginLeft: 6 }}>
                                                                        <Spinner size={18} />
                                                                    </span>
                                                                )}
                                                            </span>
                                                        }
                                                        open={openCollapsible === key}
                                                        onToggle={() => setOpenCollapsible(openCollapsible === key ? null : key)}
                                                        actions={
                                                            <>
                                                                <button
                                                                    className="user-story-menu-btn"
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        setMenuOpen(menuOpen === key ? null : key);
                                                                        setMenuAnchor(
                                                                            menuOpen === key
                                                                                ? null
                                                                                : (e.currentTarget as HTMLElement).getBoundingClientRect()
                                                                        );
                                                                    }}
                                                                    aria-label="Open options"
                                                                >
                                                                    <span className="user-story-menu-dot" />
                                                                    <span className="user-story-menu-dot" />
                                                                    <span className="user-story-menu-dot" />
                                                                </button>
                                                                {menuOpen === key && menuAnchor && (
                                                                    <UserStoryMenuPortal
                                                                        anchorRect={menuAnchor}
                                                                        onClose={() => setMenuOpen(null)}
                                                                    >
                                                                        <button onClick={() => { setViewStory(story); setMenuOpen(null); }}>View</button>
                                                                        <button onClick={async () => { setMenuOpen(null); await handleReview(story); }}>Review</button>
                                                                        <button onClick={() => { setDeleteStory(story); setMenuOpen(null); }}>Delete</button>
                                                                    </UserStoryMenuPortal>
                                                                )}
                                                            </>
                                                        }
                                                    >
                                                        {reviewLoading[key] ? (
                                                            <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40 }}>
                                                                <Spinner size={22} />
                                                                <span style={{ color: "black" }}>Reviewing user story...</span>
                                                            </div>
                                                        ) : (
                                                            <div className="user-story-review-comment">
                                                                <b>Review results:</b>
                                                                {!reviewOutput[key] && (
                                                                    <div style={{ marginTop: 6, color: "black" }}>No review results yet.</div>
                                                                )}
                                                                {reviewOutput[key] && (
                                                                    <>
                                                                        <div style={{ marginTop: 6 }}>
                                                                            {reviewOutput[key]?.validation ?? "No validation result."}
                                                                        </div>
                                                                        <b style={{ display: "block", marginTop: 12 }}>Issues:</b>
                                                                        <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                                                            {Array.isArray(reviewOutput[key]?.issues) && reviewOutput[key].issues.length > 0 ? (
                                                                                reviewOutput[key].issues.map((issue: string, idx: number) => (
                                                                                    <li key={idx}>{issue}</li>
                                                                                ))
                                                                            ) : (
                                                                                <li>No issues.</li>
                                                                            )}
                                                                        </ul>
                                                                        <b style={{ display: "block", marginTop: 12 }}>Suggestions:</b>
                                                                        <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                                                            {Array.isArray(reviewOutput[key]?.suggestions) && reviewOutput[key].suggestions.length > 0 ? (
                                                                                reviewOutput[key].suggestions.map((s: string, idx: number) => (
                                                                                    <li key={idx}>{s}</li>
                                                                                ))
                                                                            ) : (
                                                                                <li>No suggestions.</li>
                                                                            )}
                                                                        </ul>
                                                                        <button
                                                                            className="review-modal-btn"
                                                                            style={{ marginTop: 18 }}
                                                                            onClick={async () => {
                                                                                setSendingToJira(prev => ({ ...prev, [key]: true }));
                                                                                try {
                                                                                    await fetch("https://ai-devcrew-back.onrender.com/comment-review-results", {
                                                                                        method: "POST",
                                                                                        headers: {
                                                                                            "Content-Type": "application/json",
                                                                                        },
                                                                                        body: JSON.stringify([reviewOutput[key]]),
                                                                                    });
                                                                                    setSuccessMessage("Review sent to Jira successfully!");
                                                                                    setTimeout(() => setSuccessMessage(null), 3500);
                                                                                } catch {
                                                                                    alert("Error sending review to Jira.");
                                                                                }
                                                                            }}
                                                                        >
                                                                            {sendingToJira[key] ? (
                                                                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                                                                    <Spinner size={18} />
                                                                                    Sending...
                                                                                </span>
                                                                            ) : (
                                                                                "Send review to Jira"
                                                                            )}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Collapsible>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Collapsible>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

            {viewStory && (
                <div className="review-modal-bg">
                    <div className="review-modal">
                        <div className="review-modal-title">
                            {viewStory.summary}
                        </div>
                        <div className="review-modal-description">
                            {viewStory.description}
                        </div>
                        <button className="review-modal-btn" onClick={() => setViewStory(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {deleteStory && (
                <div className="review-modal-bg">
                    <div className="review-modal">
                        <div className="review-modal-title" style={{ color: "#232b3e" }}>
                            Confirm delete
                        </div>
                        <div className="review-modal-description">
                            Are you sure you want to delete <b>{deleteStory.summary}</b>?
                        </div>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.2rem" }}>
                            <button
                                className="review-modal-btn"
                                style={{ background: "#ef4444" }}
                                disabled={deleting}
                                onClick={async () => {
                                    setDeleting(true);
                                    try {
                                        await fetch('https://ai-devcrew-back.onrender.com/delete-issue?issue_key=' + deleteStory.id, {
                                            method: "DELETE",
                                        });
                                        setStories(stories => stories.filter(s => s.id !== deleteStory.id));
                                        setDeleteStory(null);
                                    } catch {
                                        alert("Error deleting story");
                                    } finally {
                                        setDeleting(false);
                                    }
                                }}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                            <button className="review-modal-btn" onClick={() => setDeleteStory(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <AppFooter />
        </div>
    );
};

export default ReviewUserStories;