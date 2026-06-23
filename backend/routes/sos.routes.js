// routes/sos.routes.js — Emergency SOS email alert
const express = require('express');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Gmail SMTP transporter (reuse across requests)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

/**
 * POST /api/sos
 * Sends an emergency SOS email with live location to emergency contacts.
 * Protected — requires JWT auth.
 *
 * Body: {
 *   userName: string,
 *   latitude: number | null,
 *   longitude: number | null,
 *   contacts: [{ name: string, email: string }]
 * }
 */
router.post('/', protect, async (req, res) => {
  try {
    const { userName, latitude, longitude, contacts } = req.body;

    // Validate
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one emergency contact with email is required.',
      });
    }

    const validContacts = contacts.filter(c => c.email && c.email.includes('@'));
    if (validContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid email addresses found in contacts.',
      });
    }

    // Build location info
    const hasLocation = latitude != null && longitude != null;
    const mapsLink = hasLocation
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : null;
    const coordsText = hasLocation
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : 'Could not determine';
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // HTML email template
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0D0D0D;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:24px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#1A1A2E;border-radius:16px;overflow:hidden;border:1px solid #333;">

              <!-- Red Alert Banner -->
              <tr>
                <td style="background:linear-gradient(135deg,#DC2626,#991B1B);padding:32px 24px;text-align:center;">
                  <h1 style="color:#FFFFFF;margin:0;font-size:26px;font-weight:800;letter-spacing:1px;">
                    TouristGuide Emergency Alert
                  </h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                    Sent via TouristGuide App Location Service
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding:28px 24px;">

                  <!-- Who -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                    <tr>
                      <td style="background:#252540;border-radius:12px;padding:16px 20px;border-left:4px solid #EF4444;">
                        <p style="color:#9CA3AF;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Person in Distress</p>
                        <p style="color:#FFFFFF;margin:0;font-size:20px;font-weight:700;">${userName || 'TouristGuide User'}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- When -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                    <tr>
                      <td style="background:#252540;border-radius:12px;padding:16px 20px;border-left:4px solid #F59E0B;">
                        <p style="color:#9CA3AF;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time of Alert</p>
                        <p style="color:#FFFFFF;margin:0;font-size:16px;font-weight:600;">${timestamp}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Where -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                    <tr>
                      <td style="background:#252540;border-radius:12px;padding:16px 20px;border-left:4px solid #10B981;">
                        <p style="color:#9CA3AF;margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Location Details</p>
                        ${hasLocation ? `
                          <p style="color:#FFFFFF;margin:0 0 8px;font-size:14px;">Coordinates: ${coordsText}</p>
                          <a href="${mapsLink}" style="display:inline-block;background:#10B981;color:#FFFFFF;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
                            Open in Google Maps
                          </a>
                        ` : `
                          <p style="color:#F59E0B;margin:0;font-size:14px;font-weight:600;">Location could not be determined (permission denied)</p>
                        `}
                      </td>
                    </tr>
                  </table>

                  <!-- Action Required -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                    <tr>
                      <td style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:20px;text-align:center;">
                        <p style="color:#EF4444;margin:0;font-size:16px;font-weight:700;">
                          Attention Required
                        </p>
                        <p style="color:#D1D5DB;margin:8px 0 0;font-size:14px;line-height:1.5;">
                          This user has triggered an emergency alert. Please try to contact them immediately, or reach out to local emergency services if you cannot get in touch.
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#111827;padding:16px 24px;text-align:center;border-top:1px solid #333;">
                  <p style="color:#6B7280;margin:0;font-size:12px;">
                    This is an automated safety notification from the TouristGuide mobile app.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Plain text fallback
    const textBody = `TouristGuide Emergency Alert

Person in Distress: ${userName || 'TouristGuide User'}
Time: ${timestamp}
Location: ${hasLocation ? `${coordsText}\nGoogle Maps: ${mapsLink}` : 'Could not determine'}

Attention Required: This user has triggered an emergency alert. Please contact them or local services to ensure their safety.

— TouristGuide App`;

    // Send email to all contacts
    const recipientEmails = validContacts.map(c => c.email).join(', ');

    await transporter.sendMail({
      from: `"TouristGuide Safety" <${process.env.SMTP_EMAIL}>`,
      to: recipientEmails,
      replyTo: process.env.SMTP_EMAIL,
      subject: `TouristGuide Emergency Alert: Assistance needed for ${userName || 'User'}`,
      text: textBody,
      html: htmlBody,
    });

    console.log(`🚨 SOS email sent to: ${recipientEmails} for user: ${userName}`);

    return res.status(200).json({
      success: true,
      message: `Emergency email sent to ${validContacts.length} contact(s).`,
      recipients: validContacts.map(c => c.name),
    });
  } catch (error) {
    console.error('❌ SOS Email Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send emergency email. Please call emergency services directly.',
    });
  }
});

module.exports = router;
