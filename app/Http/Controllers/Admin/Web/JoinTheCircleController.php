<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateJoinTheCircleContentRequest;
use App\Services\Web\JoinTheCircleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JoinTheCircleController extends Controller
{
    public function __construct(private JoinTheCircleService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/web/join-the-circle', [
            'sections' => $this->service->getAdminSections(),
        ]);
    }

    public function update(UpdateJoinTheCircleContentRequest $request): RedirectResponse
    {
        $key = $request->validated('key');

        if (JoinTheCircleService::fieldType($key) === 'image') {
            $this->service->updateImage($key, $request->file('image'));
        } else {
            $this->service->updateText($key, $request->validated('value'));
        }

        return back()->with('success', 'Content updated.');
    }
}
