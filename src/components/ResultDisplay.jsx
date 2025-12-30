import React, { useState } from 'react';

const ResultDisplay = ({ result, onGenerateConcept, loadingConcept }) => {
    const [selectedStep1, setSelectedStep1] = useState(null);
    const [selectedStep2, setSelectedStep2] = useState(null);

    // resultが変わったら選択状態をリセット
    React.useEffect(() => {
        setSelectedStep1(null);
        setSelectedStep2(null);
    }, [result]);

    if (!result) return null;

    // 安全にデータにアクセスするためのチェック
    const step1 = result.step1 || { title: "STEP1（抽出中...）", subtitle: "", items: [] };
    const step2 = result.step2 || { title: "STEP2（抽出中...）", subtitle: "", items: [] };

    // itemsが配列でない場合のフォールバック
    const items1 = Array.isArray(step1.items) ? step1.items : [];
    const items2 = Array.isArray(step2.items) ? step2.items : [];

    const handleGenerateClick = () => {
        if (!selectedStep1 || !selectedStep2) {
            alert("STEP1とSTEP2からそれぞれ1つ選択してください。");
            return;
        }
        onGenerateConcept(selectedStep1, selectedStep2);
    };

    const formatForCopy = () => {
        let text = `${step1.title || ''} | ${step2.title || ''}\n`;
        text += `${step1.subtitle || ''} | ${step2.subtitle || ''}\n`;
        text += `--------------------------------------------------\n`;

        const maxItems = Math.max(items1.length, items2.length);
        for (let i = 0; i < maxItems; i++) {
            const item1 = items1[i] || "";
            const item2 = items2[i] || "";
            text += `${i + 1}. ${item1} | ${i + 1}. ${item2}\n`;
        }
        return text;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formatForCopy());
        alert('クリップボードにコピーしました！');
    };

    return (
        <div className="card result-section">
            <div className="result-grid">
                <div className="result-column">
                    <h2 className="step-title">{step1.title}
                        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                            {selectedStep1 ? '(選択済み)' : '(1つ選択)'}
                        </span>
                    </h2>
                    <p className="step-subtitle">{step1.subtitle}</p>
                    <ul className="result-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {items1.map((item, index) => (
                            <li key={`s1-${index}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <input
                                    type="radio"
                                    name="step1-group"
                                    id={`s1-${index}`}
                                    checked={selectedStep1 === item}
                                    onChange={() => setSelectedStep1(item)}
                                    style={{ marginTop: '0.3rem' }}
                                />
                                <label htmlFor={`s1-${index}`} style={{ cursor: 'pointer', lineHeight: '1.5', color: 'inherit' }}>
                                    {item}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="result-column">
                    <h2 className="step-title">{step2.title}
                        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                            {selectedStep2 ? '(選択済み)' : '(1つ選択)'}
                        </span>
                    </h2>
                    <p className="step-subtitle">{step2.subtitle}</p>
                    <ul className="result-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {items2.map((item, index) => (
                            <li key={`s2-${index}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <input
                                    type="radio"
                                    name="step2-group"
                                    id={`s2-${index}`}
                                    checked={selectedStep2 === item}
                                    onChange={() => setSelectedStep2(item)}
                                    style={{ marginTop: '0.3rem' }}
                                />
                                <label htmlFor={`s2-${index}`} style={{ cursor: 'pointer', lineHeight: '1.5', color: 'inherit' }}>
                                    {item}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    onClick={handleGenerateClick}
                    disabled={loadingConcept || !selectedStep1 || !selectedStep2}
                    style={{ background: 'var(--secondary)', filter: 'brightness(0.9)' }}
                >
                    {loadingConcept ? (
                        <><span className="spinner"></span> コンセプト生成中...</>
                    ) : (
                        '選択した項目でコンセプトを生成する'
                    )}
                </button>

                <button className="copy-btn" onClick={handleCopy} style={{ border: 'none', padding: '0.5rem', fontSize: '0.9rem' }}>
                    一覧をコピーする (比較形式)
                </button>
            </div>
        </div>
    );
};

export default ResultDisplay;
