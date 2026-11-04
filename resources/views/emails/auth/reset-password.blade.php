@extends('emails.layouts.bahali')

@section('preheader', 'Use this link to choose a new password for your Bahali account.')

@section('content')
    {{-- Eyebrow + heading --}}
    <p
        style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:1.6px; text-transform:uppercase; color:#0E7C7B;">
        Account security</p>
    <h1 class="heading"
        style="margin:0 0 22px; font-family:Fraunces, 'Playfair Display', Georgia, serif; font-size:28px; font-weight:600; line-height:1.25; color:#16302F;">
        Reset your password</h1>

    <p style="margin:0 0 16px; color:#16302F;">Hello {{ $name }},</p>

    <p style="margin:0 0 20px;">We received a request to reset the password for your Bahali account. Click the button below
        to choose a new password.</p>

    {{-- Button --}}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="button" style="margin:4px 0 22px;">
        <tr>
            <td align="center" style="border-radius:10px; background:#0E7C7B;">
                <a href="{{ $actionUrl }}" target="_blank"
                    style="display:inline-block; padding:13px 28px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:10px;">Reset
                    password</a>
            </td>
        </tr>
    </table>

    {{-- Expiry notice --}}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
        <tr>
            <td
                style="background:#FBF8F2; border:1px solid #EFEAE0; border-left:4px solid #0E7C7B; border-radius:10px; padding:13px 16px; font-size:14px; line-height:1.55; color:#26403F;">
                This link expires in <strong>{{ $minutes }} minutes</strong> and can only be used once.
            </td>
        </tr>
    </table>

    <p style="margin:0 0 14px; font-size:14px; color:#5B6B6E;">If you didn't ask to reset your password, you can ignore this
        email — your password won't change.</p>

    <p style="margin:22px 0 0; color:#16302F;">Warm regards,<br>The Bahali team</p>

    {{-- Link fallback --}}
    <p
        style="margin:26px 0 0; padding-top:18px; border-top:1px solid #EFEAE0; font-size:12px; line-height:1.6; color:#8A9795;">
        If the button doesn't work, copy this link into your browser:<br>
        <a href="{{ $actionUrl }}" style="color:#0E7C7B; word-break:break-all;">{{ $actionUrl }}</a>
    </p>
@endsection

@section('footer')
    <p style="margin:0;">You're receiving this because a password reset was requested for your Bahali account.</p>
@endsection
