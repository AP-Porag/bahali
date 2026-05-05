<?php

namespace App\Services\Admin\ProviderType;

use App\Models\ProviderType;

class ProviderTypeService
{
    public function list($perPage = 10, $search = null)
    {
        return ProviderType::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);
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
