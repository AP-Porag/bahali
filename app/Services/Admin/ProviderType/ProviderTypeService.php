<?php

namespace App\Services\Admin\ProviderType;

use App\Models\ProviderType;
use Illuminate\Http\Request;

class ProviderTypeService
{
    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);

        $query = ProviderType::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $providerTypes = $query->latest()->paginate($perPage ?? 10);

        return [
            'provider_types' => $providerTypes,
            'meta' => pagination_meta($providerTypes, 'Search by name'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    public function create(array $data)
    {
        return ProviderType::create($data);
    }

    public function update(Industry $industry, array $data)
    {
        $industry->update($data);
        return $industry;
    }

    public function delete(ProviderType $providerType)
    {
        return $providerType->delete();
    }

    public function find($id)
    {
        return Industry::findOrFail($id);
    }
}
