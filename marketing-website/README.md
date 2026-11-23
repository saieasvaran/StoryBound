# Storybound: The Lost Library — marketing website

A static responsive marketing landing page, designed for the ATP Coursework 1 (2026/27) B8 landing-page criterion. This is a **marketing site**, not the downloadable game. It uses the team's supplied fantasy castle and Lumi character artwork.

## Getting started

1. Unzip the project and keep all files and the `assets/` folder together.
2. Preview locally: from this folder, run `python -m http.server 8000` and visit `http://localhost:8000`.
3. Open `site-config.js` and enter the real **team names/roles**, **team email** and working **social links**. Until this is done, the site intentionally displays a placeholder rather than invented contact details.
4. The three interactive demos under `#demo` are short *marketing samples*, not exports of the team’s clickable Figma prototype. Add actual Figma screenshots (or a separate approved screenshots gallery) before the viva to meet the specification explicitly. The mini-games do not save learning progress.
5. Review `privacy.html` with your team and confirm the actual data controller/contact address, data-retention period and hosting/form processing arrangements before collecting submissions.
6. Commit the complete website folder to the team's Git repository, including asset attribution and AI-use declaration where required.

## Get the CTA / interest form working

The form has **Netlify Forms** markup (`data-netlify="true"`), `method="POST"`, a hidden `form-name`, honeypot field and a configured thank-you page. It is **not a working cloud-backed waitlist until deployed**. It deliberately does not claim success in local preview.

**Recommended deployment:**

1. Create a Netlify site by connecting the team's Git repository or uploading this site's folder to Netlify. Use a static publish directory containing `index.html`.
2. Enable / verify **form detection** in Netlify, deploy, and check that the `storybound-interest` form appears under Forms. If necessary, redeploy after detection is enabled.
3. Submit a test adult email on the live site, confirm it appears in the site's form submissions, and verify the thank-you page loads. Delete the test record afterwards if appropriate.
4. Connect the team's own **.com or .lk domain** to the Netlify site and ensure HTTPS is active. Your course specification requires the website to be live on your own domain at the viva; a free `.netlify.app` subdomain does **not** satisfy that hosting requirement.
5. Update `og:image` in `index.html` to an **absolute HTTPS URL** such as `https://YOUR-REAL-DOMAIN.lk/assets/social-preview.jpg` for reliable social sharing. Add a canonical link after the domain is fixed. Do not leave fake domains in the code.
6. Test form delivery and the privacy notice again from the final custom domain. Ensure a real team member is responsible for receiving and handling contacts.

**If hosting elsewhere:** Replace Netlify's form processing with a tested alternative (for example a backend endpoint or trusted form service). An ordinary static HTML upload alone does not store email sign-ups.

## Accessibility and quality checks

- Semantic headings and descriptive alternative text; skip link; visible keyboard focus.
- Mobile navigation keyboard usable; FAQ uses native `<details>`.
- Reduced-motion settings respected; images served as optimised WebP.
- All meaningful links are real anchors; unset social links are hidden rather than left broken.
- Descriptions are appropriately cautious. The game is **in development**. The three game demos are local playable samples; the dashboard is an illustrative concept. The chatbot is a keyword-based scripted preview, **not connected to a live AI service**.
- Test 360px mobile, 768px tablet, 1280px desktop, and keyboard-only navigation. Run an accessibility/SEO check such as Lighthouse after hosting.

## File map

- `index.html` — one-page marketing website
- `styles.css` — styling and responsive rules
- `script.js` — mobile navigation, team/social rendering, subtle scroll effects and local-form notice
- `interactive-demos.js` — working mini-game demos (sound, matching, spelling) and the scripted parent chatbot preview, entirely client-side
- `site-config.js` — your real team/contact/social details
- `privacy.html` — privacy notice template (requires local review)
- `thank-you.html` — form success page for a properly configured hosted backend
- `favicon.svg`, `assets/social-preview.jpg` — favicon and social preview
- `assets/*.webp` — optimised copies of the team's supplied castle and owl imagery

## Coursework B8 check

