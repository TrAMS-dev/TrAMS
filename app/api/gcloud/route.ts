import { google } from "googleapis";

export async function POST(req: Request) {
    const body = await req.json();
    console.log("API gcloud hit with body:", body);

    // Destructure known fields from BookKursForm
    const {
        kontaktpersonNavn,
        kontaktpersonTelefon,
        kontaktpersonEpost,
        kursType,
        deltakermasse,
        antallDeltakere,
        datoer,
        sted,
        annet,
        kursbevis
    } = body;

    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
        console.error("GOOGLE_PRIVATE_KEY is missing from env");
        return Response.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Sanitize key: remove wrapping double quotes if present, handle escaped newlines
    const formattedKey = privateKey
        .replace(/^"|"$/g, '')
        .replace(/\\n/g, "\n");

    console.log("Key Debug:", {
        length: formattedKey.length,
        startsWith: formattedKey.substring(0, 20),
        hasHeader: formattedKey.includes("BEGIN PRIVATE KEY"),
        hasNewline: formattedKey.includes("\n")
    });

    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: formattedKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append to "Sheet1"
    // Columns: Timestamp | Navn | Tif | Epost | Kurs | Deltakere | Antall | Datoer | Sted | Annet | Bevis
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            // Range 'Sheet1!A:A' tells Google to look for the last row in Column A and append after that.
            // This prevents "cascading" (where it writes to K, then U, etc.) if previous columns are empty.
            range: "Sheet1!A:A",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS", // Explicitly insert new rows
            requestBody: {
                values: [[
                    new Date().toISOString(),
                    kontaktpersonNavn ?? "",
                    kontaktpersonTelefon ?? "",
                    kontaktpersonEpost ?? "",
                    kursType ?? "",
                    deltakermasse ?? "",
                    antallDeltakere ?? "",
                    datoer ?? "",
                    sted ?? "",
                    annet ?? "",
                    kursbevis ? "Ja" : "Nei"
                ]],
            },
        });
    } catch (error: any) {
        console.error("GCloud Append Error:", error);
        return Response.json({
            error: error.message || "Failed to append to sheet",
            details: "Check if the sheet name is exactly 'Sheet1' (case sensitive)."
        }, { status: 400 });
    }

    return Response.json({ ok: true });
}