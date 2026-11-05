---
name: learning-site-design
description: Extend this library’s bilingual responsive documentation interface while preserving accessible navigation and local learner state.
---

# Learning site design

Read `AGENTS.md`, existing locale labels, `site/app`, and `site/components` before changing patterns. Preserve Next.js static export, stable IDs, routes, and replaceable storage interfaces.

Use a restrained athletic editorial aesthetic: readable line measure, clear hierarchy, generous spacing, and a small accent palette. Reuse tokens for color, spacing, type, radius, and focus. Support dark/light modes and Chinese/English font stacks; Chinese wrapping cannot depend on spaces.

Provide collapsible chapter navigation, a keyboard-operable mobile drawer, section anchors, in-page contents, and previous/next navigation. Localize controls, errors, empty/loading states, screen-reader labels, feedback, and instructions. Language switching retains route IDs, anchor, interaction values, and learning state. Translated titles must never become persistence keys.

Use semantic landmarks/headings, visible focus, native labeled controls, sufficient contrast, reduced-motion behavior, touch targets, and mobile-scrollable tables. Contextual glossary controls require keyboard activation, Escape, focus restoration, mobile support, and ordinary link fallbacks. Hover cannot be the only trigger.

Before publication inspect representative equations, tables, diagrams, quiz feedback, long Chinese paragraphs, search, and notes at desktop/mobile widths in both themes. Report observed browser coverage separately from automated checks. Follow the installed Sites skill for packaging/publication; configured static output is `site/out`.
