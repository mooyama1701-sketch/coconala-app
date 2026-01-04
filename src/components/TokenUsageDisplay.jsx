import React from 'react';

const TokenUsageDisplay = ({ tokenUsage }) => {
    // 概算費用（Gemini 3 Flash Preview）
    // Input: $0.50 / 1M tokens
    // Output: $3.00 / 1M tokens
    // $1 = 150円換算
    const INPUT_PRICE_PER_TOKEN_JPY = (0.50 / 1000000) * 150;
    const OUTPUT_PRICE_PER_TOKEN_JPY = (3.00 / 1000000) * 150;

    const estimatedCost = (
        (tokenUsage.input * INPUT_PRICE_PER_TOKEN_JPY) +
        (tokenUsage.output * OUTPUT_PRICE_PER_TOKEN_JPY)
    );

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(33, 33, 33, 0.95)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px', marginBottom: '4px' }}>
                💎 Gemini API Usage
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span>Input:</span>
                <span style={{ fontFamily: 'monospace' }}>{tokenUsage.input.toLocaleString()} toks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span>Output:</span>
                <span style={{ fontFamily: 'monospace' }}>{tokenUsage.output.toLocaleString()} toks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#4caf50', fontWeight: 'bold', marginTop: '4px' }}>
                <span>Est. Cost:</span>
                {/* 小数点以下3桁まで表示（非常に安価なため） */}
                <span>¥{estimatedCost.toFixed(3)}</span>
            </div>
        </div>
    );
};

export default TokenUsageDisplay;
