<?php

namespace App\Http\Requests\Provider;

use App\Http\Requests\BaseRequest;

class ProviderRequest extends BaseRequest
{
    public function rules()
    {

        return [

            'name' => 'required|string|max:255',

            'email' => 'required|string|email|max:255|unique:users,email',

            'phone' => 'nullable|string|max:255',

            'provider_type_id' => 'nullable|exists:provider_types,id',

            'region' => 'nullable|string|max:255',

            'verification_status' => 'nullable|string|max:255',

            'service' => 'nullable|string|max:50',

            'status' => 'nullable|string|max:50',

            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'bio' => 'nullable|string',

            'location' => 'nullable|string',

        ];
    }
}
