<?php
/**
 * ------------------------------------------------------------------
 * ADD these to the TOP of ProviderController.php (with your other
 * `use` statements) — skip any that are already imported.
 * ------------------------------------------------------------------
 */
use App\Mail\OtpVerificationMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;

/**
 * ------------------------------------------------------------------
 * ADD this constant inside the ProviderController class body,
 * e.g. right after `class ProviderController extends Controller {`
 * ------------------------------------------------------------------
 */
private const SESSION_PENDING_USER = 'pending_provider_registration_user_id';

/**
 * ------------------------------------------------------------------
 * ADD these three NEW methods anywhere inside the class.
 * ------------------------------------------------------------------
 */

/**
 * Step 2 -> Step 3: create the (unverified) user account and email an OTP.
 * Called by the frontend right after "About You" passes validation.
 */
public function registerAccount(Request $request)
{
    $validated = Validator::make($request->all(), [
        'organization_name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255', 'unique:users,email'],
        'password' => ['required', 'string', 'min:8'],
    ])->validate();

    $user = User::create([
        'name'     => $validated['organization_name'],
        'email'    => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role'     => 'provider',
    ]);

    $this->issueOtp($user);
    $request->session()->put(self::SESSION_PENDING_USER, $user->id);

    return response()->json(['message' => 'Verification code sent.']);
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

    $userId = $request->session()->get(self::SESSION_PENDING_USER);
    $user = $userId ? User::find($userId) : User::where('email', $request->email)->first();

    if (!$user || $user->email !== $request->email) {
        return response()->json(['message' => 'We could not find that registration.'], 422);
    }

    if (!$user->otp_code || !$user->otp_expires_at || Carbon::now()->greaterThan($user->otp_expires_at)) {
        return response()->json(['message' => 'This code has expired. Please request a new one.'], 422);
    }

    if (!hash_equals($user->otp_code, $request->otp)) {
        return response()->json(['message' => 'That code is incorrect.'], 422);
    }

    $user->update([
        'email_verified_at' => now(),
        'otp_code' => null,
        'otp_expires_at' => null,
    ]);

    return response()->json(['message' => 'Verified.']);
}

/**
 * Issues a fresh OTP for the pending registration (used by "Resend code").
 */
public function resendOtp(Request $request)
{
    $request->validate(['email' => ['required', 'email']]);

    $userId = $request->session()->get(self::SESSION_PENDING_USER);
    $user = $userId ? User::find($userId) : User::where('email', $request->email)->first();

    if (!$user || $user->email !== $request->email) {
        return response()->json(['message' => 'We could not find that registration.'], 422);
    }

    $this->issueOtp($user);

    return response()->json(['message' => 'Verification code resent.']);
}

/**
 * Shared helper — generates a 6-digit code, saves it with a 10-minute
 * expiry, and emails it to the user.
 */
private function issueOtp(User $user): void
{
    $otp = (string) random_int(100000, 999999);

    $user->update([
        'otp_code' => $otp,
        'otp_expires_at' => now()->addMinutes(10),
    ]);

    Mail::to($user->email)->send(new OtpVerificationMail($otp));
}

/**
 * ------------------------------------------------------------------
 * REPLACE your existing store() method with this version.
 * Changes from your original:
 *   - Looks up the user created in registerAccount() via the session,
 *     instead of creating a new User here.
 *   - Blocks submission if that user's email isn't verified yet.
 *   - Clears the pending-registration session key on success.
 *   - Everything else (file uploads, Provider::create, redirect) is
 *     unchanged from what you already had.
 * ------------------------------------------------------------------
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
