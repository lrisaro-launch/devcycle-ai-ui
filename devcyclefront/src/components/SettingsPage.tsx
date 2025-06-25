import React, { useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Collapsible from "./Collapsible";
import "./SettingsPage.css";

const PROMPTS = "Prompts";
const PROMPT_PROCESS_DOCUMENTS = "Prompt_process_documents";
const PROMPT_REVIEW_USER_STORIES = "Prompt_review_user_stories";
const PROMPT_UPLOAD_REVIEW = "Prompt_upload_review";

const promptsDic: Record<string, string> = {
    REQUIREMENTS_ANALYSIS_PROMPT: "",
    QA_REVIEW_PROMPT: ""
};

const SettingsPage: React.FC = () => {
    const [openSetting, setOpenSetting] = useState<string | null>(null);
    const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
    const [uploadReviewPrompt, setUploadReviewPrompt] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const getPrompts = async () => {
            const processPromptResponse = await fetch("https://ai-devcrew-back.onrender.com/get-prompt?prompt_name=REQUIREMENTS_ANALYSIS_PROMPT");
            if (!processPromptResponse.ok) throw new Error("Failed to fetch the process prompt");
            const processPromptdata = await processPromptResponse.json();
            promptsDic.REQUIREMENTS_ANALYSIS_PROMPT = processPromptdata || "";

            const reviewPromptResponse = await fetch("https://ai-devcrew-back.onrender.com/get-prompt?prompt_name=QA_REVIEW_PROMPT");
            if (!reviewPromptResponse.ok) throw new Error("Failed to fetch the review prompt");
            const reviewPromptData = await reviewPromptResponse.json();
            promptsDic.QA_REVIEW_PROMPT = reviewPromptData || "";

            // const uploadReviewPromptResponse = await fetch("https://ai-devcrew-back.onrender.com/get-prompt?prompt_name=QA_REVIEW_PROMPT");
            // if (!uploadReviewPromptResponse.ok) throw new Error("Failed to fetch the upload review prompt");
            // const uploadReviewPromptData = await uploadReviewPromptResponse.json();
            // setUploadReviewPrompt(uploadReviewPromptData || "");
        };
        getPrompts();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            for (const [promptType, prompt] of Object.entries(promptsDic)) {
                const response = await fetch(`https://ai-devcrew-back.onrender.com/add-or-update-prompt?prompt_name=${promptType}&prompt_value=${prompt}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to save the prompts.");
                }
            }

            setSuccessMessage("Changes save successfully!");
            setTimeout(() => setSuccessMessage(null), 3500);
        } catch (err: any) {
            alert("An error occurred while saving the changes.");
        }
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
                                    value={promptsDic.REQUIREMENTS_ANALYSIS_PROMPT}
                                    onChange={e => promptsDic.REQUIREMENTS_ANALYSIS_PROMPT = e.target.value || ""}
                                    rows={12}
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
                                    value={promptsDic.QA_REVIEW_PROMPT}
                                    onChange={e => promptsDic.QA_REVIEW_PROMPT = e.target.value || ""}
                                    rows={12}
                                    placeholder="Enter your custom prompt here..."
                                />
                            </Collapsible>
                            {/* <Collapsible
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
                                    rows={12}
                                    placeholder="Enter your custom prompt here..."
                                />
                            </Collapsible> */}
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