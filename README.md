# Tools Showcase Landing Page

Research date: 2026-05-17

Goal: create a slick static landing page for showcasing tools, AI experiments, GitHub projects, videos, and personal links.

Working premise: this should feel like a living workshop by an experienced software developer who is still actively exploring AI. Age can be part of the voice if it is framed as perspective, taste, and curiosity rather than nostalgia.

## Core Direction

Build a static site first. Keep the content portable so it can be hosted on GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any static host later.

Recommended stack:

- Astro for a modern static site with simple content collections.
- Plain Markdown or JSON for tools data.
- No backend needed at first.
- Optional lightweight JavaScript for filtering, search, hover previews, and a playful hero interaction.

Homepage structure:

1. Hero: short identity statement plus an interactive "tool launcher" or command-palette style panel.
2. Featured tools: 3-5 polished cards with live links, GitHub links, short outcomes, and status.
3. Tool archive: searchable/filterable list by category such as AI, dev utilities, productivity, experiments, and video-backed projects.
4. Lab notes or build log: optional short posts about what was built, what was learned, and what is next.
5. About link/page: personal story, why AI is interesting now, YouTube/Twitter/GitHub links, contact.

## Inspiration Sites

### Anthony Fu

URL: https://antfu.me/

Why it fits: direct creator identity, open-source-heavy, clear projects list, talks, writing, and social links. The page quickly answers "who is this person and what have they made?"

Borrow:

- Put creator identity and project credibility above the fold.
- Keep the project archive obvious.
- Use a warm, maker-first voice instead of resume-speak.

Avoid:

- A long plain-text list if your tools benefit from screenshots, demos, or categories.

### makr.io

URL: https://www.makr.io/

Why it fits: a practical tool directory with clear categories, direct tool links, and utility-first positioning. This is close to the "I build useful tools" model.

Borrow:

- Category sections for groups of tools.
- Fast scan pattern: tool name, tiny description, direct launch.
- Trust signals like "browser-based," "no sign-up," or "runs locally" when true.

Avoid:

- Looking like a generic directory if the personal story matters.

### Rauno Freiberg

URL: https://rauno.me/

Why it fits: minimal, modern, confident, and memorable. It shows how far typography, motion, and restraint can go.

Borrow:

- A strong one-screen introduction.
- Tasteful motion and interaction details.
- A short personal manifesto or build philosophy.

Avoid:

- Becoming too cryptic for visitors who came to find tools quickly.

### Bruno Simon

URL: https://bruno-simon.com/

Why it fits: the classic "portfolio as interactive world" reference. It is attention-grabbing and proves craft immediately.

Borrow:

- One memorable interactive moment in the hero.
- Optional easter eggs for people who explore.
- A behind-the-scenes/build-log angle.

Avoid:

- Making the whole site depend on heavy 3D unless that is the product. For this project, a smaller interactive hero is likely enough.

### Brittany Chiang

URL: https://brittanychiang.com/

Why it fits: polished portfolio structure with about, experience, projects, archive, social links, and clean project presentation.

Borrow:

- Clear navigation: About, Projects/Tools, Writing/Notes, Contact.
- Project cards with descriptions, tech tags, images, and links.
- A full project archive for older work.

Avoid:

- Making it feel like a job-hunting portfolio if the goal is "tools I build."

### Lee Robinson

URL: https://leerob.com/

Why it fits: compact, human, current, and good at blending writing, code, videos, and social presence.

Borrow:

- A simple personal intro that does not over-explain.
- Prominent links to writing, code, videos, and online follow links.
- Strong editorial taste.

Avoid:

- Over-minimalism if the tools need visual previews.

### swyx

URL: https://www.swyx.io/about

Why it fits: AI/devtools-oriented personal site with a useful About page, social links, projects, talks, and multiple bio lengths.

Borrow:

- About page with short/medium/long bio variants.
- Explicit AI/devtools positioning.
- Social, GitHub, YouTube, and speaking/writing links in one place.

Avoid:

- Too much biography on the landing page; keep that behind About.

### Josh W. Comeau

URL: https://www.joshwcomeau.com/

Why it fits: teaches through interactive, delightful web pieces and has a strong personal brand.

Borrow:

- Interactive explanations or mini demos for selected tools.
- High-polish microinteractions.
- A writing/tutorial section if you want to explain how tools were built.

Avoid:

- Turning every project into a long article when a launch link is enough.

## Style Concepts

### 1. AI Workshop

Quiet dark or light interface, command-palette hero, live-ish snippets, cards grouped by tool category. Feels like a polished personal lab.

