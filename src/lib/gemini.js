import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT_TEMPLATE = `
#前提条件:
- タイトル: ココナラアカウント設計ガイド
- 依頼者条件: ココナラでのサービス提供を考えているが、効果的なアカウント設計に悩んでいる人。
- 制作者条件: ココナラのプラットフォームに精通し、魅力的なアカウントを構築するスキルを持つ人。
- 目的と目標: ココナラでのサービス販売を最大化するために、効果的なアカウント設計を行うこと。

#ユーザー入力情報:
発信内容＝{{content_topic}}
ターゲット＝{{target_audience}}

#行動指示
以下のSTEP1とSTEP2を実行し、ターゲットの深い悩みと理想の未来をJSON形式で出力してください。

## 出力形式（JSON）
必ず以下のJSONフォーマットのみを出力してください。Markdownのコードブロックは不要です。
{
  "step1": {
    "title": "STEP1：悩みの抽出",
    "subtitle": "{{content_topic}}前の状態",
    "items": [
      // 悩みを5つ記述
    ]
  },
  "step2": {
    "title": "STEP2：理想の未来の提示",
    "subtitle": "{{content_topic}}によって悩みを解決し、実現した後の状態",
    "items": [
      // 理想の未来（ベネフィット）を5つ記述
    ]
  }
}

## STEP1：悩みの抽出
「{{content_topic}}」といった情報発信をするアカウントにおいて、「{{target_audience}}」がその情報を見る前に抱えている悩みや問題を5つ書き出してください。

## STEP2：理想の未来の提示
「{{target_audience}}」が、「{{content_topic}}」といった情報を見て悩みを解決したときに、連れていくことができる理想の未来（ベネフィット）を5つ書き出してください。
`;

const CONCEPT_PROMPT_TEMPLATE = `
#行動指示
{{target_pain_points}}といった悩みや問題を抱えている{{target_audience}}を、{{ideal_future}}
といった理想の未来に連れていくための{{content_topic}}のアカウントのコンセプトを作成してください。

ターゲットが抱える悩みや問題＝ {{target_pain_points}}
理想の未来＝{{ideal_future}}

＃出力形式
以下のフォーマット通り、必ず**1文**でまとめて出力してください。鍵括弧「」や改行は不要です。

このアカウントは、{{target_audience}}の{{target_pain_points}}といった問題を{{content_topic}}で解決して{{ideal_future}}という未来に連れていくものである。
`;

const PROFILE_PROMPT_TEMPLATE = `
#前提条件:
- タイトル: ココナラプロフィールの作成
- 依頼者条件: プロフェッショナルなオンラインプロフィールを求めている個人
- 制作者条件: クリエイティブなライティングとマーケティングのスキルが必要
- 目的と目標: 魅力的で効果的なプロフィールを作成する

＃行動指示
{{concept}}を表現するために、
{{career_skills}}を活用し、
ガイドラインを基に
効果的でプロフェッショナルな
キャッチコピーを**5パターン**作成してください。

＃ガイドライン
- 出力は**JSON形式**で行ってください。
- 各キャッチコピーは「50文字以内」です。
- 「無料」「0円」などは使わないこと。
- **具体的なベネフィット（数値や具体的な変化）を必ず含めてください。**
- 「これは自分ためのサービスだ！」と思ってもらえるように、ターゲットの悩みに寄り添い、解決後の未来を提示してください。
- 5つのパターンは、切り口（数値強調、共感重視、権威性重視など）を少しずつ変えて提案してください。
- あなたのサービス提供している理念を全力で伝えます。
-「具体的に何をしてくれる人なのか？」これを伝えていきます。
-「キャッチコピーのいい例」
・成約率8割の販売に特化したLP書きます。
・Twitter運用歴3年、あなたのTwitterをビジネス特化に生まれ変わらせます。
・あなたのコンセプトにドンピシャのTwitterヘッダー画像を制作します。
・3ヶ月でカッコいい理想の体を作るパーソナルトレーニング指導します。
-「キャッチコピー悪い例」次のキャッチコピーは抽象的すぎて、購入する必要性を感じません。
・あなたの人生を最高に輝かせます
・理想の毎日へ導きます
・Twitter運用代行します

＃出力形式（JSON）
必ず以下のJSONフォーマットのみを出力してください。Markdownのコードブロックは不要です。
{
  "catchphrases": [
    "キャッチコピー案1",
    "キャッチコピー案2",
    "キャッチコピー案3",
    "キャッチコピー案4",
    "キャッチコピー案5"
  ]
}

＃入力情報
コンセプト＝{{concept}}
経歴・実績・スキル＝{{career_skills}}
`;

