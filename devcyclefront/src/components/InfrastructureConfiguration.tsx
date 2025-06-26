import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Collapsible from "./Collapsible";
import "./InfrastructureConfiguration.css";

const cloudProviders = [
    { label: "AWS", desc: "Amazon Web Services" },
    { label: "Google Cloud Platform (GCP)", desc: "Google Cloud services" },
    { label: "Microsoft Azure", desc: "Microsoft cloud platform" },
    { label: "Vercel / Netlify", desc: "Fast deploy for frontend and serverless" },
    { label: "DigitalOcean / Heroku / Railway", desc: "Simple and affordable options" },
    { label: "On-premise / Localhost", desc: "Own or local infrastructure" },
];

const backendStacks = [
    { label: "Node.js (Express, NestJS)", desc: "JavaScript/TypeScript backend" },
    { label: "Python (FastAPI, Django, Flask)", desc: "Popular Python frameworks" },
    { label: "Java (Spring Boot)", desc: "Robust framework for Java" },
    { label: "Go", desc: "Efficient and concurrent language" },
    { label: ".NET", desc: "Microsoft framework for C#" },
    { label: "Ruby on Rails", desc: "Productive framework for Ruby" },
];

const databases = [
    { label: "PostgreSQL", desc: "Advanced relational database" },
    { label: "MySQL", desc: "Popular relational database" },
    { label: "MongoDB", desc: "NoSQL document-oriented database" },
    { label: "SQLite", desc: "Lightweight embedded database" },
    { label: "Redis", desc: "In-memory storage for cache and queues" },
    { label: "Firebase / Firestore", desc: "Google's real-time database" },
];

const devTools = [
    { label: "Docker", desc: "Containers for development and production" },
    { label: "Docker Compose", desc: "Orchestration for multiple containers" },
    { label: "LocalStack", desc: "Simulate AWS services locally" },
    { label: "Testing frameworks", desc: "Jest, Pytest, etc." },
    { label: "Linters / Formatters", desc: "ESLint, Prettier, Black, etc." },
];

const cicdProviders = [
    { label: "GitHub Actions", desc: "CI/CD integrated with GitHub" },
    { label: "GitLab CI", desc: "GitLab pipelines" },
    { label: "CircleCI", desc: "Flexible continuous integration" },
    { label: "Bitbucket Pipelines", desc: "CI/CD for Bitbucket repositories" },
];

const cicdSteps = [
    { label: "Run Tests", desc: "Run automated tests" },
    { label: "Build", desc: "Build artifacts or images" },
    { label: "Deploy to Staging/Prod", desc: "Deploy to environments" },
];

const authProviders = [
    { label: "JWT", desc: "JSON Web Tokens" },
    { label: "OAuth2 (Google, GitHub)", desc: "Social login" },
    { label: "Auth0 / Firebase Auth", desc: "External authentication services" },
];

const securityOptions = [
    { label: "CORS settings", desc: "Configure allowed origins" },
    { label: "Rate limiting", desc: "Limit number of requests" },
    { label: "HTTPS", desc: "Encrypt traffic" },
];

const projectStructure = [
    { label: "Monorepo", desc: "Single repository for everything" },
    { label: "Multirepo", desc: "Separate repos per service/module" },
    { label: "Modular or microservices architecture", desc: "Logical or physical separation" },
    { label: "Serverless functions", desc: "Functions as a service" },
];

const frontendFrameworks = [
    { label: "React", desc: "Modern UI library" },
    { label: "Next.js", desc: "React with SSR and SSG" },
    { label: "Angular", desc: "Full-featured framework by Google" },
    { label: "Vue", desc: "Progressive and flexible framework" },
];

const regions = [
    "us-east-1", "us-west-2", "eu-west-1", "asia-south1", "southamerica-east1"
];

