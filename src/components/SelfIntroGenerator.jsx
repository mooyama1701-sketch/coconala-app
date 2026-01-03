import React from 'react';

const SelfIntroGenerator = ({
    onGenerate,
    loading,
    introResult,
    selectedCatchphrase,
    onCatchphraseChange,
    sellerName
}) => {

    if (!selectedCatchphrase) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(introResult);
        alert('自己紹介文をクリップボードにコピーしました！');
    };

    return (
        <div className="card result-section" style={{ marginTop: '2rem', borderColor: 'var(--accent)' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>STEP5: 自己紹介文の作成（冒頭100文字）</h2>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0, 150, 255, 0.05)', borderRadius: '8px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>選択中のキャッチコピー (編集可能):</p>
                <textarea
                    value={selectedCatchphrase}
                    onChange={(e) => onCatchphraseChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                選択したキャッチコピー、名前 ({sellerName || '未入力'})、経歴・実績を元に、
                信頼と信用を感じさせる自己紹介文（冒頭100文字のみ）を生成します。
            </p>

            <button
                onClick={onGenerate}
                disabled={loading}
                style={{
                    background: 'var(--accent)',
                    filter: loading ? 'brightness(0.7)' : 'none',
                    marginBottom: '1.5rem',
                    width: '100%'
                }}
            >
                {loading ? (
                    <><span className="spinner"></span> 自己紹介文生成中...</>
                ) : (
                    '自己紹介文を生成する'
                )}
            </button>

            {introResult && (
                <div style={{ position: 'relative' }}>
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6'
                    }}>
                        {introResult}
                    </div>
                    <button
                        className="copy-btn"
                        onClick={handleCopy}
                        style={{ marginTop: '1rem' }}
                    >
                        自己紹介文をコピー
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelfIntroGenerator;
