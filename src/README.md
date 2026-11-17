# ki src — Phase E rewrite pending

Vendor `60-apps/itonami-project-ki/src/app.ts` is the production source that uses `createKyselyDb()` (RW direct write, forbidden on itonami per [ADR-2605172000](../../../../90-docs/adr/2605172000-itonami-kotoba-substrate.md)).

Per [ADR-2605203000](../../../../90-docs/adr/2605203000-kotoba-write-target-options.md) Phase E, **Option B** (PDS XRPC) was picked for ki. Rewrite follows the pattern established by:
- [ipaddress/kotoba](../../../itonami-project-ipaddress/kotoba/)
- [hanrei/kotoba](../../../itonami-project-hanrei/kotoba/)
- [tsukuru/kotoba](../../../itonami-project-tsukuru/kotoba/)

Vendor source NOT carried over — wave-3 follow-up sub-PRs will port each command using `@etzhayyim/sdk` `e.write()` / `e.read()` replacements.

## Status

- Scaffold (this PR): CLAUDE.md, kotodama.jsonld, package.json, svelte/, wrangler.jsonc copied with sed
- Lexicons: 5 files migrated to `00-contracts/lexicons/cloud/itonami/ki/`
- kotoba reference impl: deferred (Option B pattern follows etz #89 / #90)
- ki.itonami.cloud deploy: NOT yet (operator stage)
- ki.itonami.cloud (vendor) status: **LIVE** — wait for operator Stage 4 (routing-gateway 301) + 1-week observation before vendor rm
- `svelte/` was replaced by `cljs/` (reagent + re-frame + jp-go-dds) on 2026-09-07, see the root README.md

## Related
- ADR-2605172000 — kotoba substrate
- ADR-2605203000 — Phase E decision matrix
- vendor deps.toml [[migrations]] phase-e-kotoba-write-target-decision-2026-05-20
