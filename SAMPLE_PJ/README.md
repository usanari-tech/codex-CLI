# SAMPLE_PJ — 静的MVP + 公開/収益テンプレート

最短で「作る→公開→課金」を体験できる、超軽量の静的サイトMVPです。
サンプル機能として「CSV→JSONコンバーター」（完全クライアントサイド）を同梱し、
課金はホスト型チェックアウト（例：Stripe Payment Links）にリンクするだけで成立する構成です。

## できること
- 公開: GitHub Pages（Actions同梱）で1クリック公開
- 収益: Stripe Payment Link などの外部決済リンクを設置
- 機能: ブラウザで動く CSV→JSON 変換（ローカルで完結）

## 構成
- `public/index.html` … LP + ツール本体 + 課金ボタン
- `public/thanks.html` … 決済後リダイレクト先（サンクスページ）
- `public/app.js` … ツールのロジック（CSV→JSON）
- `public/style.css` … 最低限のスタイル
- `public/config.js` … 決済リンクなどの設定（プレースホルダを置いてあります）
- `.github/workflows/deploy-pages.yml` … GitHub Pages への自動デプロイ

## セットアップ（収益導線）
1) StripeでPayment Linkを作成
- 成功URL: `https://<あなたのGitHubユーザー名>.github.io/<リポジトリ名>/SAMPLE_PJ/public/thanks.html`
- キャンセルURL: `https://<あなたのGitHubユーザー名>.github.io/<リポジトリ名>/SAMPLE_PJ/public/`

2) `public/config.js` を編集
```js
window.APP_CONFIG = {
  paymentLink: "https://buy.stripe.com/xxxxxx", // ←あなたのPayment Link URL
};
```

3) 決済検証について（割り切り）
- 本テンプレートは「最短で収益を得る」を優先し、クライアントのみで完結します。
- 決済完了の厳密な認可/コンテンツ解放は行いません（サンクスページ誘導まで）。
- 将来的に本格運用する際は、Lemon Squeezy/Stripe + ライセンスキー配布 or 署名付きトークン等の導入を検討してください。

## 公開（GitHub Pages）
1) リポジトリにプッシュ後、GitHubのSettings → Pages を開く
- Build and deployment: Source = GitHub Actions を選択
- 以後、`main`にpushすると自動で公開されます（Actions同梱済み）

2) 公開URL
- `https://<あなたのGitHubユーザー名>.github.io/<リポジトリ名>/SAMPLE_PJ/public/`

## ローカル確認
- ブラウザで `SAMPLE_PJ/public/index.html` を直接開けば動作します。

## 次の一歩（オプション）
- コンテンツ拡充: 機能を増やす/LPの改善/FAQやブログ追加
- 計測: Plausible/Umami などのクッキーレス解析スニペットを`index.html`に追加
- 信頼性: 決済後の自動メール/ライセンス配布をサーバレス関数で実装

---
このテンプレートは「まず1円稼ぐ」ための土台です。細かい最適化は収益が出始めてからでOKです。
