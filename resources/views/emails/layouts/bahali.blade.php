{{-- Bahali email layout — same colours and fonts as the website (cream background, teal, Fraunces headings). --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $subject ?? 'Bahali' }}</title>
    {{-- Fraunces loads in Apple Mail / iOS; other clients fall back to Georgia. --}}
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap"
        rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #F7F3EC;
        }

        a {
            color: #0E7C7B;
        }

        @media only screen and (max-width: 620px) {
            .container {
                width: 100% !important;
            }

            .card {
                padding: 28px 22px !important;
            }

            .heading {
                font-size: 24px !important;
            }

            .button a {
                display: block !important;
            }
        }
    </style>
</head>

<body style="margin:0; padding:0; background:#F7F3EC; -webkit-text-size-adjust:100%;">
    {{-- Inbox preview text --}}
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:#F7F3EC;">@yield('preheader')</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:#F7F3EC;">
        <tr>
            <td align="center" style="padding:32px 12px;">
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0"
                    border="0" style="width:600px; max-width:600px;">

                    {{-- Wordmark --}}
                    <tr>
                        <td align="center" style="padding:0 0 22px;">
                            <a href="{{ url('/') }}"
                                style="text-decoration:none; font-family:Fraunces, 'Playfair Display', Georgia, serif; font-size:26px; font-weight:600; color:#0E7C7B; letter-spacing:-0.3px;">Bahali</a>
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td class="card"
                            style="background:#FFFFFF; border:1px solid #E7E0D2; border-radius:16px; padding:40px 40px 36px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#3A4B49; font-size:15px; line-height:1.65;">
                            @yield('content')
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center"
                            style="padding:24px 24px 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size:12px; line-height:1.6; color:#8A9795;">
                            @yield('footer')
                            <p style="margin:10px 0 0;">&copy; {{ date('Y') }} Bahali Provider Directory</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
