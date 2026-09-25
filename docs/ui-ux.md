# Lifeline Blood Donor Network — UI/UX Specification

**Document:** `ui-ux.md`  
**Status:** Approved visual direction  
**Purpose:** Define the normal UI/UX style used across the Lifeline website and dashboard screens.

---

# 1. Design Direction

Lifeline should use a **clean, modern, trustworthy healthcare/community SaaS design**.

The visual style used in the approved screen concepts is:

- Clean white interface
- Soft light-gray page background
- Navy/dark-blue typography
- Lifeline red as the primary action color
- Soft pastel status colors
- Rounded cards
- Very subtle shadows
- Spacious layouts
- Clear visual hierarchy
- Friendly human-centered imagery
- Simple line icons
- Professional dashboard structure

The interface should feel **reliable and calm**, while emergency blood-related actions should remain visually prominent.

> Design principle: **People first, information second, decoration third.**

---

# 2. Design Goals

The UI should communicate:

1. Trust
2. Safety
3. Urgency when required
4. Community
5. Simplicity
6. Professionalism
7. Accessibility

The user should understand the purpose of a screen within a few seconds.

---

# 3. Visual Style

## Overall Look

Use:

```text
Background      → #F7F9FC
Cards           → #FFFFFF
Primary Red     → #E53935
Deep Red        → #C62828
Navy            → #101B5C
Secondary Blue  → #2563EB
Success Green   → #16A34A
Warning Orange  → #F59E0B
Purple          → #7C3AED
Text            → #111827
Muted Text      → #64748B
Border          → #E5E7EB
```

The red color represents Lifeline and important actions.

Do not use red for every element. Red should remain meaningful.

---

# 4. Color System

## Primary

```text
Lifeline Red: #E53935
Dark Red:     #C62828
Light Red:    #FEECEC
```

Use for:

- Primary CTA
- Active navigation
- Emergency status
- Important alerts
- Blood-related icons
- Selected states

## Navy

```text
Navy:         #101B5C
Dark Navy:    #0B1448
Light Navy:   #EAF0FF
```

Use for:

- Headings
- Main navigation text
- Dashboard titles
- Important labels

## Blue

```text
Blue:         #2563EB
Light Blue:   #EAF2FF
```

Use for:

- Information
- Donor-related actions
- Links
- Neutral interactive states

## Green

```text
Green:        #16A34A
Light Green:  #EAF8EF
```

Use for:

- Verified
- Approved
- Fulfilled
- Active
- Successful operations

## Orange

```text
Orange:       #F59E0B
Light Orange: #FFF6DD
```

Use for:

- Pending
- Warnings
- Capacity alerts

## Purple

```text
Purple:       #7C3AED
Light Purple: #F2EAFF
```

Use for:

- Volunteers
- Secondary analytics
- Special categories

---

# 5. Typography

## Font

Use:

```text
Inter, system-ui, sans-serif
```

Next.js implementation should load Inter through the preferred Next.js font mechanism.

## Typography Scale

```text
Hero heading:       48–64px / 700
Page heading:       32–40px / 700
Section heading:    20–24px / 700
Card heading:       16–20px / 600
Body:               14–16px / 400
Small text:         12–13px / 400
Button text:        14–15px / 600
KPI number:         26–34px / 700
```

Headings should generally use Navy.

Important words can use Lifeline Red.

Example:

```text
Impact in Numbers
```

with `Numbers` highlighted in red.

---

# 6. Layout System

## Desktop

Target:

```text
1440px × 900px
```

Minimum supported desktop width:

```text
1024px
```

Admin dashboard structure:

```text
┌───────────────┬─────────────────────────────────────┐
│               │ Header                              │
│               ├─────────────────────────────────────┤
│   Sidebar     │                                     │
│               │ Main Content                        │
│               │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

Recommended:

```text
Sidebar: 230–250px
Header:  70px
Content: flexible
```

## Main Content

Desktop page padding:

```text
24px–32px
```

Maximum content width:

```text
1440px–1600px
```

Avoid unnecessarily stretched content.

---

# 7. Public Website Layout

Public pages should use a lighter, marketing-oriented layout.

```text
Navbar
   ↓
Hero Section
   ↓
Trust / Impact Metrics
   ↓
Core Feature Section
   ↓
How It Works
   ↓
Camps / Blood Requests
   ↓
Community Impact
   ↓
CTA
   ↓
Footer
```

## Navbar

Desktop:

```text
[ Lifeline Logo ]

Home
Find Blood
Camps
Become a Donor
About
Contact

                    [Login] [Become a Donor]
