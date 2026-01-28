---
title: "Footnote sidebar demo"
description: "Verifies footnotes can float to the right while TOC stays hidden."
publishDate: "28 Jan 2026"
updatedDate: "28 Jan 2026"
tags: ["test", "footnote", "layout"]
footnotesSidebar: true
tocSidebar: false
---

This paragraph references a source for the first time.[^first] Scroll a bit more to see how the sidebar follows.

Add another section with a second reference farther down, with some filler text to separate the anchors and test spacing.[^second] The goal is to visually check that the right-rail footnotes line up with the first footnote marker, and that the table of contents stays hidden.

Keep going with a third reference after a longer block of content so the distance between references grows.[^third]

One more short paragraph and a final reference near the end to see stacking behavior.[^fourth]

Here is an extra paragraph without footnotes to push the content further down the page, ensuring the positioning logic deals with larger gaps and varied paragraph heights. Add some inline code `const x = 42;` and bold text for realism.

Finish with a final line to confirm the sidebar still leaves space below the last item.

[^first]: First sidebar footnote to check alignment.
[^second]: Second sidebar footnote; confirms list formatting and spacing.
[^third]: Third sidebar footnote; placed further down to test larger gaps.
[^fourth]: Fourth sidebar footnote; close to the bottom for final spacing check.
