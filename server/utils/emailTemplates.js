const bookingConfirmationEmail = (user, event, booking) => ({
  subject: `🎟️ Booking Confirmed — ${event.title}`,
  html: `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; 
                margin: 0 auto; background: #f8fafc; padding: 0;">
      
      <!-- Header -->
      <div style="background: #2563eb; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
          EventBook
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px;">
          Your ticket is confirmed!
        </p>
      </div>

      <!-- Body -->
      <div style="background: white; padding: 40px 32px;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 8px;">
          Hi ${user.name} 👋
        </p>
        <p style="font-size: 15px; color: #64748b; margin: 0 0 32px;">
          Your booking has been confirmed. Here are your details:
        </p>

        <!-- Event Card -->
        <div style="border: 1px solid #e2e8f0; border-radius: 12px; 
                    overflow: hidden; margin-bottom: 32px;">
          <img 
            src="${event.image}" 
            alt="${event.title}"
            style="width: 100%; height: 200px; object-fit: cover; display: block;"
          />
          <div style="padding: 24px;">
            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">
              ${event.title}
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;">
                  📅 Date
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${new Date(event.date).toLocaleDateString('en-IN', { 
                    weekday: 'long', year: 'numeric', 
                    month: 'long', day: 'numeric' 
                  })}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  🕐 Time
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${event.time}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  📍 Venue
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${event.venue}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  🎫 Seats
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${booking.seats} seat(s)
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  💰 Total Paid
                </td>
                <td style="padding: 8px 0; color: #2563eb; font-size: 18px; font-weight: 800;">
                  ₹${booking.totalAmount}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Booking ID -->
        <div style="background: #f1f5f9; border-radius: 8px; 
                    padding: 16px; text-align: center; margin-bottom: 32px;">
          <p style="margin: 0; color: #64748b; font-size: 13px;">Booking ID</p>
          <p style="margin: 4px 0 0; color: #1e293b; font-size: 14px; 
                    font-weight: 700; font-family: monospace;">
            ${booking._id}
          </p>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0;">
          Please arrive 30 minutes before the event. 
          Carry a valid ID proof along with this confirmation.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; text-align: center;">
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">
          © 2025 EventBook. All rights reserved.
        </p>
        <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
          This is an automated email. Please do not reply.
        </p>
      </div>

    </div>
  `
})

const newEventEmail = (user, event) => ({
  subject: `New ${event.category.charAt(0).toUpperCase() + event.category.slice(1)} Added — ${event.title}`,
  html: `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px;
                margin: 0 auto; background: #f8fafc; padding: 0;">

      <!-- Header -->
      <div style="background: #2563eb; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
          EventBook
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px;">
          New ${event.category} just dropped 🎟️
        </p>
      </div>

      <!-- Body -->
      <div style="background: white; padding: 40px 32px;">
        <p style="font-size: 16px; color: #1e293b; margin: 0 0 8px;">
          Hi ${user.name} 👋
        </p>
        <p style="font-size: 15px; color: #64748b; margin: 0 0 32px;">
          A new ${event.category} has been added that you might love:
        </p>

        <!-- Event Card -->
        <div style="border: 1px solid #e2e8f0; border-radius: 12px;
                    overflow: hidden; margin-bottom: 32px;">
          <img
            src="${event.image}"
            alt="${event.title}"
            style="width: 100%; height: 200px; object-fit: cover; display: block;"
          />
          <div style="padding: 24px;">
            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">
              ${event.title}
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 40%;">
                  📅 Date
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${new Date(event.date).toLocaleDateString('en-IN', {
                    weekday: 'long', year: 'numeric',
                    month: 'long', day: 'numeric'
                  })}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  🕐 Time
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${event.time}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  📍 Venue
                </td>
                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
                  ${event.venue}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">
                  💰 Starting From
                </td>
                <td style="padding: 8px 0; color: #2563eb; font-size: 18px; font-weight: 800;">
                  ₹${event.price}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center;">
          <a 
            href="http://localhost:3000"
            style="display: inline-block; background: #2563eb; color: white;
                   padding: 14px 36px; border-radius: 8px; text-decoration: none;
                   font-size: 15px; font-weight: 700;"
          >
            Book Now
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 24px 32px; text-align: center;">
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">
          © 2025 EventBook. All rights reserved.
        </p>
        <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px;">
          You received this because you previously booked a ${event.category} on EventBook.
        </p>
      </div>

    </div>
  `
})

module.exports = { bookingConfirmationEmail, newEventEmail }
