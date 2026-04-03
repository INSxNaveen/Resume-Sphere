import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', height: '100vh', zIndex: 9999, position: 'relative' }}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Something went wrong.</h1>
          <p style={{fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginTop: '10px'}}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{fontSize: '12px', marginTop: '20px', whiteSpace: 'pre-wrap'}}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
