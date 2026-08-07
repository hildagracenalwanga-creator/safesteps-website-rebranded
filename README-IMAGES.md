# Adding Your Own Images

The site is already wired up to look for images at the paths below. Just drop your files in with these exact names (or update the `src=` in the HTML if you use different names), and they'll appear automatically.

## Logo
`images/Logo.png` — used site-wide in the header. It has been enlarged (132px on desktop) so the consultancy name printed on the logo itself is readable; the separate "Safe Steps Training Services" text label has been removed from the header since the name is already on the logo.

## Founder & Co-Founder photos (about.html)
- `images/team/founder.jpg` — Hilda Grace Nalwanga (Founder)
- `images/team/cofounder.jpg` — Annah Mirembe (Co-Founder)

Until you add these files, the broken-image icon is automatically hidden (via `onerror`), so the page still looks clean.

## Nurture Orbit program logo (nurture-orbit.html)
- `images/nurture-orbit-logo.png` — shown at the top of the hero section on the Nurture Orbit Collective page. Same graceful hide-until-added behavior as the other images above.

## Blog post photos (blog.html)
Each post looks for an image at `images/blog/<name>.jpg`:
- `images/blog/mentors-and-mentees.jpg`
- `images/blog/beyond-the-noise-and-silence.jpg`
- `images/blog/power-of-small-decisions.jpg`
- `images/blog/dying-rose.jpg`
- `images/blog/a-table-for-one.jpg`
- `images/blog/stages-faces-and-fares.jpg`
- `images/blog/one-voice-one-team.jpg`

Same as above — missing files simply hide gracefully until you add them.

## Social Links
- Instagram and TikTok icons (via Font Awesome) are in the site footer on every page.
- The Founder's LinkedIn link appears only on her card on the About page (about.html), since it's her personal LinkedIn profile.
