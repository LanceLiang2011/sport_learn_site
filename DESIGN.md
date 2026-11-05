# Strength Study design system

Use the tokens in `site/app/globals.css`: `--bg` warm off-white, `--paper` surfaces, `--ink` forest text, `--muted` secondary copy, `--line` dividers, `--accent` lime highlights, `--soft` educational panels. Dark mode replaces these tokens at the HTML root. Color never carries correctness alone.

The editorial library pairs restrained original SVG graphics with a large serif-accented headline; reading pages use a quieter, wide-line-height documentation layout. Arial/PingFang SC/Microsoft YaHei are local font stacks; no external font or translation requests. Chinese uses strict line breaking and less negative tracking. Tables scroll within their own container. Respect reduced motion.

Shared patterns: chapter sidebar with native collapsible details; mobile course menu; section anchor TOC; original explanations with source locator; explicit `term:` links opening named modal dialogs; fieldset quizzes with option-specific feedback after submission; interactive labs with visible model assumptions and arithmetic; note editor with stable section IDs. Use visible focus rings, labeled inputs, native buttons, real links and a skip link. Keep sidebar client props to IDs/titles, never full course prose.

Desktop uses 260px sidebar, a reading column capped around 820px, and a 190px in-page TOC. Hide the outer TOC below 1150px and show an inline TOC; collapse the chapter menu below 760px. Library cards become a single column below 760px.
