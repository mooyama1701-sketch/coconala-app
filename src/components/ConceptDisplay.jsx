import React from 'react';

const ConceptDisplay = ({ concept }) => {
    if (!concept) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(concept);
        alert('コンセプトをクリップボードにコピーしました！');
    };

    return (
        <div className="card result-section" style={{ marginTop: '2rem', borderColor: 'var(--secondary)' }}>
            <div style={{ padding: '2rem', background: 'rgba(171, 71, 188, 0.05)' }}>
                <h2 style={{ color: 'var(--secondary)' }}>STEP3: アカウントコンセプト</h2>
                <div className="result-area">
                    {concept}
                </div>
            </div>
            <button className="copy-btn" onClick={handleCopy}>
                コンセプトをコピーする
            </button>
        </div>
    );
};

export default ConceptDisplay;
