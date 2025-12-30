import React from 'react';

const ServiceContentGenerator = ({
    serviceContent,
    onServiceContentChange,
    serviceDetail,
    onServiceDetailChange,
    introResult
}) => {

    if (!introResult) return null;

    return (
        <div className="card result-section" style={{ marginTop: '2rem', borderColor: 'var(--accent)' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>STEP6: サービス内容の設定</h2>

            {/* 1. サービス内容 */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    1. あなたが提供するサービスの内容を入力してください。
                </label>
                <textarea
                    value={serviceContent}
                    onChange={(e) => onServiceContentChange(e.target.value)}
                    placeholder="例：AIを活用してコンテンツを制作して、収入を得るスキルを教える。"
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        boxSizing: 'border-box',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '100%',
                        resize: 'vertical'
                    }}
                />
            </div>

            {/* 2. 詳しい自己紹介 */}
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    2. 詳しい自己紹介を入力してください。
                </label>
                <textarea
                    value={serviceDetail}
                    onChange={(e) => onServiceDetailChange(e.target.value)}
                    placeholder="例：教師経験30年のキャリアを活かして、初心者の方にもわかりやすく生成AIの使い方を教えます。"
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-color)',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        boxSizing: 'border-box',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '100%',
                        resize: 'vertical'
                    }}
                />
            </div>
        </div>
    );
};

export default ServiceContentGenerator;
