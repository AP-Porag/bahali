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
        $query = Provider::with('providerType');


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

    public function create($data): Provider
    {
        $avatarPath = null;

        if ($data->hasFile('avatar') && $data->file('avatar')->isValid()) {
            $avatarPath = $data->file('avatar')->store('providers/avatars', 'public');
        }

        return Provider::create([
            'name'             => $data->name,
            'provider_type_id' => $data->provider_type_id ?: null,
            'region'           => $data->region,
            'service'          => $data->service,
            'status'           => $data->status ?? 'Draft',
            'bio'              => $data->bio,
            'location'         => $data->location,
            'avatar'           => $avatarPath,
        ]);
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
}
