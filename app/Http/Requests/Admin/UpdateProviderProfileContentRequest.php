<?php

namespace App\Http\Requests\Admin;

use App\Services\Web\ProviderProfilePageService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProviderProfileContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Access is guarded by the admin route middleware.
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'key' => ['required', 'string', Rule::in(ProviderProfilePageService::keys())],
        ];

        $type = ProviderProfilePageService::fieldType($this->input('key'));

        if ($type === 'image') {
            $rules['image'] = ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'];
        } elseif ($type === 'textarea') {
            $rules['value'] = ['required', 'string', 'max:5000'];
        } else {
            $rules['value'] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'key.in' => 'This content field does not exist.',
            'value.required' => 'This field cannot be empty.',
            'image.required' => 'Please choose an image to upload.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Allowed formats: JPG, PNG, WEBP.',
            'image.max' => 'The image may not be larger than 5 MB.',
        ];
    }
}
