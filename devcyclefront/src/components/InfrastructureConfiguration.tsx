import React from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const InfrastructureConfiguration: React.FC = () => {
    return (
        <div className="pfv-bg">
            <AppHeader />
            <main className="pfv-main">
                <div className="pfv-content-card">
                    <h1 className="pfv-title">Infrastructure Configuration</h1>
                    {/* Aquí irá la configuración de infraestructura */}
                </div>
            </main>
            <AppFooter />
        </div>
    );
};

export default InfrastructureConfiguration;