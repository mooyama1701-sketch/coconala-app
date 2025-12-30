import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateConcept, generateAccountConcept, generateProfileCatchphrase, generateNameSuggestions, generateSelfIntroduction } from './lib/gemini';
import ErrorBoundary from './components/ErrorBoundary';
import ConceptDisplay from './components/ConceptDisplay';
import ProfileGenerator from './components/ProfileGenerator';
import SelfIntroGenerator from './components/SelfIntroGenerator';
import ServiceContentGenerator from './components/ServiceContentGenerator';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConcept, setLoadingConcept] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingSelfIntro, setLoadingSelfIntro] = useState(false);

  const [result, setResult] = useState(null);
  const [conceptResult, setConceptResult] = useState(null);
  const [profileResult, setProfileResult] = useState(null);
  const [introResult, setIntroResult] = useState(null); // 自己紹介文結果
  const [showKeyInput, setShowKeyInput] = useState(false);

  // 生成時の入力内容を保持
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentTarget, setCurrentTarget] = useState('');

  // STEP6: サービス内容
  const [serviceContent, setServiceContent] = useState('');

  // ProfileGeneratorからLiftしたState
  const [sellerName, setSellerName] = useState('');
  const [selectedCatchphrase, setSelectedCatchphrase] = useState(null);
  const [careerSkills, setCareerSkills] = useState(''); // Memo: careerSkillsはProfileGenerator内で管理していたが、自己紹介文生成に必要なためここでも持つか、ProfileGeneratorから受け取る必要がある。
  // 今回はProfileGeneratorのonGenerateProfileで受け取った値を保持しておくのが自然。
  const [savedCareerSkills, setSavedCareerSkills] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleGenerate = async (topic, target) => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setConceptResult(null);
    setProfileResult(null);
    setIntroResult(null);
    setCurrentTopic(topic);
    setCurrentTarget(target);

    try {
      const generatedText = await generateConcept(apiKey, topic, target);
      console.log("Generated JSON:", generatedText);
      setResult(generatedText);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateConcept = async (selectedStep1, selectedStep2) => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return;
    }

    setLoadingConcept(true);
    setConceptResult(null);
    setProfileResult(null);
    setIntroResult(null);

    try {
      const concept = await generateAccountConcept(
        apiKey,
        currentTopic,
        currentTarget,
        selectedStep1,
        selectedStep2
      );
      setConceptResult(concept);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingConcept(false);
    }
  };

  const handleGenerateProfile = async (skills, name) => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return;
    }

    setLoadingProfile(true);
    setProfileResult(null);
    setIntroResult(null);
    setSavedCareerSkills(skills); // 後で自己紹介文生成に使うために保存

    try {
      const profile = await generateProfileCatchphrase(
        apiKey,
        conceptResult,
        skills
      );
      setProfileResult(profile);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleGenerateNames = async () => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return [];
    }
    setLoadingNames(true);
    try {
      const result = await generateNameSuggestions(apiKey, conceptResult);
      return result.names || [];
    } catch (error) {
      console.error(error);
      alert(error.message);
      return [];
    } finally {
      setLoadingNames(false);
    }
  };

  const handleGenerateSelfIntro = async () => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return;
    }
    if (!selectedCatchphrase) {
      alert('キャッチコピーを選択してください。');
      return;
    }

    setLoadingSelfIntro(true);
    setIntroResult(null);

    try {
      const intro = await generateSelfIntroduction(
        apiKey,
        conceptResult,
        savedCareerSkills, // 保存しておいた経歴データを使用
        sellerName,
        selectedCatchphrase
      );
      setIntroResult(intro);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingSelfIntro(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <div className="api-key-section">
          <button
            className="copy-btn"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            {showKeyInput ? '設定を閉じる' : 'API設定'}
          </button>
        </div>

        {showKeyInput && (
          <div className="card" style={{ padding: '1rem', marginTop: 0 }}>
            <label style={{ marginBottom: '0.5rem' }}>Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Gemini API Key"
              style={{ marginBottom: 0 }}
            />
            <p style={{ fontSize: '0.8rem', color: '#b0bec5', marginTop: '0.5rem' }}>
              ※キーはブラウザに保存されます。
            </p>
          </div>
        )}

        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Coconala Architect</h1>
          <p className="subtitle">
            ターゲットの悩みを深掘りし、理想の未来を描くアカウント設計ガイド
          </p>
        </header>

        <InputForm onSubmit={handleGenerate} loading={loading} />

        <ResultDisplay
          result={result}
          onGenerateConcept={handleGenerateConcept}
          loadingConcept={loadingConcept}
        />

        <ConceptDisplay concept={conceptResult} />

        <ProfileGenerator
          concept={conceptResult}
          onGenerateProfile={handleGenerateProfile}
          loadingProfile={loadingProfile}
          profileResult={profileResult}
          onGenerateNames={handleGenerateNames}
          loadingNames={loadingNames}
          // Props for state lifting
          sellerName={sellerName}
          onSellerNameChange={setSellerName}
          selectedCatchphrase={selectedCatchphrase}
          onSelectCatchphrase={setSelectedCatchphrase}
        />

        <SelfIntroGenerator
          onGenerate={handleGenerateSelfIntro}
          loading={loadingSelfIntro}
          introResult={introResult}
          selectedCatchphrase={selectedCatchphrase}
          sellerName={sellerName}
        />

        <ServiceContentGenerator
          serviceContent={serviceContent}
          onServiceContentChange={setServiceContent}
          introResult={introResult}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
