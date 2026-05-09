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

            'avatar' => [
                'nullable',
                function ($attribute, $value, $fail) {

                    // old image path/string হলে skip
                    if (is_string($value)) {
                        return;
                    }

                    // new uploaded file হলে validate
                    if ($value instanceof \Illuminate\Http\UploadedFile) {

                        $allowedMimeTypes = [
                            'image/jpeg',
                            'image/png',
                            'image/webp',
                        ];

                        if (! in_array($value->getMimeType(), $allowedMimeTypes)) {
                            $fail('The avatar must be a jpg, png, or webp image.');
                        }

                        if ($value->getSize() > 5 * 1024 * 1024) {
                            $fail('The avatar must not be greater than 5MB.');
                        }
                    }
                },
            ],

            'bio' => 'nullable|string',

            'location' => 'nullable|string',

        ];
    }
}
