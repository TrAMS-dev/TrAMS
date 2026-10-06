# Emails sent by trams-web

All emails are sent through [Resend](https://resend.com) from `web@trams.no` and require `RESEND_API_KEY`. If the key is missing, the email is skipped and a warning is logged.

## Overview

| # | Email | Subject | Recipient | Trigger |
|---|-------|---------|-----------|---------|
| 1 | Event signup – confirmed | `Plass på kurs: <title>` | Participant | Signs up and gets a spot |
| 2 | Event signup – waitlist | `Venteliste: <title>` | Participant | Signs up when the event is full |
| 3 | Promoted from waitlist (by admin) | `Du har fått plass: <title>` | Participant | Admin moves them from waitlist to confirmed |
| 4 | Event reminder | `Påminnelse: <title>` | All confirmed participants | Daily cron, 2 days before the event |
| 5 | New user registration | `Ny brukerregistrering: <name>` | `WEB_NOTIFY_EMAIL` (default `web@trams.no`) | Someone registers an admin account |
| 6 | Account approved | `Kontoen din er godkjent – TrAMS` | The approved user | Admin approves a pending user |
| 7 | Course booking – customer confirmation | `Bekreftelse på kursbestilling - TrAMS` | The booking contact person | Course booking form submitted |
| 8 | Course booking – admin notification | `Ny kursbestilling: <course> - <name>` | `ADMIN_EMAIL` (default `ekstern@trams.no`) or `ADMIN_EMAIL_LEVANGER` (default `levanger@trams.no`) | Course booking form submitted |

Reply-To: emails 1–4 use the event's `contact_email` when it is set; otherwise replies go to `web@trams.no`. Email 5 replies to the new user; email 8 replies to the booking contact person.

## Event emails

Code: [lib/eventSignupEmail.ts](lib/eventSignupEmail.ts)

### 1. Signup – confirmed spot
- **Sent from:** [app/api/events/signup/route.ts](app/api/events/signup/route.ts)
- **When:** A user signs up and there is room. Also when someone first in the waitlist signs up again after a spot has opened.
- **Content:** Confirms the spot with event title, date, location and link. Asks them to reply as soon as possible if they can't come, and warns that cancelling less than 24 hours before the event gives them lower priority for future TrAMS courses.

### 2. Signup – waitlist
- **Sent from:** [app/api/events/signup/route.ts](app/api/events/signup/route.ts)
- **When:** A user signs up but the event is full (`max_attendees` reached).
- **Content:** Tells them they are on the waitlist, their place in the queue, and that they will get an email if a spot opens.

### 3. Promoted from waitlist
- **Sent from:** [lib/waitlistPromotion.ts](lib/waitlistPromotion.ts), called by
  - [app/api/admin/event-participants/promote/route.ts](app/api/admin/event-participants/promote/route.ts) (admin picks specific participants)
  - [app/api/admin/event-participants/promote-waitlist/route.ts](app/api/admin/event-participants/promote-waitlist/route.ts) (admin promotes the first N on the waitlist)
- **When:** An admin moves one or more participants from waitlist to confirmed.
- **Content:** Tells them they now have a confirmed spot, with event details and link, and asks them to reply as soon as possible if they can't come.

### 4. Event reminder
- **Sent from:** [app/api/cron/event-reminders/route.ts](app/api/cron/event-reminders/route.ts) (Vercel Cron, daily at 07:00 UTC, see [vercel.json](vercel.json))
- **When:** For events starting two calendar days later (Oslo time). Events that were missed are caught up as long as they start more than 24 hours later. Each event is reminded once (`Events.reminder_sent_at`). Events without a set date are skipped.
- **Recipients:** Everyone with `status = 'confirmed'` on the event.
- **Content:** Reminds them of their spot with event details and link. If they can't come, they must email the event's contact address (or reply) at least 24 hours before the event starts.
- **Requires:** `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.

## User account emails

### 5. New user registration (to TrAMS)
- **Sent from:** [app/api/send/user-registration/route.ts](app/api/send/user-registration/route.ts), called by [app/admin/register/page.tsx](app/admin/register/page.tsx)
- **When:** Someone registers an account.
- **Content:** Name and email of the new user, and that they are waiting for approval in admin.

### 6. Account approved
- **Sent from:** [app/api/admin/users/approval-email/route.ts](app/api/admin/users/approval-email/route.ts) (template in [lib/userApprovalEmail.ts](lib/userApprovalEmail.ts)), called by [app/admin/users/page.tsx](app/admin/users/page.tsx)
- **When:** An admin approves a pending user.
- **Content:** Tells them their account is approved, with a link to `/admin/login`.

## Course booking emails

Code: [app/api/send/form-complete/route.ts](app/api/send/form-complete/route.ts), templates in [components/CourseEmailTemplate.tsx](components/CourseEmailTemplate.tsx). Called by [components/BookKursForm.tsx](components/BookKursForm.tsx).

### 7. Customer confirmation
- **When:** Someone submits the course booking form.
- **Content:** Thanks them for the booking and summarizes what they ordered.

### 8. Admin notification
- **When:** Same submission as above (both are sent at the same time).
- **Recipient:** Levanger bookings go to the Levanger address; all others go to the Trondheim address.
- **Content:** All booking details.

## Not sent by this app

Supabase Auth (signup) does not send a confirmation email: `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml). This only covers the local config; check the Supabase dashboard (Authentication → Email) for the hosted project.
