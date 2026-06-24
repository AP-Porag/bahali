<?php

/* ==================================================================
 |  Bahali Provider Directory — Laravel 12 backend reference
 |  This file collects the controller, route, and migration in one
 |  place. Split each block into its proper file in your app.
 ================================================================== */


/* ------------------------------------------------------------------
 | 1) app/Http/Controllers/ProviderDirectoryController.php
 ------------------------------------------------------------------ */

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\StoreProviderRequest;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;

class ProviderDirectoryController extends Controller
{
    /** Show the registration form. */
    public function create()
    {
        return Inertia::render('admin/provider/create');
    }

    /** Validate, store files, persist, and redirect back with a flash. */
    // public function store(StoreProviderRequest $request)
    // {
    //     $data = $request->validated();

    //     // Create the login account first, then link the provider to it.
    //     // Email lives on the users table (unique); the provider references it.
    //     $user = User::create([
    //         'name' => $data['organization_name'],
    //         'email' => $data['email'],
    //         'password' => Hash::make($data['password']),
    //     ]);

    //     $data['user_id'] = $user->id;
    //     unset($data['email'], $data['password']);

    //     // Handle file uploads -> store on the 'public' disk.
    //     if ($request->hasFile('verification_document')) {
    //         $data['verification_document'] = $request
    //             ->file('verification_document')
    //             ->store('providers/verification', 'public');
    //     }

    //     if ($request->hasFile('profile_photo')) {
    //         $data['profile_photo'] = $request
    //             ->file('profile_photo')
    //             ->store('providers/photos', 'public');
    //     }

    //     $additional = [];
    //     foreach ((array) $request->file('additional_photos', []) as $photo) {
    //         $additional[] = $photo->store('providers/photos', 'public');
    //     }
    //     $data['additional_photos'] = $additional;

    //     Provider::create($data);

    //     return redirect()
    //         ->route('providers.create')
    //         ->with('success', 'Your application has been received.');
    // }

    public function store(StoreProviderRequest $request)
    {
        try {
            $data = $request->validated();

            // Create the login account first
            $user = User::create([
                'name' => $data['organization_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'provider',
            ]);

            $data['user_id'] = $user->id;
            unset($data['email'], $data['password']);

            // Handle file uploads
            if ($request->hasFile('verification_document')) {
                $file = $request->file('verification_document');

                // নিশ্চিত হয়ে নিন এটি আসলেই একটি ভ্যালিড UploadedFile অবজেক্ট এবং কোনো ফেক অবজেক্ট বা খালি ফাইল নয়
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $data['verification_document'] = $file->store('providers/verification', 'public');
                } else {
                    unset($data['verification_document']);
                }
            } else {
                unset($data['verification_document']);
            }

            // ২. প্রোফাইল ফটো আপলোড
            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');

                if ($file instanceof UploadedFile && $file->isValid()) {
                    $data['profile_photo'] = $file->store('providers/photos', 'public');
                } else {
                    unset($data['profile_photo']);
                }
            } else {
                unset($data['profile_photo']);
            }

            // ✅ Fix: Initialize $additional array
            $additional = [];
            if ($request->hasFile('additional_photos')) {
                foreach ($request->file('additional_photos') as $photo) {
                    if ($photo && $photo->isValid()) {
                        $additional[] = $photo->store('providers/photos', 'public');
                    }
                }
            }
            $data['additional_photos'] = $additional;

            // Create provider
            $provider = Provider::create($data);


            // ✅ Return JSON response
            return response()->json([
                'success' => true,
                'message' => 'Your application has been received.',
                'provider' => $provider,
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            // Log error
            Log::error('Provider registration failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            // Return error response
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

/* ------------------------------------------------------------------
 | 2) routes/web.php  (add these lines)
 ------------------------------------------------------------------ */
/*
use App\Http\Controllers\ProviderDirectoryController;

Route::get('/provider-directory', [ProviderDirectoryController::class, 'create'])
    ->name('providers.create');

Route::post('/provider-directory', [ProviderDirectoryController::class, 'store'])
    ->name('providers.store');
*/


/* ------------------------------------------------------------------
 | 3) app/Models/Provider.php
 ------------------------------------------------------------------ */
/*
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $guarded = [];

    protected $casts = [
        'license_states'      => 'array',
        'areas_of_support'    => 'array',
        'populations_served'  => 'array',
        'languages'           => 'array',
        'service_formats'     => 'array',
        'practice_settings'   => 'array',
        'telehealth_regions'  => 'array',
        'payment_methods'     => 'array',
        'accessibility'       => 'array',
        'additional_photos'   => 'array',
        'consent_accurate'        => 'boolean',
        'consent_notify'          => 'boolean',
        'consent_no_endorsement'  => 'boolean',
        'consent_public'          => 'boolean',
    ];
}
*/


/* ------------------------------------------------------------------
 | 4) database/migrations/xxxx_create_providers_table.php
 ------------------------------------------------------------------ */
/*
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();

            // Basic
            $table->string('provider_type');
            $table->string('organization_name');
            $table->string('credentials')->nullable();
            $table->string('professional_title');
            $table->string('professional_title_other')->nullable();

            // About
            $table->text('short_bio');
            $table->string('years_experience')->nullable();

            // Licensure
            $table->string('license_number');
            $table->json('license_states');
            $table->string('license_status');
            $table->string('verification_document')->nullable();

            // Support / populations
            $table->json('areas_of_support');
            $table->string('areas_of_support_other')->nullable();
            $table->json('populations_served');

            // Culture & language
            $table->string('caribbean_identity');
            $table->string('caribbean_experience');
            $table->json('languages');
            $table->string('languages_other')->nullable();
            $table->text('cultural_approach')->nullable();

            // Service
            $table->json('service_formats');
            $table->json('practice_settings');

            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state_province');
            $table->string('country');
            $table->string('multiple_locations');
            $table->json('telehealth_regions')->nullable();

            // Payment
            $table->json('payment_methods');
            $table->text('insurance_plans')->nullable();

            // Contact
            $table->string('phone');
            $table->string('email');
            $table->string('website')->nullable();
            $table->text('social_links')->nullable();

            // Media
            $table->string('profile_photo');
            $table->json('additional_photos')->nullable();

            // Accessibility
            $table->json('accessibility');

            // Consent
            $table->boolean('consent_accurate')->default(false);
            $table->boolean('consent_notify')->default(false);
            $table->boolean('consent_no_endorsement')->default(false);
            $table->boolean('consent_public')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
*/
