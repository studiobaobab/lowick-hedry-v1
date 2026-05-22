# Lowick Hedry — Website v1

First-draft build of the Lowick Hedry website, produced from `Web v1 approach/lowick-hedry-web-brief.md`, the Lowick Hedry brand guidelines and the Design System. Built to be responsive, SEO-friendly and aligned with 2026 web best practice, for a v1 launch ahead of 30 June 2026.

## What's here

```
lowick-hedry-v1/
├─ index.html          Home
├─ team.html           Team
├─ contact.html        Contact
├─ css/lowick-hedry.css  Single stylesheet (grown from lowick-hedry-coming-soon)
├─ js/site.js          Mobile nav, scroll-reveal, demo form handler
└─ assets/
   ├─ logos/           Wordmark SVGs (negative + dark, both orientations)
   ├─ gradients/       Official web .webp gradients (kept for future use)
   └─ team/            Web-optimised square headshots
```

Open `index.html` in a browser to view. No build step or server required.

## Design decisions (confirmed with Studio Baobab)

- **Structure:** three separate pages (Home / Team / Contact) sharing one stylesheet — true to the brief's sitemap.
- **Hero treatment:** the official Lowick Hedry **dark navy gradient** (rendered in CSS, matching the coming-soon page), type-led, no hero photography.
- **Team page:** real profiles for the three named, photographed leaders — **Sam Cornick, Kevin McKeever, Oscar Houseago** — plus a wider-team grid of clearly-marked **"Name TBC"** placeholder cards (greyed) ready for content.
- **Contact form:** built visually and flagged as a **demonstration form, not yet live**. It needs wiring to a backend (e.g. Formspree, a serverless function, or the firm's CRM) before launch.

## Brand discipline applied

- Two typefaces only — **Fraunces** (display/headlines) + **Rethink Sans** (UI/body).
- Buttons are **rectangular** (0 radius); cards are **10px**; only the tag chips are pill-shaped.
- **Off White** is the dominant light surface; dark sections use the official navy gradient. **Signal-red** is the accent on light; **Light Yellow** is reserved for dark sections only, per the guidelines.
- British English throughout; sentence case headings; no emoji; restrained Lucide-style line icons only.

---

## SEO recommendations (per page)

### Home — `index.html`
- **URL slug:** `/`
- **Meta title:** `Lowick Hedry — Trusted advisors for a changing landscape`
- **Meta description:** *Lowick Hedry is a strategic advisory firm working where commercial ambition meets political reality — public affairs, planning, corporate communications and senior counsel for complex, high-stakes decisions.*
- **H1:** Trusted advisors for a changing landscape
- **H2 structure:** Where commercial ambition meets political reality · Senior people. Broad reach. Serious counsel. · Strategic advice where politics, business and public opinion meet. · The moments clients come to us. · What clients say. · A senior team, built for complex decisions. · Facing a complex decision, planning challenge or public affairs issue?
- **Internal links:** → Expertise (anchor), Team, Contact (primary + secondary CTAs throughout).
- **Keyword territory:** strategic advisory firm UK, public affairs consultancy UK, planning communications consultancy, corporate reputation advisory, political intelligence consultancy.

### Team — `team.html`
- **URL slug:** `/team`
- **Meta title:** `Team — Lowick Hedry`
- **Meta description:** *Meet the Lowick Hedry team — senior counsel, political intelligence and commercial judgement, brought together to advise on complex, high-stakes decisions.*
- **H1:** Senior counsel, political intelligence and commercial judgement — in one team
- **H2 structure:** The senior team. · Depth across every discipline. · Judgement, relationships and execution — applied together. · Work with a team built for complex decisions.
- **Internal links:** → Contact (CTA), Home.

### Contact — `contact.html`
- **URL slug:** `/contact`
- **Meta title:** `Contact — Lowick Hedry`
- **Meta description:** *Start a conversation with Lowick Hedry. Whether you are navigating a planning challenge, policy issue, reputational question or strategic decision, our team can help you find the clearest route forward.*
- **H1:** Start a conversation
- **H2 structure:** Speak to the team. · You do not need to have every detail defined.
- **Internal links:** → Team, Home, Expertise.

*Note: meta titles/descriptions are already set in each file's `<head>`. Add `og:image`, a `sitemap.xml`, `robots.txt` and structured data (Organization / LocalBusiness schema with both office addresses) during production hardening.*

---

## Content still required from the client

| Item | Where it appears | Status |
| --- | --- | --- |
| Confirmed **projects delivered** figure | Home → proof/data ("XXX+") | **Placeholder — marked [TBC]** |
| Confirmed **London boroughs** figure | Home → proof/data ("XX") | **Placeholder — marked [TBC]** |
| Final **office addresses** (London / Cambridge) | Footer + Contact | Using brief values — please confirm |
| **Phone number** | Footer + Contact | Using +44 (0) 203 633 0763 — please confirm |
| **Email address** | Footer + Contact | Using hello@lowickhedry.com — please confirm |
| **Team — roles & bios** for Sam, Kevin, Oscar | Team → leadership | **Placeholder text** |
| **Wider team** names, roles, photos | Team → wider team grid | **"Name TBC" placeholders** |
| Final **testimonials** (×3) + attribution | Home → testimonials | **Lorem-ipsum placeholders** |
| Final **client logo files** | Home → logo stripe | **Text wordmarks as placeholders** |
| **Podcast links** (YouTube / Spotify / Apple) | Footer | Linked to `#` — awaiting URLs |
| **Policy pages** (Privacy / Cookie / Modern Slavery) | Footer | Linked to `#` — awaiting pages |
| **LinkedIn URL** | Footer + Contact | Linked to `#` — awaiting URL |

## Recommended next steps (without expanding scope)

1. **Wire the contact form** to a real endpoint and add basic validation + a success/thank-you state.
2. **Swap text wordmarks** in the logo stripe for the supplied client logo files (mono/greyscale to keep it understated).
3. **Drop in the confirmed stats** and remove the [TBC] markers.
4. **Add the senior bios** and replace the wider-team placeholders as headshots and names are confirmed.
5. **Production hardening:** favicon set, `og:image`, sitemap, robots, Organization schema, analytics, and a cookie-consent banner tied to the Cookie Policy.
6. Consider a light **"Insights / Political Business podcast"** teaser as a future page once there is content to support it — kept out of v1 to stay focused.
