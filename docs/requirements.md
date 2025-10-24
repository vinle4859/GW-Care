## Mental Wellness Prototype Requirements Specification

### 1. Overview
- **Purpose**: Define the functional, non-functional, and visual requirements for the mental wellness web prototype targeting Vietnamese users (English secondary), enabling rapid iteration toward MVP validation.
- **Product Goals**:
  - Provide immediate self-help tools (check-in, guided plan, emotion tracking).
  - Offer supportive AI interactions while showcasing future premium human services.
  - Deliver a calm, trustworthy experience aligned with the specified style guide.
- **Platforms**: Responsive web application (desktop, tablet, mobile) with Progressive Web App (PWA) capabilities.

### 2. User Roles & Assumptions
- **Primary User**: Individual seeking mental wellness support (no authentication required).
- **Secondary Stakeholders**: Counselors/doctors (viewed only via premium showcase pages), internal moderators.
- Prototype assumes single-device usage with optional anonymous session persistence.

### 3. Functional Requirements

#### FR-1 Initial Psychological Check-In
1. Present a multi-step wizard (3â€“5 screens) guided by the mascot.
2. Collect:
   - Primary concern (dropdown).
   - Current mood (emoji scale).
   - Desired outcome (goal selection).
   - Optional free-text note.
3. Provide Vietnamese copy by default with English toggle.
4. Save responses to session state (localStorage + in-memory).
5. Trigger FR-2 (Support Plan generation) upon completion.

#### FR-2 AI-Generated Personal Support Plan
1. Create a 4-week plan immediately after FR-1 using persona-based templates enhanced by lightweight AI prompts.
2. Display plan as four weekly cards, each with:
   - Theme summary.
   - Daily micro-goals (3â€“5 activities).
   - Quick actions: `Complete`, `Snooze`, `Replace`.
3. Allow users to revisit and adjust plan from dashboard.
4. Store plan in session state with ability to regenerate after FR-6 (Wellness Test).

#### FR-3 Daily Emotion Tree
1. Render a month-long SVG tree with 30 branches (one per day) and up to 4 nodes per day (morning, midday, evening, night).
2. Provide emotion selector buttons (4â€“5 base emotions) each with intensity slider.
3. Logging an emotion spawns a leaf:
   - Color mapped to emotion family/intensity using gradients drawn from the core palette (deep indigo through blush).
   - Tooltip or modal surfaces timestamp and optional reflection note.
4. Animate leaf growth and track streaks; at month end, play bloom animation and allow export (PNG/SVG).
5. Permit users to view previous months (session-limited history).
6. Include a "See a full tree" demo toggle that temporarily reveals a fully populated example, clearly labeled as a preview without altering the user's actual data.

#### FR-4 Suggested Daily Activities & Checklist
1. Present daily habit list derived from FR-2.
2. Each activity supports `Mark Complete`, `Snooze`, `Replace`.
3. Checklist progress updates mascot feedback and optional encouragement messages.
4. Capture completion stats for future analytics (local only in prototype).

#### FR-5 AI Chat Companion
1. Provide 24/7 chat module with conversation history (last 20 messages).
2. Respect selected language for prompts and responses.
3. Use server proxy to call LLM with safety moderation.
4. Allow user to clear chat history at any time (session purge).

#### FR-6 AI Voice Chat (Speech-to-Text)
1. Offer microphone button inside chat; when pressed:
   - Start listening via Web Speech API (if available).
   - Display live transcript; let user edit before sending.
2. For unsupported browsers, grey out the button with tooltip explaining limitation.
3. Support Vietnamese recognition where available; fall back to English recognition otherwise.

#### FR-7 Periodic Mental Wellness Test
1. Prompt user every 30 days (local reminder) to retake condensed check-in.
2. Prefill previous answers for quick comparison.
3. Show delta summaries (e.g., â€œStress decreasedâ€) via simple charts.
4. Regenerate support plan when user accepts updates.

#### FR-8 Premium Tier Showcases
1. Provide two static pages:
   - **Level 1 - Counselors**: overview, benefits, sample testimonials, session highlights, and pricing tile for **Tier 1** (99,000 VND).
   - **Level 2 - Doctors**: overview, medical considerations, session highlights, and pricing tile for **Tier 2** (159,000 VND).
2. Present the three business tiers (Free, Tier 1 - 99,000 VND, Tier 2 - 159,000 VND) in a responsive pricing panel marked "View only - prototype" with inactive action buttons.
3. Include messaging that booking and waitlist features are coming soon; do not collect user data in this prototype.
4. CTA buttons link from dashboard banners and AI chat suggestions to these informational pages.

#### FR-9 Personalized Profile Card
1. Dashboard card displays nickname, date of birth (optional), status tagline.
2. Inline edit controls with validation and immediate visual feedback.
3. Integrates mascot variant referencing user status (e.g., â€œExplorerâ€ badge).

#### FR-10 Bilingual Support
1. Global language toggle (Vietnamese default, English secondary).
2. All copy, error messages, and AI prompts localized.
3. Persist language preference in session state.
4. Provide translation QA checklist before release.

#### FR-11 Data & Privacy Controls
1. Generate anonymous session ID on first load.
2. Store sensitive data client-side only for prototype.
3. Provide â€œReset my dataâ€ action clearing local storage and reload.
4. Display concise privacy notice explaining data handling.

