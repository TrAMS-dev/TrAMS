import { getCustomerConfirmationHtml, getAdminNotificationHtml, BookingData } from '@/components/CourseEmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email address to receive admin notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ekstern@trams.no';

export async function POST(request: Request) {
  try {
    const booking: BookingData = await request.json();

    // Validate required fields
    if (!booking.kontaktpersonEpost || !booking.kontaktpersonNavn) {
      return Response.json(
        { error: 'Mangler påkrevde felt (e-post og navn)' },
        { status: 400 }
      );
    }

    const kursNavn = booking.kursType === 'Annet' ? booking.kursTypeAnnet : booking.kursType;

    // Send both emails in parallel
    const [customerResult, adminResult] = await Promise.all([
      // 1. Send confirmation email to customer
      resend.emails.send({
        from: 'TrAMS <web@trams.no>',
        to: [booking.kontaktpersonEpost],
        subject: 'Bekreftelse på kursbestilling - TrAMS',
        html: getCustomerConfirmationHtml(booking),
      }),

      // 2. Send notification email to admin
      resend.emails.send({
        from: 'TrAMS Kursbestilling <web@trams.no>',
        to: [ADMIN_EMAIL],
        replyTo: booking.kontaktpersonEpost,
        subject: `Ny kursbestilling: ${kursNavn} - ${booking.kontaktpersonNavn}`,
        html: getAdminNotificationHtml(booking),
      }),
    ]);

    // Check for errors in either email
    if (customerResult.error) {
      console.error('Failed to send customer email:', customerResult.error);
      return Response.json(
        { error: 'Kunne ikke sende bekreftelsesmail til kunde' },
        { status: 500 }
      );
    }

    if (adminResult.error) {
      console.error('Failed to send admin email:', adminResult.error);
      // Don't fail the whole request if admin email fails, customer already got theirs
    }

    return Response.json({
      success: true,
      customerEmailId: customerResult.data?.id,
      adminEmailId: adminResult.data?.id,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return Response.json(
      { error: 'Kunne ikke sende e-post' },
      { status: 500 }
    );
  }
}
