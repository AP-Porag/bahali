<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateConnectContentRequest;
use App\Services\Web\ConnectContentSchema;
use App\Services\Web\ConnectContentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin → CMS → Home / Website Pages — text and images of every Bahali Connect page.
 * (Provider Search, Provider Profile and Blog keep their own screens.)
 */
class ConnectContentController extends Controller
{
    public function __construct(private ConnectContentService $service) {}

    /** /admin/web/pages → first page in the list (Home has its own sidebar item). */
    public function index(): RedirectResponse
    {
        return redirect()->route('admin.connect-content.edit', 'help');
    }

    public function edit(string $page): Response
    {
        abort_unless(ConnectContentService::exists($page), 404);

        $pages = collect(ConnectContentSchema::pages())
            ->map(fn (array $meta, string $key) => ['key' => $key, 'title' => $meta['title'], 'group' => $meta['group']])
            ->values();

        return Inertia::render('admin/web/connect-content', [
            'page'     => ['key' => $page] + ConnectContentSchema::pages()[$page],
            'pages'    => $pages,
            'sections' => $this->service->getAdminSections($page),
        ]);
    }

    public function update(UpdateConnectContentRequest $request, string $page): RedirectResponse
    {
        abort_unless(ConnectContentService::exists($page), 404);

        $key = $request->validated('key');

        if (ConnectContentService::fieldType($page, $key) === 'image') {
            $this->service->updateImage($page, $key, $request->file('image'));
        } else {
            $this->service->updateText($page, $key, $request->validated('value'));
        }

        return back()->with('success', 'Content updated.');
    }

    public function reset(Request $request, string $page): RedirectResponse
    {
        abort_unless(ConnectContentService::exists($page), 404);

        $key = $request->validate(['key' => ['required', 'string', Rule::in(ConnectContentService::keys($page))]])['key'];
        $this->service->reset($page, $key);

        return back()->with('success', 'Content reset.');
    }
}