export const generateConcept = async (apiKey, contentTopic, targetAudience) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // JSON mode is recommended for structured output
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" }
  });

  // Use a function for replacement to avoid special character issues
  const prompt = PROMPT_TEMPLATE
    .replace(/{{content_topic}}/g, () => contentTopic)
    .replace(/{{target_audience}}/g, () => targetAudience);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error(`生成に失敗しました: ${error.message}`);
  }
};

export const generateAccountConcept = async (apiKey, contentTopic, targetAudience, selectedPainPoints, selectedIdealFuture) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  // Use a function for replacement to avoid special character issues (like $)
  const prompt = CONCEPT_PROMPT_TEMPLATE
    .replace(/{{content_topic}}/g, () => contentTopic)
    .replace(/{{target_audience}}/g, () => targetAudience)
    .replace(/{{target_pain_points}}/g, () => selectedPainPoints)
    .replace(/{{ideal_future}}/g, () => selectedIdealFuture);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Concept Generation Error:", error);
    throw new Error(`コンセプト生成に失敗しました: ${error.message}`);
  }
};

export const generateProfileCatchphrase = async (apiKey, concept, careerSkills) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using JSON mode
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = PROFILE_PROMPT_TEMPLATE
    .replace(/{{concept}}/g, () => concept)
    .replace(/{{career_skills}}/g, () => careerSkills);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Profile Generation Error:", error);
    throw new Error(`プロフィール生成に失敗しました: ${error.message}`);
  }
};

const NAME_PROMPT_TEMPLATE = `
#前提条件:
- 役割: ココナラで活動する出品者の名前を考案する
- コンセプト: {{concept}}
- ターゲット: このコンセプトに響く顧客層

#行動指示:
上記のコンセプトに基づき、ターゲットに信頼感や親しみやすさを与える「出品者名」のアイデアを**5つ**提案してください。
名前は変更可能であることを前提に、幅広く提案してください。

#ガイドライン:
- 日本語で20文字以内。
- 覚えやすく、コンセプト（専門性や人柄）が伝わるもの。
- 奇抜すぎるものは避け、プロフェッショナル感と親しみやすさのバランスをとる。
- 出力は**JSON形式**のみ。

#出力形式（JSON）:
{
  "names": [
    "名前案1",
    "名前案2",
    "名前案3",
    "名前案4",
    "名前案5"
  ]
}
`;

export const generateNameSuggestions = async (apiKey, concept) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = NAME_PROMPT_TEMPLATE.replace(/{{concept}}/g, () => concept);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Name Generation Error:", error);
    throw new Error(`名前の提案に失敗しました: ${error.message}`);
  }
};

const SELF_INTRO_PROMPT_TEMPLATE = `
#行動指示
ユーザーが入力した情報を織り交ぜ、
STEP3で出力された「アカウントコンセプト」を明確にしつつ、
ユーザが選択したキャッチコピーに一致している魅力を引きつける表現での
ユーザが入力した名前のプロフィール（自己紹介文）を、ガイドラインを基に
**冒頭の100文字のみ**を作成してください。
この100文字は、プロフィールページの最初に表示される最も重要な部分です。**必ず100文字以内に収まるように**、見た人に「信頼」と「信用」を感じてもらえる要素だけを厳選して凝縮してください。

#入力情報
- アカウントコンセプト: {{concept}}
- 経歴・実績・スキル: {{career_skills}}
- 出品者名: {{seller_name}}
- 選択したキャッチコピー: {{catchphrase}}

#ガイドライン
- **出力文字数**: **絶対に100文字を超えないこと（80〜100文字）**
- **禁止事項**: 文末に「（98文字）」のような文字数表記やカウントは絶対に含めないでください。純粋なテキストのみを出力してください。
- **構成**:
  1. 挨拶と名乗り
  2. 誰に向けた何の専門家か
  3. 実績や権威性
  4. 提供できる価値
- 上記全ての要素を入れると長くなる場合は、最も重要な要素（実績や価値）を優先し、言葉を削ぎ落として短くしてください。
- 「〜させていただきます」「〜と考えております」のような冗長な表現は避け、「〜します」「〜です」と言い切ってください。
- 不要な修飾語は削除し、密度を高くしてください。

#参考フォーマット
はじめまして、{{seller_name}}です。{{誰に}}の{{何を}}専門に支援しています。{{実績}}を活かし、{{ベネフィット}}を実現します。{{締めの言葉}}
`;

