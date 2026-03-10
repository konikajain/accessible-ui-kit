# Accessible UI Kit ♿

An interactive guide to WCAG 2.1 accessibility patterns — showing the **wrong way vs the right way**, side by side, with real keyboard and screen reader behavior.

Live Demo → [accessible-ui-kit.vercel.app](https://accessible-ui-kit.vercel.app/)

---

## Why I built this

At Raja Software Labs I improved accessibility compliance by 25% across LinkedIn Games production UI. This project documents the exact patterns I applied — focus management, ARIA labels, color contrast, and form accessibility.

Most frontend developers treat accessibility as an afterthought. This project shows I treat it as a first-class concern.

---

## What's inside

### 1. Focus Management — WCAG 2.1.1, 2.4.3
- Side by side comparison of `outline: none` (wrong) vs `focus-visible` (correct)
- Focus trap in modal — Tab cycles only within the modal, Escape closes it and returns focus to trigger
- Every interaction logged so you can see exactly what a keyboard user experiences

### 2. ARIA Labels — WCAG 4.1.2
- Icon buttons without labels vs with `aria-label` — screen reader simulation log shows the difference
- `aria-expanded` on accordion — announces open/closed state to screen readers
- `aria-live` region — dynamic announcements for loading states and counter updates
- Semantic HTML — div vs button, why it matters for keyboard access

### 3. Color Contrast — WCAG 1.4.3
- Live contrast ratio calculator using the real WCAG luminance formula
- Shows AA Large (3:1), AA Normal (4.5:1), and AAA (7:1) pass/fail in real time
- 6 preset examples of common mistakes developers make
- Live preview shows exactly how chosen colors look on real text

### 4. Form Accessibility — WCAG 1.3.1, 3.3.1, 3.3.2
- Inaccessible form vs fully accessible form side by side
- Proper label linking via htmlFor/id
- Live validation with `role="alert"` error announcements
- `aria-invalid`, `aria-describedby`, `aria-required` wired correctly
- Error summary on failed submit
- Full accessible form checklist

---

## How it maps to my resume

| Resume bullet | Project section |
|---|---|
| *"Enhanced WCAG compliance by 25%"* | All 4 tabs |
| *"ARIA, Semantic HTML"* | ARIA Labels tab |
| *"Accessibility best practices in code reviews"* | Form checklist |
| *"LinkedIn Games — millions of DAU"* | Context for why scale makes this critical |

---

## Key patterns used
```jsx
// Visible focus indicator
button:focus-visible {
  outline: 2px solid #34d399;
  outline-offset: 2px;
}

// ARIA label on icon button
<button aria-label="Delete item">🗑️</button>

// Live region for dynamic content
<div aria-live="polite">Content updates announced automatically</div>

// Accessible form field
<label htmlFor="email">Email Address</label>
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">⚠ {error}</span>
```

---

## Run locally
```bash
git clone https://github.com/konikajain/accessible-ui-kit.git
cd accessible-ui-kit
npm install
npm run dev
```

Open http://localhost:5173

---

## Other projects

- [React Performance Lab](https://github.com/konikajain/react-perf-dashboard) — useMemo, debounce, throttle, code splitting
- [GraphQL Search Bar](#) *(coming soon)*
- [Virtualized Data Table](#) *(coming soon)*

---

Built by [Konika Jain](https://linkedin.com/in/yourprofile) — Frontend Engineer
