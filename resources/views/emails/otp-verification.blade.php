<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification — Bahali</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #26403F;
            background-color: #F7F3EC;
        }

        .email-wrapper {
            background-color: #F7F3EC;
            padding: 40px 20px;
        }

        .email-container {
            max-width: 540px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Header with Bahali branding */
        .email-header {
            background: linear-gradient(135deg, #2C5349 0%, #1F3D3A 100%);
            padding: 40px 30px;
            text-align: center;
            color: #FFFFFF;
        }

        .email-header h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }

        .email-header p {
            font-size: 14px;
            opacity: 0.95;
            letter-spacing: 0.5px;
        }

        /* Content area */
        .email-content {
            padding: 40px 30px;
        }

        .email-content h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px;
            color: #2C5349;
            margin-bottom: 16px;
            font-weight: 600;
        }

        .email-content p {
            font-size: 15px;
            line-height: 1.7;
            color: #5B6B6E;
            margin-bottom: 20px;
        }

        /* OTP Code Display */
        .otp-container {
            margin: 32px 0;
            text-align: center;
        }

        .otp-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9AA6A4;
            margin-bottom: 12px;
            display: block;
            font-weight: 600;
        }

        .otp-code {
            font-family: 'Courier New', monospace;
            font-size: 42px;
            font-weight: 700;
            letter-spacing: 12px;
            color: #2C5349;
            background: linear-gradient(to bottom, #FFFFFF, #F9F9F9);
            border: 2px solid #E7E0D2;
            border-radius: 8px;
            padding: 24px;
            margin: 0 auto;
            display: inline-block;
            min-width: 280px;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        /* Info box */
        .info-box {
            background-color: #F7F3EC;
            border-left: 4px solid #2C5349;
            padding: 16px 20px;
            border-radius: 4px;
            margin: 24px 0;
            font-size: 14px;
            color: #5B6B6E;
        }

        .info-box strong {
            color: #26403F;
        }

        /* Action button */
        .action-button {
            display: inline-block;
            margin: 24px 0;
            padding: 14px 32px;
            background-color: #2C5349;
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            transition: background-color 0.2s;
            text-align: center;
        }

        .action-button:hover {
            background-color: #1F3D3A;
        }

        /* Footer */
        .email-footer {
            background-color: #FAFBFA;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E7E0D2;
            font-size: 13px;
            color: #9AA6A4;
        }

        .email-footer p {
            margin-bottom: 8px;
        }

        .email-footer a {
            color: #2C5349;
            text-decoration: none;
        }

        .email-footer a:hover {
            text-decoration: underline;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 14px;
            font-weight: 600;
            color: #2C5349;
            margin-top: 16px;
        }

        /* Divider */
        .divider {
            height: 1px;
            background-color: #E7E0D2;
            margin: 24px 0;
        }

        /* Disclaimer */
        .disclaimer {
            font-size: 12px;
            color: #9AA6A4;
            font-style: italic;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #E7E0D2;
        }

        /* Responsive */
        @media (max-width: 540px) {
            .email-container {
                border-radius: 0;
            }

            .email-header {
                padding: 30px 20px;
            }

            .email-header h1 {
                font-size: 24px;
            }

            .email-content {
                padding: 30px 20px;
            }

            .otp-code {
                font-size: 36px;
                letter-spacing: 8px;
                min-width: 260px;
                padding: 20px;
            }

            .email-footer {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <h1>Bahali</h1>
                <p>Provider Directory</p>
            </div>

            <!-- Content -->
            <div class="email-content">
                <h2>Email Verification</h2>
                <p>Thank you for registering with Bahali. To complete your application and join our provider directory,
                    please verify your email address using the code below:</p>

                <!-- OTP Code -->
                <div class="otp-container">
                    <span class="otp-label">Your Verification Code</span>
                    <div class="otp-code">{{ $otp }}</div>
                </div>

                <!-- Info Box -->
                <div class="info-box">
                    ⏱ This code will expire in <strong>10 minutes</strong>. If you didn't receive this code or it has
                    expired, you can request a new one.
                </div>

                <p>Enter this code on the verification page to proceed with your registration.</p>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #9AA6A4;">If you didn't request this verification code or didn't
                    register with Bahali, please disregard this email. Your account will remain inactive if not verified
                    within 10 minutes.</p>

                <div class="disclaimer">
                    For security reasons, never share this code with anyone. Bahali staff will never ask you for this
                    code via email or phone.
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>Need help? <a href="https://bahali.org/contact">Contact our support team</a></p>
                <div class="footer-brand">
                    Bahali
                </div>
                <p style="margin-top: 12px; font-size: 12px;">
                    {{ config('app.name') }} &copy; {{ date('Y') }} | <a href="https://bahali.org/privacy">Privacy
                        Policy</a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
