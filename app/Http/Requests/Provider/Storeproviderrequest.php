<?php

namespace App\Http\Requests\Provider;

use App\Support\AreasOfSupport;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Step 1 — Basic Information
            'provider_type' => ['required', Rule::in([
                'individual',
                'organization',
                'support_group',
                'faith_based',
                'community_program'
            ])],
            'organization_name' => ['required', 'string', 'max:255'],
            'credentials' => ['nullable', 'string', 'max:255'],
            'professional_title' => ['required', 'array', 'min:1'],
            'professional_title.*' => ['string'],
            'professional_title_other' => [
                'nullable',
                'string',
                'max:255',
                'required_if:professional_title,Other (specify)'
            ],

            // Step 2 — About You & Account
            'short_bio' => ['required', 'string', 'max:5000'],
            'years_experience' => ['nullable', 'string', 'min:0', 'max:50'],

            // Step 3 — Licensure & Verification
            'license_number' => ['nullable', 'string', 'max:120'],
            'license_states' => ['required', 'array', 'min:1'],
            'license_states.*' => ['string'],
            // FIXED: frontend sends 'not_applicable' (underscore), not 'not applicable'
            'license_status' => ['required', Rule::in(['active', 'provisional', 'not_applicable'])],
            'verification_document' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240'
            ],

            // Step 4 — Areas of Support
            'areas_of_support' => ['required', 'array', 'min:1'],
            // Each area must be a known value from the taxonomy.
            'areas_of_support.*' => ['string', Rule::in(AreasOfSupport::flatten())],
            // No "Other" option in the new taxonomy — keep the field harmless.
            'areas_of_support_other' => ['nullable', 'string', 'max:255'],

            // Step 5 — Populations Served
            'populations_served' => ['required', 'array', 'min:1'],
            'populations_served.*' => ['string'],

            // Step 6 — Cultural & Language Responsiveness
            'caribbean_identity' => ['required', Rule::in(['yes', 'no', 'prefer_not'])],
            'caribbean_experience' => ['required', Rule::in(['yes', 'no'])],
            'languages' => ['required', 'array', 'min:1'],
            'languages.*' => ['string'],
            'languages_other' => ['nullable', 'string', 'max:255'],
            'cultural_approach' => ['nullable', 'string', 'max:2500'],

            // Step 7 — Service Information
            'service_formats' => ['required', 'array', 'min:1'],
            'service_formats.*' => ['string'],
            'practice_settings' => ['required', 'array', 'min:1'],
            'practice_settings.*' => ['string'],

            // Step 8 — Location
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'state_province' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'multiple_locations' => ['required', Rule::in(['yes', 'no'])],
            'hide_address' => ['boolean'],
            'telehealth_regions' => ['nullable', 'array'],
            'telehealth_regions.*' => ['string'],

            // Step 9 — Insurance & Payment
            'payment_methods' => ['required', 'array', 'min:1'],
            'payment_methods.*' => ['string'],
            'insurance_plans' => ['nullable', 'string', 'max:2000'],

            // Step 10 — Contact Information
            'phone' => ['required', 'string', 'max:40'],
            'website' => ['nullable', 'url', 'max:255'],
            'social_links' => ['nullable', 'string', 'max:2000'],

            // Step 11 — Profile Media
            'profile_photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'additional_photos' => ['nullable', 'array', 'max:10'],
            'additional_photos.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],

            // Step 12 — Accessibility
            'accessibility' => ['required', 'array', 'min:1'],
            'accessibility.*' => ['string'],

            // Step 13 — Consent & Agreement
            'consent_accurate' => ['accepted'],
            'consent_notify' => ['accepted'],
            'consent_no_endorsement' => ['accepted'],
            'consent_public' => ['accepted'],
        ];
    }

    /**
     * Selected areas tagged with their category, ready for storage.
     * @return array<int, array{category: string, area: string}>
     */
    public function mappedAreasOfSupport(): array
    {
        return collect($this->input('areas_of_support', []))
            ->unique()
            ->map(fn(string $area) => [
                'category' => AreasOfSupport::categoryFor($area),
                'area' => $area,
            ])
            ->filter(fn(array $row) => $row['category'] !== null) // guard: skip unknowns
            ->values()
            ->all();
    }

    public function messages(): array
    {
        return [
            'license_states.min' => 'Select at least one state or country of licensure.',
            'areas_of_support.min' => 'Select at least one area of support.',
            'areas_of_support.*.in' => 'One of the selected support areas is not recognized.',
            'populations_served.min' => 'Select at least one population you serve.',
            'languages.min' => 'Select at least one language you speak.',
            'service_formats.min' => 'Select at least one service format.',
            'practice_settings.min' => 'Select at least one practice setting.',
            'payment_methods.min' => 'Select at least one accepted payment method.',
            'accessibility.min' => 'Select at least one accessibility option.',
            'email.unique' => 'An account with this email already exists.',
            'password.regex' => 'Password must have no spaces and include an uppercase letter, a lowercase letter, and a number.',
            'consent_accurate.accepted' => 'Please confirm the information is accurate.',
            'consent_notify.accepted' => 'Please agree to notify Bahali of changes.',
            'consent_no_endorsement.accepted' => 'Please acknowledge this is not an endorsement.',
            'consent_public.accepted' => 'Please consent to public display of your listing.',
            'years_experience.integer' => 'Years of experience must be a number.',
            'years_experience.min' => 'Years of experience cannot be negative.',
            'years_experience.max' => 'Years of experience cannot exceed 50.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'consent_accurate' => $this->boolean('consent_accurate'),
            'consent_notify' => $this->boolean('consent_notify'),
            'consent_no_endorsement' => $this->boolean('consent_no_endorsement'),
            'consent_public' => $this->boolean('consent_public'),
            'hide_address' => $this->boolean('hide_address'),
            'multiple_locations' => $this->boolean('multiple_locations') ? 'yes' : 'no',
            'caribbean_experience' => $this->boolean('caribbean_experience') ? 'yes' : 'no',
            // NOTE: caribbean_identity is intentionally NOT coerced — see below.
        ]);
    }
}
