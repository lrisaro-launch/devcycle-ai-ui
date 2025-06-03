import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./ReviewUserStories.css";
import Collapsible from "./Collapsible";
import { useProcessedFile } from "../context/ProcessedFileContext";
import UserStoryMenuPortal from "./UserStoryMenuPortal";
import Spinner from "./Spinner";

interface UserStory {
    summary: string;
    description: string;
    criterios_de_aceptacion: string[];
}

const ReviewUserStories: React.FC = () => {
    const { result } = useProcessedFile();
    const [stories, setStories] = useState<UserStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [viewStory, setViewStory] = useState<UserStory | null>(null);
    const [deleteStory, setDeleteStory] = useState<UserStory | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);

    // States to manage review functionality
    const [reviewOutput, setReviewOutput] = useState<{ [key: string]: string }>({});
    const [reviewLoading, setReviewLoading] = useState<{ [key: string]: boolean }>({});
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

    useEffect(() => {
        setStories(result?.analisis?.tickets || []);
        setLoading(false);

        // const fetchStories = async () => {
        //   try {
        //     setLoading(true);
        //     setError(null);
        //     const response = await fetch("https://ai-devcrew-back.onrender.com/user-stories");
        //     if (!response.ok) throw new Error("Failed to fetch user stories");
        //     const data = await response.json();
        //     setStories(data);
        //   } catch (err: any) {
        //     setError(err.message || "Error loading user stories");
        //   } finally {
        //     setLoading(false);
        //   }
        // };
        // fetchStories();
    }, []);

    const handleReview = async (story: UserStory) => {
        const key = story.summary;
        if (reviewOutput[key]) {
            setOpenCollapsible(key); // Abrir si ya está cargado
            return;
        }
        setReviewLoading(prev => ({ ...prev, [key]: true }));
        try {
            //     const response = await fetch(`https://ai-devcrew-back.onrender.com/user-stories/review/${encodeURIComponent(key)}`);
            //     if (!response.ok) throw new Error("Failed to fetch review output");
            //     const data = await response.json();
            //     setReviewOutput(prev => ({ ...prev, [key]: data.output || "No comment." }));
            // } catch {
            //     setReviewOutput(prev => ({ ...prev, [key]: "Error loading review output." }));
            // } finally {
            //     setReviewLoading(prev => ({ ...prev, [key]: false }));
            // }
            setTimeout(() => {
                setReviewOutput(prev => ({ ...prev, [key]: "No comment." }));
                setReviewLoading(prev => ({ ...prev, [key]: false }));
                setOpenCollapsible(key);
            }, 1000);
        } catch {
            setReviewOutput(prev => ({ ...prev, [key]: "Error loading review output." }));
            setReviewLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="pfv-bg">
            <AppHeader />
            <div className="pfv-title-section">
                <h1 className="pfv-title">Review user stories</h1>
                <p className="pfv-description">
                    Here you can view and manage all your created user stories. Click the menu on the right of each story for more options.
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
                        {stories.map((story: UserStory, idx: number) => {
                            const key = story.summary || String(idx);
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
                                                <span style={{ color: "#b0b8d1" }}>Reviewing user story...</span>
                                            </div>
                                        ) : (
                                            <div className="user-story-review-comment">
                                                <b>Review comment:</b>
                                                <div style={{ marginTop: 6 }}>
                                                    {reviewOutput[key] ?? "No comment."}
                                                </div>
                                            </div>
                                        )}
                                    </Collapsible>
                                </li>
                            );
                        })}
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
                        <div className="review-modal-acceptance">
                            <div className="review-modal-acceptance-title">Acceptance Criteria:</div>
                            <ul className="review-modal-acceptance-list">
                                {viewStory.criterios_de_aceptacion && viewStory.criterios_de_aceptacion.length > 0 ? (
                                    viewStory.criterios_de_aceptacion.map((criteria, idx) => (
                                        <li key={idx}>{criteria}</li>
                                    ))
                                ) : (
                                    <li>No acceptance criteria.</li>
                                )}
                            </ul>
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
                                        await fetch(`https://ai-devcrew-back.onrender.com/user-stories/${encodeURIComponent(deleteStory.summary)}`, {
                                            method: "DELETE",
                                        });
                                        setStories(stories => stories.filter(s => s.summary !== deleteStory.summary));
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