Best for: showcasing many GitHub tools with direct links.

### 2. Tool Cabinet

Visual grid of "drawers" or compact panels, each opening into a tool preview. Mature, tactile, distinctive, but still practical.

Best for: a broad catalog of utilities and experiments.

### 3. Dispatches From The Future

Editorial style with strong typography, a few bold interactive moments, and build notes. Emphasizes being 65, AI-curious, and still shipping.

Best for: personal voice, YouTube, writing, and projects together.

### 4. Playable Hero, Practical Site

One lightweight interactive canvas/terminal/orbit at the top, then a clean tool directory below.

Best for: grabbing attention without making the whole site hard to maintain.

## Recommended First Version

Use "Playable Hero, Practical Site."

Reason: it captures attention, suits an AI/tool-builder persona, stays static-host friendly, and lets the tools remain the main attraction.

Potential headline:

> AI tools, dev utilities, and useful oddities by [Name].

Potential subhead:

> I build small, sharp software experiments, mostly around AI, developer workflows, and things I wanted badly enough to make myself.

from my blog
> Researching the optimal; implementing the practical

Primary calls to action:

- Explore tools
- View GitHub
- Watch YouTube
- About

## Tool Inventory Template

Use one entry per tool:

```yaml
- name:
  slug:
  status: live | prototype | archived
  category: ai | devtool | productivity | experiment | media
  one_liner:
  why_i_built_it:
  live_url:
  github_url:
  video_url:
  screenshot:
  tech:
  featured: true | false
```

## Content To Collect Next

- Name or handle to use publicly.
- GitHub profile URL.
- YouTube URL.
- Twitter/X URL.
- Any other links: LinkedIn, Bluesky, newsletter, email.
- 5-10 tools to feature first.
- Screenshots or short screen recordings for the top 3 tools.
- Preferred tone: polished lab, playful maker, serious builder, or a mix.

## Hosting Notes

- GitHub Pages: simplest if the repo is already on GitHub and the site can be public.
- Cloudflare Pages: fast static hosting, easy custom domains.
- Netlify: simple deploy previews and forms if needed.
- Vercel: strong if using Next.js or wanting a highly polished frontend workflow.
- Gatsby: free/open-source React static-site framework. Viable, but probably not the first pick unless you already like Gatsby.

The content should stay host-neutral until deployment is chosen.

## Codex Follow-up Review

Your notes point to a clearer direction than the first pass:

- The page should be simple to update, probably driven by one data file and optional Markdown pages per tool.
- The homepage should sell the tools first, not the biography.
- A left navigation layout is worth exploring: About, Tools, Archive, GitHub, YouTube, Contact.
- CLI tools should not be forced into live demos. Better patterns:
  - animated terminal GIF
  - short asciinema-style recording
  - screenshot of output
  - GitHub link
  - YouTube walkthrough
  - "why I built it" paragraph
- The best card shape is probably: name, one-line result, tags, status, buttons for GitHub / Watch / Notes.
- Avoid designer-showcase energy, giant type, cute illustrations, and long text walls on the landing page.

Updated design target:

> A practical, sharp developer workshop: compact cards, dark-or-neutral theme, left nav, fast archive, and optional GIF/video drill-downs for tools.

## Five More Sites That Fit Better

### Simon Willison's Tools

URL: https://tools.simonwillison.net/

Why it fits: this is probably the closest content model. It is a growing collection of small tools, many AI-assisted, categorized by purpose, with links back to GitHub and build notes.

Borrow:

- Categories by real use case: Image/media, Text/document, Data/time, GitHub/dev, LLM playgrounds.
- A "Recently added" and "Recently updated" section.
- Treat each tool as a small durable artifact.
- Link to source and build notes without over-polishing every entry.

Avoid:

- The visual style is too plain for your goal. Use the information architecture, not the look.

### Linus Lee / thesephist Projects

URL: https://thesephist.com/projects/

Why it fits: huge archive of personal tools, experiments, languages, utilities, and AI-adjacent interface work. It handles lots of projects without pretending every one is equal.

Borrow:

- Split tools into Highlights, Released, Retired, Experiments, and Unfinished.
- Let some projects be tiny, weird, or personal.
- Make the site feel like an active workshop instead of a static resume.

Avoid:

- It is still text-heavy. Your homepage should surface cards first, then let deeper pages carry the longer notes.

### Tania Rascia Projects

URL: https://www.taniarascia.com/projects/

Why it fits: clean open-source project list with year, description, and practical links: Article, Demo, Source. This maps well to GitHub / YouTube / Notes.

Borrow:

