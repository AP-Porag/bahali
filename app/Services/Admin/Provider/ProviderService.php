<?php

namespace App\Services\Admin\Provider;

use App\Models\Provider;

class ProviderService
{
    public function list($perPage = 10, $search = null)
    {
        return Provider::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data)
    {
        return Provider::create($data);
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
