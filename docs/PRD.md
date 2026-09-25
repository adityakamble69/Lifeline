# Lifeline Blood Donor Network — Product Requirements Document

**Status:** Initial / Documentation Foundation  
**Product:** Lifeline Blood Donor Network  
**Primary objective:** Connect blood donors, people/organizations needing blood, and blood donation camps through one trusted platform.

## 1. Project Overview

Lifeline is a web application for discovering blood donors, finding nearby donation camps, registering for camps, submitting emergency blood requests, and managing the donor/camp ecosystem.

The system has two major experiences:

- **Public/Donor experience:** discover blood, camps, donation opportunities, emergency requests, and manage a donor profile.
- **Admin/Organizer experience:** manage donors, approvals, camps, registrations, volunteers, inventory, emergency requests, verification requests, messages, notifications, analytics, exports, organization profile, team members, and settings.

## 2. Problem Statement

Blood availability is often fragmented across individuals, hospitals, camps, and informal communication channels. People may struggle to find compatible donors quickly, while organizers need structured tools to manage donors, camps, requests, and inventory.

Lifeline provides a centralized workflow for discovery, registration, verification, coordination, and reporting.

## 3. Goals

- Make blood donor discovery fast and understandable.
- Allow donors to maintain a useful donor profile.
- Support urgent and regular blood requests.
- Make blood donation camps discoverable and easy to register for.
- Give organizers structured management tools.
- Maintain trustworthy verification and status tracking.
- Provide useful operational analytics without unnecessary complexity.

## 4. Target Users

### Donor
A registered person willing to donate blood.

### Recipient / Requester
A person or authorized representative creating a blood request.

### Organizer / Admin
A trusted organization member managing donors, camps, requests, inventory, volunteers, and operations.

### Volunteer
A team member supporting camps and community activities.

## 5. User Roles

| Role | Main permissions |
|---|---|
| Guest | Browse public information, camps, and general blood information |
| Donor | Manage profile, search blood, view/register for camps, view donations, receive notifications |
| Requester | Create and manage blood requests, track request status |
| Organizer/Admin | Full operational management within organization scope |
| Volunteer | Assigned camp and volunteer workflows only |

Authorization must be server-enforced; hiding UI controls is not sufficient.

## 6. Core Features

### Public
- Landing page
- About
- Contact
- Camps
- Find Blood
- Become a Donor
- Public navigation and informational content

### Donor / User Panel
- Dashboard
- My Profile
- Find Blood
- Nearby Camps
- Register for Camp
- My Donations
- Emergency Request
- Notifications
- Settings

### Admin / Organizer Panel
- Dashboard
- Manage Camps
- Registrations
- Volunteers
- Camp Feedback
- Donors
- Donor Approvals
- Blood Inventory
- Emergency Requests
- Request Verifications
- Messages
- Notifications
- Analytics
- Export Data
- Organization Profile
- Team Members
- Settings

## 7. Functional Requirements

### FR-01 Authentication
- Users can register and log in.
- Passwords are stored only as secure hashes.
- Protected resources require authentication.
- Sessions/tokens must expire according to documented policy.
- Role/organization authorization is enforced by the backend.

### FR-02 Donor Profiles
- Donors can maintain name, contact information, blood group, location, availability/status, and donation history.
- Sensitive fields are not exposed to unauthorized users.
- Admins can review and manage donor records.

### FR-03 Find Blood
- Search by blood group and location.
- Show eligible/active donors according to privacy and availability rules.
- Never expose more donor information than required for contact.

### FR-04 Emergency Requests
- Requesters can create urgent blood requests.
- Requests contain blood group, units, location/hospital, urgency, required date/time, and requester/contact details.
- Requests have explicit statuses such as pending, in-progress, fulfilled, rejected, or expired.
- Admins can verify and coordinate requests.

### FR-05 Camps
- Organizers can create, edit, publish, close, and manage camps.
- Users can view camp details and register.
- Organizers can manage registrations and volunteers.
- Camp feedback can be collected after a camp.

### FR-06 Blood Inventory
- Authorized organizers can record stock additions, usage, transfers, and adjustments.
- Inventory is tracked by blood group and storage location.
- Stock changes are auditable.
- Low-stock and expiry-related alerts can be generated.

### FR-07 Verification
- Donor/request verification workflows support pending, verified, and rejected states.
- Verification actions record actor and timestamp.
- Uploaded/linked documents must be protected.