#### FR-12 Mascot Guidance
1. Mascot appears:
   - On check-in screens with empathetic prompts.
   - Dashboard hero with contextual encouragement (based on FR-3/FR-4 progress).
   - When users access premium pages (inviting to learn more).
2. Mascot expressions change according to user trend segments (uplift, neutral, needs support).

### 4. Non-Functional Requirements
- **Performance**: Initial load < 2.5 MB, interactive within 3 seconds on mid-tier mobile (3G throttling).
- **Accessibility**:
  - WCAG 2.1 AA color contrast (palette below respects ratios).
  - Keyboard navigable components, ARIA labels for emotion leaves and chat controls.
  - Provide text alternatives for audio/voice features.
- **Security & Privacy**:
  - API keys stored server-side; client uses proxy endpoints.
  - LLM moderation filters for harmful content.
  - Display clear disclaimers that the app is not a substitute for emergency services; provide hotline links.
- **Localization**: Support left-to-right languages; ensure strings are adaptable in length.
- **Analytics**: Event hooks for check-in completion, plan interactions, chat usage (prototype-ready with toggle).
- **Maintainability**: Component-based architecture, TypeScript typings, lint/format enforcement per `stack_requirements.md`.

### 5. Style & Theme Guidelines

#### Visual Identity
- **App Mascot**: Friendly companion guiding onboarding, check-ins, and dashboard. Keep soft outlines, rounded shapes, and subtle facial expression changes (calm smile, empathetic concern, celebratory cheer).
- **Color Palette** (dark to light):
  - Shade 01 `#2A2F4F` for navigation chrome, headings, and structural accents.
  - Shade 02 `#917FB3` for primary buttons, progress indicators, and key component fills.
  - Shade 03 `#E5BEEC` for cards, secondary surfaces, and gentle gradients.
  - Shade 04 `#FDE2F3` for page backgrounds, highlights, and calming ambient washes.
  - Gradients can blend Shade 01 through Shade 03 to echo the mobile inspiration while staying legible on web.
- **Typography**: `PT Sans`, 16px base size, 1.5 line height. Heading hierarchy uses semi-bold weights with sentence case.
- **Iconography**: Rounded icons with simple line work; prefer `#917FB3` strokes on light fills so they read on desktop and mobile.
- **Layout**: Responsive web-first canvas with generous whitespace. Cards keep 8px radius and soft shadows `rgba(42,47,79,0.12)` to avoid heavy contrast.
- **Motion**: Gentle easing (`cubic-bezier(0.33, 1, 0.68, 1)`) for 200-400 ms transitions; respect prefers-reduced-motion in CSS.

#### Component-Level Styling
- **Navigation**: Top bar in `#2A2F4F` with white logo/labels; active state shows a `#917FB3` underline and subtle glow.
- **Buttons**: Primary background `#917FB3` with text `#FDE2F3`; hover shifts toward `#805EA7`. Secondary buttons outlined in `#2A2F4F` with `#E5BEEC` fill on hover.
- **Forms**: Inputs use 1px `#917FB3` border, 6px radius, and a `#E5BEEC` focus ring.
- **Emotion Buttons**: Circular controls with gradients from `#917FB3` to `#E5BEEC` plus drop shadows `rgba(42,47,79,0.2)` when selected.
- **Chat Panel**: User messages in `#2A2F4F` bubbles, AI responses in `#E5BEEC`; timestamps in `#917FB3`.
- **Premium Showcase**: Responsive three-tier pricing grid highlighting Free, Tier 1 (99,000 VND), and Tier 2 (159,000 VND) with a "View only - prototype" ribbon over inactive CTAs.
- **Prototype View-Only Labels**: Settings and other placeholder sections must display a "View only" badge and disabled controls to communicate roadmap context.


### 6. Content Requirements
- Provide localized strings for all UI elements, onboarding scripts, and AI system prompts.
- Include disclaimers in both languages directing to emergency contacts.
- Prepare sample activity content (minimum 20 entries) categorized by mood/goal.
- Curate initial AI prompt templates (compassionate tone, emergency escalation guidance).
- Premium showcase pages require sample testimonials (placeholder text allowed), FAQ entries, and pricing copy for Free, Tier 1 (99,000 VND), and Tier 2 (159,000 VND).

### 7. Dependencies & Integration Notes
- Refer to `stack_requirements.md` for tooling versions.
- AI chat uses server proxy to chosen LLM provider; ensure moderation API configured.
- Optional integrations: email waitlist (Resend/Brevo), analytics (Plausible/PostHog).

### 8. Acceptance Criteria
- All functional requirements FR-1 through FR-12 demonstrably working in Vietnamese.
- English toggle switches full UI content (excluding any copy still in translation backlog).
- Emotion Tree exports a shareable asset reflecting the latest monthâ€™s data.
- Voice chat gracefully degrades on unsupported browsers.
- Premium showcase captures waitlist form submissions successfully.
- Setup guide followed by non-technical tester without blocking issues.

### 9. Open Questions / Future Considerations
- Decision on long-term persistence (Supabase vs. in-browser only).
- Selection of LLM provider for production (cost, latency, language support).
- Path toward native wrappers (React Native/Expo) once prototype validated.
- Compliance requirements (HIPAA, GDPR) for eventual premium tiers.

This specification should guide planning, design, and development for the prototype phase while keeping future expansion in mind.