- [x] Product title, custom logo emblem and value proposition
- [x] Problem and proposed solution
- [x] Feature explanation and 3 mini-games with correct final names
- [x] Three playable mini-game demonstrations and a scripted parent guidance chatbot; **supplement with actual Figma exports**
- [ ] Team names and roles from the real group (`site-config.js`)
- [ ] Real email and social links (`site-config.js`)
- [ ] Tested hosted CTA form & verified privacy information
- [ ] Hosted on group's `.com` / `.lk` domain via HTTPS
- [ ] Source committed to team repo and verified at viva
- [x] Responsive layout, keyboard support, alt text, SEO title/description, favicon, social preview asset

## Assets and provenance

Castle images and owl character derive from the assets the team provided in the conversation. The website's social-preview composition uses that same submitted artwork. The new cheerful, waving Lumi artwork in `assets/lumi-welcome.webp` is AI-generated from the team’s character reference and should be declared appropriately. Verify your team's rights to publish each illustration and accurately declare any generative-image or AI assistance, as required by the coursework.

## What visitors can try (no backend required)

- **Sound Land:** hear a word with browser speech synthesis and select a missing prefix/suffix.
- **Match Land:** hear a word card and pair it with the correct picture card.
- **Spell Land:** tap scrambled letter tiles in order to spell a pictured word.
- **Parent chat demo:** click a suggested parent question or type a short question and receive one of several scripted responses. There is **no actual AI model/API** here, and text is not sent to a server.

For the game audio, use Chrome/Edge/Safari in a normal browser and enable the system sound. Some browsers or local devices may not provide speech synthesis. The Sound and Match demos provide non-audio hints.

The registration form is still only a real waitlist after supported hosting is configured and tested. Replace all team placeholders, confirm site privacy notice, and link real social profiles before submission.


## Latest adjustments (22 November 2026)
- Match Land's word cards display text (CAT, DOG, SUN, MOON). Clicking any word card reads the entire word aloud using the browser's speech engine, if available. Pair it with its picture; the hint button offers a picture clue.
- The registration area positions the waving Lumi beneath its introductory text, rather than layering over text.
- Five member names are now set in `site-config.js`. Roles and photo paths remain empty until the team supplies them; entering them later will automatically populate the cards.


## Logo and subtle hover motion (22 November 2026)
- `assets/storybound-logo.png` is the real team logo supplied for the website. It appears in the navigation bar and footer.
- The hero uses the existing Lumi character PNG with CSS floating, magic sparkles and optional mouse-responsive perspective. **It is a 2D illustration with a 3D-like effect, not a real 3D character model.**
- The four "Little details. Big encouragement." cards rise on desktop hover, with a small pointer tilt and glow.
- Motion is minimized for touch visitors and disabled for people using the `prefers-reduced-motion` setting.
- The three playable previews and the parent chatbot demo are unchanged.


## Parent dashboard concept image (CW1)
- The **Progress at a glance** card on the main page displays the team-provided dashboard concept image inside the original small white dashboard-preview box.
- There is no dashboard launch link or standalone interactive dashboard page on this marketing site.
- The illustration shows invented/sample progress rather than real learner information. The actual parent dashboard belongs in the future downloadable game.


## Parent card sizing and Yoko portrait (22 November 2026)
- The two For Parents cards now stretch to the same height on desktop and tablet, while stacking naturally on mobile. The dashboard stays a static illustration inside its original card.
- Yoko Fernando's supplied portrait is stored at `assets/yoko-fernando.webp` and included in the first team card.
- The remaining four photos and all five roles are intentionally left blank until supplied.


## Interactive adventure walkthrough (22 November 2026)

The former static four-card **02 / The Adventure** section is now a self-contained, clickable Storybound journey. Visitors can move among four checkpoints using mouse, touch or keyboard (Left/Right arrow keys, Home/End, or Previous/Next buttons). Lumi follows the progress trail with gentle motion. Stage two includes three selectable animated castles; stage three offers a CAT word-to-picture practice sample with optional browser speech; stage four opens an illustrative storybook reward. These are marketing-only demonstrations and do **not** store learner progress or unlock actual game content. The section supports reduced-motion preferences.

New files: `journey.css` (styles), `journey.js` (step navigation and small demo interactions). Keep them beside `index.html` and retain their stylesheet/script references in the HTML.
