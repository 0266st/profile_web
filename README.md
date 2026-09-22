# profile_web

0266st / 0168th のポートフォリオサイト — https://profile.ztssst.dev

Next.js (App Router) + React。デザインは [Hallmark](https://github.com/nutlope/hallmark) の Cobalt テーマ。

## 開発

```sh
npm install
cp .env.example .env.local   # 必要な値を埋める
npm run dev
```

問い合わせフォームは Cloudflare Turnstile と Resend を使います。ローカルでは Turnstile のテスト用キーで動きます。

## ビルド

`output: "standalone"` なので、`npm run build` のあと `.next/static` と `public` を `.next/standalone` にコピーすれば `node server.js` で動きます。

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` はビルド時に埋め込まれるため、本番用の値は `.env.production.local` に置いてからビルドしてください。
