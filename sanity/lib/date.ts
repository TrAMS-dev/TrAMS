export function formatNorwegianDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