```

The primary CTA should use Lifeline Red.

---

# 8. Hero Sections

Hero sections should use:

- Large heading
- Short supporting paragraph
- Primary CTA
- Secondary CTA
- Human/community image
- Soft red gradient or pale red background

Example layout:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Give Blood.                                         │
│  Save a Life.                                        │
│                                                      │
│  Connect with donors and blood donation camps.      │
│                                                      │
│  [ Find Blood ] [ Become a Donor ]                   │
│                                      [Image]         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Avoid excessive text inside the hero.

---

# 9. Admin Dashboard UX

The admin dashboard should look like a modern SaaS management platform.

## Header

```text
[☰] [Search donors, requests, camps...]

                         [Notifications]
                         [Profile]
```

Header height:

```text
68–72px
```

Background:

```text
#FFFFFF
```

Bottom border:

```text
#E5E7EB
```

---

# 10. Sidebar

The sidebar is persistent on desktop.

Structure:

```text
Lifeline Logo

Dashboard

CAMP MANAGEMENT
  Manage Camps
  Registrations
  Volunteers
  Camp Feedback

DONOR MANAGEMENT
  Donors
  Donor Approvals
  Blood Inventory

REQUEST MANAGEMENT
  Emergency Requests
  Request Verifications

COMMUNICATION
  Messages
  Notifications

REPORTS
  Analytics
  Export Data

SETTINGS
  Organization Profile
  Team Members
  Settings
```

## Sidebar Behavior

Active item:

```text
Background: #FEECEC
Text:       #E53935
Left bar:   #E53935
```

Inactive item:

```text
Text: #101B5C
```

Hover:

```text
Background: #F7F9FC
```

---

# 11. Page Header Pattern

Every dashboard page should use a consistent header.

Example:

```text
SMALL RED EYEBROW

Page Title
Short description explaining the purpose of the page.

                                      Optional action
```

Example:

```text
ANALYTICS

Impact in Numbers

Track donations, requests, camps and community growth.

                                      [Export Data]
```

Some major screens can use a wide visual banner below this area.

---

# 12. Banner Style

The approved Lifeline screens use a wide visual banner.

Recommended structure:

```text
┌─────────────────────────────────────────────────────────┐
│ Soft red background                                     │
│                                                         │
│ Page title             Handwritten-style campaign text │
│ Description                                      Image │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Use human-centered blood donation imagery.

The banner should never interfere with primary navigation or important controls.

---

# 13. KPI Cards

Dashboard KPI cards should be compact and readable.

Example:

```text
┌─────────────────────┐
│  👥                 │
│  1,248              │
│  Total Donors       │
│  ↑ 12% this month   │
└─────────────────────┘
```

Recommended:

- White background
- 14–16px radius
- Small icon container
- Large metric
- Short label
- Optional trend

Use semantic icon colors.

---

# 14. Cards

Standard card:

```text
Background: #FFFFFF
Border:     #E5E7EB
Radius:     14–16px
Padding:    20–24px
Shadow:     very subtle
```

Card title:

```text
16–20px
600 weight
Navy
```

Cards should have consistent spacing.

---

# 15. Tables

Tables are heavily used in admin pages.

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ Donor Management                         [Search] [Filter]   │
├──────────────────────────────────────────────────────────────┤
│ Name      Blood Group   Location    Status       Actions     │
│ Rahul     O+            Nagpur      Active       ...         │
│ Priya     A+            Pune        Pending      ...         │
└──────────────────────────────────────────────────────────────┘
```

Rules:

- Header background: very light gray/blue.
- Rows separated by subtle borders.
- Status displayed as badges.
- Actions aligned right.
- Use pagination for large datasets.
- Keep row height comfortable.

---

# 16. Status Badges

Use pill-shaped badges.

Examples:

```text
Active
Verified
Approved
Fulfilled
```

→ Green

```text
Pending
In Review
Waiting
```

→ Orange

```text
Urgent
Critical
Rejected
```

→ Red

```text
In Progress
Information
```

→ Blue

Text should remain readable without depending on color alone.

---

# 17. Forms

Forms should use a two-column layout on desktop when appropriate.

Example:

```text
┌─────────────────────────────────────────────┐
│ Create Camp                                 │
│                                             │
│ Camp Name             Location              │
│ [____________]        [____________]        │
│                                             │
│ Date                  Capacity              │
│ [____________]        [____________]        │
│                                             │
│ Description                                 │
│ [____________________________________]      │
│                                             │
│                      [Cancel] [Create Camp] │
└─────────────────────────────────────────────┘
```

On mobile:

```text
One column
```

All inputs require visible labels.

---

# 18. Emergency UX

Emergency blood requests require a stronger visual hierarchy.

Use:

```text
URGENT
```

with:

- red badge
- clear blood group
- required units
- hospital/location
- time requirement
- primary action

Example:

```text
┌──────────────────────────────────────────────┐
│ 🔴 URGENT                                    │
│                                              │
│ O+ Blood Required                            │
│ 4 Units                                      │
│ City Care Hospital — Nagpur                  │
│ Needed by 6:00 PM                            │
│                                              │
│ [ View Request ] [ Contact / Respond ]       │
└──────────────────────────────────────────────┘
```

Do not use flashing or aggressive animations.

---

# 19. Find Blood Page

The main interaction should be immediately visible.

```text
Find Blood

