@extends('emails.layouts.bahali')

@section('preheader', $preheader)

@section('content')
    {{-- Eyebrow + heading --}}
    <p
        style="margin:0 0 8px; font-size:12px; font-weight:600; letter-spacing:1.6px; text-transform:uppercase; color:#0E7C7B;">
        Availability</p>
    <h1 class="heading"
        style="margin:0 0 22px; font-family:Fraunces, 'Playfair Display', Georgia, serif; font-size:28px; font-weight:600; line-height:1.25; color:#16302F;">
        {{ $heading }}</h1>

    <p style="margin:0 0 16px; color:#16302F;">Hello {{ $name }},</p>

    @foreach ($intro as $paragraph)
        <p style="margin:0 0 16px;">{{ $paragraph }}</p>
    @endforeach

    {{-- What the listing shows now --}}
    @if ($statusRows)
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
            style="margin:6px 0 22px; background:#FBF8F2; border:1px solid #EFEAE0; border-radius:12px;">
            @foreach ($statusRows as $row)
                <tr>
                    <td
                        style="padding:{{ $loop->first ? '14px' : '4px' }} 18px {{ $loop->last ? '14px' : '4px' }}; font-size:14px; color:#5B6B6E;">
                        {{ $row['label'] }}</td>
                    <td align="right"
                        style="padding:{{ $loop->first ? '14px' : '4px' }} 18px {{ $loop->last ? '14px' : '4px' }}; font-size:14px; font-weight:600; color:#16302F;">
                        {{ $row['value'] }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    {{-- Amber notice (availability ran out / needs a choice) --}}
    @if ($notice)
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
            <tr>
                <td
                    style="background:#FDF5E4; border:1px solid #F3D9A4; border-left:4px solid #E8B84B; border-radius:10px; padding:13px 16px; font-size:14px; line-height:1.55; color:#7A5410;">
                    {{ $notice }}</td>
            </tr>
        </table>
    @endif

    {{-- Button --}}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="button" style="margin:4px 0 24px;">
        <tr>
            <td align="center" style="border-radius:10px; background:#0E7C7B;">
                <a href="{{ $actionUrl }}" target="_blank"
                    style="display:inline-block; padding:13px 28px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:10px;">{{ $actionText }}</a>
            </td>
        </tr>
    </table>

    @foreach ($outro as $paragraph)
        <p style="margin:0 0 14px; font-size:14px; color:#5B6B6E;">{{ $paragraph }}</p>
    @endforeach

    <p style="margin:22px 0 0; color:#16302F;">Warm regards,<br>The Bahali team</p>

    {{-- Link fallback --}}
    <p
        style="margin:26px 0 0; padding-top:18px; border-top:1px solid #EFEAE0; font-size:12px; line-height:1.6; color:#8A9795;">
        If the button doesn't work, copy this link into your browser:<br>
        <a href="{{ $actionUrl }}" style="color:#0E7C7B; word-break:break-all;">{{ $actionUrl }}</a>
    </p>
@endsection

@section('footer')
    <p style="margin:0;">You're receiving this because you have a provider listing on the Bahali Provider Directory.</p>
@endsection
