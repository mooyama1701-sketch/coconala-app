import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: '#ff5252' }}>
                    <h2 style={{ color: '#ff5252' }}>問題が発生しました</h2>
                    <p>表示中にエラーが発生しました。</p>
                    <pre style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '1rem', overflow: 'auto' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '1rem', width: 'auto' }}
                    >
                        ページを再読み込み
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