[ Blood Group ▼ ]
[ City / Location ]
[ Search ]

────────────────────────────────────

Available Donors

[ Donor Card ]
[ Donor Card ]
[ Donor Card ]
```

Donor cards should show only information necessary for the permitted workflow.

Do not expose private contact details publicly.

---

# 20. Camps Page

Camp listing cards:

```text
┌──────────────────────────────┐
│ Blood Donation Camp          │
│                              │
│ 📅 25 Sep 2026               │
│ 📍 Nagpur                    │
│ 👥 120 / 150 registered      │
│                              │
│ [ View Details ]             │
└──────────────────────────────┘
```

Use green for healthy capacity and orange/red for near-full capacity.

---

# 21. Notifications

Notifications should be grouped by category.

Categories:

```text
All
Unread
Donor Related
Requests
Camps
Verifications
System
```

Notification row:

```text
[Icon]  New Emergency Request
        A+ blood required at hospital...
        10 minutes ago
```

Unread notifications should have a visible but subtle indicator.

---

# 22. Analytics

Analytics pages should not feel overloaded.

Recommended hierarchy:

```text
KPI Cards
     ↓
Main Trends
     ↓
Distribution Charts
     ↓
Tables
     ↓
Impact Summary
```

Use charts for:

- donation trends
- request trends
- donor growth
- blood group distribution
- camp performance
- request status

Do not create charts just for decoration.

---

# 23. Profile Pages

Profile screens should use:

```text
Profile Header
      ↓
Basic Information
      ↓
Impact / Activity
      ↓
Preferences
      ↓
Security
```

Organization profile can include:

- Logo
- Banner
- Organization name
- Description
- Location
- Contact
- Mission
- Vision
- Social links
- Team
- Documents
- Impact statistics

---

# 24. Settings Page

Settings should use a left category navigation on desktop.

```text
Settings

General
Security
Notifications
Appearance
Language
Data & Privacy
Team & Permissions
Integrations
```

Right side contains the selected settings panel.

This pattern should remain consistent throughout the admin application.

---

# 25. Modals

Use modals for:

- Delete confirmation
- Approve/reject confirmation
- Short edit forms
- Quick details
- Export options

Avoid placing complete workflows inside a modal.

---

# 26. Toast Notifications

Use small top-right or bottom-right notifications.

Success:

```text
✓ Camp created successfully.
```

Error:

```text
! Unable to create camp. Please try again.
```

Warning:

```text
! Blood inventory is running low.
```

Info:

```text
i 5 new camp registrations.
```

Duration:

```text
3–5 seconds
```

Critical errors should remain visible until acknowledged.

---

# 27. Loading States

Use skeleton loaders for:

- Dashboard cards
- Tables
- Camp cards
- Donor lists
- Profile sections

Example:

```text
██████████████
██████
████████████████████
```

Avoid showing a blank white page while loading.

---

# 28. Empty States

Example:

```text
              [Illustration]

          No Camps Found

There are no camps matching your filters.

              [Create Camp]
```

Empty states should explain the situation and provide a useful next step.

---

# 29. Error States

Use:

```text
Something went wrong

We couldn't load this information.
Please try again.

[ Retry ]
```

Do not expose stack traces or technical errors to users.

---

# 30. Responsive Behavior

## Desktop

```text
Sidebar visible
Multi-column layouts
Large tables
Two-column forms
Dashboard grids
```

## Tablet

```text
Sidebar can collapse
Cards reduce columns
Tables become scrollable
Forms may become single column
```

## Mobile

```text
Sidebar → Drawer
Header → Compact
KPI grid → 1–2 columns
Tables → Cards / horizontal scroll
Forms → Single column
Buttons → Full-width where appropriate
```

---

# 31. Breakpoints

Use Tailwind breakpoints:

```text
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

Primary design target:

```text
Desktop: 1440px
Tablet:  768px
Mobile:  390px
```

---

# 32. Spacing

Use an 8px-oriented visual rhythm.

Common values:

```text
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Avoid inconsistent arbitrary spacing.

---

# 33. Border Radius

```text
Inputs:       10px
Buttons:      10px
Cards:        14–16px
Large cards:  18–20px
Badges:       999px
```

---

# 34. Shadows

Use subtle shadows.

```text
Card:
0 2px 10px rgba(15, 23, 42, 0.05)

