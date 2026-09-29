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

export type ParticipantRow = Tables<'EventParticipants'>

export type ExportColumnKey =
    | 'name'
    | 'email'
    | 'kull'
    | 'allergies'
    | 'membership'
    | 'customQuestion'
    | 'status'
    | 'attendance'
    | 'signedUpAt'

interface ColumnDef {
    key: ExportColumnKey
    label: string
    getValue: (p: ParticipantRow, customQuestion: string | null) => string
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
    { key: 'allergies', label: 'Allergier', getValue: (p) => p.allergies ?? '' },
    {
        key: 'membership',
        label: 'Medlemskap (selvrapportert)',
        getValue: (p) => memberConfirmLabel(p),
    },
    {
        key: 'customQuestion',
        label: 'Tilleggsspørsmål',
        getValue: (p) => (p.custom_question_response ? 'Ja' : 'Nei'),
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

const DEFAULT_SELECTED_COLUMNS: ExportColumnKey[] = [
    'name',
    'email',
    'kull',
    'allergies',
    'membership',
    'customQuestion',
    'status',
    'attendance',
    'signedUpAt',
]

type ExportScope = 'all' | 'confirmed' | 'waitlist'
type AttendanceFilter = 'all' | 'attended' | 'notAttended' | 'unregistered'

interface ExportParticipantsDialogProps {
    open: boolean
    onClose: () => void
    participants: ParticipantRow[]
    eventCustomQuestion: string | null
    slug: string
}

function csvCell(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export default function ExportParticipantsDialog({
    open,
    onClose,
    participants,
    eventCustomQuestion,
    slug,
}: ExportParticipantsDialogProps) {
    const [scope, setScope] = useState<ExportScope>('all')
    const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all')
    const [selectedColumns, setSelectedColumns] = useState<Set<ExportColumnKey>>(
        () => new Set(DEFAULT_SELECTED_COLUMNS)
    )

    const availableColumns = useMemo(
        () => ALL_COLUMNS.filter((c) => c.key !== 'customQuestion' || !!eventCustomQuestion),
        [eventCustomQuestion]
    )

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
        setSelectedColumns((prev) => {
            const next = new Set(prev)
            if (checked) next.add(key)
            else next.delete(key)
            return next
        })
    }

    const scopeLabel = (s: ExportScope) => {
        if (s === 'confirmed') return 'bekreftet'
        if (s === 'waitlist') return 'venteliste'
        return 'alle'
    }

    const handleDownload = () => {
        const columns = availableColumns.filter((c) => selectedColumns.has(c.key))
        if (columns.length === 0 || filteredRows.length === 0) return

        const csvContent = [
            columns.map((c) => csvCell(c.label)).join(','),
            ...filteredRows.map((p) =>
                columns.map((c) => csvCell(c.getValue(p, eventCustomQuestion))).join(',')
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
                                            checked={selectedColumns.has(c.key)}
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
                                {selectedColumns.size} kolonne(r).
                            </Text>
                        </Stack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="outline" onClick={onClose}>
                            Avbryt
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={filteredRows.length === 0 || selectedColumns.size === 0}
                        >
                            Last ned CSV
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
