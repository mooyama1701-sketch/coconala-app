import React, { useState } from 'react';

const ProfileGenerator = ({
    concept,
    onGenerateProfile,
    loadingProfile,
    profileResult,
    onGenerateNames,
    loadingNames,
    sellerName,
    onSellerNameChange,
    selectedCatchphrase,
    onSelectCatchphrase
}) => {
    // 経歴・スキルは入力中はこのコンポーネントだけで管理し、生成時に親に渡す形でもOKだが、
    // ここでは他の入力と同様にローカルで持ち、生成アクションで親に渡す既存実装を維持する。
    const [careerSkills, setCareerSkills] = useState('');

    // sellerNameとselectedCatchphraseは親から受け取るpropsを使用するため、ここでのuseStateは削除

    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [isNameSuggestionsVisible, setIsNameSuggestionsVisible] = useState(false);

    if (!concept) return null;

    const handleGenerateClick = () => {
        if (!careerSkills.trim()) {
            alert("経歴・実績・スキルを入力してください。");
            return;
        }
        onGenerateProfile(careerSkills, sellerName);
    };

    const handleGenerateNamesClick = async () => {
        const names = await onGenerateNames();
        if (names && names.length > 0) {
            setNameSuggestions(names);
            setIsNameSuggestionsVisible(true);
        }
    };

    const handleSelectName = (name) => {
        onSellerNameChange(name); // 親のState更新
        setIsNameSuggestionsVisible(false);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('クリップボードにコピーしました！');
    };

    // 結果がオブジェクト（配列）か文字列かで処理を分ける
    const catchphrases = profileResult?.catchphrases || (typeof profileResult === 'string' ? [profileResult] : []);

    return (
        <div className="card result-section" style={{ marginTop: '2rem', borderColor: 'var(--accent)' }}>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>STEP4: プロフィール作成</h2>

            {/* 出品者名入力セクション */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="sellerName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    出品者名（20文字以内）
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        id="sellerName"
                        value={sellerName} // Propsから
                        onChange={(e) => onSellerNameChange(e.target.value)} // Propsのハンドラ
                        placeholder="例：AI副業アドバイザー｜田中"
                        maxLength={20}
                        style={{ flex: 1, marginBottom: 0 }}
                    />
                    <button
                        onClick={handleGenerateNamesClick}
                        disabled={loadingNames}
                        style={{
                            background: 'var(--secondary)',
                            width: 'auto',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        {loadingNames ? '提案中...' : 'AIで提案'}
                    </button>
                </div>

                {/* 名前候補リスト */}
                {isNameSuggestionsVisible && nameSuggestions.length > 0 && (
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '1rem',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#b0bec5' }}>
                            クリックして選択してください：
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {nameSuggestions.map((name, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectName(name)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--accent)',
                                        color: 'var(--text-color)',
                                        borderRadius: '20px',
                                        padding: '0.3rem 0.8rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer'
                                    }}
                                    className="hover-effect"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="careerSkills" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    経歴・実績・スキル
                </label>
                <textarea
                    id="careerSkills"
                    value={careerSkills}
                    onChange={(e) => setCareerSkills(e.target.value)}
                    placeholder={`例：
・教師経験30年、不登校対策教員として教育相談活動に従事
・AI副業コミュニティを主催（参加者580名）
・AI活用セミナー200回開催し1000名に指導`}
                    rows={5}
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
                        maxWidth: '100%'
                    }}
                />
            </div>

            <button
                onClick={handleGenerateClick}
                disabled={loadingProfile || !careerSkills.trim()}
                style={{
                    background: 'var(--accent)',
                    filter: loadingProfile ? 'brightness(0.7)' : 'none',
                    marginBottom: '1.5rem',
                    width: '100%'
                }}
            >
                {loadingProfile ? (
                    <><span className="spinner"></span> プロフィール文生成中...</>
                ) : (
                    'プロフィール文を生成する（5案）'
                )}
            </button>

            {catchphrases.length > 0 && (
                <div style={{ padding: '1.5rem', background: 'rgba(0, 255, 170, 0.05)', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>✨</span> 生成されたキャッチコピー（5案）
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#b0bec5' }}>
                        気に入ったキャッチコピーを選択してください。
                    </p>

                    <div className="catchphrase-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {catchphrases.map((text, index) => (
                            <label
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: 'var(--card-bg)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedCatchphrase === text ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="catchphrase"
                                    value={text}
                                    checked={selectedCatchphrase === text} // Propsから
                                    onChange={() => onSelectCatchphrase(text)} // Propsのハンドラ
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                <div style={{
                                    background: 'var(--accent)',
                                    color: '#fff', // 文字色を白に変更
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1, fontWeight: '500' }}>
                                    {text}
                                </div>
                                <button
                                    className="copy-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCopy(text);
                                    }}
                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                >
                                    コピー
                                </button>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileGenerator;
