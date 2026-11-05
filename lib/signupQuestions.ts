import type { Json } from '@/types/supabase'

/** Typer spørsmål arrangøren kan stille ved påmelding. */
export const SIGNUP_QUESTION_TYPES = ['checkbox', 'text', 'single_choice', 'multi_choice'] as const
export type SignupQuestionType = (typeof SIGNUP_QUESTION_TYPES)[number]

export const SIGNUP_QUESTION_TYPE_LABELS: Record<SignupQuestionType, string> = {
    checkbox: 'Ja/nei (avkrysning)',
    text: 'Kort tekstsvar',
    single_choice: 'Velg ett alternativ',
    multi_choice: 'Velg flere alternativer',
}

export const MAX_SIGNUP_QUESTIONS = 20
const MAX_LABEL_LENGTH = 300
const MAX_OPTIONS = 50
const MAX_TEXT_ANSWER_LENGTH = 1000

export type SignupQuestion = {
    /** Stabil id, slik at svar ikke mistes om spørsmålet får ny tekst. */
    id: string
    type: SignupQuestionType
    label: string
    /** For avkrysning betyr påkrevd at boksen må krysses av. */
    required: boolean
    /** Kun brukt for single_choice og multi_choice. */
    options: string[]
}

export type SignupAnswer = boolean | string | string[]
/** Svar per spørsmåls-id. */
export type SignupAnswers = Record<string, SignupAnswer>

export function isChoiceQuestion(type: SignupQuestionType) {
    return type === 'single_choice' || type === 'multi_choice'
}

function isSignupQuestionType(value: unknown): value is SignupQuestionType {
    return SIGNUP_QUESTION_TYPES.includes(value as SignupQuestionType)
}

/** Fjerner tomme og dupliserte alternativer. */
export function cleanOptions(options: string[]): string[] {
    return Array.from(new Set(options.map((o) => o.trim()).filter(Boolean)))
}

/** Leser signup_questions-kolonnen og forkaster ugyldige oppføringer. */
export function parseSignupQuestions(value: Json | null | undefined): SignupQuestion[] {
    if (!Array.isArray(value)) return []
    const questions: SignupQuestion[] = []
    const seenIds = new Set<string>()
    for (const entry of value) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
        const id = typeof entry.id === 'string' ? entry.id.trim() : ''
        const label = typeof entry.label === 'string' ? entry.label.trim() : ''
        if (!id || !label || seenIds.has(id) || !isSignupQuestionType(entry.type)) continue
        const options = Array.isArray(entry.options)
            ? cleanOptions(entry.options.filter((o): o is string => typeof o === 'string'))
            : []
        if (isChoiceQuestion(entry.type) && options.length === 0) continue
        seenIds.add(id)
        questions.push({
            id,
            type: entry.type,
            label,
            required: entry.required === true,
            options: isChoiceQuestion(entry.type) ? options : [],
        })
    }
    return questions.slice(0, MAX_SIGNUP_QUESTIONS)
}

/** Returnerer en feilmelding dersom spørsmålene ikke kan lagres, ellers null. */
export function validateSignupQuestions(questions: SignupQuestion[]): string | null {
    if (questions.length > MAX_SIGNUP_QUESTIONS) {
        return `Maks ${MAX_SIGNUP_QUESTIONS} spørsmål per arrangement`
    }
    for (const [i, q] of questions.entries()) {
        const n = i + 1
        if (!q.label.trim()) return `Spørsmål ${n} mangler tekst`
        if (q.label.length > MAX_LABEL_LENGTH) return `Spørsmål ${n} er for langt`
        if (isChoiceQuestion(q.type)) {
            if (q.options.length < 2) return `Spørsmål ${n} må ha minst to alternativer`
            if (q.options.length > MAX_OPTIONS) {
                return `Spørsmål ${n} kan ha maks ${MAX_OPTIONS} alternativer`
            }
        }
    }
    return null
}

/**
 * Sjekker innsendte svar mot spørsmålene og returnerer rensede svar.
 * Svar på spørsmål som ikke finnes, eller alternativer som ikke finnes, forkastes.
 */
export function validateSignupAnswers(
    questions: SignupQuestion[],
    raw: unknown
): { answers: SignupAnswers } | { error: string } {
    const input =
        raw && typeof raw === 'object' && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {}
    const answers: SignupAnswers = {}

    for (const q of questions) {
        const value = input[q.id]
        switch (q.type) {
            case 'checkbox': {
                const checked = value === true
                if (q.required && !checked) return { error: `Du må krysse av for «${q.label}»` }
                answers[q.id] = checked
                break
            }
            case 'text': {
                const text = typeof value === 'string' ? value.trim() : ''
                if (q.required && !text) return { error: `Du må svare på «${q.label}»` }
                if (text.length > MAX_TEXT_ANSWER_LENGTH) {
                    return { error: `Svaret på «${q.label}» er for langt` }
                }
                if (text) answers[q.id] = text
                break
            }
            case 'single_choice': {
                const choice = typeof value === 'string' && q.options.includes(value) ? value : ''
                if (q.required && !choice) return { error: `Du må svare på «${q.label}»` }
                if (choice) answers[q.id] = choice
                break
            }
            case 'multi_choice': {
                const chosen = Array.isArray(value)
                    ? q.options.filter((o) => value.includes(o))
                    : []
                if (q.required && chosen.length === 0) {
                    return { error: `Du må velge minst ett alternativ for «${q.label}»` }
                }
                answers[q.id] = chosen
                break
            }
        }
    }
    return { answers }
}

/** Leser question_answers-kolonnen. */
export function parseSignupAnswers(value: Json | null | undefined): SignupAnswers {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const answers: SignupAnswers = {}
    for (const [id, answer] of Object.entries(value)) {
        if (typeof answer === 'boolean' || typeof answer === 'string') {
            answers[id] = answer
        } else if (Array.isArray(answer)) {
            answers[id] = answer.filter((a): a is string => typeof a === 'string')
        }
    }
    return answers
}

/** Svaret som lesbar tekst, f.eks. til tabell og CSV. Tom streng betyr ubesvart. */
export function formatSignupAnswer(question: SignupQuestion, answer: SignupAnswer | undefined) {
    if (question.type === 'checkbox') return answer === true ? 'Ja' : 'Nei'
    if (Array.isArray(answer)) return answer.join(', ')
    return typeof answer === 'string' ? answer : ''
}
