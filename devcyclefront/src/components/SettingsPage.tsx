import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Collapsible from "./Collapsible";
import "./SettingsPage.css";

const PROMPTS = "Prompts";
const PROMPT_PROCESS_DOCUMENTS = "Prompt_process_documents";
const PROMPT_REVIEW_USER_STORIES = "Prompt_review_user_stories";
const PROMPT_UPLOAD_REVIEW = "Prompt_upload_review";

const SettingsPage: React.FC = () => {
    const [openSetting, setOpenSetting] = useState<string | null>(null);
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
    const [processPrompt, setProcessPrompt] = useState("");
    const [reviewPrompt, setReviewPrompt] = useState("");
    const [uploadReviewPrompt, setUploadReviewPrompt] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("Changes save successfully!");
        setTimeout(() => setSuccessMessage(null), 3500);
    };

    return (
        <div className="pfv-bg">
            <AppHeader />
            <div className="pfv-title-section">
                <h1 className="pfv-title">Configuration</h1>
                <p className="pfv-description">
                    Manage your workspace settings. Here you can customize and adjust options for your AI experience.
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
            <main className="settings-main">
                <div className="settings-list-card">
                    <Collapsible
                        title={
                            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                Prompts
                            </span>
                        }
                        open={openSetting === PROMPTS}
                        onToggle={() => setOpenSetting(openSetting === PROMPTS ? null : PROMPTS)}
                    >
                        <ul className="settings-list" style={{ marginTop: 8 }}>
                            <Collapsible
                                title={
                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        Prompt to process the documents
                                    </span>
                                }
                                open={openCollapsible === PROMPT_PROCESS_DOCUMENTS}
                                onToggle={() => setOpenCollapsible(openCollapsible === PROMPT_PROCESS_DOCUMENTS ? null : PROMPT_PROCESS_DOCUMENTS)}
                            >
                                <textarea
                                    id={PROMPT_PROCESS_DOCUMENTS}
                                    className="settings-textarea"
                                    value={processPrompt}
                                    onChange={e => setProcessPrompt(e.target.value)}
                                    rows={6}
                                    placeholder="Enter your custom prompt here..."
                                />
                            </Collapsible>
                            <Collapsible
                                title={
                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        Prompt to review the user stories
                                    </span>
                                }
                                open={openCollapsible === PROMPT_REVIEW_USER_STORIES}
                                onToggle={() => setOpenCollapsible(openCollapsible === PROMPT_REVIEW_USER_STORIES ? null : PROMPT_REVIEW_USER_STORIES)}
                            >
                                <textarea
                                    id={PROMPT_REVIEW_USER_STORIES}
                                    className="settings-textarea"
                                    value={reviewPrompt}
                                    onChange={e => setReviewPrompt(e.target.value)}
                                    rows={6}
                                    placeholder="Enter your custom prompt here..."
                                />
                            </Collapsible>
                            <Collapsible
                                title={
                                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        Prompt to upload the review to the platform
                                    </span>
                                }
                                open={openCollapsible === PROMPT_UPLOAD_REVIEW}
                                onToggle={() => setOpenCollapsible(openCollapsible === PROMPT_UPLOAD_REVIEW ? null : PROMPT_UPLOAD_REVIEW)}
                            >
                                <textarea
                                    id={PROMPT_UPLOAD_REVIEW}
                                    className="settings-textarea"
                                    value={uploadReviewPrompt}
                                    onChange={e => setUploadReviewPrompt(e.target.value)}
                                    rows={6}
                                    placeholder="Enter your custom prompt here..."
                                />
                            </Collapsible>
                        </ul>
                    </Collapsible>
                    <button
                        type="submit"
                        className="review-modal-btn"
                        style={{ marginTop: 10, minWidth: 140 }}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </main>
            <AppFooter />
        </div>
    );
};

export default SettingsPage;