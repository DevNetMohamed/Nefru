import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { apiRequest } from "../../../services/api";
import { updateProfile } from "../../../store/slices/authSlice";
import styles from "./GuideVerification.module.css";

const DOCUMENT_LABELS = {
  national_id: "National ID",
  passport: "Passport",
  guide_license: "Guide license",
};

export default function GuideVerification() {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const [verification, setVerification] = useState(null);
  const [documentType, setDocumentType] = useState("national_id");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadVerification = useCallback(async () => {
    setError("");

    try {
      const response = await apiRequest("/guide-verification/me");
      setVerification(response.data.verification);
    } catch (requestError) {
      setError(requestError.message || "Unable to load verification details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVerification();
  }, [loadVerification]);

  const syncProfileStatus = (verificationStatus) => {
    dispatch(
      updateProfile({
        user,
        profile: {
          ...profile,
          verificationStatus,
          rejectionReason: "",
        },
      }),
    );
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Choose a document first");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const existingDocument = verification?.documents?.find(
        (document) => document.documentType === documentType,
      );
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);

      const endpoint = existingDocument
        ? `/guide-verification/documents/${existingDocument.id}`
        : "/guide-verification/documents";

      await apiRequest(endpoint, {
        method: existingDocument ? "PATCH" : "POST",
        body: formData,
      });

      setFile(null);
      await loadVerification();
    } catch (requestError) {
      setError(requestError.message || "Unable to upload the document");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const endpoint =
        verification.verificationStatus === "rejected"
          ? "/guide-verification/resubmit"
          : "/guide-verification/submit";
      const response = await apiRequest(endpoint, { method: "POST" });
      syncProfileStatus(response.data.verificationStatus);
      await loadVerification();
    } catch (requestError) {
      setError(requestError.message || "Unable to submit the application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.stateCard}>Loading verification details…</div>;
  }

  const status = verification?.verificationStatus || "draft";
  const canEditDocuments = ["draft", "rejected"].includes(status);

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Guide onboarding</p>
        <h1>Document verification</h1>
        <p>
          Upload a clear identity document and follow any changes requested by
          the review team.
        </p>
      </header>

      <section className={styles.statusCard} data-status={status}>
        <span>Current status</span>
        <strong>{status.replace("_", " ")}</strong>
        {verification?.rejectionReason && (
          <p>{verification.rejectionReason}</p>
        )}
      </section>

      {verification?.requestedChanges?.length > 0 && (
        <section className={styles.card}>
          <h2>Requested changes</h2>
          <ul>
            {verification.requestedChanges.map((change) => (
              <li key={change.id}>
                <strong>{DOCUMENT_LABELS[change.documentType]}</strong>
                <span>{change.message}</span>
                <small>{change.resolvedAt ? "Updated" : "Action needed"}</small>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.card}>
        <h2>Your documents</h2>
        {verification?.documents?.length > 0 ? (
          <ul>
            {verification.documents.map((document) => (
              <li key={document.id}>
                <strong>{DOCUMENT_LABELS[document.documentType]}</strong>
                <span>{document.originalName}</span>
                <small>
                  Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No verification documents uploaded yet.</p>
        )}
      </section>

      {canEditDocuments && (
        <section className={styles.card}>
          <h2>{status === "rejected" ? "Replace a document" : "Add a document"}</h2>
          <div className={styles.uploadGrid}>
            <select
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
            >
              <option value="national_id">National ID</option>
              <option value="passport">Passport</option>
              <option value="guide_license">Guide license</option>
            </select>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <button type="button" onClick={handleUpload} disabled={submitting}>
              {submitting ? "Uploading…" : "Upload document"}
            </button>
          </div>
        </section>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {canEditDocuments && (
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={submitting || verification?.documents?.length === 0}
        >
          {status === "rejected" ? "Resubmit for review" : "Submit for review"}
        </button>
      )}
    </main>
  );
}

