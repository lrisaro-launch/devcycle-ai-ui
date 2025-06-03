import React from "react";

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  className,
  actions,
  open,
  onToggle,
}) => {
  return (
    <div className={className ? `user-story-collapsable ${className}` : "user-story-collapsable"}>
      <div
        className={`user-story-collapsable-title${open ? " open" : ""}`}
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <span
          className="user-story-collapsable-arrow"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        <span className="user-story-title">{title}</span>
        {actions && (
          <div
            className="user-story-actions"
            onClick={e => e.stopPropagation()}
            style={{ marginLeft: "auto" }}
          >
            {actions}
          </div>
        )}
      </div>
      {open && (
        <div className="user-story-collapsable-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;