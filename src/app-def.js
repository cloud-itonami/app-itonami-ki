// Ki (樹液, sap): the vascular stage of the itonami bonsai apps. Signals are
// absorbed (xylem), synthesized into an artifact, bloomed (phloem publication)
// and snapshotted in rings. Every action runs the domain code in ./domain on
// this device and stores its records locally.
import { absorb, synthesize, bloom, ring, mapRoute, getStatus } from "./domain/index.js";

export const app = {
  title: "Ki",
  description: "樹液（sap）— koke・hakkou などからの信号を吸い上げ（absorb）、成果物に合成し（synthesize）、公開し（bloom）、期間ごとの年輪（ring）として残します。",
  did: "did:web:ki.itonami.cloud",
  storageKey: "itonami.ki.v1",
  collections: [
    { name: "cloud.itonami.ki.absorb", label: "吸収 (absorb)" },
    { name: "cloud.itonami.ki.synthesis", label: "合成 (synthesis)" },
    { name: "cloud.itonami.ki.bloom", label: "開花 (bloom)" },
    { name: "cloud.itonami.ki.ring", label: "年輪 (ring)" },
    { name: "cloud.itonami.ki.route", label: "経路 (route)" },
  ],
  actions: [
    {
      name: "absorb", label: "吸収する (absorb)", help: "koke（fixation）・hakkou（ferment）などからの信号を取り込みます。",
      fields: [
        { name: "absorbId", label: "absorb ID", required: true },
        { name: "sourceVertexId", label: "送り元 vertex", required: true },
        { name: "inputKind", label: "種類", type: "select", options: ["fixation", "ferment", "transfer"], required: true },
        { name: "content", label: "内容", type: "textarea", required: true },
      ],
      run: (store, input) => absorb(store, input),
    },
    {
      name: "synthesize", label: "合成する (synthesize)", help: "吸収した入力から成果物を作ります。推論は含みません。結果の名前・確信度・モデル名を記録します。",
      fields: [
        { name: "synthesizeId", label: "synthesize ID", required: true },
        { name: "absorbId", label: "元の absorb ID", required: true },
        { name: "name", label: "成果物の名前" },
        { name: "confidencePermille", label: "確信度 (0–1000)", type: "number", step: "1" },
        { name: "model", label: "モデル名" },
      ],
      run: (store, input) => synthesize(store, input),
    },
    {
      name: "bloom", label: "開花させる (bloom)", help: "合成した成果物を公開済みとして記録します（この端末内の記録です）。",
      fields: [
        { name: "bloomId", label: "bloom ID", required: true },
        { name: "synthesizeId", label: "synthesize ID", required: true },
        { name: "artifactId", label: "artifact ID" },
      ],
      run: (store, input) => bloom(store, input),
    },
    {
      name: "ring", label: "年輪を刻む (ring)", help: "期間（ISO 8601、例: P7D）内の開花の数をスナップショットにします。",
      fields: [
        { name: "ringId", label: "ring ID", required: true },
        { name: "period", label: "期間", placeholder: "P7D", required: true },
      ],
      run: (store, input) => ring(store, input),
    },
    {
      name: "mapRoute", label: "経路を記録する (mapRoute)",
      fields: [
        { name: "routeId", label: "route ID", required: true },
        { name: "source", label: "送り元", required: true },
        { name: "destination", label: "送り先", required: true },
        { name: "gateway", label: "ゲートウェイ", required: true },
      ],
      run: (store, input) => mapRoute(store, input),
    },
    {
      name: "getStatus", label: "状態を見る (getStatus)", help: "synthesize ID か bloom ID のどちらかを入れます。",
      fields: [
        { name: "synthesizeId", label: "synthesize ID" },
        { name: "bloomId", label: "bloom ID" },
      ],
      run: (store, input) => getStatus(store, input),
    },
  ],
};
