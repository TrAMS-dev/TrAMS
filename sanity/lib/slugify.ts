export function slugify(input: string): string {
    return input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^\-+/, '')
        .replace(/\-+$/, '')
}
