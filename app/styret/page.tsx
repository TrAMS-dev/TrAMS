'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StyretPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/#BoardMembers');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting...</p>
        </div>
    );
}
