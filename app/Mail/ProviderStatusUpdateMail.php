<?php

namespace App\Mail;

use App\Models\Provider;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProviderStatusUpdateMail extends Mailable
{
    use Queueable, SerializesModels;

    public $provider;
    public $status;
    public $note;

    public function __construct(Provider $provider, string $status, ?string $note = null)
    {
        $this->provider = $provider;
        $this->status = $status;
        $this->note = $note;
    }

    public function envelope(): Envelope
    {
        $statusLabel = $this->getStatusLabel($this->status);

        return new Envelope(
            subject: "Your Bahali Provider Application — Status: {$statusLabel}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.provider-status-update',
        );
    }

    /**
     * Get human-readable status label
     */
    private function getStatusLabel(string $status): string
    {
        return match ($status) {
            'approved' => 'Approved ✓',
            'rejected' => 'Rejected',
            'suspended' => 'Suspended',
            'inactive' => 'Inactive',
            'pending' => 'Pending',
            default => ucfirst($status),
        };
    }
}
