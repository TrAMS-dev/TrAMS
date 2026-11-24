# Emails sent by trams-web

All emails are sent through [Resend](https://resend.com) from `web@trams.no` and require `RESEND_API_KEY`. If the key is missing, the email is skipped and a warning is logged.

## Editing the text (Sanity)

The text of every email (subject, paragraphs, headings, button labels, sign-off) is edited in Sanity Studio under **E-poster**, one document per email plus **Felles for alle e-poster** (sign-off and the text under buttons). Changes apply to the next email sent after the document is published.

- Placeholders like `{navn}`, `{tittel}`, `{arrangement}`, `{lenke}` and `{kontakt}` are filled in when the email is sent. Each field's description in the Studio lists the ones it supports. A paragraph whose placeholder has no value is left out (for example «Du har plass nummer {plass}» when the queue position is unknown). In «Etter arrangementet», `{tilbakemelding}` and `{kursbevis}` must stay on their own line; they are replaced by the text and button for the feedback form and certificate, or left out.
- `{kontakt}` is the event's `contact_email`, or `web@trams.no` when it is not set.
- Data blocks stay in code: the booking summary and booking details tables, the new-user and website-feedback tables, the event date format, and the sender name.
- Default text lives in [lib/email/defaults.ts](lib/email/defaults.ts). It is the starting value when a document is first opened in the Studio, and the fallback for empty fields, unpublished documents, or when Sanity can't be reached.
- Code: schema in [sanity/schemas/emailTypes.ts](sanity/schemas/emailTypes.ts), fetching in [lib/email/content.ts](lib/email/content.ts), Portable Text and placeholder rendering in [lib/email/portableText.ts](lib/email/portableText.ts).

## Overview

Subjects and content below describe the default text; the live wording may have been changed in Sanity.

| # | Email | Subject | Recipient | Trigger |
|---|-------|---------|-----------|---------|
| 1 | Event signup – confirmed | `Plass på kurs: <title>` | Participant | Signs up and gets a spot |
| 2 | Event signup – waitlist | `Venteliste: <title>` | Participant | Signs up when the event is full |
| 3 | Promoted from waitlist (by admin) | `Du har fått plass: <title>` | Participant | Admin moves them from waitlist to confirmed |
| 4 | Moved to waitlist (by admin) | `Flyttet til venteliste: <title>` | Participant | Admin moves them from confirmed to waitlist |
| 5 | Removed from event (by admin) | `Fjernet fra påmelding: <title>` | Participant | Admin removes them (confirmed or waitlist) |
| 6 | Event reminder | `Påminnelse: <title>` | All confirmed participants | Daily cron, 2 days before the event |
| 7 | New user registration | `Ny brukerregistrering: <name>` | `WEB_NOTIFY_EMAIL` (default `web@trams.no`) | Someone registers an admin account |
| 8 | Account approved | `Kontoen din er godkjent – TrAMS` | The approved user | Admin approves a pending user |
| 9 | Course booking – customer confirmation | `Bekreftelse på kursbestilling - TrAMS` | The booking contact person | Course booking form submitted |
| 10 | Course booking – admin notification | `Ny kursbestilling: <course> - <name>` | `ADMIN_EMAIL` (default `ekstern@trams.no`) or `ADMIN_EMAIL_LEVANGER` (default `levanger@trams.no`) | Course booking form submitted |
| 11 | Website feedback | `Tilbakemelding på nettsiden` | `WEB_NOTIFY_EMAIL` (default `web@trams.no`) | Someone sends feedback from the footer |
| 12 | After the event | `Takk for at du deltok: <title>` | Participants marked «Møtt» | Automatically when marked «Møtt» after the event (or daily cron if marked before it ended); admins can also send manually |
| 13 | Event signup confirmations (deferred) | `Plass på kurs: <title>` / `Venteliste: <title>` | All participants (confirmed and waitlisted) | Scheduled job every 15 min, once the registration deadline or the admin-chosen time passes, for events set to defer confirmation |

Reply-To: emails 1–6, 12 and 13 use the event's `contact_email` when it is set; otherwise replies go to `web@trams.no`. Email 7 replies to the new user; email 10 replies to the booking contact person; email 11 replies to the sender if they gave an email address.

## Event emails

Code: [lib/eventSignupEmail.ts](lib/eventSignupEmail.ts)

All four of these (1–4) are gated by the event's `confirmation_email_timing` (set in the "Bekreftelses-e-post" field on the event form): `immediate` (default) sends them as described below; `never` never sends them; `on_deadline` and `scheduled` suppress them until email 13's batch has gone out for the event (see below), after which they resume sending immediately, same as `immediate`.

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

### 4. Moved to waitlist
- **Sent from:** [lib/waitlistPromotion.ts](lib/waitlistPromotion.ts) (`moveParticipantsToWaitlist`), called by [app/api/admin/event-participants/demote/route.ts](app/api/admin/event-participants/demote/route.ts)
- **When:** An admin moves a confirmed participant to the waitlist ("Til venteliste" in the participant table).
- **Content:** Tells them they have been moved from a confirmed spot to the waitlist, their place in the queue, and that they will get an email if a spot opens. They keep their signup time, so their queue position is based on when they signed up.

### 5. Removed from event
- **Sent from:** [app/api/admin/event-participants/remove/route.ts](app/api/admin/event-participants/remove/route.ts)
- **When:** An admin removes a participant ("Fjern"), whether they had a confirmed spot or were on the waitlist.
- **Content:** Tells them they have been removed from the signup (or the waitlist) and no longer have a spot, with event details and who to contact with questions.

### 6. Event reminder
- **Sent from:** [app/api/cron/event-reminders/route.ts](app/api/cron/event-reminders/route.ts) (Vercel Cron, daily at 07:00 UTC, see [vercel.json](vercel.json))
- **When:** For events starting two calendar days later (Oslo time). Events that were missed are caught up as long as they start more than 24 hours later. Each event is reminded once (`Events.reminder_sent_at`). Events without a set date are skipped.
- **Recipients:** Everyone with `status = 'confirmed'` on the event.
- **Content:** Reminds them of their spot with event details and link. If they can't come, they must email the event's contact address (or reply) at least 24 hours before the event starts.
- **Requires:** `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.

### 13. Event signup confirmations (deferred)
- **Sent from:** [app/api/cron/event-signup-confirmations/route.ts](app/api/cron/event-signup-confirmations/route.ts) (Vercel Schedules, every 15 minutes, see `schedules` in [vercel.json](vercel.json); on the Hobby plan each run can start up to 15 minutes late), using [lib/eventSignupEmail.ts](lib/eventSignupEmail.ts)'s `sendBulkEventSignupEmails`
- **When:** Once per event (`Events.confirmation_emails_sent_at`), the first run after:
  - `reg_deadline`, for events with `confirmation_email_timing = 'on_deadline'` ("Send når påmeldingsfristen går ut")
  - `confirmation_email_send_at`, for events with `confirmation_email_timing = 'scheduled'` ("Velg tidspunkt selv", with a date and time field next to the selector)

  This lets admins finish moving people between confirmed and waitlist (e.g. to prioritize older kull) before anyone is told their status, instead of emails 1–4 going out as people sign up or get moved.
- **Recipients:** Everyone on the event, confirmed and waitlisted alike, in one batch — confirmed participants get email 1's content, waitlisted participants get email 2's content with their final queue position.
- **Content:** Same templates as emails 1 and 2.
- **Requires:** `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.

### 12. After the event (feedback form and certificate)
- **Sent from:** [app/api/admin/event-participants/followup/route.ts](app/api/admin/event-participants/followup/route.ts), called by [components/admin/EventFollowupPanel.tsx](components/admin/EventFollowupPanel.tsx)
- **Also sent from:** [app/api/admin/event-participants/attendance/route.ts](app/api/admin/event-participants/attendance/route.ts) and [app/api/cron/event-followups/route.ts](app/api/cron/event-followups/route.ts) (Vercel Cron, daily at 18:00 UTC), both through [lib/eventFollowup.ts](lib/eventFollowup.ts)
- **When:** Automatically, once per participant (`EventParticipants.followup_sent_at`), for events that ended within the last 14 days:
  - right away when an admin sets a participant to «Møtt» after the event has ended
  - by the daily cron for participants set to «Møtt» before the event ended
  - The automatic email includes the certificate if the event has «Send kursbevis» on (`Events.certificate_enabled`), and the feedback link if the event has feedback questions. If it has neither, nothing is sent.
  - Admins can also send it manually from the participants page, choosing the content, or resend it to everyone who attended.
- **Recipients:** Everyone with `attended = true` on the event.
- **Content:** Thanks them for coming, with one or both of:
  - a link to the event's feedback form (`/arrangementer/<slug>/tilbakemelding`, a separate page with the form; the event needs at least one feedback question. The form is not linked from the event page, and only accepts answers after the event has ended. Old `?tilbakemelding` links redirect there)
  - a personal certificate link (`/kursbevis/<id>.<signature>`), a printable A4 page with name, course, date, an optional course description and the signature set in Sanity. Only included when the event has «Send kursbevis» on. The link is signed with `CERTIFICATE_SECRET` (falls back to `SUPABASE_SERVICE_ROLE_KEY`), so changing that secret invalidates links already sent.

## User account emails

### 7. New user registration (to TrAMS)
- **Sent from:** [app/api/send/user-registration/route.ts](app/api/send/user-registration/route.ts), called by [app/admin/register/page.tsx](app/admin/register/page.tsx)
- **When:** Someone registers an account.
- **Content:** Name and email of the new user, and that they are waiting for approval in admin.

### 8. Account approved
- **Sent from:** [app/api/admin/users/approval-email/route.ts](app/api/admin/users/approval-email/route.ts) (template in [lib/userApprovalEmail.ts](lib/userApprovalEmail.ts)), called by [app/admin/users/page.tsx](app/admin/users/page.tsx)
- **When:** An admin approves a pending user.
- **Content:** Tells them their account is approved, with a link to `/admin/login`.

## Course booking emails

Code: [app/api/send/form-complete/route.ts](app/api/send/form-complete/route.ts), templates in [lib/courseBookingEmail.ts](lib/courseBookingEmail.ts). Called by [components/BookKursForm.tsx](components/BookKursForm.tsx).

### 9. Customer confirmation
- **When:** Someone submits the course booking form.
- **Content:** Thanks them for the booking and summarizes what they ordered.

### 10. Admin notification
- **When:** Same submission as above (both are sent at the same time).
- **Recipient:** Levanger bookings go to the Levanger address; all others go to the Trondheim address.
- **Content:** All booking details.

## Website feedback emails

### 11. Website feedback
- **Sent from:** [app/api/send/feedback/route.ts](app/api/send/feedback/route.ts), called by [components/FeedbackDialog.tsx](components/FeedbackDialog.tsx) ("Tilbakemelding" column in the footer)
- **When:** Someone submits the feedback form.
- **Content:** The feedback message, the page it was sent from, and the sender's email if they gave one. Submissions that fill in the hidden honeypot field are dropped without sending.

## Not sent by this app

Supabase Auth (signup) does not send a confirmation email: `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml). This only covers the local config; check the Supabase dashboard (Authentication → Email) for the hosted project.
