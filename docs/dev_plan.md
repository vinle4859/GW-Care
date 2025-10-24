1. Initial Psychological Check-In  
   - **Specification**  
     - Guided onboarding flow (3â€“5 screens) hosted in a modal wizard.  
     - Collect primary concerns, current mood, goal focus (e.g., stress relief, better sleep), and optional free-form note.  
     - Leverage the mascot for empathetic prompts in Vietnamese first, with English copy staged for later.  
     - Responses stored in a session-scoped state object; no persistent account required during prototype.  
   - **Implementation Approach**  
     - Build a React multi-step form using `react-hook-form` (or equivalent) with schema validation (Zod/Yup).  
     - Store answers in a `useSessionState` hook backed by localStorage for resilience; encrypt-at-rest deferred to full release.  
     - Route decisions through a rules matrix (JSON) so non-engineers can tune questions/weighting.  
     - Instrument analytics events for drop-off per step to iterate on copy.  
   - **Verification**  
     - Jest/RTL unit tests asserting validation rules, wizard navigation, and locale toggling.  
     - Playwright smoke path that completes the full check-in and confirms session persistence.  
     - Accessibility pass (keyboard traversal, focus order, ARIA labels on navigation buttons).  

2. AI-Generated Personal Support Plan  
   - **Specification**  
     - Produce a 4-week roadmap immediately after check-in, broken into weekly themes and daily micro-goals aligned with user inputs.  
     - Must surface in both Vietnamese and English, defaulting to Vietnamese.  
     - Provide quick editing: users can swap or snooze tasks without leaving the dashboard.  
   - **Implementation Approach**  
     - Translate check-in data into a normalized profile object (e.g., `need_focus`, `preferred_modalities`).  
     - Feed profile into a deterministic template engine: predefined plan blueprints keyed by persona, refined via light-weight AI call (optional).  
     - Persist plan in browser storage plus optional backend session for future sync.  
     - Render via reusable `WeekCard` components that also expose activity checklist hooks.  
   - **Verification**  
     - Unit tests covering persona-to-plan mapping and mutation handlers (`Complete`, `Snooze`, `Replace`).  
     - Integration test ensuring regeneration after check-in updates refreshes the displayed plan.  
     - Snapshot/visual regression on bilingual rendering of `WeekCard` components.  

3. Daily Emotion Tree  
   - **Specification**  
     - 30-branch SVG tree where each branch represents a day; branches subdivided into time slots (morning/noon/evening, expandable).  
     - Users log emotions by tapping rounded emotion buttons; each log spawns a leaf colored by emotion family/intensity and tied to notes.  
     - Month-end bloom animation and downloadable PNG/SVG export.  
     - Provide a "See a full tree" preview toggle that overlays a demo tree without altering real entries.  
   - **Implementation Approach**  
     - Craft base tree SVG asset using Shade 01 `#2A2F4F` for trunks and branches; compute branch node coordinates programmatically.  
     - Map emotions to tonal ramps that blend `#917FB3`, `#E5BEEC`, and `#FDE2F3`, reserving `#2A2F4F` for highest-intensity states.  
     - Manage logs in a `journalEntries` store; on render, translate entries into `<circle>`/`<path>` elements with easing transitions using D3 or React Spring.  
     - Implement tooltips/modal for leaf detail, leveraging accessibility attributes for keyboard navigation.  
     - Use `html-to-canvas` or native SVG serialization for exports.  
   - **Verification**  
     - Unit tests for data-to-visual mapping (leaf color, branch placement) and preview toggle behavior.  
     - Visual regression comparing default, populated, and preview states.  
     - Manual QA for export assets and screen-reader descriptions on leaves/tooltips.  

4. Suggested Daily Activities & Checklist  
   - **Specification**  
     - Each day shows 3â€“5 activities tied to the plan theme, with toggles to mark complete, snooze, or replace.  
     - Checklist progress influences mascot feedback and can trigger gentle encouragement.  
   - **Implementation Approach**  
     - Generate activity sets from the support plan, storing metadata (`duration`, `category`, `requires_ai`) in content JSON.  
     - Build a `DailyActivities` component with optimistic UI updates and local persistence.  
     - For replacements, surface a drawer pulling from a recommendation pool filtered by constraints.  
     - Log completion events for future analytics.  
   - **Verification**  
     - Component tests for state transitions and optimistic updates when toggling activity status.  
     - Integration test ensuring mascot feedback reacts to completion percentages.  
     - Accessibility check on keyboard operation of activity actions and focus management in replacement drawer.  

5. AI Chat Companion  
   - **Specification**  
     - 24/7 chat panel anchored to the dashboard, bilingual prompts, optional topic starter chips.  
     - Should reflect current plan context and recent emotion entries without exposing raw text.  
   - **Implementation Approach**  
     - Integrate a hosted LLM API with predefined system prompt emphasizing supportive tone and escalation boundaries.  
     - Use server-side proxy to redact personal identifiers and enforce rate limiting.  
     - Store conversation history ephemerally (browser memory + session cache) and purge after 24 hours for privacy.  
     - Add safety filters (moderation endpoint) before displaying AI responses.  
   - **Verification**  
     - Contract tests against the proxy to confirm request/response schema, error handling, and moderation fallbacks.  
     - E2E test simulating user chat in both languages with history trim at 20 messages.  
     - Content QA pass for disclaimer visibility and escalation messaging.  

