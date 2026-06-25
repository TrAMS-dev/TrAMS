'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Field, NativeSelect } from '@chakra-ui/react'

const MONTHS = [
    { value: '01', label: 'Januar' },
    { value: '02', label: 'Februar' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
] as const

function calculateYearForMonth(selectedMonthStr: string): string {
    if (!selectedMonthStr) return ''
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-indexed (1-12)
    const selectedMonth = parseInt(selectedMonthStr, 10)

    if (selectedMonth < currentMonth) {
        return String(currentYear + 1)
    } else {
        return String(currentYear)
    }
}

function parsePlannedMonth(value: string): { year: string; month: string } {
    if (!value) return { year: '', month: '' }
    const [year, month] = value.split('-')
    return { year: year ?? '', month: month ?? '' }
}

interface PlannedMonthSelectorProps {
    value: string
    onChange: (value: string) => void
}

export function PlannedMonthSelector({ value, onChange }: PlannedMonthSelectorProps) {
    const parsed = useMemo(() => parsePlannedMonth(value), [value])
    const [month, setMonth] = useState(parsed.month)

    useEffect(() => {
        setMonth(parsed.month)
    }, [parsed.month])

    const handleMonthChange = (nextMonth: string) => {
        const nextYear = calculateYearForMonth(nextMonth)
        setMonth(nextMonth)
        onChange(nextYear && nextMonth ? `${nextYear}-${nextMonth}` : '')
    }

    return (
        <Field.Root>
            <Field.Label>Planlagt måned *</Field.Label>
            <Box
                display="grid"
                gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                gap={4}
            >
                <Field.Root>
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            value={month}
                            onChange={(event) => handleMonthChange(event.target.value)}
                        >
                            <option value="">Velg måned</option>
                            {MONTHS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Field.Root>

            </Box>
            <Field.HelperText>
                Arrangementet vises kun i listevisning, ikke i kalenderen.
            </Field.HelperText>
        </Field.Root>
    )
}
