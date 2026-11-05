---
name: book-to-course
description: Add a private ebook as a complete English and Simplified Chinese course with full-source coverage and stable IDs.
---

# Book to course

Read `AGENTS.md`, `site/content/SCHEMA.md`, and `site/lib/types.ts`. Add one course without rewriting existing courses.

Inspect the actual ebook, metadata, license, contents, appendices, glossary, references, diagrams, and extraction quality. Keep original books, extracted text/images, OCR, and detailed analysis private. Read every substantive section in bounded chunks; a table of contents is insufficient. Render difficult figures and equations and resolve extraction gaps.

Maintain a private source ledger recording every section, printed versus file-page or EPUB locators, concepts, equations, qualifications, mapped lessons/terms/questions/interactions, extraction issues, and separate en/zh-CN completion and review states. Explicitly account for front matter, appendices, references, and noninstructional omissions. A generated file list alone does not prove reading.

Synthesize the whole source before fixing curriculum and terminology. Author original explanations, examples, summaries, tables, and diagrams. Preserve formulas, units, assumptions, author-specific claims, and truthful source-language bibliography. Label generated examples and simplified models. Do not copy protected chapters or illustrations.

Write `site/content/courses/{course-id}.en.json` and `{course-id}.zh-CN.json` with identical stable course/chapter/lesson/section/term/question/option/interaction IDs. Translate every learner-facing field during authoring, never through runtime translation. Use natural technical language and a consistent bilingual term map. Keep source citations unchanged. Every substantive chapter needs objectives, comprehensive explanations, applications, summary, source locators, and approximately 5–10 meaningful questions with explanations for every option. Use `$learning-interactions` for at least two relevant source-grounded interactions when justified.

Use explicit `[localized term](term:stable-term-id)` annotations. Glossaries are course-specific; preserve aliases and conflicting source definitions. Correct answer IDs must match across languages. Review translated questions semantically, not only structurally.

Run `node --import ./site/node_modules/tsx/dist/loader.mjs scripts/validate-content.ts --write-markdown` from the repository root to validate and produce localized Markdown companions. Apply `$course-quality-review`, build/browser checks, and review actual staged/public artifacts before authorized synchronization and publication. Keep unresolved fidelity or translation issues visible.
