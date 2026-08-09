import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import styles from "./MobilePageHeader.module.css";

export default function MobilePageHeader({ title, backTo = -1, action, className = "" }) {
  const navigate = useNavigate();
  const ActionIcon = action?.icon;

  const handleAction = () => {
    if (!action || action.disabled) return;
    if (action.to) return navigate(action.to);
    action.onClick?.();
  };

  return (
    <header className={`${styles.header} ${className}`}>
      <button type="button" className={styles.iconButton} onClick={() => navigate(backTo)} aria-label="Go back">
        <ChevronLeft size={24} strokeWidth={2.2} />
      </button>
      <h1 title={title}>{title}</h1>
      {action ? (
        <button
          type="button"
          className={`${styles.actionButton} ${action.text ? styles.textAction : ""}`}
          onClick={handleAction}
          aria-label={action.label || action.text}
          disabled={action.disabled}
        >
          {ActionIcon ? <ActionIcon aria-hidden="true" /> : null}
          {action.text ? <span>{action.text}</span> : null}
        </button>
      ) : (
        <span className={styles.headerSpacer} aria-hidden="true" />
      )}
    </header>
  );
}
