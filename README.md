# Strength Study / 运动科学学习库

An independent, bilingual, static learning library for strength and hypertrophy training. Next.js, React and TypeScript; no backend or runtime translation service. Both English and Simplified Chinese are authored before build time.

## Run

Requires Node.js 22+ (verified with Node 24). From this source root:

```sh
npm ci
npm run dev
npm run validate
npm run test
npm run typecheck
npm run build
node scripts/check-static-links.mjs out
node scripts/check-publication.mjs out
```

The final deployable static site is `out/`. The application source is `site/`. All course routes are generated at build time. The root hosting manifest selects `out`; the nested manifest preserves authoring-site identity.

## Content

Each book becomes a course with paired `site/content/courses/{id}.en.json` and `{id}.zh-CN.json` files. Stable identifiers join both translations and local learner records. Typed JSON contains original Markdown section prose, objectives, review questions, terminology and interaction specifications. Generated Markdown companions under `site/content/lessons/` are reviewable authoring artifacts; JSON is the canonical render source. Regenerate companions with:

```sh
node --import ./site/node_modules/tsx/dist/loader.mjs scripts/validate-content.ts --write-markdown
```

When npm workspaces hoist dependencies, use `node --import tsx scripts/validate-content.ts --write-markdown` instead. The production build validates translation structure, IDs and answer parity before indexing public educational text. EN/中文 switching retains stable course, lesson and section references, interaction drafts, saved notes, progress and quiz history.

These are independently written educational syntheses, not authorized reproductions or replacements for the original books. Bibliographic titles and source locators retain their original language. Source recommendations are identified as such; simplified interactions calculate bookkeeping relationships, not predicted growth or recovery.

## Local learner data

The asynchronous `LearningRepository` interface has a LocalStorage adapter. Existing v1 exports and the early v0 discriminator migrate with defaults for optional preferences/bookmarks. Import validates the complete payload before mutation, merges stable IDs/references by newer timestamp, preserves existing values on ties and does not infer deletions. Notes retain their original text. Storage failures retain in-memory changes and display an export reminder. Drafts and interaction inputs use the current tab's session storage. Data is not automatically synchronized across browsers or devices.

## Private sources and future courses

The authoring workspace holds ebooks in `books/` and extraction, source coverage ledgers, and audit notes in `private/`. None is part of this publishable source or deployment. `scripts/prepare-publication.mjs` selects an explicit source allowlist; inspect its actual output with the publication checker before synchronization.

Read `AGENTS.md` and the project skills under `.agents/skills/`. If the environment does not discover these automatically, open the corresponding SKILL.md explicitly. Add one book by reading all substantive source material, recording exact coverage privately, authoring both complete locales, checking all references and translations, then running validation, tests and browser QA. Existing course IDs should remain unchanged.

Project skills: `book-to-course`, `learning-site-design`, `learning-interactions`, and `course-quality-review`. Design tokens and component patterns are documented in `DESIGN.md`; actual validation evidence belongs in `QUALITY.md`.

Reusable request: “Use book-to-course and course-quality-review to add the new book in books/ as one complete English/简体中文 course. Read the entire source, maintain a private coverage ledger, retain existing courses, validate both translations and all interactions, then synchronize the reviewed publishable source and deploy through Sites.”