Elevated:
0 8px 24px rgba(15, 23, 42, 0.08)
```

Avoid heavy shadows.

---

# 35. Icons

Use one consistent icon library throughout the application.

Recommended:

```text
Lucide Icons
```

Icon style:

- simple
- outline-based
- consistent stroke width
- approximately 18–22px in standard UI
- 24px+ for dashboard feature icons

Do not mix multiple unrelated icon styles.

---

# 36. Images

Preferred imagery:

- blood donation
- hands holding a heart/blood symbol
- volunteers
- donors
- community activities
- donation camps

Avoid:

- graphic medical imagery
- excessive stock-photo usage
- unrelated decorative photos

Images should support the message rather than dominate the interface.

---

# 37. Illustrations

Use minimal illustrations for:

- Empty states
- Success states
- Onboarding
- Error states

Illustrations should follow the same red/navy/pastel visual language.

---

# 38. Animation

Animations should be subtle.

Recommended:

```text
transition: 150–250ms
```

Use animation for:

- hover
- drawer opening
- modal opening
- dropdowns
- page transitions
- toast appearance

Avoid:

- flashing emergency elements
- excessive bouncing
- continuous animations
- distracting dashboard effects

Respect:

```text
prefers-reduced-motion
```

---

# 39. Accessibility

The website must support:

- keyboard navigation
- visible focus
- semantic HTML
- accessible labels
- sufficient color contrast
- screen-reader-friendly controls
- large enough touch targets

Minimum touch target:

```text
44 × 44px
```

Never communicate important information using color alone.

---

# 40. UX Writing

Use short, human language.

Prefer:

```text
Find Blood
```

instead of:

```text
Search for available blood donor resources
```

Prefer:

```text
Create Camp
```

instead of:

```text
Create a new blood donation campaign event
```

Emergency messages should be direct.

---

# 41. Primary CTA Rules

Each screen should have one clear primary action.

Examples:

```text
Find Blood       → Primary
Become a Donor   → Primary
Create Camp      → Primary
Approve Donor    → Primary
Verify Request   → Primary
Export Data      → Primary
Save Changes     → Primary
```

Do not make every button red.

---

# 42. Design Consistency Rules

Every new page must reuse:

- same typography
- same colors
- same sidebar
- same header
- same card system
- same form controls
- same button styles
- same badge styles
- same spacing system
- same icon family
- same responsive behavior

Do not create a new visual language for individual pages.

---

# 43. Page-Level UX Pattern

Every major page should follow:

```text
Navigation
   ↓
Page Header
   ↓
Context / Filters / Primary Action
   ↓
Main Content
   ↓
Secondary Information
   ↓
Empty / Loading / Error State
```

---

# 44. Admin Page Template

```text
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Header / Search / Notifications / Profile     │
├─────────┼───────────────────────────────────────────────┤
│         │ Eyebrow                                       │
│         │ Page Title                  Primary Action     │
│         │ Description                                     │
│         │                                               │
│         │ KPI / Filter / Search                         │
│         │                                               │
│         │ Main Table / Cards / Charts                   │
│         │                                               │
│         │ Secondary Cards / Activity / Summary          │
└─────────┴───────────────────────────────────────────────┘
```

This template should be reused for:

- Donors
- Camps
- Registrations
- Volunteers
- Requests
- Inventory
- Notifications
- Analytics
- Exports
- Organization Profile
- Team Members
- Settings

---

# 45. Final UI/UX Rule

When creating any new screen for Lifeline:

**Do not design the page from scratch.**

First reuse the established system:

```text
Lifeline Red
      +
Navy Typography
      +
White Cards
      +
Light Gray Background
      +
Rounded Components
      +
Soft Shadows
      +
Consistent Sidebar/Header
      +
Clear CTA
      +
Responsive Layout
```

The result should look like it belongs to the same product even when the feature is completely different.

---

# 46. Reference Visual Direction

The existing Lifeline screen concepts establish the visual baseline for:

- Landing page
- Camps
- Find Blood
- Become a Donor
- About
- Contact
- Donor Dashboard
- My Profile
- Nearby Camps
- Register for Camp
- My Donations
- Emergency Request
- Notifications
- Settings
- Admin Dashboard
- Manage Camps
- Registrations
- Volunteers
- Camp Feedback
- Donor Management
- Donor Approvals
- Blood Inventory
- Emergency Requests
- Request Verifications
- Messages
- Analytics
- Export Profile
- Export Data
- Organization Profile
- Team Members

All future UI should visually belong to this same Lifeline system.
