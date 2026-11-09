<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- 🔑 CSRF Token - এই লাইনটি যোগ করুন -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Bahali') }}</title>

    <!-- Canonical address: always the primary domain from APP_URL (https://bahaliconnect.com), never the .org redirect -->
    <link rel="canonical" href="{{ rtrim(config('app.url'), '/') . request()->getPathInfo() }}">

    @if (($page['component'] ?? '') === 'web/JoinTheCircle')
        @php
            /* Landing page (Version 3.7): text comes from Admin → Website → Join the Circle ("Page title & link previews"). */
            $lp = $page['props']['content'] ?? [];
            $lpText = fn (string $key, string $default) => ($lp[$key] ?? '') ?: $default;
            $lpDescription = $lpText('landing.seo.description', 'Join the Bahali Provider Directory and help individuals and families across Caribbean communities and the diaspora discover the mental health and emotional wellness support you offer.');
            $lpShareTitle = $lpText('landing.seo.share_title', 'Make meaningful support easier to find.');
            $lpShareDescription = $lpText('landing.seo.share_description', 'Join a growing directory connecting individuals and families with mental health and emotional wellness providers across the Caribbean and its diaspora.');
            $lpShareImage = url($lpText('landing.seo.share_image', '/images/landing/social-share.jpg'));
        @endphp
        <!-- Printed on the server so WhatsApp, Facebook, LinkedIn and X can read them. -->
        <meta name="description" content="{{ $lpDescription }}">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Bahali Provider Directory">
        <meta property="og:title" content="{{ $lpShareTitle }}">
        <meta property="og:description" content="{{ $lpShareDescription }}">
        <meta property="og:url" content="{{ rtrim(config('app.url'), '/') . request()->getPathInfo() }}">
        <meta property="og:image" content="{{ $lpShareImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Bahali Provider Directory: {{ $lpShareTitle }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $lpShareTitle }}">
        <meta name="twitter:description" content="{{ $lpShareDescription }}">
        <meta name="twitter:image" content="{{ $lpShareImage }}">
    @endif

    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/bahali-icon.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/bahali-icon.png') }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Bahali public pages: Cormorant Garamond 500/600 + DM Sans 400/500/600 only -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
