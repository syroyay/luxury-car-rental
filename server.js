require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'bookings@supercarrentals.de';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'bookings@supercarrentals.de';

app.use(express.json());
app.use(express.static(path.join(__dirname), {
  index: 'index.html'
}));

app.post('/api/send-confirmation', async (req, res) => {
  const booking = req.body;

  if (!booking || !booking.email || !booking.car || !booking.id) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const purposeLabels = {
    fun: 'Just For Fun', wedding: 'Wedding', trip: 'Trip / Tour',
    business: 'Business Event', photoshoot: 'Photoshoot / Film',
    airport: 'Airport Transfer', other: 'Other'
  };

  const pickupFormatted = formatDate(booking.pickupDateTime);
  const returnFormatted = formatDate(booking.returnDateTime);
  const purposeText = purposeLabels[booking.purpose] || booking.purpose;
  const locationText = booking.delivery ? 'Delivery to: ' + booking.deliveryAddress : 'Showroom pickup';

  // Customer confirmation email
  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #333;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1a1a,#2a2a2a);padding:40px 40px 30px;text-align:center;border-bottom:2px solid #D4AF37;">
            <h1 style="margin:0;color:#D4AF37;font-size:28px;font-weight:300;letter-spacing:3px;">SUPERCARRENTALS.DE</h1>
            <p style="margin:10px 0 0;color:#999;font-size:13px;letter-spacing:2px;">LUXURY CAR RENTAL</p>
          </td>
        </tr>
        <!-- Confirmation -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 5px;color:#D4AF37;font-size:22px;font-weight:400;">Booking Confirmed</h2>
            <p style="margin:0 0 30px;color:#888;font-size:14px;">Thank you, ${booking.name}! Your reservation is confirmed.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Booking ID</span><br>
                  <span style="color:#D4AF37;font-size:18px;font-weight:600;letter-spacing:2px;">${booking.id.toUpperCase()}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Car</span><br>
                  <span style="color:#fff;font-size:16px;">${booking.car}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Pickup</span><br>
                  <span style="color:#fff;font-size:14px;">${pickupFormatted}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Return</span><br>
                  <span style="color:#fff;font-size:14px;">${returnFormatted}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Location</span><br>
                  <span style="color:#fff;font-size:14px;">${locationText}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;border-bottom:1px solid #333;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Purpose</span><br>
                  <span style="color:#fff;font-size:14px;">${purposeText}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 25px;background:#1a1a1a;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Estimated Total</span><br>
                  <span style="color:#D4AF37;font-size:22px;font-weight:600;">${booking.estimatedTotal}</span>
                </td>
              </tr>
            </table>

            <p style="margin:30px 0 15px;color:#888;font-size:13px;line-height:1.6;">
              If you have any questions or need to make changes, please contact us:
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:5px 0;color:#ccc;font-size:13px;">WhatsApp / Phone: <a href="tel:+971502136375" style="color:#D4AF37;text-decoration:none;">+971 50 213 6375</a></td>
              </tr>
              <tr>
                <td style="padding:5px 0;color:#ccc;font-size:13px;">Instagram: <a href="https://instagram.com/exclusivedriveuae_com" style="color:#D4AF37;text-decoration:none;">@exclusivedriveuae_com</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:25px 40px;background:#111;border-top:1px solid #333;text-align:center;">
            <p style="margin:0;color:#666;font-size:11px;">Supercarrentals.de &mdash; Luxury Car Rental</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Owner notification email
  const ownerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #ddd;">
        <tr>
          <td style="background:#1a1a1a;padding:25px 30px;border-bottom:3px solid #D4AF37;">
            <h1 style="margin:0;color:#D4AF37;font-size:20px;font-weight:400;">New Booking Received</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;">
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;width:140px;border-bottom:1px solid #eee;">Booking ID</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${booking.id.toUpperCase()}</td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Car</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${booking.car}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Customer Name</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${booking.name}</td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Email</td>
                <td style="color:#333;border-bottom:1px solid #eee;"><a href="mailto:${booking.email}" style="color:#D4AF37;">${booking.email}</a></td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Phone</td>
                <td style="color:#333;border-bottom:1px solid #eee;"><a href="tel:${booking.phone}" style="color:#D4AF37;">${booking.phone}</a></td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Age</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${booking.age}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Pickup</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${pickupFormatted}</td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Return</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${returnFormatted}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Location</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${locationText}</td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Purpose</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${purposeText}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="color:#666;font-weight:600;border-bottom:1px solid #eee;">Special Requests</td>
                <td style="color:#333;border-bottom:1px solid #eee;">${booking.specialRequests || 'None'}</td>
              </tr>
              <tr>
                <td style="color:#666;font-weight:600;border-bottom:2px solid #D4AF37;">Estimated Total</td>
                <td style="color:#D4AF37;font-weight:700;font-size:16px;border-bottom:2px solid #D4AF37;">${booking.estimatedTotal}</td>
              </tr>
            </table>
            <p style="margin:20px 0 0;color:#999;font-size:12px;">Booked at: ${booking.bookedAt}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const [customerResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [booking.email],
        subject: `Booking Confirmed — ${booking.car} | Supercarrentals.de`,
        html: customerHtml
      }),
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [OWNER_EMAIL],
        subject: `New Booking — ${booking.car} | ${booking.name}`,
        html: ownerHtml
      })
    ]);

    console.log('Emails sent:', { customer: customerResult, owner: ownerResult });
    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send confirmation emails' });
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
