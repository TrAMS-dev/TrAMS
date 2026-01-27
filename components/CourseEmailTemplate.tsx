export interface BookingData {
  kontaktpersonNavn: string;
  kontaktpersonEpost: string;
  kontaktpersonTelefon?: string;
  kursType: string;
  kursTypeAnnet?: string;
  deltakermasse?: string;
  antallDeltakere: string;
  datoType: 'spesifikk' | 'fleksibel';
  spesifikkDato?: string;
  spesifikkTid?: string;
  fraDato?: string;
  tilDato?: string;
  sted: string;
  adresse?: string;
  annet?: string;
  kursbevis: boolean;
  engelskKurs: boolean;
}

// Helper function to format date display
function formatDateDisplay(booking: BookingData): string {
  if (booking.datoType === 'spesifikk') {
    return `${booking.spesifikkDato} kl. ${booking.spesifikkTid}`;
  }
  return `${booking.fraDato} - ${booking.tilDato}`;
}

function getDateLabel(booking: BookingData): string {
  return booking.datoType === 'spesifikk' ? 'Ønsket dato og tid:' : 'Ønsket periode:';
}

// Customer confirmation email - returns HTML string
export function getCustomerConfirmationHtml(booking: BookingData): string {
  const kursNavn = booking.kursType === 'Annet' ? booking.kursTypeAnnet : booking.kursType;
  const stedTekst = booking.sted === 'helsehus' ? 'Øya Helsehus' : booking.adresse;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #c41e3a; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TrAMS - Trondheim Akuttmedisinske Studentforening</h1>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
      <h2 style="color: #333; margin-top: 0;">Takk for din bestilling!</h2>
      
      <p style="color: #555; line-height: 1.6;">
        Hei ${booking.kontaktpersonNavn},
      </p>
      
      <p style="color: #555; line-height: 1.6;">
Denne mailen bekrefter at du har booket førstehjelpskurs av TrAMS, Trondheim Akuttmedisinske Studentforening. Du vil bli kontaktet av foreningens eksternsjef når vi har funnet instruktører til å holde kurset, eller dersom det er ytterligere spørsmål til bookingen.      </p>

      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Oppsummering av bestillingen</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Kurs:</td>
              <td style="padding: 8px 0; color: #333;">${kursNavn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Antall deltakere:</td>
              <td style="padding: 8px 0; color: #333;">${booking.antallDeltakere}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">${getDateLabel(booking)}</td>
              <td style="padding: 8px 0; color: #333;">${formatDateDisplay(booking)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Sted:</td>
              <td style="padding: 8px 0; color: #333;">${stedTekst}</td>
            </tr>
            ${booking.kursbevis ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Kursbevis:</td>
              <td style="padding: 8px 0; color: #333;">Ja</td>
            </tr>
            ` : ''}
            ${booking.engelskKurs ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Språk:</td>
              <td style="padding: 8px 0; color: #333;">Engelsk</td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <p style="color: #555; line-height: 1.6;">
        Har du spørsmål i mellomtiden? Ta gjerne kontakt med oss på 
        <a href="mailto:ekstern@trams.no" style="color: #c41e3a;">ekstern@trams.no</a>.
      </p>

      <p style="color: #555; line-height: 1.6; margin-bottom: 0;">
        Med vennlig hilsen,<br />
        <strong>TrAMS</strong>
      </p>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>
        TrAMS - Trondheim Akuttmedisinske Studentforening<br />
        <a href="https://trams.no" style="color: #c41e3a;">trams.no</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Admin notification email - returns HTML string
export function getAdminNotificationHtml(booking: BookingData): string {
  const kursNavn = booking.kursType === 'Annet' ? booking.kursTypeAnnet : booking.kursType;
  const stedTekst = booking.sted === 'helsehus' ? 'Øya Helsehus' : `Eget lokale: ${booking.adresse}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #c41e3a; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Ny kursbestilling mottatt</h1>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
      <p style="color: #555; line-height: 1.6;">
        En ny kursbestilling har blitt sendt inn via nettsiden.
      </p>

      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Kontaktinformasjon</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Navn:</td>
              <td style="padding: 8px 0; color: #333;">${booking.kontaktpersonNavn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">E-post:</td>
              <td style="padding: 8px 0; color: #333;">
                <a href="mailto:${booking.kontaktpersonEpost}" style="color: #c41e3a;">
                  ${booking.kontaktpersonEpost}
                </a>
              </td>
            </tr>
            ${booking.kontaktpersonTelefon ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Telefon:</td>
              <td style="padding: 8px 0; color: #333;">
                <a href="tel:${booking.kontaktpersonTelefon}" style="color: #c41e3a;">
                  ${booking.kontaktpersonTelefon}
                </a>
              </td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Kursdetaljer</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Kurs:</td>
              <td style="padding: 8px 0; color: #333;">${kursNavn}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Antall deltakere:</td>
              <td style="padding: 8px 0; color: #333;">${booking.antallDeltakere}</td>
            </tr>
            ${booking.deltakermasse ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Deltakermasse:</td>
              <td style="padding: 8px 0; color: #333;">${booking.deltakermasse}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Tid og sted</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Type:</td>
              <td style="padding: 8px 0; color: #333;">
                ${booking.datoType === 'spesifikk' ? 'Spesifikk dato og tid' : 'Fleksibel periode'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">${getDateLabel(booking)}</td>
              <td style="padding: 8px 0; color: #333;">${formatDateDisplay(booking)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Sted:</td>
              <td style="padding: 8px 0; color: #333;">${stedTekst}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Tilleggsvalg</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Kursbevis ønsket:</td>
              <td style="padding: 8px 0; color: #333;">${booking.kursbevis ? 'Ja' : 'Nei'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Kurs på engelsk:</td>
              <td style="padding: 8px 0; color: #333;">${booking.engelskKurs ? 'Ja' : 'Nei'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${booking.annet ? `
      <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0;">
        <h3 style="color: #c41e3a; margin-top: 0;">Andre kommentarer</h3>
        <p style="color: #333; margin: 0; white-space: pre-wrap;">${booking.annet}</p>
      </div>
      ` : ''}

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffc107;">
        <p style="color: #856404; margin: 0;">
          <strong>Husk:</strong> Ta kontakt med kunden for å bekrefte kurset og avklare detaljer.
        </p>
      </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>
        Denne e-posten ble automatisk generert fra kursbestillingsskjemaet på trams.no
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
