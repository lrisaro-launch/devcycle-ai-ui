import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface UserStoryMenuPortalProps {
  anchorRect: DOMRect | null;
  children: React.ReactNode;
  onClose: () => void;
}

const UserStoryMenuPortal: React.FC<UserStoryMenuPortalProps> = ({ anchorRect, children, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!anchorRect) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="user-story-menu-dropdown"
      style={{
        position: "fixed",
        top: anchorRect.bottom + 4,
        left: anchorRect.right - 140,
        zIndex: 2000,
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default UserStoryMenuPortal;