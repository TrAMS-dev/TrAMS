'use client'

import { useMemo, useState } from 'react'
import {
    Dialog,
    Button,
    Stack,
    Box,
    Text,
    RadioGroup,
    Checkbox,
    HStack,
} from '@chakra-ui/react'
import type { Tables } from '@/types/supabase'
import {
    type SignupQuestion,
    formatSignupAnswer,
    parseSignupAnswers,
} from '@/lib/signupQuestions'

export type ParticipantRow = Tables<'EventParticipants'>

/** Fast kolonne, eller `question:<id>` for et påmeldingsspørsmål. */
export type ExportColumnKey =
    | 'name'
    | 'email'
    | 'kull'
    | 'phone'
    | 'allergies'
    | 'membership'
    | 'status'
    | 'attendance'
    | 'signedUpAt'
    | `question:${string}`

interface ColumnDef {
    key: ExportColumnKey
    label: string
    getValue: (p: ParticipantRow) => string
}

function questionColumn(q: SignupQuestion): ColumnDef {
    return {
        key: `question:${q.id}`,
        label: q.label,
        getValue: (p) => formatSignupAnswer(q, parseSignupAnswers(p.question_answers)[q.id]),
    }
}

function memberConfirmLabel(p: ParticipantRow) {
    if (p.confirmed_trams_member === true) return 'TrAMS-medlem'
    if (p.confirmed_trams_member === false) return 'Ikke medlem'
    return 'Ukjent'
}

function attendanceLabel(p: ParticipantRow) {
    if (p.attended === true) return 'Møtt'
    if (p.attended === false) return 'Ikke møtt'
    return 'Ikke registrert'
}

const ALL_COLUMNS: ColumnDef[] = [
    { key: 'name', label: 'Navn', getValue: (p) => p.name ?? '' },
    { key: 'email', label: 'E-post', getValue: (p) => p.email ?? '' },
    { key: 'kull', label: 'Kull', getValue: (p) => (p.kull != null ? String(p.kull) : '') },
    { key: 'phone', label: 'Telefon', getValue: (p) => p.phone ?? '' },
    { key: 'allergies', label: 'Allergier', getValue: (p) => p.allergies ?? '' },
    {
        key: 'membership',
        label: 'Medlemskap (selvrapportert)',
        getValue: (p) => memberConfirmLabel(p),
    },
    {
        key: 'status',
        label: 'Status',
        getValue: (p) => (p.status === 'waitlist' ? 'Venteliste' : 'Påmeldt'),
    },
    { key: 'attendance', label: 'Oppmøte', getValue: (p) => attendanceLabel(p) },
    {
        key: 'signedUpAt',
        label: 'Påmeldt (tidspunkt)',
        getValue: (p) => new Date(p.created_at).toLocaleString('nb-NO'),
    },
]

type ExportScope = 'all' | 'confirmed' | 'waitlist'
type AttendanceFilter = 'all' | 'attended' | 'notAttended' | 'unregistered'

interface ExportParticipantsDialogProps {
    open: boolean
    onClose: () => void
    participants: ParticipantRow[]
    eventSignupQuestions: SignupQuestion[]
    includePhone: boolean
    slug: string
}

function csvCell(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export default function ExportParticipantsDialog({
    open,
    onClose,
    participants,
    eventSignupQuestions,
    includePhone,
    slug,
}: ExportParticipantsDialogProps) {
    const [scope, setScope] = useState<ExportScope>('all')
    const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all')
    const [deselectedColumns, setDeselectedColumns] = useState<Set<ExportColumnKey>>(
        () => new Set()
    )

    // Question columns go right after the membership column
    const availableColumns = useMemo(() => {
        const fixed = ALL_COLUMNS.filter((c) => c.key !== 'phone' || includePhone)
        const insertAt = fixed.findIndex((c) => c.key === 'membership') + 1
        return [
            ...fixed.slice(0, insertAt),
            ...eventSignupQuestions.map(questionColumn),
            ...fixed.slice(insertAt),
        ]
    }, [eventSignupQuestions, includePhone])

    const selectedColumns = availableColumns.filter((c) => !deselectedColumns.has(c.key))

    const filteredRows = useMemo(() => {
        return participants.filter((p) => {
            if (scope === 'confirmed' && p.status === 'waitlist') return false
            if (scope === 'waitlist' && p.status !== 'waitlist') return false

            if (attendanceFilter === 'attended' && p.attended !== true) return false
            if (attendanceFilter === 'notAttended' && p.attended !== false) return false
            if (attendanceFilter === 'unregistered' && p.attended != null) return false

            return true
        })
    }, [participants, scope, attendanceFilter])

    const toggleColumn = (key: ExportColumnKey, checked: boolean) => {
        setDeselectedColumns((prev) => {
            const next = new Set(prev)
            if (checked) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const scopeLabel = (s: ExportScope) => {
        if (s === 'confirmed') return 'bekreftet'
        if (s === 'waitlist') return 'venteliste'
        return 'alle'
    }

    const handleDownload = () => {
        const columns = selectedColumns
        if (columns.length === 0 || filteredRows.length === 0) return

        const csvContent = [
            columns.map((c) => csvCell(c.label)).join(','),
            ...filteredRows.map((p) =>
                columns.map((c) => csvCell(c.getValue(p))).join(',')
            ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${slug}-deltakere-${scopeLabel(scope)}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        onClose()
    }

    return (
        <Dialog.Root open={open} onOpenChange={({ open: isOpen }) => !isOpen && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="lg">
                    <Dialog.Header>
                        <Dialog.Title>Eksporter deltakere</Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <Dialog.Body>
                        <Stack gap={6}>
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Hvem skal tas med?
                                </Text>
                                <RadioGroup.Root
                                    value={scope}
                                    onValueChange={(details) =>
                                        setScope((details.value as ExportScope) ?? 'all')
                                    }
                                >
                                    <Stack gap={2}>
                                        <RadioGroup.Item value="all">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Alle (påmeldte og venteliste)
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="confirmed">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Kun påmeldte (bekreftet plass)
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="waitlist">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Kun venteliste
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    </Stack>
                                </RadioGroup.Root>
                            </Box>

                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Filtrer på oppmøte
                                </Text>
                                <RadioGroup.Root
                                    value={attendanceFilter}
                                    onValueChange={(details) =>
                                        setAttendanceFilter(
                                            (details.value as AttendanceFilter) ?? 'all'
                                        )
                                    }
                                >
                                    <HStack gap={4} flexWrap="wrap">
                                        <RadioGroup.Item value="all">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>Alle</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="attended">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>Møtt</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="notAttended">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>Ikke møtt</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                        <RadioGroup.Item value="unregistered">
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Ikke registrert
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    </HStack>
                                </RadioGroup.Root>
                            </Box>

                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Kolonner
                                </Text>
                                <Stack gap={2}>
                                    {availableColumns.map((c) => (
                                        <Checkbox.Root
                                            key={c.key}
                                            checked={!deselectedColumns.has(c.key)}
                                            onCheckedChange={(details) =>
                                                toggleColumn(c.key, !!details.checked)
                                            }
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>{c.label}</Checkbox.Label>
                                        </Checkbox.Root>
                                    ))}
                                </Stack>
                            </Box>

                            <Text fontSize="sm" color="gray.600">
                                {filteredRows.length} deltaker(e) vil bli eksportert med{' '}
                                {selectedColumns.length} kolonne(r).
                            </Text>
                        </Stack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={onClose}>
                            Avbryt
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={filteredRows.length === 0 || selectedColumns.length === 0}
                        >
                            Last ned CSV
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
