# Lifeline Blood Donor Network — Design System

## 1. Design Philosophy

Lifeline should feel:

- Human
- Trustworthy
- Modern
- Calm under pressure
- Accessible
- Action-oriented

The visual language combines a clean SaaS dashboard structure with warm humanitarian blood-donation imagery.

Avoid visual clutter. Important actions, especially emergency workflows, should be immediately understandable.

## 2. Color Palette

### Primary

```text
Primary Red:       #D62828
Deep Red:          #A4161A
Light Red:         #FDE8E8
```

### Neutrals

```text
Background:        #F5F7FA
Surface:           #FFFFFF
Primary Text:      #1F2937
Secondary Text:    #64748B
Border:            #E2E8F0
```

### Semantic

```text
Success:           #16A34A
Warning:           #F59E0B
Error:             #DC2626
Info:              #2563EB
```

Do not introduce arbitrary colors for individual pages. Use semantic tokens.

## 3. Typography

Preferred font family:

```text
Inter, system-ui, sans-serif
```

Suggested hierarchy:

| Element | Size | Weight |
|---|---:|---:|
| Display | 40–48px | 700 |
| H1 | 32–40px | 700 |
| H2 | 24–30px | 700 |
| H3 | 18–22px | 600 |
| Body | 14–16px | 400 |
| Small | 12–13px | 400/500 |
| Button | 14–15px | 600 |

Use comfortable line-height and avoid overly dense text.

## 4. Spacing

Use a 4px base scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

Primary page padding:
- desktop: 24–32px
- tablet: 20–24px
- mobile: 16px

## 5. Border Radius

```text
Small controls: 8px
Inputs/buttons: 10px
Cards: 14–16px
Large feature cards: 20px
Pills/badges: 999px
```

## 6. Shadows

Use subtle shadows only:

```text
Card: 0 2px 10px rgba(15, 23, 42, 0.05)
Elevated: 0 8px 24px rgba(15, 23, 42, 0.08)
```

Do not use heavy/glossy shadows.

## 7. Buttons

### Primary
- Red background
- White text
- Clear hover state
- 10px radius

### Secondary
- White/surface background
- Neutral border
- Dark text

### Destructive
- Red/error semantic treatment
- Require confirmation for irreversible actions

### Icon Button
- Square hit area
- Tooltip/accessible label
- Never rely on icon alone when meaning is ambiguous

## 8. Cards

Cards are the primary information containers.

Rules:
- White background.
- 1px border or subtle shadow.
- 14–16px radius.
- Consistent internal padding.
- Clear title/value hierarchy.

Dashboard KPI cards should use:
- icon
- primary metric
- label
- optional trend indicator

## 9. Inputs and Forms

- Labels must be visible.
- Use clear placeholder text only as supporting information.
- Show validation near the field.
- Use red only for actual errors.
- Disable submit while a request is processing.
- Preserve user input after validation failures.

## 10. Navigation

### Public Navbar
- Logo
- Main links
- Find Blood CTA
- Become a Donor CTA
- Login/account

### Admin Sidebar
Sections:
- Dashboard
- Camp Management
- Donor Management
- Request Management
- Communication
- Reports
- Settings

Active item uses light red background + primary red indicator.

## 11. Tables

Desktop tables should:
- have clear headers;
- use compact rows;
- use status badges;
- keep primary actions visible;
- support pagination/filtering.

Mobile:
- transform into stacked cards or horizontal scroll only when necessary.

## 12. Modals

Use modals for:
- confirmations
- short forms
- focused detail views

Do not put long multi-step workflows into small modals.

## 13. Badges

Examples:

```text
Active      → Success
Pending     → Warning
Rejected    → Error
Verified    → Success
In Progress → Info/Warning
Critical    → Error
```

Text must remain understandable without color.

## 14. Icons

Use one consistent icon family throughout the product.

Icons should:
- reinforce meaning;
- have accessible labels when interactive;
- not replace essential text.

## 15. Loading States

Use:
- skeletons for tables/cards;
- spinners for short actions;
- disabled controls during mutation.

Avoid blank screens during loading.

## 16. Empty States

Every major collection needs an intentional empty state.

Example:

```text
No pending donor approvals
There are no donor applications waiting for review.
```

Include a relevant next action when appropriate.

## 17. Error States

Errors should:
- explain what happened;
- avoid technical jargon;
- offer retry where useful;
- preserve entered data.

Emergency workflows should make failure especially visible.

## 18. Hover / Focus

- Hover: subtle surface/border change.
- Focus: clearly visible outline/ring.
- Keyboard focus must never be removed.

## 19. Animation

Keep animations subtle:

- 150–250ms for hover/transitions.
- Small fade/slide for panels.
- Avoid distracting continuous animations.
- Respect `prefers-reduced-motion`.

## 20. Responsive Breakpoints

Tailwind-oriented breakpoints:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Primary design targets:
- Mobile: 360–639px
- Tablet: 640–1023px
- Desktop: 1024px+

## 21. Mobile Rules

- Sidebar becomes a drawer.
- Tables become cards or controlled horizontal scrolling.
- Primary CTA remains easy to reach.
- Forms use full-width controls.
- Avoid tiny tap targets.
- Keep emergency actions visually prominent.

## 22. Imagery

Use:
- blood-drop/heart symbolism;
- real human/community imagery where appropriate;
- soft red gradients for hero areas.

Do not use graphic medical imagery.

## 23. Dashboard Visual Language

Admin screens should consistently use:
- light background;
- white cards;
- navy/dark text;
- Lifeline red for primary actions;
- semantic green/yellow/blue states;
- rounded cards;
- generous whitespace;
- concise charts.

> **Detailed UI/UX reference:** See `ui-ux.md` for the approved screen-level visual and interaction specification used by the Lifeline page designs.
