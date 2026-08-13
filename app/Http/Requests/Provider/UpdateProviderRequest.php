<?php

namespace App\Http\Requests\Provider;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ownership is enforced in the controller (provider = auth user's own record).
        return true;
    }

    public function rules(): array
    {
        return [
            'provider_type'        => ['nullable', 'string', 'max:255'],
            'organization_name'    => ['required', 'string', 'max:255'],
            'credentials'          => ['nullable', 'string', 'max:255'],
            'professional_title'   => ['nullable', 'array'],
            'professional_title.*' => ['string', 'max:255'],

            'short_bio'            => ['nullable', 'string'],
            'years_experience'    => ['nullable', 'string', 'max:255'],

            'license_number'         => ['nullable', 'string', 'max:255'],
            'license_not_applicable' => ['nullable', 'boolean'],
            'license_status'         => ['nullable', 'string', 'max:255'],

            'populations_served'   => ['nullable', 'array'],
            'populations_served.*' => ['string', 'max:255'],

            'caribbean_identity'   => ['nullable', 'string', 'max:255'],
            'caribbean_experience' => ['nullable', 'string', 'max:255'],
            'languages'            => ['nullable', 'array'],
            'languages.*'          => ['string', 'max:255'],
            'cultural_approach'    => ['nullable', 'string'],

            'service_formats'   => ['nullable', 'array'],
            'service_formats.*' => ['string', 'max:255'],

            'address'            => ['nullable', 'string', 'max:255'],
            'city'               => ['nullable', 'string', 'max:255'],
            'state_province'     => ['nullable', 'string', 'max:255'],
            'country'            => ['nullable', 'string', 'max:255'],
            'multiple_locations' => ['nullable', 'string', 'max:255'],
            'hide_address'       => ['nullable', 'boolean'],

            'payment_methods'   => ['nullable', 'array'],
            'payment_methods.*' => ['string', 'max:255'],
            'insurance_plans'   => ['nullable', 'string'],

            'phone'        => ['nullable', 'string', 'max:50'],
            'website'      => ['nullable', 'string', 'max:255'],
            'social_links' => ['nullable', 'string'],

            'verification_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'profile_photo'         => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:10240'],
            'additional_photos'     => ['nullable', 'array'],
            'additional_photos.*'   => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],

            'existing_additional_photos'   => ['nullable', 'array'],
            'existing_additional_photos.*' => ['string'],

            // Array columns are re-read via input() in the service, but must have
            // rules so they survive validation:
            'license_states'       => ['nullable', 'array'],
            'telehealth_regions'   => ['nullable', 'array'],
            'accessibility'        => ['nullable', 'array'],
            'practice_settings'    => ['nullable', 'array'],
            'treatment_approaches' => ['nullable', 'array'],
            'specialized_training' => ['nullable', 'array'],
            'certifications'       => ['nullable', 'array'],
            'areas_of_support'     => ['nullable', 'array'],
        ];
    }

    /**
     * Parse the "category|area" entries into pivot rows for provider_support_areas.
     * (Same shape the registration flow uses.)
     */
    public function mappedAreasOfSupport(): array
    {
        $mapped = [];
        foreach ($this->input('areas_of_support', []) as $entry) {
            if (! is_string($entry) || ! str_contains($entry, '|')) {
                continue;
            }
            [$category, $area] = explode('|', $entry, 2);
            $category = trim($category);
            $area = trim($area);
            if ($category !== '' && $area !== '') {
                $mapped[] = ['category' => $category, 'area' => $area];
            }
        }
        return $mapped;
    }
}
