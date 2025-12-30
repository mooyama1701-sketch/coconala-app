import React, { useState } from 'react';

const InputForm = ({ onSubmit, loading }) => {
    const [contentTopic, setContentTopic] = useState('');
    const [targetAudience, setTargetAudience] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (contentTopic.trim() && targetAudience.trim()) {
            onSubmit(contentTopic, targetAudience);
        }
    };

    return (
        <form className="card" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="contentTopic">発信内容 (例: AIを活用して自分の得意や経験を商品化する)</label>
                <input
                    id="contentTopic"
                    type="text"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="AIを活用して自分の得意や経験を商品化する"
                    required
                />
            </div>

            <div>
                <label htmlFor="targetAudience">ターゲット (例: 50代のAIを活用して豊かたなセカンドキャリアを構築したいと考えている人)</label>
                <input
                    id="targetAudience"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="50代のAIを活用して豊かなセカンドキャリアを構築したいと考えている人"
                    required
                />
            </div>

            <button type="submit" disabled={loading || !contentTopic || !targetAudience}>
                {loading ? (
                    <>
                        <span className="spinner"></span> 生成中... AIが分析しています
                    </>
                ) : (
                    'アカウント設計ガイドを生成する'
                )}
            </button>
        </form>
    );
};

export default InputForm;