- Simple repeatable project schema.
- Use consistent link labels per tool.
- Keep project descriptions short and concrete.
- Include both homepage highlights and a full archive.

Avoid:

- The page is intentionally minimal. Add richer cards and GIF/screenshot slots for your top tools.

### Hayden Menge

URL: https://haydenmenge.com/

Why it fits: AI/tooling-focused portfolio with filterable categories, screenshots, tags, and source links. It is modern without being too designer-ish.

Borrow:

- Filters like All, Tooling, AI/ML, Web.
- Screenshot per card.
- Tech tags that help visitors scan.
- A compact bio below the tool grid rather than leading with a huge life story.

Avoid:

- Do not let the skills section overtake the tools. Your site should not feel like a job-search portfolio.

### Gauresh G Pai

URL: https://gauresh.is-a.dev/

Why it fits: includes CLI tools as featured projects, with screenshots, tags, GitHub links, and live-demo links. Useful reference for how CLI work can live in a visual card grid.

Borrow:

- CLI project cards with screenshot, tags, role/status, and GitHub link.
- "More Projects" archive pattern.
- Explicit labels like CLI, npm, Node.js, dev.

Avoid:

- The resume/experience sections are too prominent for your use case. Keep that material mostly on About.

## Revised Build Recommendation

Build this as a static Astro site with:

- `tools.yaml` for the card grid and archive.
- `src/content/tools/*.md` for optional drill-down pages.
- Left nav on desktop, compact top nav on mobile.
- Home page sections: Featured Tools, Recently Added, Tool Archive, Find Me.
- About page with a short bio first, then longer background and links.
- Each featured tool supports `gif`, `screenshot`, `github_url`, `youtube_url`, `notes_url`, `install_command`, and `status`.

First visual direction:

- dark-neutral or graphite background, not bright white
- restrained accent color, maybe green/cyan/amber rather than purple
- compact card grid
- terminal-style install snippets only where useful
- inline GIFs for CLI demos
- no heavy 3D, no cute mascots, no giant hero typography

## Codex Review Of Latest Notes

The latest notes make the target much more concrete.

Current top references:

- Hayden Menge: best visual direction. Project tabs, strong screenshots, per-project tech/tool tags, and modern cards.
- Tania Rascia: best card/content structure. Short summary, GitHub stars, and clear links like Demo / Article / Source.
- Brittany Chiang: best layout/navigation influence. Left navigation, about page, project cards, and archive.
- makr.io: useful for card-first browsing and drill-down behavior, but less for CLI-specific presentation.

Sites now mostly rejected:

- Simon Willison's tools: useful only as a taxonomy/archive reference. Too plain and list-heavy visually.
- thesephist projects: useful only as an example of project grouping at scale. Not card-driven enough.
- Rauno, Bruno Simon, Josh Comeau: too designer/cute/experience-first for this project.
- Lee Robinson, swyx: too text-first for the landing page.

Tagline note:

> Researching the optimal; implementing the practical

This is strong. It should probably appear as a hero subline or site motto, not the main headline. A good headline still needs to say what visitors get:

> AI tools and developer utilities by [Name]

Then the motto can sit right under it:

> Researching the optimal; implementing the practical.

Updated page model:

1. Left nav: Tools, About, Archive, GitHub, YouTube, Contact.
2. Hero: concise identity, motto, and maybe one featured tool preview.
3. Featured tools: large cards with image/GIF, tags, status, GitHub, YouTube, Details.
4. Tabs: All, AI, CLI, Dev Tools, Utilities, Experiments.
5. Archive: compact list/table for older or smaller projects.
6. About: short intro first, longer bio and social links below.

Updated tool card fields:

```yaml
- name:
  slug:
  status: live | prototype | archived
  category: ai | cli | devtool | utility | experiment
  one_liner:
  screenshot:
  gif:
  github_url:
  youtube_url:
  demo_url:
  article_url:
  install_command:
  tech:
  github_stars:
  featured:
```

Build recommendation after latest notes:

- Still favor Astro for this unless there is a strong Gatsby preference.
- Gatsby is free and can host on the same static hosts, but it is heavier than needed for a tool catalog.
- The site should be data-driven so adding a new tool means adding one YAML/Markdown entry and one optional image/GIF.
- Use project detail pages only for tools that deserve GitHub / YouTube / GIF / install instructions / notes.

## Implementation Status

Initial static implementation created:

- `index.html`: landing page structure driven by the page model.
- `styles.css`: Hayden-inspired dark developer-workshop layout, card grid, tabs, left nav, and scroll fade-ins.
- `data.js`: starting tool cards and "Stay Connected" links.
- `script.js`: category tabs, search, detail dialog, archive table, social links, mobile nav, and reveal animation.

