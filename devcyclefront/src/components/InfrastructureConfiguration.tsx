import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Collapsible from "./Collapsible";
import "./InfrastructureConfiguration.css";

// JSON to configure the infrastructure
const configJson = {
  platform: {
    name: "liberty-ai-backend",
    environment: "dev",
    region: "eastus",
  },
  networking: {
    vnet_required: true,
    vnet_cidr: "10.0.0.0/16",
    subnets: [
      {
        name: "app-subnet",
        cidr: "10.0.1.0/24",
        type: "app",
        nsg_attached: true,
      },
      {
        name: "db-subnet",
        cidr: "10.0.2.0/24",
        type: "db",
        nsg_attached: true,
      },
    ],
    hub_spoke: false,
    vpn_gateway: false,
    firewall_required: false,
    private_dns_zones: ["blob.core.windows.net", "database.windows.net"],
  },
  identity_access: {
    aad_integration: true,
    rbac_assignments: [
      {
        principal_type: "group",
        role: "Contributor",
        scope: "subscription",
      },
    ],
    managed_identities: "system-assigned",
  },
  compute: {
    app_services: [
      {
        name: "backend-app",
        sku: "P1v2",
        runtime: "dotnet",
      },
    ],
    azure_functions: [
      {
        name: "trigger-fn",
        plan_type: "consumption",
        runtime: "python",
        triggers: ["HTTP"],
      },
    ],
    virtual_machines: [
      {
        count: 1,
        size: "Standard_B2s",
        os: "Linux",
        auto_shutdown: true,
        public_ip: false,
      },
    ],
  },
  storage_data: {
    blob_storage: [
      {
        name: "logs-storage",
        redundancy: "LRS",
        access_tier: "Hot",
      },
    ],
    databases: [
      {
        type: "CosmosDB",
        tier: "Standard",
        private_endpoint: true,
        backup_policy: "Geo-Redundant",
      },
    ],
  },
  ci_cd: {
    terraform_state_backend: "Azure Storage",
    ci_cd_tool: "GitHub Actions",
    state_locking_enabled: true,
    secret_management: "Azure Key Vault",
  },
  monitoring: {
    log_analytics_workspace: true,
    retention_days: 90,
    application_insights: true,
    diagnostic_settings: true,
    alerts: [
      {
        type: "CPU",
        threshold_percent: 80,
        email_recipients: ["ops@example.com"],
      },
    ],
  },
  security: {
    azure_policy_definitions: ["deny-public-ip", "allowed-skus"],
    key_vault_needed: true,
    key_vault_soft_delete: true,
    key_vault_access_policies_defined: true,
    security_center_tier: "Standard",
  },
  tags_naming: {
    naming_convention: "{env}-{service}-{region}",
    tags: {
      environment: "dev",
      owner: "ai-team",
      cost_center: "R&D-123",
    },
  },
};

// Utilities to detect field type
const isBoolean = (v: any) => typeof v === "boolean";
const isString = (v: any) => typeof v === "string";
const isNumber = (v: any) => typeof v === "number";
const isArray = (v: any) => Array.isArray(v);
const isObject = (v: any) =>
  typeof v === "object" && !Array.isArray(v) && v !== null;

// Generates an initial value for the state based on the JSON
function getInitialState(obj: any): any {
  if (isArray(obj)) {
    return obj.map(getInitialState);
  }
  if (isObject(obj)) {
    const res: any = {};
    for (const k in obj) res[k] = getInitialState(obj[k]);
    return res;
  }
  return obj;
}

