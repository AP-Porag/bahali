<?php

namespace App\Http\Requests\Admin;

use App\Services\Web\ConnectContentService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConnectContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Access is guarded by the admin route middleware.
        return true;
    }

    public function rules(): array
    {
        $page = (string) $this->route('page');

        $rules = [
            'key' => ['required', 'string', Rule::in(ConnectContentService::keys($page))],
        ];

        $type = ConnectContentService::fieldType($page, $this->input('key'));

        if ($type === 'image') {
            $rules['image'] = ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'];
        } else {
            $rules['value'] = ['required', 'string', 'max:' . (ConnectContentService::MAX_LENGTH[$type] ?? 500)];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'key.in' => 'This content field does not exist.',
            'value.required' => 'This field cannot be empty.',
            'value.max' => 'This text is too long.',
            'image.required' => 'Please choose an image to upload.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Allowed formats: JPG, PNG, WEBP.',
            'image.max' => 'The image may not be larger than 5 MB.',
        ];
    }
}
