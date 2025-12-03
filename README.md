# MyWarmBlog — Starter Blog

This is a warm-light, multipage static blog starter intended for GitHub Pages.

## Contents

- `index.html` — Home page (shows featured posts).
- `blog.html` — All posts list (generated from `posts/posts.json`).
- `post.html` — Single post template (loads a markdown file by query string).
- `css/style.css` — Warm light styles.
- `js/blog.js` — Logic for rendering lists and posts.
- `posts/` — Markdown posts and `posts.json` manifest.

## How to add a post

1. Create a markdown file `posts/your-slug.md`.
2. Add a small YAML frontmatter at top:
\`\`\`
---
title: Your Post Title
date: 2025-12-01
---
\`\`\`
3. Add an entry in `posts/posts.json` with fields: `slug`, `title`, `date`, `excerpt`, `reading_time`.

## Deploy to GitHub Pages

1. Create a new repository on GitHub.
2. Commit the files and push to the `main` branch.
3. In repository Settings > Pages, choose branch `main` and folder `/ (root)`.
4. The site will be available at `https://<your-username>.github.io/<repo-name>/`.

For more advanced workflows (automatic posts.json generation from markdown, templates, or a static site generator) consider using Eleventy, Hugo, or Jekyll.

