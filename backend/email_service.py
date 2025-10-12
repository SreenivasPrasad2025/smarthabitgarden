import os
import resend

def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """
    Send password reset email with reset token using Resend API

    Resend provides reliable email delivery that works on free hosting tiers.
    Get your API key from: https://resend.com/api-keys
    """
    resend_api_key = os.getenv("RESEND_API_KEY", "")
    from_email = os.getenv("FROM_EMAIL", "onboarding@resend.dev")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # If Resend API key is not configured, log the token (for development)
    if not resend_api_key:
        print(f"\n{'='*60}")
        print(f"⚠️  RESEND_API_KEY not set - Email will not be sent")
        print(f"PASSWORD RESET TOKEN FOR {to_email}:")
        print(f"Token: {reset_token}")
        print(f"Reset URL: {frontend_url}/reset-password?token={reset_token}")
        print(f"{'='*60}\n")
        return True

    # Set Resend API key
    resend.api_key = resend_api_key

    # Create reset URL
    reset_url = f"{frontend_url}/reset-password?token={reset_token}"

    # HTML email body
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

    try:
        # Send email using Resend API
        params = {
            "from": from_email,
            "to": [to_email],
            "subject": "Password Reset - Smart Habit Garden",
            "html": html_body,
        }

        response = resend.Emails.send(params)
        print(f"✅ Password reset email sent to {to_email} (ID: {response.get('id', 'N/A')})")
        return True

    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        # In development/error, still show the token
        print(f"\n{'='*60}")
        print(f"PASSWORD RESET TOKEN FOR {to_email}:")
        print(f"Token: {reset_token}")
        print(f"Reset URL: {reset_url}")
        print(f"{'='*60}\n")
        return False