### FR-08 Notifications
- Users receive relevant in-app notifications.
- Notification categories include emergency requests, donor activity, camp activity, verification, and system messages.
- Read/unread state is persisted.

### FR-09 Messaging
- Authorized users can communicate through the application.
- Conversations must respect role and privacy rules.
- Emergency communication must not depend solely on chat.

### FR-10 Analytics and Export
- Admins can view operational metrics.
- Reports should distinguish current values from historical trends.
- Authorized admins can export permitted datasets.
- Sensitive data should support anonymization where appropriate.

## 8. Non-Functional Requirements

- Responsive on desktop, tablet, and mobile.
- Accessible keyboard navigation and semantic HTML.
- Clear loading, empty, success, and error states.
- Secure authentication and authorization.
- Server-side validation for every mutation.
- API responses use consistent status/error structures.
- Database operations use parameterized queries.
- Avoid unnecessary dependencies and duplicate components.
- Core pages should remain usable on average mobile networks.
- Important administrative actions should be auditable.

## 9. Major Screens

### Public
`/`, `/about`, `/contact`, `/camps`, `/find-blood`, `/become-donor`

### Donor
`/app`, `/app/profile`, `/app/find-blood`, `/app/camps`, `/app/camps/:id/register`, `/app/donations`, `/app/emergency-request`, `/app/notifications`, `/app/settings`

### Admin
`/admin`, `/admin/camps`, `/admin/registrations`, `/admin/volunteers`, `/admin/feedback`, `/admin/donors`, `/admin/donor-approvals`, `/admin/inventory`, `/admin/emergency-requests`, `/admin/verifications`, `/admin/messages`, `/admin/notifications`, `/admin/analytics`, `/admin/export`, `/admin/organization`, `/admin/team`, `/admin/settings`

## 10. Key User Journeys

### Donor registration
Register → verify account → complete donor profile → submit donor approval → approval → donor becomes discoverable according to privacy rules.

### Find blood
Find Blood → choose blood group/location → view eligible results → initiate permitted contact/request workflow.

### Emergency request
Login → Emergency Request → enter patient/request data → submit → verification → matching/coordination → in progress → fulfilled/closed.

### Camp registration
Camps → view camp → review capacity/date/location → register → receive confirmation → attend → donation record/feedback.

### Admin donor approval
Admin → Donor Approvals → filter pending → inspect donor details/documents → approve/reject → audit event → notification.

## 11. Authentication Requirements

- Authentication is handled by Clerk.
- Frontend uses Clerk's supported Next.js integration.
- Backend verifies Clerk-issued authentication context before protected operations.
- Authorization is enforced by application roles/organization membership on the backend.
- Do not store Clerk passwords or authentication secrets in the application database.
- Do not return secrets or internal authentication details from APIs.

## 12. Admin Requirements

Admin functionality must be organization-scoped.

Critical actions:
- donor approval/rejection
- request verification
- inventory adjustment
- camp publication/closure
- team/permission changes
- data export

These actions should record actor, timestamp, action, and target where practical.

## 13. API Requirements

REST API under `/api/v1`.

Requirements:
- JSON request/response format.
- Consistent success/error shape.
- Authentication middleware.
- Role/permission middleware.
- Request validation.
- Pagination for large collections.
- Filtering/sorting only through documented parameters.
- No database credentials or internal errors in responses.

## 14. Integrations

Initial version:
- Supabase PostgreSQL database
- REST API
- Clerk authentication
- GitHub for source control
- Postman for API testing
- Vercel for frontend deployment
- Render for backend deployment

Optional future integrations:
- Email/SMS provider
- Maps/geocoding provider
- Cloud object storage
- Push notification provider

These should not become mandatory dependencies until their business need is confirmed.

## 15. Future Features

- PWA/offline-friendly workflows
- Push notifications
- SMS/WhatsApp notification integration
- Hospital/clinic partner portal
- Advanced donor eligibility workflow
- Automated donor matching
- Multi-organization support with stronger tenancy controls
- Mobile application

## 16. Out of Scope

- Medical diagnosis or clinical decision-making
- Automated determination of medical donor eligibility
- Blood testing/lab management
- Hospital billing
- Payment processing for donations
- Unverified public exposure of donor contact details
- Social-network-style public posting