export const generateSelfIntroduction = async (apiKey, concept, careerSkills, sellerName, catchphrase) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = SELF_INTRO_PROMPT_TEMPLATE
    .replace(/{{concept}}/g, () => concept)
    .replace(/{{career_skills}}/g, () => careerSkills)
    .replace(/{{seller_name}}/g, () => sellerName)
    .replace(/{{catchphrase}}/g, () => catchphrase);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Self Intro Generation Error:", error);
    throw new Error(`自己紹介文の生成に失敗しました: ${error.message}`);
  }
};

const PROFILE_MAIN_TEXT_PROMPT_TEMPLATE = `
#行動指示
{{catchphrase}}と{{intro_text}}に続く
プロフィールの本文を、
初めての訪問者にも強い印象を残せるように、
{{concept}}というアカウントコンセプトに沿って、
{{service_content}}と{{service_detail}}で
専門性や実績、親密感や共感を得られるように、
{{reference_profile}}に倣って、
ガイドラインに従って
魅力的なプロフィール本文を作成してください。

#ガイドライン
「信頼・信用」のために
・具体的なサービス内容
・サービスの流れ
・サービス提供している想い
・今までの行動実績や積み上げてきた努力
・サービスに関係した経歴
・サービスに関係した実績
「親近感・共感」のために
・趣味や出身地（※入力情報に含まれている場合のみ記述すること。捏造しないこと）
・家族のこと（※入力情報に含まれている場合のみ記述すること。捏造しないこと）
・自分のプライベート（※入力情報に含まれている場合のみ記述すること。捏造しないこと）

以上の点を気にしながら、プロフィール本文は**1000文字程度**にまとめてください。
【重要】冒頭の自己紹介文（100文字）と合わせて合計1300文字以内にする必要があるため、この出力（本文）は**最大でも1100文字**で止めてください。絶対に1200文字を超えてはいけません。
【重要】入力情報に存在しない、妻、子供、ペット、特定の趣味などの詳細な個人情報は絶対に創作して書かないでください。入力情報にある事実のみを使って膨らませてください。
【重要】出力に「###」「**」などのマークダウン記号は絶対に使用しないでください。プレーンテキストのみで出力してください。見出しを使いたい場合は、記号を使わずに行を変えるか、隅付き括弧【】などを使ってください。
【重要】**出力には「プロフィールの冒頭文（STEP5の結果）」を含めず、その続きから書いてください。** システム側で冒頭文を結合しますので、重複しないようにしてください。

#入力情報
コンセプト＝”
{{concept}}
”
キャッチコピー＝”
{{catchphrase}}
”
プロフィールの冒頭文＝”
{{intro_text}}
”
詳しいサービス内容＝”
{{service_content}}
”
詳しい自己紹介＝”
{{service_detail}}
”
参考にしたいプロフィール文＝”
{{reference_profile}}
”
`;

export const generateProfileMainText = async (apiKey, concept, catchphrase, introText, serviceContent, serviceDetail, referenceProfile, useCinderellaStory) => {
  if (!apiKey) {
    throw new Error("APIキーが設定されていません。");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  let prompt = PROFILE_MAIN_TEXT_PROMPT_TEMPLATE
    .replace(/{{concept}}/g, () => concept)
    .replace(/{{catchphrase}}/g, () => catchphrase)
    .replace(/{{intro_text}}/g, () => introText)
    .replace(/{{service_content}}/g, () => serviceContent)
    .replace(/{{service_detail}}/g, () => serviceDetail)
    .replace(/{{reference_profile}}/g, () => referenceProfile);

  if (useCinderellaStory) {
    prompt += `
\n#追加指示: シンデレラストーリーの要素を含める
プロフィール本文の中に、「マイナス（不遇・失敗・苦悩）からプラス（成功・解決・達成）へ転じたストーリー（シンデレラストーリー）」を必ず盛り込んでください。
ユーザーが「自分と同じような悩みを持っていた人が、こうやって解決できたんだ」と強力に共感し、権威性を感じるようなエピソードを作成してください。
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const bodyText = response.text();
    // 冒頭文と本文を結合して返す
    return `${introText}\n\n${bodyText}`;
  } catch (error) {
    console.error("Gemini Profile Main Text Generation Error:", error);
    throw new Error(`プロフィール本文の生成に失敗しました: ${error.message}`);
  }
};
