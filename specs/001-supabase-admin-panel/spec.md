# Feature Specification: Supabase Integration & Admin Panel

**Feature Branch**: `feature/supabase-admin-panel`

**Created**: 2026-06-24

**Status**: Draft

**Input**: User description: "Integração com Supabase e painel admin para o Instituto Movimenta."

---

## Clarifications

### Session 2026-06-24

- Q: Conformidade com LGPD — abordagem de consentimento nos formulários públicos → A: Checkbox de consentimento obrigatório em todos os formulários públicos (cursinho, voluntário, contato, newsletter) com texto simples sobre uso dos dados pelo Instituto Movimenta. Não é necessário criar página de Política de Privacidade nesta iteração.
- Q: Duração da sessão do admin → A: 7 dias com renovação automática a cada visita.
- Q: Deleção de registros no painel admin → A: Deleção individual com modal de confirmação; ação permanente e irreversível.
- Q: Indicador de mensagens não lidas → A: Badge com contagem de mensagens não lidas visível na sidebar e no card do dashboard.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Public Form Persistence (Priority: P1)

A member of the public fills out any of the site's forms (cursinho registration, volunteer sign-up, contact message, newsletter subscription). After submitting, their data is saved and they receive a success confirmation. If they try to register again with the same email (for cursinho, volunteer, or newsletter), they receive a clear, friendly message instead of a silent failure or generic error.

**Why this priority**: Core foundation of the feature — without persistence, all form submissions are lost. Every other capability depends on data being stored.

**Independent Test**: Submit each public form with valid data and verify the submission is recorded. Submit again with the same email and verify the duplicate message appears.

**Acceptance Scenarios**:

1. **Given** a visitor fills out a public form and checks the consent checkbox, **When** they click submit with valid data, **Then** they see a success confirmation and their data is saved.
2. **Given** a visitor fills out a public form but does NOT check the consent checkbox, **When** they attempt to submit, **Then** the form is blocked and the consent field shows a validation error.
3. **Given** a visitor tries to register for the cursinho with an already-registered email, **When** they submit, **Then** they see a friendly message such as "Este e-mail já está cadastrado."
4. **Given** a visitor submits the newsletter subscription with an already-subscribed email, **When** they submit, **Then** they see a friendly message.
5. **Given** a bot fills out a hidden trap field and submits any form, **When** the form is processed, **Then** the submission is silently discarded and the bot sees a fake success response.
6. **Given** a visitor submits a contact message, **When** they submit, **Then** their message is saved regardless of whether they have sent messages before.

---

### User Story 2 — Admin Authentication (Priority: P1)

A team member opens the admin panel URL and is redirected to a login page if not authenticated. They enter their credentials and gain access. Unauthenticated visitors cannot access any admin page under any circumstance.

**Why this priority**: Without protected access, all collected data would be publicly exposed. Must be in place before any admin views are built.

**Independent Test**: Attempt to access `/admin` as unauthenticated — must redirect to login. Log in with valid credentials — must land on dashboard. Log in with invalid credentials — must stay on login with error.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user navigates to any `/admin/*` URL, **When** the page loads, **Then** they are redirected to the login page.
2. **Given** an admin enters valid credentials on the login page, **When** they submit, **Then** they are redirected to the admin dashboard.
3. **Given** an admin enters invalid credentials, **When** they submit, **Then** they see an error message and remain on the login page.
4. **Given** an authenticated admin clicks "Sair" (logout), **When** the action completes, **Then** they are redirected to the login page and cannot access admin pages without logging in again.

---

### User Story 3 — Admin Dashboard Overview (Priority: P2)

An admin lands on the dashboard after logging in and sees at a glance how many total records exist in each category: cursinho registrations, volunteers, contact messages, and newsletter subscribers. Each count card links to that category's detail view.

**Why this priority**: Provides immediate situational awareness without needing to navigate each section individually.

