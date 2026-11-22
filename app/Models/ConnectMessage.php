<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Bahali Connect Contact and Report a concern submissions (private — staff only).
 * Privacy Policy: privacy correspondence and concern reports are kept for four years.
 */
class ConnectMessage extends Model
{
    protected $fillable = [
        'kind',        // contact | report
        'topic',       // contact: directory | account | privacy | accessibility | other
        'category',    // report: type of concern
        'profile',     // report: provider name or page link
        'message',
        'wants_reply',
        'name',
        'email',
        'handled_at',
    ];

    protected $casts = [
        'wants_reply' => 'boolean',
        'handled_at'  => 'datetime',
    ];
}
