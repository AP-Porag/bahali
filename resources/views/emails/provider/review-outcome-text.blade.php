{!! $heading !!}

Hello {!! $name !!},

@foreach ($intro as $paragraph)
    {!! $paragraph !!}
@endforeach
@foreach ($statusRows as $row)
    {!! $row['label'] !!}: {!! $row['value'] !!}
@endforeach
@if ($note)
    {!! $noteLabel !!}:
    {!! $note !!}
@endif
@foreach ($beforeAction as $paragraph)
    {!! $paragraph !!}
@endforeach
@if ($actionUrl)
    {!! $actionText !!}: {!! str_starts_with($actionUrl, 'mailto:') ? ($support ?: $actionUrl) : $actionUrl !!}
@endif

@foreach ($outro as $paragraph)
    {!! $paragraph !!}
@endforeach
Warm regards,
The Bahali team