**Independent Test**: With at least one record in each of the 4 categories, load the dashboard and verify all counts are accurate and all links navigate correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated admin loads the dashboard, **When** the page loads, **Then** they see accurate total counts for each of the 4 categories, and the contact messages card shows a distinct badge with the number of unread messages.
2. **Given** there are unread contact messages, **When** the admin views any page in the panel, **Then** the sidebar shows a badge with the unread count next to "Contato".
3. **Given** an admin clicks a category card or link, **When** navigated, **Then** they arrive at that category's detail table.

---

### User Story 4 — Registration Management & Export (Priority: P2)

An admin navigates to any registration section (cursinho, volunteers, contact, newsletter), views records in a paginated table ordered by newest first, applies filters to narrow results, and exports the filtered dataset as a CSV file for use in spreadsheets or WhatsApp contact lists.

**Why this priority**: Core operational need — the team must be able to act on registrations received (contact volunteers, organize cursinho groups, follow up on messages).

**Independent Test**: With multiple records across different dates and cities, filter by date range and city, verify only matching records appear, export CSV and verify it contains exactly the filtered records with correct headers.

**Acceptance Scenarios**:

1. **Given** an admin opens any registration section, **When** the page loads, **Then** they see records ordered newest-first with 50 per page.
2. **Given** an admin applies a date range filter, **When** applied, **Then** only registrations within that range appear.
3. **Given** an admin filters cursinho or volunteer records by city, **When** applied, **Then** only records from that city appear.
4. **Given** an admin filters volunteer records by area of interest, **When** applied, **Then** only records matching that interest appear.
5. **Given** an admin clicks "Exportar CSV", **When** the file downloads, **Then** it contains all currently visible/filtered records with proper column headers.
6. **Given** an admin views the contact messages section, **When** they toggle a message as "lida" (read), **Then** its visual status updates immediately.

---

### Edge Cases

- What happens when a form is submitted while the data service is temporarily unavailable? The user sees a generic error message; no data is silently lost or partially saved.
- How does the system handle two near-simultaneous duplicate submissions with the same email (race condition)? The database-level unique constraint ensures only one is saved; the other receives a duplicate error.
- What happens when an admin session expires mid-use? The next request redirects them to login without data loss.
- How does CSV export behave when there are no records matching the active filters? The exported file contains only the header row, or a friendly "Nenhum resultado" message is shown before export.
- What happens when an admin applies multiple filters that return zero results? The table shows a clear empty-state message.
- What happens if required environment credentials are missing or malformed at startup? The application fails immediately with a clear error identifying which credential is missing.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST persist all valid public form submissions (cursinho, volunteer, contact, newsletter) to a central data store immediately upon receipt.
- **FR-001a**: All public forms MUST display a mandatory consent checkbox with plain-language text indicating that the submitted data will be used by Instituto Movimenta for its stated social activities. Form submission MUST be blocked if the checkbox is unchecked.
- **FR-002**: System MUST reject duplicate email registrations for cursinho, volunteer, and newsletter forms — a single email MUST NOT appear twice in any of these datasets.
- **FR-003**: System MUST display a clear, user-friendly message when a duplicate email is detected, never a silent failure or generic error.
- **FR-004**: System MUST silently discard any form submission where a hidden spam-detection field has been filled, returning a fake success response to the submitter.
- **FR-005**: All form data MUST be validated server-side using the same rules as client-side before any persistence occurs.
- **FR-006**: All admin interface routes MUST require authentication; unauthenticated requests to any `/admin/*` route MUST redirect to the login page.
- **FR-006a**: Admin sessions MUST remain active for 7 days and MUST be automatically renewed on each visit within that window. Sessions expire after 7 days of inactivity.
- **FR-007**: Admin authentication MUST use email and password; no self-registration flow is available — accounts are provisioned by the project team.
- **FR-008**: Admin MUST be able to view all records for each of the 4 entities (cursinho registrations, volunteers, contact messages, newsletter subscribers) in a paginated table.
- **FR-009**: All admin tables MUST default to showing the newest records first, with 50 records per page.
- **FR-010**: Admin MUST be able to filter records by date range (from / to) in all four sections.
- **FR-011**: Admin MUST be able to filter cursinho and volunteer records by city.
- **FR-012**: Admin MUST be able to filter volunteer records by area of interest.
- **FR-013**: Admin MUST be able to export the currently filtered dataset as a CSV file usable in any spreadsheet application, with correct column headers in Portuguese.
- **FR-014**: Admin dashboard MUST display a current count of total records in each of the 4 categories. The contact messages card MUST also show a distinct count of unread messages as a badge.
- **FR-014a**: The admin sidebar MUST display a badge with the current count of unread contact messages next to the "Contato" navigation item, updating on each page load.
- **FR-015**: Admin MUST be able to toggle contact messages between "lida" (read) and "não lida" (unread) status; the distinction must be visually clear in the table.
- **FR-015a**: Admin MUST be able to permanently delete any individual record from any section (cursinho, volunteers, contact, newsletter) via a confirmation modal that warns the action is irreversible. This supports LGPD data deletion rights and operational error correction.
- **FR-016**: The admin interface MUST be accessible and functional on both desktop and mobile screen sizes.
- **FR-017**: Required environment credentials MUST be validated at application startup; the app MUST fail immediately with a clear error identifying any missing or malformed credential.

