import { getCustomerConfirmationEmail, getAdminNotificationEmail, type BookingData } from '@/lib/courseBookingEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email address to receive admin notifications
const ADMIN_EMAIL_TRONDHEIM = process.env.ADMIN_EMAIL || 'ekstern@trams.no';
const ADMIN_EMAIL_LEVANGER = process.env.ADMIN_EMAIL_LEVANGER || 'levanger@trams.no';

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

    const ADMIN_EMAIL = booking.kursby === 'levanger' ? ADMIN_EMAIL_LEVANGER : ADMIN_EMAIL_TRONDHEIM;

    const [customerEmail, adminEmail] = await Promise.all([
      getCustomerConfirmationEmail(booking),
      getAdminNotificationEmail(booking),
    ]);

    // Send both emails in parallel
    const [customerResult, adminResult] = await Promise.all([
      // 1. Send confirmation email to customer
      resend.emails.send({
        from: 'TrAMS <web@trams.no>',
        to: [booking.kontaktpersonEpost],
        subject: customerEmail.subject,
        html: customerEmail.html,
      }),

      // 2. Send notification email to admin
      resend.emails.send({
        from: 'TrAMS Kursbestilling <web@trams.no>',
        to: [ADMIN_EMAIL],
        replyTo: booking.kontaktpersonEpost,
        subject: adminEmail.subject,
        html: adminEmail.html,
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
