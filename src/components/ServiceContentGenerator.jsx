import React from 'react';

const ServiceContentGenerator = ({
    serviceContent,
    onServiceContentChange,
    serviceDetail,
    onServiceDetailChange,
    referenceProfile,
    onReferenceProfileChange,
    introResult,
    onGenerateProfileMainText,
    loadingProfileMainText,
    profileMainTextResult,
    useCinderellaStory,
    onUseCinderellaStoryChange
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

            {/* 3. 参考にしたいプロフィール文 */}
            <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    3. あなたが参考にしたいプロフィール文
                </label>
                <textarea
                    value={referenceProfile}
                    onChange={(e) => onReferenceProfileChange(e.target.value)}
                    placeholder="参考にしたい既存のプロフィール文があれば入力してください。"
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

            {/* シンデレラストーリーオプション */}
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    id="cinderellaStory"
                    checked={useCinderellaStory}
                    onChange={(e) => onUseCinderellaStoryChange(e.target.checked)}
                    style={{ marginRight: '0.5rem', transform: 'scale(1.2)' }}
                />
                <label htmlFor="cinderellaStory" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    シンデレラストーリー（不遇な過去からの逆転）を含める
                </label>
            </div>

            <button
                onClick={onGenerateProfileMainText}
                disabled={loadingProfileMainText || !serviceContent || !serviceDetail}
                className="action-btn"
                style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (loadingProfileMainText || !serviceContent || !serviceDetail) ? 'not-allowed' : 'pointer',
                    opacity: (loadingProfileMainText || !serviceContent || !serviceDetail) ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                }}
            >
                {loadingProfileMainText ? 'プロフィール本文を生成中...' : 'STEP7: プロフィール本文を生成する'}
            </button>

            {profileMainTextResult && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>生成されたプロフィール本文</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        {profileMainTextResult}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(profileMainTextResult)}
                        className="copy-btn"
                    >
                        本文をコピー
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceContentGenerator;