6. Periodic Mental Wellness Test  
   - **Specification**  
     - Monthly reminder to retake the check-in with a condensed question set, surfacing trend deltas (e.g., stress decreased).  
     - Present results via progress cards and feed adjustments into the support plan.  
   - **Implementation Approach**  
     - Reuse the check-in wizard with prefilled answers; capture new responses under a `checkinHistory` array.  
     - Compute deltas client-side and visualize with small multiples (sparklines) in PT Sans.  
     - Prompt scheduling via local notifications (PWA) or email hooks once infrastructure allows.  
   - **Verification**  
     - Unit tests validating delta calculations across multiple check-in entries.  
     - E2E scenario verifying reminder prompt, retake flow, and plan regeneration.  
     - Regression test on chart accessibility (ARIA roles, text alternatives).  

7. Voice-to-Text Enhancement (Prototype Optional)  
   - **Specification**  
     - Users press and hold a mic button within chat to dictate; automatic transcription fills the input field for review before sending.  
     - Clearly communicates browser support and offers textual fallback.  
   - **Implementation Approach**  
     - Use the Web Speech API where available; wrap in a feature flag and detect locale support for Vietnamese.  
     - On unsupported browsers, grey out the control with helper tooltip.  
     - Debounce streaming transcripts and allow user edits prior to submission.  
   - **Verification**  
     - Browser matrix manual test plan covering supported and fallback states.  
     - Unit tests for transcription reducer (start/stop/reset) and edit confirmation logic.  
     - Accessibility audit ensuring mic control meets WCAG (labeling, focus, status updates).  

8. Premium Tier Showcases  
   - **Specification**  
     - Two informative pages highlighting counselor (Level 1) and doctor (Level 2) services with testimonials placeholders and future-state messaging.  
     - Showcase the Free, Tier 1 (99,000 VND), and Tier 2 (159,000 VND) offerings in a responsive pricing panel labeled "View only - prototype" with disabled action buttons.  
   - **Implementation Approach**  
     - Static React pages styled with the indigo-lavender palette; include FAQ accordions, illustrative session highlights, and pricing tiles per tier.  
     - CTA buttons route from dashboard/chat to these pages and reinforce future availability.  
     - Track analytics for page views and CTA clicks only (no form submission events).  
   - **Verification**  
     - Snapshot tests ensuring bilingual content, pricing tiers, and "coming soon" messaging render correctly.  
     - Manual QA confirming no network calls attempt to submit data and that disabled buttons convey view-only status.  
     - Accessibility review of FAQ accordion semantics, pricing card focus order, and assistive-text for view-only ribbons.  


9. Personalized Profile Card  
   - **Specification**  
     - Lightweight profile drawer showing nickname, DOB (optional), and current status tagline.  
     - Allows quick edits without full account system.  
   - **Implementation Approach**  
     - Create `ProfileContext` storing editable fields in localStorage.  
     - Expose inline edit controls with validation (DOB partial allowed).  
     - Surface avatar/mascot integration (e.g., mascot badge referencing user status).  
   - **Verification**  
     - Unit tests for validation logic and persistence behavior.  
     - Visual regression ensuring mascot badge and language toggle interplay.  
     - Manual QA verifying â€œReset my dataâ€ clears profile info.  

10. Bilingual Support Framework  
    - **Specification**  
      - Vietnamese-first experience with toggle to English.  
      - All copy, CTA text, and error messages sourced from translation files; emotion labels and prompts localized.  
    - **Implementation Approach**  
      - Adopt `react-i18next` (or similar) with JSON namespace structure (`common`, `checkin`, `activities`).  
      - Provide locale context to AI prompts so chat responses align with selected language.  
      - Automate fallback checks to avoid missing translations; implement content QA checklist before release.  
    - **Verification**  
      - Automated lint rule or test that scans for untranslated keys (fallback warnings fail CI).  
      - E2E toggle test validating full UI swap between VI and EN.  
      - Localization QA checklist sign-off covering tone and truncation in both languages.  

11. Visual & Mascot Integration  
    - **Specification**  
      - Friendly mascot present on onboarding, check-ins, and dashboard banners, adapting expressions to user state.  
      - Consistent use of palette (#2A2F4F, #917FB3, #E5BEEC, #FDE2F3) and PT Sans typography across web breakpoints.  
      - Settings and other prototype-only surfaces show "View only" messaging so stakeholders understand disabled controls.  
    - **Implementation Approach**  
      - Develop reusable illustration components (SVG) parameterized by mood (neutral, encouraging, celebratory).  
      - Set up a theming system (CSS variables) carrying the four-core palette plus accessible text contrasts.  
      - Include motion via CSS transitions (300-400ms, cubic-bezier) with reduced-motion support.  
    - **Verification**  
      - Snapshot tests for mascot state permutations and theme tokens.  
      - Motion QA ensuring reduced-motion media query disables non-essential animations.  
      - Contrast checks validating palette stays within WCAG 2.1 AA.


12. Data Layer & Privacy Guardrails  
    - **Specification**  
      - No full authentication; rely on anonymous session IDs with optional email capture.  
      - Clearly communicate data usage and allow users to reset their session.  
    - **Implementation Approach**  
      - Generate UUID on first visit; store in http-only cookie if backend present or localStorage fallback.  
      - Provide â€œReset my dataâ€ action purging local storage and clearing caches.  
      - Prepare backend schema drafts (if needed) emphasizing encryption-at-rest and audit logging for future premium rollout.  
    - **Verification**  
      - Unit tests for session generator and reset workflow (ensuring all stores clear).  
      - Security review checklist covering proxy endpoints and local storage contents.  
      - Manual confirmation that privacy notice surfaces on first load.  

13. QA Infrastructure & Tooling  
    - **Plan**  
      - Establish a Playwright test suite with tagged journeys (`smoke`, `regression`) wired into CI.  
      - Configure Jest with `jsdom` environment, RTL helpers, and coverage thresholds per feature module.  
      - Integrate axe accessibility checks into key UI component tests and nightly e2e runs.  
      - Set up visual regression snapshots via Chromatic or Storybook test runner for high-variance components (emotion tree, mascot states).  
