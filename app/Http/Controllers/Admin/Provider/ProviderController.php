<?php

namespace App\Http\Controllers\Admin\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Admin\Provider\ProviderService;

class ProviderController extends Controller
{
    protected $service;

    public function __construct(ProviderService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        return Inertia::render('admin/provider/index', [
            'providers' => $this->service->list(
                $request->perPage ?? 10,
                $request->search ?? null
            ),
            'filters' => $request->only(['search', 'perPage', 'page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/provider-type/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:industries,name',
        ]);

        $this->service->create($validated);

        return redirect()
            ->route('admin.industries.index')
            ->with('success', 'Industry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Industry $industry)
    {
        return Inertia::render('Admin/Industry/Show', [
            'industry' => $industry,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Industry $industry)
    {
        return Inertia::render('admin/industry/edit', [
            'industry' => $industry,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Industry $industry)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:industries,name,' . $industry->id,
        ]);

        $this->service->update($industry, $validated);

        return redirect()
            ->route('admin.industries.index')
            ->with('success', 'Industry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Industry $industry)
    {
        $this->service->delete($industry);

        return redirect()
            ->route('admin.industries.index')
            ->with('success', 'Industry deleted successfully.');
    }
}
