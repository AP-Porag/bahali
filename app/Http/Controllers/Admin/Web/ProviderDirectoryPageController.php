<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateProviderDirectoryContentRequest;
use App\Services\Web\ProviderDirectoryPageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProviderDirectoryPageController extends Controller
{
    public function __construct(private ProviderDirectoryPageService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/web/provider-directory', [
            'sections' => $this->service->getAdminSections(),
        ]);
    }

    public function update(UpdateProviderDirectoryContentRequest $request): RedirectResponse
    {
        $key = $request->validated('key');

        if (ProviderDirectoryPageService::fieldType($key) === 'image') {
            $this->service->updateImage($key, $request->file('image'));
        } else {
            $this->service->updateText($key, $request->validated('value'));
        }

        return back()->with('success', 'Content updated.');
    }
}
