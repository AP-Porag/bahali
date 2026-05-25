<?php

namespace App\Services\Admin\Provider;

use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProviderService
{
    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);
        $query = Provider::query();


        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
                // ->orWhere('email', 'like', "%{$search}%")
                // ->orWhere('phone', 'like', "%{$search}%")
                // ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        // if ($status !== 'all') {
        //     $query->where('status', (int) $status);
        // }

        $providers = $query->latest()->paginate($perPage ?? 10);
        return [
            'providers' => $providers->items(),
            'meta' => pagination_meta($providers, 'Search by name'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    public function create(array $data): Provider
    {
        $provider = Provider::create([
            'provider_name' => $data['provider_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,

            'country_id' => $data['country_id'],
            'region_type' => $data['region_type'] ?? null,
            'region' => $data['region'] ?? null,
            'city_town' => $data['city_town'] ?? null,
            'service_area' => $data['service_area'] ?? null,

            'professions' => $data['professions'],
            'credentials' => $data['credentials'],
            'support_areas' => $data['support_areas'],

            'service_format' => $data['service_format'],

            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,

            'address_visibility_preference' => $data['address_visibility_preference'],
            'location_sensitivity_flag' => $data['location_sensitivity_flag'] ?? false,

            'street_address_1' => $data['street_address1'] ?? null,
            'street_address_2' => $data['street_address2'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,

            'verification_address' => $data['verification_address'] ?? null,
            'billing_address' => $data['billing_address'] ?? null,

            'status' => $data['status'] ?? 'draft',
            'verification_status' => 'unverified',
        ]);

        // // pivots
        // if (!empty($data['professions'])) {
        //     $provider->professions()->sync($data['professions']);
        // }

        // if (!empty($data['credentials'])) {
        //     $provider->credentials()->sync($data['credentials']);
        // }

        // if (!empty($data['support_areas'])) {
        //     $provider->supportAreas()->sync($data['support_areas']);
        // }

        return $provider;
    }
    public function update(Provider $provider, $data): Provider
    {
        $avatarPath = $provider->avatar;

        // 🔥 New avatar uploaded
        if ($data->hasFile('avatar') && $data->file('avatar')->isValid()) {

            // ✅ delete old avatar if exists
            if ($provider->avatar && Storage::disk('public')->exists($provider->avatar)) {
                Storage::disk('public')->delete($provider->avatar);
            }

            // ✅ store new avatar
            $avatarPath = $data->file('avatar')->store('providers/avatars', 'public');
        }

        $provider->update([
            'name'             => $data->name,
            'email'            => $data->email,
            'phone' => $data->phone,
            'verification_status' => $data->verification_status,
            'provider_type_id' => $data->provider_type_id ?: null,
            'region'           => $data->region,
            'service'          => $data->service,
            'status'           => $data->status ?? 'Draft',
            'bio'              => $data->bio,
            'location'         => $data->location,
            'avatar'           => $avatarPath, // ✅ updated
        ]);

        return $provider->fresh();
    }

    public function delete(Provider $provider)
    {
        return $provider->delete();
    }

    public function find($id)
    {
        return Industry::findOrFail($id);
    }

    public function detail(Provider $provider): array
    {

        return [
            'provider' => $provider->load([
                'providerType',
            ]),
        ];
    }




    public function setVerified(Provider $provider): Provider
    {
        $provider->update([
            'status' => 'published',
            'verification_status' => 'verified',
            'is_public' => true,
            'verified_at' => now(),
        ]);

        return $provider;
    }

    public function setProvisional(Provider $provider): Provider
    {
        $provider->update([
            'status' => 'published',
            'verification_status' => 'provisional',
            'is_public' => true,
        ]);
        return $provider;
    }

    public function suspend(Provider $provider): Provider
    {
        $provider->update([
            'status' => 'suspended',
            'verification_status' => 'revoked',
            'is_public' => false,
            'suspended_at' => now(),
        ]);

        return $provider;
    }

    public function expire(Provider $provider): Provider
    {
        $provider->update([
            'status' => 'expired',
            'verification_status' => 'expired',
            'is_public' => false,
        ]);

        return $provider;
    }

    public function publish(Provider $provider): Provider
    {
        $provider->update([
            'status' => 'published',
            'is_public' => true,
        ]);

        return $provider;
    }

    // private function update(Provider $provider, array $data): Provider
    // {
    //     $provider->update($data);
    //     return $provider;
    // }
}