Current implementation choices:

- Hayden Menge is the visual anchor: cards, project tabs, images, tech tags, and modern dark styling.
- Tania Rascia informs the project-card link model: Source / Video / Package / Notes.
- Brittany Chiang informs the left navigation and archive/about structure.
- The motto is kept: "Researching the optimal; implementing the practical."
- Repo card descriptions are seeded from GitHub repo metadata and README language.
- YouTube is wired where a repo already has a specific video; more tool-specific links can be added later in `data.js`.
- The page title is "AI tools and utilities by Doug Finke."
- `assets/bioPic-2026.png` is used in the left nav and mobile header so the avatar shows Doug's face.
- Social links moved into the left nav in this order: X, YouTube, New York - Agentic AI, GitHub, LinkedIn, Gumroad, Sessionize.
- GitHub, X, YouTube, and LinkedIn use local brand-style icon markup so they do not disappear if the icon CDN lacks brand icons.
- Card sizing has been tightened so the page reads more like a compact tool catalog.
- The initial lime accent was shifted to a cooler blue-teal with amber highlights.

Local preview:

```text
http://127.0.0.1:5173
```

## AI Legibility Files

Added root-level files for AI agents, search systems, and static hosting:

- `llms.txt`: concise Markdown summary of Doug Finke, the site, current projects, key URLs, and topic tags.
- `projects.json`: structured machine-readable project catalog.
- `sitemap.xml`: sitemap for the page and AI-readable metadata files.
- `robots.txt`: allows indexing and points to the sitemap.
- `Update-SiteMetadata.ps1`: simple helper to regenerate `projects.json`, `llms.txt`, `sitemap.xml`, and `robots.txt` after metadata edits.

The page also includes:

- Open Graph and Twitter/X card metadata.
- JSON-LD for Doug Finke, the website, and the five current project repositories.
- A visible through-line section.
- A light "Work with me" section.
- An agent notes section linking to `llms.txt` and `projects.json`.

Current site URL used in metadata:

```text
https://dougfinke.dev/
```

When the site moves or is claimed under a permanent URL, update/regenerate:

```powershell
.\Update-SiteMetadata.ps1 -SiteUrl "https://your-final-site.example/"
```

When adding a new project, update:

- `data.js` for visible cards.
- `projects.json` for AI-readable project metadata.
- `index.html` JSON-LD if the project should appear in structured page metadata.
- Run `Update-SiteMetadata.ps1` to refresh `llms.txt`, `sitemap.xml`, and `robots.txt`.

Quick validation:

```powershell
node --check .\data.js
node --check .\script.js
Get-Content .\projects.json -Raw | ConvertFrom-Json | Out-Null
[xml](Get-Content .\sitemap.xml -Raw) | Out-Null
Invoke-WebRequest http://127.0.0.1:5173/llms.txt
Invoke-WebRequest http://127.0.0.1:5173/projects.json
```


## My notes

The design should be simple for me to add to going forward

- https://antfu.me/
  like some of the verbiage. does not prominently feature the "tools" aspect. I like the 'find me'
  the project, the font is too big

- https://www.makr.io/
  I like the first page tool cards and drill down. i will be doing cli tools, so i don't think live examples of those play well. the drill down to the github and YT link would be nice. i may want to post gif inline too

- https://rauno.me/
  dont like, too bright, dont like the scroll. good for designers, not me, a dev

- https://bruno-simon.com/
  no go - another designer site, not for me

- https://brittanychiang.com/
  like the project cards, the about page, the archive. i dont want to make it. i like the left navigation. 
  this is in the top 3

- https://leerob.com/
  nope too plain

- https://www.swyx.io/about
  not the worst, too markdown and too much text on the landing page. i think i want short bio etc and the cards for folks to get into the code ive written

- https://www.joshwcomeau.com/
  too cutsie

- https://tools.simonwillison.net/
  nah

- https://thesephist.com/projects/
  nah 
  - dude i want cards that folks can read a smippet about the tool and then click through to more detail with  github, YT, gif. this is just a list of links with some text. not what i want

- https://www.taniarascia.com/projects/
  this is good. i llike the card, github stars and links like demo, article, source. 
  note: there could be a YouTube link too

  this uses gatsby - no clue, if it is free, add to the list of options
  this is in the top 3

- https://haydenmenge.com/
  this shit rocks - i like the prohjects with 'tabs' fro categorization
  i like the cool images on the cards
  i like the idea of "languages", "tools" used for that particular project

