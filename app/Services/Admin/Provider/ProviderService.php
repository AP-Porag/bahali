<?php

namespace App\Services\Admin\Provider;

use App\Models\Provider;
use Illuminate\Http\Request;

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

        $provider = Provider::create([
            'name'         => $data->name,
            'provider_type_id' => $data->provider_type_id,
            'region' => $data->region,
            'service' => $data->service,
            'status' => $data->status,
            'bio' => $data->bio,
            'location' => $data->location,
        ]);

        return $provider;
    }

    public function update(Provider $provider, $data): Provider
    {
        $provider->update([
            'name'         => $data->name,
            'provider_type_id' => $data->provider_type_id,
            'region' => $data->region,
            'service' => $data->service,
            'status' => $data->status,
            'bio' => $data->bio,
            'location' => $data->location,
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