const InfrastructureConfiguration: React.FC = () => {
  const [form, setForm] = useState(() => getInitialState(configJson));
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (section: string[], key: string, value: any) => {
    setForm((prev: any) => {
      const updated = { ...prev };
      let ref: any = updated;
      for (const s of section) ref = ref[s];
      ref[key] = value;
      return updated;
    });
  };

  const handleArrayChange = (
    section: string[],
    idx: number,
    key: string,
    value: any
  ) => {
    setForm((prev: any) => {
      const updated = { ...prev };
      let ref: any = updated;
      for (const s of section) ref = ref[s];
      ref[idx] = { ...ref[idx], [key]: value };
      return updated;
    });
  };

  const handleArrayStringChange = (
    section: string[],
    label: string,
    idx: number,
    value: string
  ) => {
    setForm((prev: any) => {
      const updated = { ...prev };
      let ref: any = updated;
      for (const s of section) ref = ref[s];
      const arrCopy = [...ref[label]];
      arrCopy[idx] = value;
      ref[label] = arrCopy;
      return updated;
    });
  };

  const handleSaveFile = async () => {
    try {
      setSaving(true);
      // const response = await fetch("/api/save-config", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(form),
      // });
      // if (!response.ok) throw new Error("Error saving configuration");
      setSuccessMessage("Configuration saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      alert("Error saving configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleProcessFile = async () => {
    try {
      setProcessing(true);
      const response = await fetch(
        "https://ai-devcrew-back.onrender.com/download-terraform",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Error processing configuration");

      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");

      a.href = url;
      a.download = "Infrastructure_Configuration.tf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error processing configuration.");
    } finally {
      setProcessing(false);
    }
  };

  // Renders a field according to its type
  const renderField = (
    label: string,
    value: any,
    sectionPath: string[],
    idx?: number
  ) => {
    const key =
      idx !== undefined
        ? `${sectionPath.join(".")}.${idx}.${label}`
        : `${sectionPath.join(".")}.${label}`;
    if (isBoolean(value)) {
      return (
        <label className="ic-toggle-label" key={key}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) =>
              idx !== undefined
                ? handleArrayChange(sectionPath, idx, label, e.target.checked)
                : handleChange(sectionPath, label, e.target.checked)
            }
          />
          {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </label>
      );
    }
    if (isString(value)) {
      // If it is a string and has known options, render dropdown
      const dropdownOptions: Record<string, string[]> = {
        environment: ["dev", "qa", "prod"],
        region: [
          "eastus",
          "us-east-1",
          "us-west-2",
          "eu-west-1",
          "asia-south1",
          "southamerica-east1",
        ],
        sku: ["P1v2", "B1", "S1"],
        runtime: ["dotnet", "python", "node", "java"],
        plan_type: ["consumption", "premium"],
        os: ["Linux", "Windows"],
        redundancy: ["LRS", "GRS", "ZRS"],
        access_tier: ["Hot", "Cool", "Archive"],
        type: ["CosmosDB", "PostgreSQL", "MySQL"],
        tier: ["Standard", "Premium"],
        backup_policy: ["Geo-Redundant", "Local-Redundant"],
        terraform_state_backend: ["Azure Storage", "AWS S3", "GCP Storage"],
        ci_cd_tool: [
          "GitHub Actions",
          "GitLab CI",
          "CircleCI",
          "Bitbucket Pipelines",
        ],
        secret_management: ["Azure Key Vault", "AWS Secrets Manager"],
        security_center_tier: ["Standard", "Free"],
      };
      if (dropdownOptions[label]) {
        return (
          <label
            key={key}
            className="ic-toggle-label"
            style={{ marginBottom: 8 }}
          >
            <span style={{ minWidth: 140 }}>
              {label
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              :
            </span>
            <select
              className="ic-region-select"
              value={value}
              onChange={(e) =>
                idx !== undefined
                  ? handleArrayChange(sectionPath, idx, label, e.target.value)
                  : handleChange(sectionPath, label, e.target.value)
              }
            >
              {dropdownOptions[label].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        );
      }
      // Normal string field
      return (
        <label
          key={key}
          className="ic-toggle-label"
          style={{ marginBottom: 8 }}
        >
          <span style={{ minWidth: 140 }}>
            {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
          </span>
          <input
            className="ic-input"
            type="text"
            value={value}
            onChange={(e) =>
              idx !== undefined
                ? handleArrayChange(sectionPath, idx, label, e.target.value)
                : handleChange(sectionPath, label, e.target.value)
            }
          />
        </label>
      );
    }
    if (isNumber(value)) {
      return (
        <label
          key={key}
          className="ic-toggle-label"
          style={{ marginBottom: 8 }}
        >
          <span style={{ minWidth: 140 }}>
            {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
          </span>
          <input
            className="ic-input"
            type="number"
            value={value}
            onChange={(e) =>
              idx !== undefined
                ? handleArrayChange(
                    sectionPath,
                    idx,
                    label,
                    Number(e.target.value)
                  )
                : handleChange(sectionPath, label, Number(e.target.value))
            }
          />
        </label>
      );
    }
    if (isArray(value)) {
      // If it is an array of strings, render as multi-select
      if (value.length > 0 && isString(value[0])) {
        return (
          <div key={key} style={{ marginBottom: 10, width: "100%" }}>
            <label
              className="ic-toggle-label"
              style={{
                marginBottom: 6,
                fontWeight: 400,
                fontSize: "1rem",
                display: "block",
              }}
            >
              {label
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()) + ":"}
            </label>
            <div
              style={{
                marginLeft: 16,
                borderLeft: "2px solid rgb(160, 158, 158)",
                paddingLeft: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "100%",
                }}
              >
                {value.map((v: string, i: number) => (
                  <input
                    key={i}
                    className="ic-input"
                    type="text"
                    value={v}
                    style={{ marginBottom: 0 }}
                    onChange={(e) =>
                      handleArrayStringChange(
                        sectionPath,
                        label,
                        i,
                        e.target.value
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }
      // If it is an array of objects, render each object as a subset
      if (value.length > 0 && isObject(value[0])) {
        return (
          <div key={key} style={{ marginBottom: 12, width: "100%" }}>
            <div className="ic-section-desc">
              {label
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
            {value.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  marginLeft: 16,
                  borderLeft: "2px solid rgb(160, 158, 158)",
                  paddingLeft: 12,
                  marginBottom: 10,
                }}
              >
                {Object.entries(item).map(([k, v]) =>
                  renderField(k, v, [...sectionPath, label], i)
                )}
              </div>
            ))}
          </div>
        );
      }
      // empty array
      return null;
    }
    if (isObject(value)) {
      // Renderiza subsección anidada
      return (
        <div key={key} style={{ marginBottom: 12 }}>
          <div className="ic-section-desc">
            {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
          <div style={{ marginLeft: 16 }}>
            {Object.entries(value).map(([k, v]) =>
              renderField(k, v, [...sectionPath, label])
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render each main section as a Collapsible
  return (
    <div className="pfv-bg">
      <AppHeader />
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
            animation: "fadeInSuccess 0.3s",
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
              cursor: "pointer",
            }}
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
      <main className="pfv-main">
        <div className="pfv-content-card pfv-content-card-large">
          <h1 className="pfv-title" style={{ textAlign: "center" }}>
            Infrastructure Configuration
          </h1>
          <p className="pfv-description" style={{ textAlign: "center" }}>
            Edit your infrastructure configuration below.
          </p>
          {Object.entries(form).map(([section, value]) => (
            <Collapsible
              key={section}
              title={section
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              open={openSection === section}
              onToggle={() =>
                setOpenSection(openSection === section ? null : section)
              }
            >
              <div style={{ marginTop: 8 }}>
                {isObject(value)
                  ? Object.entries(value as Record<string, any>).map(([k, v]) =>
                      renderField(k, v, [section])
                    )
                  : renderField(section, value, [])}
              </div>
            </Collapsible>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              margin: "32px 0 0 0",
            }}
          >
            <button
              className="ic-save-btn"
              type="button"
              onClick={handleSaveFile}
              disabled={saving || processing}
              style={{ minWidth: 100 }}
            >
              {saving ? (
                <span>
                  <span className="ic-btn-spinner" /> Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
            <button
              className="ic-save-btn"
              type="button"
              onClick={handleProcessFile}
              disabled={processing || saving}
              style={{ minWidth: 110 }}
            >
              {processing ? (
                <span>
                  <span className="ic-btn-spinner" /> Processing...
                </span>
              ) : (
                "Process"
              )}
            </button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default InfrastructureConfiguration;
