export type ConfirmationEmailTiming = 'immediate' | 'on_deadline' | 'scheduled' | 'never'

export const CONFIRMATION_EMAIL_TIMINGS: ConfirmationEmailTiming[] = [
    'immediate',
    'on_deadline',
    'scheduled',
    'never',
]

export function isConfirmationEmailTiming(value: unknown): value is ConfirmationEmailTiming {
    return (
        typeof value === 'string' &&
        (CONFIRMATION_EMAIL_TIMINGS as string[]).includes(value)
    )
}

/**
 * Whether a signup/waitlist confirmation email should go out right now, given the
 * event's timing setting and whether the deferred batch has already been sent.
 * `on_deadline` and `scheduled` suppress emails (signup, and admin promote/demote)
 * until the scheduled job's one-time batch has fired; after that, changes are
 * notified immediately again, same as `immediate`. `never` never sends.
 */
export function shouldSendConfirmationEmailNow(
    timing: string | null,
    confirmationEmailsSentAt: string | null
): boolean {
    if (timing === 'never') return false
    if (timing === 'on_deadline' || timing === 'scheduled') return confirmationEmailsSentAt != null
    return true
}
