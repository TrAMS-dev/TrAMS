import { createClient } from '@supabase/supabase-js';

interface BookingRequestBody {
    kontaktpersonNavn?: string;
    kontaktpersonTelefon?: string;
    kontaktpersonEpost?: string;
    kursType?: string;
    kursTypeAnnet?: string;
    deltakermasse?: string;
    antallDeltakere?: string;
    datoer?: string;
    datoType?: 'spesifikk' | 'fleksibel';
    spesifikkDato?: string;
    spesifikkTid?: string;
    fraDato?: string;
    tilDato?: string;
    sted?: string;
    adresse?: string;
    annet?: string;
    kursbevis?: boolean;
    engelskKurs?: boolean;
}

export async function POST(req: Request) {
    const body = (await req.json()) as BookingRequestBody;
    console.log("API supabase hit with body:", body);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase credentials are missing from env");
        return Response.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Empty string is invalid for DATE/TIME columns; use null instead
    const dateOrNull = (v: string | undefined) =>
        v === undefined || v === '' ? null : v;

    // Prepare data for insertion
    const submissionData = {
        kontaktperson_navn: body.kontaktpersonNavn ?? null,
        kontaktperson_telefon: body.kontaktpersonTelefon ?? null,
        kontaktperson_epost: body.kontaktpersonEpost ?? null,
        kurs_type: body.kursType ?? null,
        kurs_type_annet: body.kursTypeAnnet ?? null,
        deltakermasse: body.deltakermasse ?? null,
        antall_deltakere: body.antallDeltakere ? parseInt(body.antallDeltakere) : null,
        datoer: body.datoer ?? null,
        dato_type: body.datoType ?? null,
        spesifikk_dato: dateOrNull(body.spesifikkDato),
        spesifikk_tid: dateOrNull(body.spesifikkTid),
        fra_dato: dateOrNull(body.fraDato),
        til_dato: dateOrNull(body.tilDato),
        sted: body.sted ?? null,
        adresse: body.adresse ?? null,
        annet: body.annet ?? null,
        kursbevis: body.kursbevis ?? false,
        engelsk_kurs: body.engelskKurs ?? false,
        created_at: new Date().toISOString(),
    };

    try {
        const { data, error } = await supabase
            .from('CourseSubmissions')
            .insert([submissionData])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            return Response.json(
                { error: error.message, details: error },
                { status: 400 }
            );
        }

        console.log("Successfully inserted submission:", data);
        return Response.json({ ok: true, data });
    } catch (error: unknown) {
        console.error("Unexpected error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to save submission";
        return Response.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
