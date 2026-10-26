<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProviderProfileContentRequest;
use App\Services\Web\ProviderProfilePageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProviderProfilePageController extends Controller
{
    public function __construct(private ProviderProfilePageService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/web/provider-profile', [
            'sections' => $this->service->getAdminSections(),
        ]);
    }

    public function update(UpdateProviderProfileContentRequest $request): RedirectResponse
    {
        $key = $request->validated('key');

        if (ProviderProfilePageService::fieldType($key) === 'image') {
            $this->service->updateImage($key, $request->file('image'));
        } else {
            $this->service->updateText($key, $request->validated('value'));
        }

        return back()->with('success', 'Content updated.');
    }
}
