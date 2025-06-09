import React, { useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import "./SettingsPage.css";

const LOCAL_STORAGE_KEY = "devcycleai_custom_prompt";

const SettingsPage: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedPrompt = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedPrompt) setPrompt(savedPrompt);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem(LOCAL_STORAGE_KEY, prompt);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
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
            <main className="settings-main">
                <div className="settings-list-card">
                    <form onSubmit={handleSave}>
                        <label htmlFor="prompt" className="settings-label">
                            Custom AI Prompt
                        </label>
                        <textarea
                            id="prompt"
                            className="settings-textarea"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            rows={6}
                            placeholder="Enter your custom prompt here..."
                        />
                        <button
                            type="submit"
                            className="review-modal-btn"
                            style={{ marginTop: 10, minWidth: 140 }}
                        >
                            Save
                        </button>
                        {saved && (
                            <span className="settings-saved-msg">
                                Saved!
                            </span>
                        )}
                    </form>
                </div>
            </main>
            <AppFooter />
        </div>
    );
};

export default SettingsPage;