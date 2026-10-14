{!! $heading !!}

Hello {!! $name !!},

@foreach ($intro as $paragraph)
    {!! $paragraph !!}
@endforeach
@foreach ($statusRows as $row)
    {!! $row['label'] !!}: {!! $row['value'] !!}
@endforeach
@if ($notice)
    {!! $notice !!}
@endif

{!! $actionText !!}: {!! $actionUrl !!}

@foreach ($outro as $paragraph)
    {!! $paragraph !!}
@endforeach
Warm regards,
The Bahali team
