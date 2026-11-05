---
name: course-quality-review
description: Audit whole-book coverage, bilingual semantic parity, quiz correctness, interaction fidelity, and private/public publication boundaries.
---

# Course quality review

Read `AGENTS.md`, the target localized course pair, and its private coverage ledger. Run `node --import ./site/node_modules/tsx/dist/loader.mjs scripts/validate-content.ts` from the repository root. Structural validation does not prove scientific accuracy, translation quality, or full-source reading.

Compare every substantive source section against mapped explanations, concepts, glossary, examples, equations, qualifications, figures, questions, and interactions. Check appendices and intentional omissions. Revisit source pages/EPUB sections for unresolved extraction issues. Report unverified concepts honestly; word counts do not establish fidelity.

Review both languages against the same objectives and source. Check technical terminology, negation, qualifiers, units, formulas, numerical values, captions, interaction feedback, and question options. Preserve author-specific attribution and source-language bibliography. Matching schema alone is not semantic parity.

Evaluate every question against its correct option IDs and all option explanations. Test application/misconception questions, exact-set multi-answer scoring, submission before answers, retry, and persisted attempts. Verify interaction assumptions, ranges, units, known outputs, text alternatives, and accessibility.

Run TypeScript and static production build, then browser-test locale switching, exact-section search in both languages, glossary keyboard behavior, mobile navigation, interactions, progress restoration, notes, and validated JSON import/export. Report only checks actually executed and limitations.

Inspect actual Git staging, deployment archive, static output, and browser assets for private books, extraction/OCR, ledgers, source figures, credentials, caches, and personal data. `.gitignore` alone is insufficient. Review copyright boundaries in both languages. Follow the installed Sites skill for authorized publication and report GitHub/deployment results separately from local readiness.
