<?php

namespace App\Http\Requests\Provider;

use App\Support\AreasOfSupport;
use Illuminate\Contracts\Validation\Validator;
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
            // Step 1 — Provider Information
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
            'professional_title.*' => ['string', 'max:255'],
            'professional_title_other' => [
                'nullable',
                'string',
                'max:255',
                'required_if:professional_title,Other (specify)'
            ],

            // Step 2 — About You
            'short_bio' => ['required', 'string', 'max:5000'],
            'years_experience' => ['nullable', 'string', 'max:50'],

            // Step 3 — Licensure & Verification
            'license_number' => ['nullable', 'string', 'max:120'],
            'license_states' => ['required', 'array', 'min:1'],
            'license_states.*' => ['string', 'max:255'],
            'license_states_other' => ['nullable', 'string', 'max:255'], // ✅ added
            'license_status' => ['required', Rule::in(['active', 'provisional', 'not_applicable'])],
            'verification_document' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240'
            ],

            // Step 4 — Areas of Support (pivot table)
            'areas_of_support' => ['required', 'array'],
            'areas_of_support.*' => ['string', 'max:600'],
            'areas_of_support_other' => ['nullable', 'string', 'max:255'],

            // Step 5 — Populations
            'populations_served' => ['required', 'array', 'min:1'],
            'populations_served.*' => ['string', 'max:255'],

            // Step 6 — Professional Expertise
            'treatment_approaches' => ['nullable', 'array'],
            'treatment_approaches.*' => ['string', 'max:255'],
            'treatment_approaches_other' => ['nullable', 'string', 'max:255'], // ✅ added
            'specialized_training' => ['nullable', 'array'],
            'specialized_training.*' => ['string', 'max:255'],
            'specialized_training_other' => ['nullable', 'string', 'max:255'], // ✅ added
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string', 'max:255'],

            // Step 7 — Cultural & Language
            'caribbean_identity' => ['required', Rule::in(['yes', 'no', 'prefer_not'])],
            'caribbean_experience' => ['required', Rule::in(['yes', 'no'])],
            'languages' => ['required', 'array', 'min:1'],
            'languages.*' => ['string', 'max:255'],
            'languages_other' => ['nullable', 'string', 'max:255'],
            'cultural_approach' => ['nullable', 'string', 'max:2500'],

            // Step 8 — Service Information
            'service_formats' => ['required', 'array', 'min:1'],
            'service_formats.*' => ['string', 'max:255'],
            'practice_settings' => ['required', 'array', 'min:1'],
            'practice_settings.*' => ['string', 'max:255'],
            'practice_settings_other' => ['nullable', 'string', 'max:255'], // ✅ added

            // Step 9 — Location
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'state_province' => ['required', 'string', 'max:120'],
            'country' => ['required', 'string', 'max:120'],
            'multiple_locations' => ['required', Rule::in(['yes', 'no'])],
            'hide_address' => ['boolean'],
            'telehealth_regions' => ['nullable', 'array'],
            'telehealth_regions.*' => ['string', 'max:255'],
            'telehealth_regions_other' => ['nullable', 'string', 'max:500'], // ✅ added

            // Step 10 — Payment
            'payment_methods' => ['required', 'array', 'min:1'],
            'payment_methods.*' => ['string', 'max:255'],
            'insurance_plans' => ['nullable', 'string', 'max:2000'],

            // Step 11 — Contact
            'phone' => ['required', 'string', 'max:40'],
            'website' => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'string', 'max:2000'],

            // Step 12 — Media
            'profile_photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'additional_photos' => ['nullable', 'array', 'max:10'],
            'additional_photos.*' => ['file', 'mimes:jpg,jpeg,png,webp', 'max:8192'],

            // Step 13 — Accessibility
            'accessibility' => ['required', 'array', 'min:1'],
            'accessibility.*' => ['string', 'max:255'],
            'accessibility_other' => ['nullable', 'string', 'max:255'], // ✅ added

            // Step 14 — Consent
            'consent_accurate' => ['accepted'],
            'consent_notify' => ['accepted'],
            'consent_no_endorsement' => ['accepted'],
            'consent_public' => ['accepted'],
        ];
    }

    /**
     * নমনীয় ভ্যালিডেশন: "category|area" ফরম্যাট যাচাই, খারাপ আইটেম স্কিপ করা
     */
    // public function withValidator(Validator $validator): void
    // {
    //     $validator->after(function (Validator $v) {
    //         $items = $this->input('areas_of_support', []);
    //         if (!is_array($items)) {
    //             return;
    //         }

    //         $knownCategories = array_keys(AreasOfSupport::GROUPS);

    //         foreach ($items as $index => $item) {
    //             $key = "areas_of_support.$index";

    //             // ফরম্যাট ঠিক না থাকলে – স্কিপ (এরর দেবেন না)
    //             if (!is_string($item) || !str_contains($item, '|')) {
    //                 continue;
    //             }

    //             [$category, $area] = array_map('trim', explode('|', $item, 2));

    //             if (!in_array($category, $knownCategories, true)) {
    //                 $v->errors()->add($key, 'This support-area category is not recognized.');
    //                 continue;
    //             }

    //             if ($area === '') {
    //                 $v->errors()->add($key, 'Please describe the area of support.');
    //                 continue;
    //             }

    //             // প্রি-ডিফাইন্ড এলাকা চেক (যদি জানা থাকে)
    //             $canonical = AreasOfSupport::categoryFor($area);
    //             if ($canonical !== null && $canonical !== $category) {
    //                 $v->errors()->add($key, 'This area does not belong to the selected category.');
    //             }
    //             // $canonical === null  →  custom "Other" text  →  allowed
    //         }
    //     });
    // }

    /**
     * areas_of_support অ্যারে থেকে পিভট টেবিলের ডেটা তৈরি করে
     * প্রি-ডিফাইন্ড → area কলামে, কাস্টম → area_other কলামে
     */
    public function mappedAreasOfSupport(): array
    {
        $items = $this->input('areas_of_support', []);
        return collect($items)
            ->filter(fn($item) => is_string($item) && str_contains($item, '|'))
            ->map(function ($item) {
                [$category, $value] = array_map('trim', explode('|', $item, 2));
                if (!$category || $value === '') return null;
                return ['category' => $category, 'area' => $value];
            })
            ->filter()
            ->unique('area')
            ->values()
            ->all();
    }
    public function messages(): array
    {
        return [
            'license_states.min' => 'Select at least one state or country of licensure.',
            'populations_served.min' => 'Select at least one population you serve.',
            'languages.min' => 'Select at least one language you speak.',
            'service_formats.min' => 'Select at least one service format.',
            'areas_of_support.required' => 'Please select at least one area of support.',
            'practice_settings.min' => 'Select at least one practice setting.',
            'payment_methods.min' => 'Select at least one accepted payment method.',
            'accessibility.min' => 'Select at least one accessibility option.',
            'consent_accurate.accepted' => 'Please confirm the information is accurate.',
            'consent_notify.accepted' => 'Please agree to notify Bahali of changes.',
            'consent_no_endorsement.accepted' => 'Please acknowledge this is not an endorsement.',
            'consent_public.accepted' => 'Please consent to public display of your listing.',
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
        ]);
    }
}
