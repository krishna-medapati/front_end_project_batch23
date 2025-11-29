"use client"

import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>!</div>
            <h1 style={styles.errorTitle}>Something went wrong</h1>
            <p style={styles.errorMessage}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.errorDetails}>
                <summary style={styles.errorSummary}>Error Details (Development Only)</summary>
                <pre style={styles.errorStack}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={styles.buttonGroup}>
              <button onClick={this.handleReset} style={styles.retryButton}>
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={styles.homeButton}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#F5F5F5",
    fontFamily: "'Geist', sans-serif",
  },
  errorCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    color: "#F44336",
    fontWeight: "bold",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#FFEBEE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "12px",
  },
  errorMessage: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  errorDetails: {
    marginTop: "20px",
    textAlign: "left",
    backgroundColor: "#F5F5F5",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
  },
  errorSummary: {
    cursor: "pointer",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "10px",
  },
  errorStack: {
    fontSize: "12px",
    color: "#666",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  retryButton: {
    padding: "12px 24px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  homeButton: {
    padding: "12px 24px",
    backgroundColor: "white",
    color: "#6b7280",
    border: "1px solid #6b7280",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
}

export default ErrorBoundary

