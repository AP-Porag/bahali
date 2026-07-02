<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\StoreProviderRequest;
use App\Mail\OtpVerificationMail;
use App\Models\Country;
use App\Models\Provider;
use App\Models\User;
use App\Utils\GlobalConstant;
use Carbon\Carbon;
use Illuminate\Http\File;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Validation\Rule;

class ProviderDirectoryController extends Controller
{
    private const STATUSES = [
        GlobalConstant::VERIFICATION_STATUS_PENDING,
        GlobalConstant::VERIFICATION_STATUS_APPROVED,
        GlobalConstant::VERIFICATION_STATUS_REJECTED,
        GlobalConstant::VERIFICATION_STATUS_SUSPENDED,
        GlobalConstant::VERIFICATION_STATUS_INACTIVE,
    ];

    /**
     * Session key used to remember which (unverified) user is mid-registration
     * between registerAccount() -> verifyOtp() -> store().
     */
    private const SESSION_PENDING_USER = 'pending_provider_registration_user_id';

    /**
     * Show the registration form.
     */
    public function create()
    {
        // Fetch countries with regions, organized for dependent dropdown
        $countries = Country::with('regions.regionType')
            ->orderBy('display_order')
            ->get()
            ->map(fn($country) => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'regions' => $country->regions
                    ->sortBy('display_order')
                    ->map(fn($region) => [
                        'id' => $region->id,
                        'name' => $region->name,
                        'regionTypeName' => $region->regionType?->name,
                        'regionTypeLabel' => $region->regionType?->label,
                    ])
                    ->values()
                    ->toArray(),
            ])
            ->values()
            ->toArray();

