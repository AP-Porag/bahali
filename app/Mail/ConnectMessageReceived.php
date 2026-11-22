<?php

namespace App\Mail;

use App\Models\ConnectMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Staff notification for a Bahali Connect Contact or Report a concern submission. */
class ConnectMessageReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ConnectMessage $item)
    {
    }

    public function envelope(): Envelope
    {
        $subject = $this->item->kind === 'report'
            ? 'Bahali Connect — concern report: ' . $this->item->category
            : 'Bahali Connect — contact: ' . $this->item->topic;

        return new Envelope(
            subject: $subject,
            replyTo: $this->item->email ? [new Address($this->item->email, $this->item->name ?: '')] : [],
        );
    }

    public function content(): Content
    {
        return new Content(text: 'emails.connect-message');
    }
}
