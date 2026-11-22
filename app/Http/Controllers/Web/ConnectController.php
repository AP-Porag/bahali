<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Mail\ConnectMessageReceived;
use App\Models\ConnectMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

/**
 * Bahali Connect — information pages, policies and the Contact / Report a concern forms.
 * (Search, results and profiles: FindSupportController.)
 */
class ConnectController extends Controller
{
    private const TOPICS = ['directory', 'account', 'privacy', 'accessibility', 'other'];

    private const CONCERNS = [
        'Incorrect or outdated profile information',
        'Credentials or misleading claims',
        'Inappropriate conduct',
        'Privacy or safety concern',
        'Technical or accessibility issue',
        'Other concern',
    ];

    public function about(): Response
    {
        return Inertia::render('connect/About');
    }

    public function howItWorks(): Response
    {
        return Inertia::render('connect/HowItWorks');
    }

    public function forProviders(): Response
    {
        return Inertia::render('connect/ForProviders');
    }

    public function urgentHelp(): Response
    {
        return Inertia::render('connect/UrgentHelp');
    }

    public function spotlight(): Response
    {
        return Inertia::render('connect/SpotlightPolicy');
    }

    /** privacy | terms | directory | accessibility */
    public function policy(string $kind): Response
    {
        return Inertia::render('connect/Policy', ['kind' => $kind]);
    }

    public function contact(Request $request): Response
    {
        return Inertia::render('connect/Support', [
            'report' => false,
            'topic'  => in_array($request->query('topic'), self::TOPICS, true) ? $request->query('topic') : 'directory',
            'sent'   => (bool) session('connect_message_sent'),
        ]);
    }

    public function report(Request $request): Response
    {
        return Inertia::render('connect/Support', [
            'report'  => true,
            'profile' => mb_substr((string) $request->query('profile', ''), 0, 500),
            'sent'    => (bool) session('connect_message_sent'),
        ]);
    }

    /**
     * POST /contact and /report-a-concern.
     * Validated on the server, stored, then emailed to staff (LEGAL_AND_SUPPORT.md).
     * Success is flashed only after the message is saved; on failure the form keeps the visitor's text.
     */
    public function submit(Request $request): RedirectResponse
    {
        // Spam protection: hidden field filled → pretend success, store nothing.
        if (filled($request->input('website'))) {
            return back()->with('connect_message_sent', true);
        }

        $report = $request->input('kind') === 'report';

        $data = $request->validate([
            'kind'        => ['required', Rule::in(['contact', 'report'])],
            'topic'       => [$report ? 'nullable' : 'required', Rule::in(self::TOPICS)],
            'category'    => [$report ? 'required' : 'nullable', Rule::in(self::CONCERNS)],
            'profile'     => ['nullable', 'string', 'max:500'],
            'message'     => ['required', 'string', 'min:10', 'max:3000'],
            'wants_reply' => ['nullable', 'boolean'],
            'name'        => ['nullable', 'string', 'max:100'],
            // Contact needs a reply address; a report may be anonymous unless a reply is requested.
            'email'       => [($report && ! $request->boolean('wants_reply')) ? 'nullable' : 'required', 'email', 'max:254'],
        ], [
            'category.required' => 'Please choose the type of concern.',
            'message.required'  => 'Please write your message.',
            'message.min'       => 'Please write at least 10 characters.',
            'email.required'    => $report ? 'Add an email address so we can reply.' : 'Add an email address so we can reply.',
            'email.email'       => 'Please enter a valid email address.',
        ]);

        try {
            $message = ConnectMessage::create([
                'kind'        => $data['kind'],
                'topic'       => $report ? null : $data['topic'],
                'category'    => $report ? $data['category'] : null,
                'profile'     => $report ? ($data['profile'] ?? null) : null,
                'message'     => $data['message'],
                'wants_reply' => $report ? (bool) ($data['wants_reply'] ?? false) : true,
                'name'        => $data['name'] ?? null,
                'email'       => $data['email'] ?? null,
            ]);
        } catch (Throwable $e) {
            Log::error('Connect message could not be saved', ['kind' => $data['kind'], 'error' => $e->getMessage()]); // no message text in logs

            return back()->withErrors(['form' => 'Something went wrong on our side.']);
        }

        // Staff notification. The message is already saved, so a mail problem does not lose it.
        try {
            Mail::to(config('mail.connect_inbox', 'contact@bahali.org'))->send(new ConnectMessageReceived($message));
        } catch (Throwable $e) {
            Log::warning('Connect message saved but staff email failed', ['id' => $message->id, 'error' => $e->getMessage()]);
        }

        return back()->with('connect_message_sent', true);
    }
}
