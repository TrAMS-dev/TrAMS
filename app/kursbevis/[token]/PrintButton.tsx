'use client'

export default function PrintButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            style={{
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: 6,
                cursor: 'pointer',
            }}
        >
            Skriv ut / lagre som PDF
        </button>
    )
}
