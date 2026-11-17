# app-itonami-ki — Ki

樹液（sap）— koke・hakkou などからの信号を吸い上げ（absorb）、成果物に合成し（synthesize）、公開し（bloom）、期間ごとの年輪（ring）として残します。

Tauri **3.0.0-alpha.6** の独立 app（`tauri-runtime-wry`、OS の WebView）と、同じファイルの static Web ビルドです。記録はすべてこの端末の中（localStorage、key `itonami.ki.v1`）に保存し、外部へは通信しません。外部操作の宣言もありません（`dist/descriptor.json` の `operations: []`）。保存に失敗したときは画面に表示します。

## できること

| 操作 | 内容 |
| --- | --- |
| 吸収する (absorb) | koke（fixation）・hakkou（ferment）などからの信号を取り込みます。 |
| 合成する (synthesize) | 吸収した入力から成果物を作ります。推論は含みません。結果の名前・確信度・モデル名を記録します。 |
| 開花させる (bloom) | 合成した成果物を公開済みとして記録します（この端末内の記録です）。 |
| 年輪を刻む (ring) | 期間（ISO 8601、例: P7D）内の開花の数をスナップショットにします。 |
| 経路を記録する (mapRoute) | — |
| 状態を見る (getStatus) | synthesize ID か bloom ID のどちらかを入れます。 |

記録（collection）: `cloud.itonami.ki.absorb`、`cloud.itonami.ki.synthesis`、`cloud.itonami.ki.bloom`、`cloud.itonami.ki.ring`、`cloud.itonami.ki.route`

## 補足

- 流れ: absorb → synthesize → bloom。ring は独立で、期間内の bloom の数を数えます。
- synthesize は推論（LLM）を含みません。結果の名前・確信度・モデル名を入力して記録します。推論を入れる場合は、別途ローカル推論か、操作ごとの同意つきの外部操作として設計します。
- 既存の挙動をそのまま移しました: synthesize は absorb ID の記録がないとき、ID に `nonexistent` を含む場合だけ拒否し、それ以外は空の absorb 記録を作ります（旧テスト互換のための挙動）。
- domain の詳しい説明は [`docs/domain.md`](docs/domain.md)（旧 `kotoba/README.md`）にあります。

## 構成

| パス | 役割 |
| --- | --- |
| `src/domain/` | domain logic（TypeScript）。ビルド時に Node の type stripping で JS にします（bundler・依存なし） |
| `src/local-store.js` | この端末内の record store。domain が使う `read` / `write` を localStorage で実装 |
| `src/app-def.js` | 画面の操作と domain 関数・collection の対応 |
| `src/ui/` | 依存なしの UI。DOM はテキストノードだけで組み、HTML 文字列を使いません（CSP `style-src 'self'`） |
| `vendor/` | kotoba-lang/kotoba の `kotoba-client-runtime.js` / consent CSS と `PINS.json`。`scripts/build.mjs` が digest のずれで失敗します |
| `src-tauri/` | Tauri v3 host。read-only command は `awai_host_info` の 1 つだけ。filesystem・network・shell・installer 権限なし |
| `cljs/` | 旧 ClojureScript UI（amu でビルド）。この app のビルド・テストでは使いません |
| `lg-clj/` | サーバー側 LangServer pod（Clojure）。この app からは呼びません |

## コマンド

```sh
npm ci
npm test              # build してから domain と local-only のテスト（ki.test.ts, local-only.test.mjs）
npm run build         # dist/ と SHA-256 の release.json
npm run build:desktop # native desktop 実行ファイル（bundle・署名なし）
```

## 状態と制限（AWAI-3079, 2026-11-17）

- 旧構成（Cloudflare Worker の XRPC dispatcher / adapter、`wrangler.jsonc`、`@etzhayyim/sdk`）は削除しました。履歴は git にあります。
- 検証済み: `npm test`、`npm run build`、`cargo check`（Tauri 3.0.0-alpha.6）。
- 未検証: native window の起動、`tauri build`、Android、署名、配布。アイコンは app-soshiki の仮アイコンです。
