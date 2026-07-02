<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update — Bahali</title>
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

        .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            margin: 20px 0;
            text-align: center;
        }

        .status-approved {
            background-color: #D4EDDA;
            color: #155724;
            border: 1px solid #C3E6CB;
        }

        .status-rejected {
            background-color: #F8D7DA;
            color: #721C24;
            border: 1px solid #F5C6CB;
        }

        .status-suspended {
            background-color: #FFF3CD;
            color: #856404;
            border: 1px solid #FFEAA7;
        }

        .status-inactive {
            background-color: #E2E3E5;
            color: #383D41;
            border: 1px solid #D6D8DB;
        }

        .status-pending {
            background-color: #D1ECF1;
            color: #0C5460;
            border: 1px solid #BEE5EB;
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
            margin-bottom: 16px;
        }

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

        .note-section {
            background-color: #FBF8F2;
            border: 1px solid #E7E0D2;
            padding: 20px;
            border-radius: 6px;
            margin: 24px 0;
        }

        .note-section h3 {
            font-size: 14px;
            color: #26403F;
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .note-content {
            font-size: 14px;
            line-height: 1.6;
            color: #5B6B6E;
            white-space: pre-wrap;
            word-break: break-word;
        }

        /* CTA Button */
        .action-button {
            display: inline-block;
            margin: 24px 0;
            padding: 14px 32px;
            background-color: #2C5349;
            color: #FFFFFF !important;
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

        /* Divider */
        .divider {
            height: 1px;
            background-color: #E7E0D2;
            margin: 24px 0;
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
                <h2>Application Status Update</h2>

                <p>Hello {{ $provider->user?->name ?? $provider->organization_name }},</p>

                <p>We've reviewed your application for the Bahali Provider Directory. Here's the update on your
                    submission:</p>

                <!-- Status Badge -->
                <div style="text-align: center;">
                    <div class="status-badge status-{{ $status }}">
                        @if ($status === 'approved')
                            ✓ APPLICATION APPROVED
                        @elseif($status === 'rejected')
                            APPLICATION NEEDS REVISION
                        @elseif($status === 'suspended')
                            APPLICATION SUSPENDED
                        @elseif($status === 'inactive')
                            APPLICATION MARKED INACTIVE
                        @else
                            UNDER REVIEW
                        @endif
                    </div>
                </div>

                <!-- Status-specific message -->
                @if ($status === 'approved')
                    <p>Congratulations! Your application has been approved. Your profile is now visible in the Bahali
                        Provider Directory, helping Caribbean individuals and families find your services.</p>

                    <div class="info-box">
                        You can manage your profile, update your information, and view inquiries from potential clients
                        by signing into your account.
                    </div>
                @elseif($status === 'rejected')
                    <p>Thank you for your submission. After careful review, we're unable to approve your application at
                        this time. Please review the feedback below and feel free to reapply with any updates.</p>
                @elseif($status === 'suspended')
                    <p>Your provider listing has been suspended. Please review the details below and contact us if you
                        have any questions or wish to reactivate your profile.</p>
                @elseif($status === 'inactive')
                    <p>Your provider listing has been marked as inactive. You can reactivate it at any time by signing
                        into your account.</p>
                @else
                    <p>Your application is currently under review by our team. We'll notify you as soon as we have an
                        update.</p>
                @endif

                <!-- Note Section (if provided) -->
                @if ($note)
                    <div class="note-section">
                        <h3>Feedback from Bahali Team</h3>
                        <div class="note-content">{{ $note }}</div>
                    </div>
                @endif

                <!-- Action -->
                @if ($status === 'approved')
                    <a href="https://bahali.org" class="action-button text-white">View Your Profile</a>
                @else
                    <a href="https://bahali.org/contact" class="action-button  text-white">Get Help</a>
                @endif

                <div class="divider"></div>

                <p style="font-size: 14px; color: #9AA6A4;">
                    @if ($status === 'rejected')
                        If you'd like to reapply or have questions about the feedback, please don't hesitate to reach
                        out to our team.
                    @else
                        If you have any questions about your status or need assistance, please contact us.
                    @endif
                </p>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>Need support? <a href="https://bahali.org/contact">Contact our team</a></p>
                <div class="footer-brand">Bahali</div>
                <p style="margin-top: 12px; font-size: 12px;">
                    {{ config('app.name') }} &copy; {{ date('Y') }} | <a href="https://bahali.org/privacy">Privacy
                        Policy</a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