const InfrastructureConfiguration: React.FC = () => {

    const [selectedCloud, setSelectedCloud] = useState<string>("");
    const [selectedBackends, setSelectedBackends] = useState<string[]>([]);
    const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
    const [selectedDevTools, setSelectedDevTools] = useState<string[]>([]);
    const [useCICD, setUseCICD] = useState<boolean>(false);
    const [selectedCICD, setSelectedCICD] = useState<string[]>([]);
    const [selectedCICDSteps, setSelectedCICDSteps] = useState<string[]>([]);
    const [useAuth, setUseAuth] = useState<boolean>(false);
    const [selectedAuth, setSelectedAuth] = useState<string[]>([]);
    const [selectedSecurity, setSelectedSecurity] = useState<string[]>([]);
    const [selectedStructure, setSelectedStructure] = useState<string[]>([]);
    const [selectedFrontend, setSelectedFrontend] = useState<string>("");
    const [useTS, setUseTS] = useState<boolean>(false);
    const [deployFrontend, setDeployFrontend] = useState<boolean>(false);
    const [envVars, setEnvVars] = useState<string>("");
    const [basePath, setBasePath] = useState<string>("");
    const [projectName, setProjectName] = useState<string>("");
    const [region, setRegion] = useState<string>("us-east-1");
    const [openSection, setOpenSection] = useState<string | null>(null);

    const handleMultiCheckbox = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
        setSelected(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
    };

    return (
        <div className="pfv-bg">
            <AppHeader />
            <main className="pfv-main">
                <div className="pfv-content-card pfv-content-card-large">
                    <h1 className="pfv-title" style={{ textAlign: "center" }}>Infrastructure Configuration</h1>
                    <p className="pfv-description" style={{ textAlign: "center" }}>
                        Select the options to configure your project's infrastructure. Expand each section for more details.
                    </p>
                    {/* 1. Cloud / Hosting Provider */}
                    <Collapsible
                        title="Cloud / Hosting Provider"
                        open={openSection === "cloud"}
                        onToggle={() => setOpenSection(openSection === "cloud" ? null : "cloud")}
                    >
                        <div className="ic-section-desc">Select the main provider for your infrastructure.</div>
                        <div className="ic-options-group">
                            {cloudProviders.map(opt => (
                                <label key={opt.label} className="ic-radio-label" title={opt.desc}>
                                    <input
                                        type="radio"
                                        name="cloud"
                                        value={opt.label}
                                        checked={selectedCloud === opt.label}
                                        onChange={() => setSelectedCloud(opt.label)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 2. Backend Language/Stack */}
                    <Collapsible
                        title="Backend Language/Stack"
                        open={openSection === "backend"}
                        onToggle={() => setOpenSection(openSection === "backend" ? null : "backend")}
                    >
                        <div className="ic-section-desc">Select one or more backend stacks.</div>
                        <div className="ic-options-group">
                            {backendStacks.map(opt => (
                                <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                    <input
                                        type="checkbox"
                                        checked={selectedBackends.includes(opt.label)}
                                        onChange={() => handleMultiCheckbox(opt.label, selectedBackends, setSelectedBackends)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 3. Database */}
                    <Collapsible
                        title="Database"
                        open={openSection === "database"}
                        onToggle={() => setOpenSection(openSection === "database" ? null : "database")}
                    >
                        <div className="ic-section-desc">Select the databases you will use.</div>
                        <div className="ic-options-group">
                            {databases.map(opt => (
                                <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDatabases.includes(opt.label)}
                                        onChange={() => handleMultiCheckbox(opt.label, selectedDatabases, setSelectedDatabases)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 4. Development and Testing Environment */}
                    <Collapsible
                        title="Development and Testing Environment"
                        open={openSection === "devtestenv"}
                        onToggle={() => setOpenSection(openSection === "devtestenv" ? null : "devtestenv")}
                    >
                        <div className="ic-section-desc">Recommended tools for development and testing.</div>
                        <div className="ic-options-group">
                            {devTools.map(opt => (
                                <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDevTools.includes(opt.label)}
                                        onChange={() => handleMultiCheckbox(opt.label, selectedDevTools, setSelectedDevTools)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 5. CI/CD */}
                    <Collapsible
                        title="CI/CD"
                        open={openSection === "cicd"}
                        onToggle={() => setOpenSection(openSection === "cicd" ? null : "cicd")}
                    >
                        <div className="ic-section-desc">Do you want to configure continuous integration and deployment?</div>
                        <label className="ic-toggle-label" title="Enable or disable CI/CD">
                            <input
                                type="checkbox"
                                checked={useCICD}
                                onChange={() => setUseCICD(v => !v)}
                            />
                            Use CI/CD
                        </label>
                        {useCICD && (
                            <>
                                <br />
                                <div className="ic-section-desc" style={{ marginTop: 10 }}>Select CI/CD providers:</div>
                                <div className="ic-options-group">
                                    {cicdProviders.map(opt => (
                                        <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCICD.includes(opt.label)}
                                                onChange={() => handleMultiCheckbox(opt.label, selectedCICD, setSelectedCICD)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                                <div className="ic-section-desc" style={{ marginTop: 10 }}>Pipeline steps:</div>
                                <div className="ic-options-group">
                                    {cicdSteps.map(opt => (
                                        <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCICDSteps.includes(opt.label)}
                                                onChange={() => handleMultiCheckbox(opt.label, selectedCICDSteps, setSelectedCICDSteps)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </Collapsible>

                    {/* 6. Security and Authentication */}
                    <Collapsible
                        title="Security and Authentication"
                        open={openSection === "security"}
                        onToggle={() => setOpenSection(openSection === "security" ? null : "security")}
                    >
                        <div className="ic-section-desc">Options to protect your application and users.</div>
                        <label className="ic-toggle-label" title="Require authentication?" style={{ marginTop: 10 }}>
                            <input
                                type="checkbox"
                                checked={useAuth}
                                onChange={() => setUseAuth(v => !v)}
                            />
                            Use authentication
                        </label>
                        {useAuth && (
                            <>
                                <br />
                                <div className="ic-section-desc" style={{ marginTop: 10 }}>Select authentication providers:</div>
                                <div className="ic-options-group">
                                    {authProviders.map(opt => (
                                        <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                            <input
                                                type="checkbox"
                                                checked={selectedAuth.includes(opt.label)}
                                                onChange={() => handleMultiCheckbox(opt.label, selectedAuth, setSelectedAuth)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                        <br />
                        <div className="ic-section-desc" style={{ marginTop: 10 }}>Other security options:</div>
                        <div className="ic-options-group">
                            {securityOptions.map(opt => (
                                <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSecurity.includes(opt.label)}
                                        onChange={() => handleMultiCheckbox(opt.label, selectedSecurity, setSelectedSecurity)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 7. Project Structure */}
                    <Collapsible
                        title="Project Structure"
                        open={openSection === "project-structure"}
                        onToggle={() => setOpenSection(openSection === "project-structure" ? null : "project-structure")}
                    >
                        <div className="ic-section-desc">Code organization and architecture.</div>
                        <div className="ic-options-group">
                            {projectStructure.map(opt => (
                                <label key={opt.label} className="ic-checkbox-label" title={opt.desc}>
                                    <input
                                        type="checkbox"
                                        checked={selectedStructure.includes(opt.label)}
                                        onChange={() => handleMultiCheckbox(opt.label, selectedStructure, setSelectedStructure)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </Collapsible>

                    {/* 8. Frontend */}
                    <Collapsible
                        title="Frontend"
                        open={openSection === "frontend"}
                        onToggle={() => setOpenSection(openSection === "frontend" ? null : "frontend")}
                    >
                        <div className="ic-section-desc">Select the framework and options for the frontend.</div>
                        <div className="ic-options-group">
                            {frontendFrameworks.map(opt => (
                                <label key={opt.label} className="ic-radio-label" title={opt.desc}>
                                    <input
                                        type="radio"
                                        name="frontend"
                                        value={opt.label}
                                        checked={selectedFrontend === opt.label}
                                        onChange={() => setSelectedFrontend(opt.label)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        <label className="ic-toggle-label" title="Use TypeScript in the frontend?">
                            <input
                                type="checkbox"
                                checked={useTS}
                                onChange={() => setUseTS(v => !v)}
                            />
                            Use TypeScript
                        </label>
                        <label className="ic-toggle-label" title="Deploy frontend with Vercel or Netlify?">
                            <input
                                type="checkbox"
                                checked={deployFrontend}
                                onChange={() => setDeployFrontend(v => !v)}
                            />
                            Deploy with Vercel/Netlify
                        </label>
                    </Collapsible>

                    {/* 9. Advanced Settings */}
                    <Collapsible
                        title="Advanced Settings"
                        open={openSection === "advancedsettings"}
                        onToggle={() => setOpenSection(openSection === "advancedsettings" ? null : "advancedsettings")}
                    >
                        <div className="ic-section-desc">Customize advanced project details.</div>
                        <div className="ic-advanced-fields">
                            <label>
                                Environment variables:
                                <input
                                    type="text"
                                    value={envVars}
                                    onChange={e => setEnvVars(e.target.value)}
                                    placeholder="e.g. API_KEY, DB_URL"
                                    className="ic-input"
                                    title="Comma-separated environment variables"
                                />
                            </label>
                            <label>
                                Base paths:
                                <input
                                    type="text"
                                    value={basePath}
                                    onChange={e => setBasePath(e.target.value)}
                                    placeholder="/api, /v1"
                                    className="ic-input"
                                    title="Base path prefixes"
                                />
                            </label>
                            <label>
                                Project name:
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    placeholder="Project name"
                                    className="ic-input"
                                    title="Project identifier name"
                                />
                            </label>
                            <label>
                                Deployment region:
                                <select
                                    value={region}
                                    onChange={e => setRegion(e.target.value)}
                                    className="ic-region-select"
                                    title="Region where the infrastructure will be deployed"
                                >
                                    {regions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </Collapsible>
                </div>
            </main>
            <AppFooter />
        </div>
    );
};

export default InfrastructureConfiguration;