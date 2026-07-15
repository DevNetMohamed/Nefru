import { useNavigate } from "react-router-dom";

import Icons from "../../../../../assets/icons";
import styles from "./ProfileMobileHeader.module.css";

const BackIcon = Icons.chevronLeft;

export default function ProfileMobileHeader({ title, backTo = -1, action }) {
  const navigate = useNavigate();
  const ActionIcon = action?.icon;

  const handleBack = () => {
    if (typeof backTo === "number") {
      navigate(backTo);
      return;
    }

    navigate(backTo);
  };

  const handleAction = () => {
    if (!action) return;

    if (action.to) {
      navigate(action.to);
      return;
    }

    action.onClick?.();
  };

  return (
    <header className={styles.header}>
      <button type="button" className={styles.iconButton} onClick={handleBack} aria-label="Go back">
        <BackIcon />
      </button>

      <h1>{title}</h1>

      {action ? (
        <button type="button" className={styles.iconButton} onClick={handleAction} aria-label={action.label}>
          {ActionIcon ? <ActionIcon /> : null}
        </button>
      ) : (
        <span className={styles.headerSpacer} aria-hidden="true" />
      )}
    </header>
  );
}
