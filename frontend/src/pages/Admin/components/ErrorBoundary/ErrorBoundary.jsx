import { Component } from "react";

// Keeps a crash in one admin page from blanking the whole portal.
export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin page crashed:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 8 }}>Something went wrong on this page.</h2>
          <p style={{ color: "#666", marginBottom: 16 }}>
            {this.state.error?.message || "Unexpected error."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
