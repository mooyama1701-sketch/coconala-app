import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateConcept, generateAccountConcept, generateProfileCatchphrase, generateNameSuggestions, generateSelfIntroduction, generateProfileMainText } from './lib/gemini';
import ErrorBoundary from './components/ErrorBoundary';
import ConceptDisplay from './components/ConceptDisplay';
import ProfileGenerator from './components/ProfileGenerator';
import SelfIntroGenerator from './components/SelfIntroGenerator';
import ServiceContentGenerator from './components/ServiceContentGenerator';
import ReportExport from './components/ReportExport';
import TokenUsageDisplay from './components/TokenUsageDisplay';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConcept, setLoadingConcept] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingSelfIntro, setLoadingSelfIntro] = useState(false);
  const [loadingProfileMainText, setLoadingProfileMainText] = useState(false);

  const [result, setResult] = useState(null);
  const [conceptResult, setConceptResult] = useState(null);
  const [profileResult, setProfileResult] = useState(null);
  const [introResult, setIntroResult] = useState(null);
  const [profileMainTextResult, setProfileMainTextResult] = useState(null);
  const [showKeyInput, setShowKeyInput] = useState(false);

  // トークン使用量
  const [tokenUsage, setTokenUsage] = useState({ input: 0, output: 0 });

  // レポート用保存データ
  const [savedStep1, setSavedStep1] = useState([]);
  const [savedStep2, setSavedStep2] = useState([]);

  // 生成時の入力内容を保持
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentTarget, setCurrentTarget] = useState('');

  // STEP6: サービス内容
  const [serviceContent, setServiceContent] = useState('');
  const [serviceDetail, setServiceDetail] = useState('');
  const [referenceProfile, setReferenceProfile] = useState('');
  const [useCinderellaStory, setUseCinderellaStory] = useState(false);

  // ProfileGeneratorからLiftしたState
  const [sellerName, setSellerName] = useState('');
  const [selectedCatchphrase, setSelectedCatchphrase] = useState(null);
  const [careerSkills, setCareerSkills] = useState('');
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

  const updateTokenUsage = (usage) => {
    if (usage) {
      setTokenUsage(prev => ({
        input: prev.input + (usage.promptTokenCount || 0),
        output: prev.output + (usage.candidatesTokenCount || 0)
      }));
    }
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
      const { value, usage } = await generateConcept(apiKey, topic, target);
      console.log("Generated JSON:", value);
      setResult(value);
      updateTokenUsage(usage);
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
      const { value, usage } = await generateAccountConcept(
        apiKey,
        currentTopic,
        currentTarget,
        selectedStep1,
        selectedStep2
      );
      setConceptResult(value);
      setSavedStep1(selectedStep1);
      setSavedStep2(selectedStep2);
      updateTokenUsage(usage);
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
    setSavedCareerSkills(skills);

    try {
      const { value, usage } = await generateProfileCatchphrase(
        apiKey,
        conceptResult,
        skills
      );
      setProfileResult(value);
      updateTokenUsage(usage);
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
      const { value, usage } = await generateNameSuggestions(apiKey, conceptResult);
      if (usage) updateTokenUsage(usage);
      return value.names || [];
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
      const { value, usage } = await generateSelfIntroduction(
        apiKey,
        conceptResult,
        savedCareerSkills,
        sellerName,
        selectedCatchphrase
      );
      setIntroResult(value);
      updateTokenUsage(usage);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingSelfIntro(false);
    }
  };

  const handleGenerateProfileMainText = async () => {
    if (!apiKey) {
      alert('APIキーを設定してください。');
      return;
    }
    if (!serviceContent || !serviceDetail) {
      alert('サービス内容と詳しい自己紹介を入力してください。');
      return;
    }

    setLoadingProfileMainText(true);
    setProfileMainTextResult(null);

    try {
      const { value, usage } = await generateProfileMainText(
        apiKey,
        conceptResult,
        selectedCatchphrase,
        introResult,
        serviceContent,
        serviceDetail,
        referenceProfile,
        useCinderellaStory
      );
      setProfileMainTextResult(value);
      updateTokenUsage(usage);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoadingProfileMainText(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <TokenUsageDisplay tokenUsage={tokenUsage} />

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
          <h1>ココナラ・プロフィール作成</h1>
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
          onCatchphraseChange={setSelectedCatchphrase}
          sellerName={sellerName}
        />

        <ServiceContentGenerator
          serviceContent={serviceContent}
          onServiceContentChange={setServiceContent}
          serviceDetail={serviceDetail}
          onServiceDetailChange={setServiceDetail}
          referenceProfile={referenceProfile}
          onReferenceProfileChange={setReferenceProfile}
          introResult={introResult}
          onGenerateProfileMainText={handleGenerateProfileMainText}
          loadingProfileMainText={loadingProfileMainText}
          profileMainTextResult={profileMainTextResult}
          useCinderellaStory={useCinderellaStory}
          onUseCinderellaStoryChange={setUseCinderellaStory}
        />

        <ReportExport
          topic={currentTopic}
          target={currentTarget}
          step1Items={savedStep1}
          step2Items={savedStep2}
          conceptResult={conceptResult}
          careerSkills={savedCareerSkills}
          selectedCatchphrase={selectedCatchphrase}
          sellerName={sellerName}
          introResult={introResult}
          serviceContent={serviceContent}
          serviceDetail={serviceDetail}
          referenceProfile={referenceProfile}
          profileMainTextResult={profileMainTextResult}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
