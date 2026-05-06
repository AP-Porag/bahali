<?php

namespace App\Http\Requests\Provider;

use App\Http\Requests\BaseRequest;

class ProviderRequest extends BaseRequest
{
    public function rules()
    {

        return [

            'name' => 'required|string|max:255',

            'provider_type_id' => 'nullable|exists:provider_types,id',

            'region' => 'required|string|max:255',

            'service' => 'required|string|max:50',

            'status' => 'nullable|string|max:500',

            'bio' => 'nullable|string',

            'location	' => 'nullable | string',

        ];
    }
}
