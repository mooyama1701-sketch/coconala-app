import React from 'react';

const ReportExport = ({
    topic,
    target,
    conceptResult,
    selectedCatchphrase,
    sellerName,
    introResult,
    serviceContent,
    serviceDetail,
    profileMainTextResult
}) => {
    const generateReportText = () => {
        const timestamp = new Date().toLocaleString();
        return `
■ココナラ・プロフィール生成レポート
日時: ${timestamp}

【STEP1 & 2: 基礎情報】
・発信内容: ${topic}
・ターゲット: ${target}

【STEP3: コンセプト】
${conceptResult || '（未生成）'}

【STEP4: キャッチコピー・名前】
・出品者名: ${sellerName || '（未入力）'}
・採用したキャッチコピー:
${selectedCatchphrase || '（未選択）'}

【STEP5: 自己紹介文（冒頭）】
${introResult || '（未生成）'}

【STEP6: サービス詳細】
・サービス内容:
${serviceContent || '（未入力）'}
・詳しい自己紹介（バックグラウンド）:
${serviceDetail || '（未入力）'}

【STEP7: プロフィール本文】
${profileMainTextResult || '（未生成）'}
    `.trim();
    };

    const handleCopy = () => {
        const text = generateReportText();
        navigator.clipboard.writeText(text).then(() => {
            alert('レポートをコピーしました。Googleドキュメントなどに貼り付けてください。');
        });
    };

    const handleDownload = () => {
        const text = generateReportText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coconala_profile_report_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!profileMainTextResult) {
        return null;
    }

    return (
        <div className="card report-section" style={{ marginTop: '3rem', borderColor: '#4caf50', background: 'rgba(76, 175, 80, 0.05)' }}>
            <h2 style={{ color: '#4caf50', marginBottom: '1rem' }}>STEP8: レポートの出力</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                ここまでの入力内容と生成結果をひとつにまとめました。<br />
                Googleドキュメント等に保存するためにコピーするか、テキストファイルとしてダウンロードしてください。
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={handleCopy}
                    className="action-btn"
                    style={{
                        flex: 1,
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        fontSize: '1rem'
                    }}
                >
                    📋 レポートをコピー
                </button>
                <button
                    onClick={handleDownload}
                    className="action-btn"
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: '2px solid #4caf50',
                        color: '#4caf50',
                        fontSize: '1rem'
                    }}
                >
                    💾 テキストで保存
                </button>
            </div>
        </div>
    );
};

export default ReportExport;