### Key Entities

- **Cursinho Registration** (`cursinho_inscricoes`): A prospective student's application to the popular preparatory course. Captures: full name, email, phone, city, state, neighborhood, school of origin, preferred shift (manhã / tarde / noite). Email is unique.
- **Volunteer** (`voluntarios`): A person interested in contributing to the organization. Captures: full name, email, phone, city, state, Instagram handle (optional), area of interest, student status (sim/não), school or university if student (optional), how they found the organization. Email is unique.
- **Contact Message** (`mensagens_contato`): A message sent through the public contact form. Captures: name, email, subject, message text, read status (lida/não lida). Multiple messages from the same email are permitted.
- **Newsletter Subscriber** (`newsletter_emails`): An email address subscribed to organizational updates. Each email is unique.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All public form submissions are confirmed to the user within 3 seconds of clicking submit under normal conditions.
- **SC-002**: Zero duplicate records per email exist in the cursinho, volunteer, and newsletter datasets after the feature is live.
- **SC-003**: Every duplicate email attempt results in a user-visible, friendly message — zero silent failures.
- **SC-004**: An admin can locate, filter, and export any dataset in under 2 minutes from the moment they log in.
- **SC-005**: All 4 public form flows continue to work with no regression in user experience after the migration to persistent storage.
- **SC-006**: Spam submissions that trigger the hidden trap field are discarded 100% of the time, with no indication to the submitter that detection occurred.
- **SC-007**: Application startup produces a clear, actionable error message if any required environment credential is absent or malformed — no cryptic runtime crashes.
- **SC-008**: Admin panel initial page load completes in under 3 seconds on a standard broadband connection.

---

## Assumptions

- Admin accounts are created manually by the project team via the external database management dashboard — no in-app provisioning or self-registration flow is needed.
- All admin users share the same level of access (single role). Per-section role-based access control may be introduced in a future iteration without requiring structural changes.
- CSV export covers only the currently filtered and visible dataset, not the entire unfiltered table.
- Donation form persistence is explicitly out of scope for this iteration.
- Email notification to the team when contact messages arrive is out of scope for this iteration (planned as a future separate feature).
- The phone field in the cursinho registration form will be renamed from its current internal name to match the volunteer form for consistency; the label visible to users remains "Telefone/WhatsApp".
- Admin interface follows the same mobile breakpoint as the rest of the site (768 px).
- No per-IP rate limiting is implemented in this iteration; honeypot detection and database-level duplicate prevention are considered sufficient for the expected submission volume.
- The admin panel design system is consistent with the existing public site (same color tokens, typography, and component library) — it is not a separate visual identity.
