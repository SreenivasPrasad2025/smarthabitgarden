import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """
    Send password reset email with reset token

    Note: This is a basic implementation. In production, consider using:
    - SendGrid, Mailgun, or AWS SES for better deliverability
    - HTML email templates
    - Better error handling and logging
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    from_email = os.getenv("FROM_EMAIL", smtp_username)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # If SMTP credentials are not configured, log the token (for development)
    if not smtp_username or not smtp_password:
        print(f"\n{'='*60}")
        print(f"PASSWORD RESET TOKEN FOR {to_email}:")
        print(f"Token: {reset_token}")
        print(f"Reset URL: {frontend_url}/reset-password?token={reset_token}")
        print(f"{'='*60}\n")
        return True

    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Reset - Smart Habit Garden"
        message["From"] = from_email
        message["To"] = to_email

        # Create reset URL
        reset_url = f"{frontend_url}/reset-password?token={reset_token}"

        # Email body (plain text and HTML versions)
        text_body = f"""
Hello,

You requested to reset your password for Smart Habit Garden.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
Smart Habit Garden Team
"""

        html_body = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #16a34a;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested to reset your password for <strong>Smart Habit Garden</strong>.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{reset_url}"
           style="background-color: #16a34a; color: white; padding: 12px 30px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link into your browser:<br>
        <a href="{reset_url}" style="color: #16a34a;">{reset_url}</a>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 1 hour.
      </p>
      <p style="color: #999; font-size: 12px;">
        If you didn't request this password reset, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">
        Best regards,<br>
        Smart Habit Garden Team
      </p>
    </div>
  </body>
</html>
"""

        # Attach both plain text and HTML versions
        part1 = MIMEText(text_body, "plain")
        part2 = MIMEText(html_body, "html")
        message.attach(part1)
        message.attach(part2)

        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(from_email, to_email, message.as_string())

        print(f"Password reset email sent to {to_email}")
        return True

    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        # In development, still show the token
        print(f"\n{'='*60}")
        print(f"PASSWORD RESET TOKEN FOR {to_email}:")
        print(f"Token: {reset_token}")
        print(f"Reset URL: {frontend_url}/reset-password?token={reset_token}")
        print(f"{'='*60}\n")
        return False