        return Inertia::render('web/create', [
            'countries' => $countries,
            'csrfToken' => csrf_token(),
        ]);
    }

    /**
     * Step 2 -> Step 3 (frontend): create the (unverified) user account
     * right after "About You" passes validation, and email a 6-digit OTP.
     */
    public function registerAccount(Request $request)
    {
        \Log::info('[registerAccount] Starting account registration', [
            'email' => $request->input('email'),
            'organization_name' => $request->input('organization_name'),
        ]);

        $validated = Validator::make($request->all(), [
            'organization_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ])->validate();

        try {
            $user = User::create([
                'name'     => $validated['organization_name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role'     => 'provider',
            ]);

            \Log::info('[registerAccount] User created successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            $this->issueOtp($user);

            \Log::info('[registerAccount] OTP issued, storing session', [
                'user_id' => $user->id,
            ]);

            $request->session()->put(self::SESSION_PENDING_USER, $user->id);

            \Log::info('[registerAccount] Session stored, returning success', [
                'user_id' => $user->id,
                'session_key' => self::SESSION_PENDING_USER,
            ]);

            return response()->json([
                'message' => 'Verification code sent.',
                'email' => $user->email,
                'user_id' => $user->id,
            ]);
        } catch (\Exception $e) {
            \Log::error('[registerAccount] Error during account creation', [
                'error' => $e->getMessage(),
                'email' => $validated['email'] ?? null,
            ]);

            // Check if it's a unique constraint violation on email (shouldn't happen due to validator, but just in case)
            if (str_contains($e->getMessage(), 'unique')) {
                return response()->json([
                    'message' => 'Email already registered.',
                    'errors' => [
                        'email' => ['This email is already registered.'],
                    ],
                ], 422);
            }

            return response()->json([
                'message' => 'An error occurred while creating your account. Please try again.',
                'errors' => [
                    'general' => [$e->getMessage()],
                ],
            ], 500);
        }
    }

    /**
     * Confirms the 6-digit code and marks the user's email as verified.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        \Log::info('[verifyOtp] Attempting to verify OTP', [
            'email' => $request->email,
            'otp' => $request->otp,
        ]);

        $userId = $request->session()->get(self::SESSION_PENDING_USER);
        $user = $userId ? User::find($userId) : User::where('email', $request->email)->first();

        if (!$user || $user->email !== $request->email) {
            \Log::warning('[verifyOtp] User not found or email mismatch', [
                'email' => $request->email,
                'user_id' => $userId,
            ]);
            return response()->json(['message' => 'We could not find that registration.'], 422);
        }

        if (!$user->otp_code || !$user->otp_expires_at || Carbon::now()->greaterThan($user->otp_expires_at)) {
            \Log::warning('[verifyOtp] OTP expired or missing', [
                'user_id' => $user->id,
                'has_otp' => !!$user->otp_code,
                'otp_expires_at' => $user->otp_expires_at,
            ]);
            return response()->json(['message' => 'This code has expired. Please request a new one.'], 422);
        }

        if (!hash_equals($user->otp_code, $request->otp)) {
            \Log::warning('[verifyOtp] OTP mismatch', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
            return response()->json(['message' => 'That code is incorrect.'], 422);
        }

        $user->update([
            'email_verified_at' => now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        \Log::info('[verifyOtp] Email verified successfully', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return response()->json(['message' => 'Verified.']);
    }

    /**
     * Issues a fresh OTP for the pending registration (used by "Resend code").
     */
    public function resendOtp(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        \Log::info('[resendOtp] Resend OTP requested', [
            'email' => $request->email,
        ]);

        $userId = $request->session()->get(self::SESSION_PENDING_USER);
        $user = $userId ? User::find($userId) : User::where('email', $request->email)->first();

        if (!$user || $user->email !== $request->email) {
            \Log::warning('[resendOtp] User not found', [
                'email' => $request->email,
            ]);
            return response()->json(['message' => 'We could not find that registration.'], 422);
        }

        $this->issueOtp($user);

        \Log::info('[resendOtp] New OTP issued', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);

        return response()->json(['message' => 'Verification code resent.']);
    }

    /**
     * Shared helper — generates a 6-digit code, saves it with a 10-minute
     * expiry, and emails it to the user.
     */
    private function issueOtp(User $user): void
    {
        $otp = (string) random_int(100000, 999999);

        \Log::info('[issueOtp] Generating OTP', [
            'user_id' => $user->id,
            'email' => $user->email,
            'otp_code' => $otp,
        ]);

        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        try {
            Mail::to($user->email)->send(new OtpVerificationMail($otp));
            \Log::info('[issueOtp] OTP email sent successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            \Log::error('[issueOtp] Failed to send OTP email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
            // Don't throw — the OTP is still in the DB, user can try to verify or resend
        }
    }

    /**
     * Validate, store files, persist, and redirect back with a flash.
     *
     * Uses storeUpload() helper to bypass getRealPath() issues on Windows.
     *
     * The user account is no longer created here — it was already created
     * (and OTP-verified) in registerAccount()/verifyOtp(). We just look it
     * up via the session and attach it to the new Provider record.
     */
    public function store(StoreProviderRequest $request)
    {
        $userId = $request->session()->get(self::SESSION_PENDING_USER);
        $user = $userId ? User::find($userId) : null;

        if (!$user || !$user->email_verified_at) {
            return back()->withErrors(['email' => 'Please verify your email before submitting.']);
        }

        $data = $request->validated();

        $data['user_id'] = $user->id;
        unset($data['email'], $data['password']);

        // Handle file uploads without relying on getRealPath()
        $data['verification_document'] = $this->storeUpload(
            $request->file('verification_document'),
            'providers/verification'
        );

        $data['profile_photo'] = $this->storeUpload(
            $request->file('profile_photo'),
            'providers/photos'
        );

        $additional = [];
        foreach (Arr::wrap($request->file('additional_photos', [])) as $photo) {
            if ($path = $this->storeUpload($photo, 'providers/photos')) {
                $additional[] = $path;
            }
        }
        $data['additional_photos'] = $additional;

        Provider::create($data);

        $request->session()->forget(self::SESSION_PENDING_USER);

        return redirect()
            ->route('providers.create')
            ->with('success', 'Your application has been received.');
    }

    /**
     * Store an uploaded file without any path resolution issues.
     *
     * Uses move_uploaded_file() which is designed for temp uploads and never
     * calls getRealPath(), fopen(), or any path resolution that fails on Windows.
     * Works with all file types: PDFs, JPEGs, PNGs, WebP, etc.
     *
     * @param UploadedFile|null $file
     * @param string $dir Directory path relative to storage/app/public (e.g. 'providers/photos')
     * @return string|null Stored file path relative to public disk, or null if invalid
     */
    private function storeUpload(?UploadedFile $file, string $dir): ?string
    {
        if (!$file instanceof UploadedFile || !$file->isValid()) {
            return null;
        }

        $tempPath = $file->getPathname();
        if (!$tempPath || !is_file($tempPath)) {
            return null;
        }

        // Destination on the public disk
        $publicPath = storage_path('app/public');
        $destDir = $publicPath . DIRECTORY_SEPARATOR . $dir;

        // Create destination directory if it doesn't exist
        if (!is_dir($destDir)) {
            @mkdir($destDir, 0755, true);
        }

        $filename = $file->hashName();
        $destPath = $destDir . DIRECTORY_SEPARATOR . $filename;

        // move_uploaded_file() works directly with temp paths, no getRealPath() involved
        if (move_uploaded_file($tempPath, $destPath)) {
            return $dir . '/' . $filename;
        }

        return null;
    }


    public function pendingProvider(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 5);

        // সরাসরি query() ব্যবহার করুন
        $query = Provider::with('user');

        // শুধুমাত্র pending status এর provider
        $query->where('status', 'pending');

        // সার্চ ফিল্টার
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $providers = $query->latest()->paginate($perPage);

        return Inertia::render('admin/provider/pending/index', [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name, email, or phone...'),
            'filters' => [
                'search' => $search,
                'status' => 'pending',
                'perPage' => $perPage,
            ],
        ]);
    }



    public function approvedProvider(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 5);

        // সরাসরি query() ব্যবহার করুন
        $query = Provider::with('user');

        // শুধুমাত্র Approved status এর provider
        $query->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED);

        // সার্চ ফিল্টার
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $providers = $query->latest()->paginate($perPage);

        return Inertia::render('admin/provider/approved/index', [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name, email, or phone...'),
            'filters' => [
                'search' => $search,
                'status' => 'approved',
                'perPage' => $perPage,
            ],
        ]);
    }


    public function rejectedProvider(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 5);

        // সরাসরি query() ব্যবহার করুন
        $query = Provider::with('user');

        // শুধুমাত্র Approved status এর provider
        $query->where('status', GlobalConstant::VERIFICATION_STATUS_REJECTED);

        // সার্চ ফিল্টার
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $providers = $query->latest()->paginate($perPage);

        return Inertia::render('admin/provider/rejected/index', [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name, email, or phone...'),
            'filters' => [
                'search' => $search,
                'status' => 'rejected',
                'perPage' => $perPage,
            ],
        ]);
    }

    public function suspendedProvider(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 5);

        // সরাসরি query() ব্যবহার করুন
        $query = Provider::with('user');

        // শুধুমাত্র Approved status এর provider
        $query->where('status', GlobalConstant::VERIFICATION_STATUS_SUSPENDED);

        // সার্চ ফিল্টার
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $providers = $query->latest()->paginate($perPage);

        return Inertia::render('admin/provider/suspended/index', [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name, email, or phone...'),
            'filters' => [
                'search' => $search,
                'status' => 'suspended',
                'perPage' => $perPage,
            ],
        ]);
    }

    public function inactiveProvider(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 5);

        // সরাসরি query() ব্যবহার করুন
        $query = Provider::with('user');

        // শুধুমাত্র Approved status এর provider
        $query->where('status', GlobalConstant::VERIFICATION_STATUS_INACTIVE);

        // সার্চ ফিল্টার
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('organization_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $providers = $query->latest()->paginate($perPage);

        return Inertia::render('admin/provider/inactive/index', [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name, email, or phone...'),
            'filters' => [
                'search' => $search,
                'status' => 'inactive',
                'perPage' => $perPage,
            ],
        ]);
    }




    public function show($id): Response
    {

        $provider = Provider::with('user')->findOrFail($id);
        // Eager-load user relationship
        // $provider->load('user');

        return Inertia::render('admin/provider/pending/show-for-verification', [
            'provider' => [
                'id' => $provider->id,
                'verification_status' => $provider->verification_status,

                // Basic
                'provider_type' => $provider->provider_type,
                'organization_name' => $provider->organization_name,
                'credentials' => $provider->credentials,
                'professional_title' => $provider->professional_title,
                'professional_title_other' => $provider->professional_title_other,

                // About - user থেকে email নিন
                'email' => $provider->user?->email ?? $provider->email,
                'short_bio' => $provider->short_bio,
                'years_experience' => $provider->years_experience,

                // Licensure
                'license_number' => $provider->license_number,
                'license_states' => $provider->license_states,
                'license_status' => $provider->license_status,
                'verification_document' => $provider->verification_document
                    ? Storage::url($provider->verification_document)
                    : null,

                // Areas
                'areas_of_support' => $provider->areas_of_support,
                'areas_of_support_other' => $provider->areas_of_support_other,

                // Populations
                'populations_served' => $provider->populations_served,

                // Culture
                'caribbean_identity' => $provider->caribbean_identity,
                'caribbean_experience' => $provider->caribbean_experience,
                'languages' => $provider->languages,
                'languages_other' => $provider->languages_other,
                'cultural_approach' => $provider->cultural_approach,

                // Service
                'service_formats' => $provider->service_formats,
                'practice_settings' => $provider->practice_settings,

                // Location
                'address' => $provider->address,
                'city' => $provider->city,
                'state_province' => $provider->state_province,
                'country' => $provider->country,
                'multiple_locations' => $provider->multiple_locations,
                'hide_address' => (bool) $provider->hide_address,
                'telehealth_regions' => $provider->telehealth_regions,

                // Payment
                'payment_methods' => $provider->payment_methods,
                'insurance_plans' => $provider->insurance_plans,

                // Contact
                'phone' => $provider->phone,
                'website' => $provider->website,
                'social_links' => $provider->social_links,

                // Status
                'status' => $provider->status,

                // Media
                'profile_photo' => $provider->profile_photo
                    ? Storage::url($provider->profile_photo)
                    : null,
                'additional_photos' => collect($provider->additional_photos ?? [])
                    ->map(fn($path) => Storage::url($path))
                    ->values()
                    ->all(),

                // Accessibility
                'accessibility' => $provider->accessibility,

                // Consent
                'consent_accurate' => (bool) $provider->consent_accurate,
                'consent_notify' => (bool) $provider->consent_notify,
                'consent_no_endorsement' => (bool) $provider->consent_no_endorsement,
                'consent_public' => (bool) $provider->consent_public,

                // Review meta
                'submitted_at' => $provider->created_at?->format('F j, Y'),
                'verification_note' => $provider->verification_note,
            ],
            'indexRoute' => 'admin.providers.index',
        ]);
    }

    /**
     * Update the verification status, then redirect to the index
     * with a flash message. The page shows the success toast on
     * the Inertia visit's onSuccess.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        // Provider খুঁজে বের করুন
        $provider = Provider::findOrFail($id);

        // ভ্যালিডেশন
        $validated = $request->validate([
            'status' => ['required', Rule::in(self::STATUSES)],
            'note'   => ['nullable', 'string', 'max:2000'],
        ]);

        // শুধুমাত্র status আপডেট করুন
        $provider->status = $validated['status'];
        // $provider->verification_note   = $validated['note'] ?? null;
        $provider->reviewed_at         = now();

        // License verified at update (শুধুমাত্র approved হলে)
        // $provider->license_verified_at = $validated['status'] === 'approved'
        //     ? now()
        //     : null;

        // Only approved providers are publicly visible
        // $provider->is_public = $validated['status'] === 'approved';

        $provider->save();

        return redirect()
            ->route('providers.pending') // providers.pending রুটে রিডাইরেক্ট
            ->with('success', 'Verification status updated successfully!');
    }


    /**
     * Display the specified pending provider.
     */
    // ProviderDirectoryController@show
    // public function showPendingProvider(Provider $provider)
    // {
    //     // Only show approved, publicly-visible profiles (see review queue below)
    //     abort_unless($provider->status === 'approved' && $provider->is_public, 404);

    //     return Inertia::render('provider/Show', [
    //         'provider' => [
    //             'name'             => $provider->display_name,
    //             'credentials'      => $provider->credentials,
    //             'title'            => $provider->professional_title,
    //             'pronouns'         => $provider->pronouns,
    //             'photo'            => $provider->profile_photo ? Storage::url($provider->profile_photo) : null,
    //             'verifiedByBahali' => (bool) $provider->license_verified_at,
    //             'verifiedOn'       => $provider->license_verified_at?->format('F Y'),
    //             'caribbeanInformed' => (bool) $provider->caribbean_informed,
    //             'acceptingClients' => (bool) $provider->accepting_clients,
    //             'tagline'          => $provider->tagline,
    //             'bio'              => $provider->bio,
    //             'location'         => [
    //                 'city'    => $provider->city,
    //                 'region'  => $provider->region?->name,
    //                 'country' => $provider->country?->name,
    //             ],
    //             'servesRemotely'   => (bool) $provider->serves_remotely,
    //             'regionsServed'    => $provider->regions_served,      // array cast
    //             'languages'        => $provider->languages,           // array cast
    //             'sessionFormats'   => $provider->session_formats,     // array cast
    //             'areasOfSupport'   => $provider->areas_of_support,    // array cast
    //             'populations'      => $provider->populations,         // array cast
    //             'culturalApproach' => $provider->cultural_approach,
    //             'yearsExperience'  => $provider->years_experience,
    //             'feeRange'         => $provider->fee_range,
    //             'slidingScale'     => (bool) $provider->sliding_scale,
    //             'insurances'       => $provider->insurances,          // array cast
    //             'accessibility'    => $provider->accessibility,       // array cast
    //             'email'            => $provider->show_email ? $provider->contact_email : null,
    //             'phone'            => $provider->show_phone ? $provider->contact_phone : null,
    //             'website'          => $provider->website,
    //         ],
    //     ]);
    // }

    /**
     * Approve a pending provider.
     */
    public function approveProvider(Request $request, $id)
    {
        $provider = Provider::where('status', 'pending')->findOrFail($id);

        $provider->update([
            'status' => 'approved', // অথবা 'active'
            'approved_at' => now(), // যদি approved_at কলাম থাকে
        ]);

        return redirect()->back()->with('success', 'Provider approved successfully!');
    }

    /**
     * Reject a pending provider.
     */
    public function rejectProvider(Request $request, $id)
    {
        $provider = Provider::where('status', 'pending')->findOrFail($id);

        $provider->update([
            'status' => 'rejected', // অথবা 'inactive'
            'rejected_at' => now(), // যদি rejected_at কলাম থাকে
            'rejection_reason' => $request->input('reason'), // যদি reason ফিল্ড থাকে
        ]);

        return redirect()->back()->with('success', 'Provider rejected successfully!');
    }
}
