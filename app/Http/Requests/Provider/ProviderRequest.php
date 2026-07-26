<?php
// app/Http/Requests/StoreProviderRequest.php

namespace App\Http\Requests\Provider;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add authentication logic if needed
    }

    public function rules(): array
    {
        return [
            // Basic Information
            'provider_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20', // Make phone required

            // Location Information
            'country' => 'required|exists:countries,id', // Change to required
            'regionType' => 'nullable|string|max:100',
            'region' => 'required|string|max:255', // Change to required
            'cityTown' => 'required|string|max:255', // Change to required
            'serviceArea' => 'nullable|string|max:255',

            'serviceFormat' => [
                'required',
                Rule::in([
                    'virtual', // Add this! Your frontend sends "virtual"
                    'home_office_private_residence',
                    'virtual_only_provider',
                    'mobile_community_based_provider',
                    'trauma_focused_service_location',
                    'dv_sa_support_location',
                    'youth_confidential_program',
                    'crisis_shelter_safety_sensitive_site'
                ]),
            ],

            // Professional Information (Arrays)
            'professions' => 'required|array|min:1',
            'professions.*' => 'string|max:255',

            'credentials' => 'nullable|array',
            'credentials.*' => 'string|max:255',

            'support_areas' => 'nullable|array',
            'support_areas.*' => 'string|max:255',

            'telehealth_regions_other' => ['nullable', 'string', 'max:500'],
            'accessibility_other' => ['nullable', 'string', 'max:500'],
            'treatment_approaches_other' => ['nullable', 'string', 'max:500'],
            'specialized_training_other' => ['nullable', 'string', 'max:500'],
            'license_states_other' => ['nullable', 'string', 'max:500'],

            // Private Address
            'streetAddress1' => 'nullable|string|max:255',
            'streetAddress2' => 'nullable|string|max:255',
            'postalCode' => 'nullable|string|max:20',

            // Geo Data
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',

            // Admin Addresses
            'verification_address' => 'nullable|string|max:255',
            'billing_address' => 'nullable|string|max:255',

            // Visibility Settings
            'addressVisibilityPreference' => [
                'required',
                Rule::in(['no_display', 'city_region_only', 'service_area', 'full_address']),
            ],

            'locationSensitivityFlag' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'provider_name.required' => 'The provider name is required.',
            'email.unique' => 'This email is already registered.',
            'country.exists' => 'The selected country is invalid.',
            'professions.required' => 'Please select at least one profession.',
            'professions.min' => 'Please select at least one profession.',
            'streetAddress1.required_if' => 'Street address is required for in-person services.',
        ];
    }

    public function validatedForStorage(): array
    {
        $validated = $this->validated();

        return [
            'provider_name' => $validated['provider_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,

            'country_id' => $validated['country'], // This expects 'country' field
            'region_type' => $validated['regionType'] ?? null,
            'region' => $validated['region'] ?? null,
            'city_town' => $validated['cityTown'] ?? null,
            'service_area' => $validated['serviceArea'] ?? null,

            'service_format' => $validated['serviceFormat'],

            'professions' => $validated['professions'] ?? [],
            'credentials' => $validated['credentials'] ?? [],
            'support_areas' => $validated['support_areas'] ?? [],

            'street_address1' => $validated['streetAddress1'] ?? null,
            'street_address2' => $validated['streetAddress2'] ?? null,
            'postal_code' => $validated['postalCode'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,

            'verification_address' => $validated['verification_address'] ?? null,
            'billing_address' => $validated['billing_address'] ?? null,

            'address_visibility_preference' => $validated['addressVisibilityPreference'],
            'location_sensitivity_flag' => $validated['locationSensitivityFlag'] ?? false,

            'status' => 'pending',
        ];
    }
}
