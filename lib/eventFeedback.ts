/**
 * Shared types + validation for the per-event feedback form.
 *
 * Questions are defined by the event creator and stored on `Events.feedback_questions`
 * (jsonb). Anonymous answers are stored on `EventFeedback.answers` (jsonb) keyed by
 * question id.
 */

export type FeedbackQuestionType = 'rating' | 'text' | 'yesno'

export interface FeedbackQuestion {
    id: string
    label: string
    type: FeedbackQuestionType
    required: boolean
}

/** Answer values by question id. rating -> 1..5, text -> string, yesno -> boolean. */
export type FeedbackAnswers = Record<string, number | string | boolean>

export const MAX_FEEDBACK_QUESTIONS = 15

/** Max characters kept for a free-text answer. */
export const MAX_FEEDBACK_TEXT_LENGTH = 2000

export const FEEDBACK_TYPE_LABELS: Record<FeedbackQuestionType, string> = {
    rating: 'Vurdering (1–5)',
    text: 'Fritekst',
    yesno: 'Ja/Nei',
}

export const FEEDBACK_QUESTION_TYPES: FeedbackQuestionType[] = ['rating', 'text', 'yesno']

const RATING_MIN = 1
const RATING_MAX = 5

export const FEEDBACK_RATING_VALUES: number[] = [1, 2, 3, 4, 5]

function isFeedbackQuestionType(value: unknown): value is FeedbackQuestionType {
    return value === 'rating' || value === 'text' || value === 'yesno'
}

/** Generate a stable id for a new question row. Falls back when crypto is unavailable. */
export function newFeedbackQuestionId(): string {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID()
        }
    } catch {
        // ignore and fall through
    }
    return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Defensively parse `Events.feedback_questions` (unknown jsonb) into a clean array.
 * Malformed entries are dropped rather than throwing.
 */
export function parseFeedbackQuestions(raw: unknown): FeedbackQuestion[] {
    if (!Array.isArray(raw)) return []

    const seenIds = new Set<string>()
    const questions: FeedbackQuestion[] = []

    for (const entry of raw) {
        if (!entry || typeof entry !== 'object') continue
        const record = entry as Record<string, unknown>

        const type = record.type
        if (!isFeedbackQuestionType(type)) continue

        const label = typeof record.label === 'string' ? record.label.trim() : ''
        if (!label) continue

        let id = typeof record.id === 'string' ? record.id.trim() : ''
        if (!id || seenIds.has(id)) id = newFeedbackQuestionId()
        seenIds.add(id)

        questions.push({
            id,
            label,
            type,
            required: record.required === true,
        })

        if (questions.length >= MAX_FEEDBACK_QUESTIONS) break
    }

    return questions
}

type ValidationResult =
    | { ok: true; answers: FeedbackAnswers }
    | { ok: false; error: string }

/**
 * Validate a submitted answer set against the event's questions. Coerces each answer to
 * the question's type, enforces `required`, and ignores unknown keys.
 */
export function validateFeedbackSubmission(
    questions: FeedbackQuestion[],
    raw: unknown
): ValidationResult {
    if (questions.length === 0) {
        return { ok: false, error: 'Dette arrangementet har ingen tilbakemeldingsspørsmål.' }
    }

    const input: Record<string, unknown> =
        raw && typeof raw === 'object' && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {}

    const answers: FeedbackAnswers = {}

    for (const question of questions) {
        const value = input[question.id]
        const missing = value === undefined || value === null || value === ''

        if (missing) {
            if (question.required) {
                return { ok: false, error: `Spørsmålet «${question.label}» må besvares.` }
            }
            continue
        }

        if (question.type === 'rating') {
            const num =
                typeof value === 'number'
                    ? value
                    : typeof value === 'string'
                      ? Number.parseInt(value, 10)
                      : NaN
            if (!Number.isInteger(num) || num < RATING_MIN || num > RATING_MAX) {
                return {
                    ok: false,
                    error: `Ugyldig vurdering for «${question.label}». Velg ${RATING_MIN}–${RATING_MAX}.`,
                }
            }
            answers[question.id] = num
        } else if (question.type === 'yesno') {
            let bool: boolean
            if (typeof value === 'boolean') bool = value
            else if (value === 'true' || value === 'Ja' || value === 'ja') bool = true
            else if (value === 'false' || value === 'Nei' || value === 'nei') bool = false
            else {
                return { ok: false, error: `Ugyldig svar for «${question.label}».` }
            }
            answers[question.id] = bool
        } else {
            const text = typeof value === 'string' ? value.trim() : String(value).trim()
            if (!text) {
                if (question.required) {
                    return { ok: false, error: `Spørsmålet «${question.label}» må besvares.` }
                }
                continue
            }
            answers[question.id] = text.slice(0, MAX_FEEDBACK_TEXT_LENGTH)
        }
    }

    return { ok: true, answers }
}
