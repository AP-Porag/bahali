<?php

namespace App\Http\Controllers\Admin\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\ProviderRequest;
use App\Models\Provider;
use App\Models\ProviderType;
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

        return Inertia::render('admin/provider/index', $this->service->list($request));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/provider/create', [
            'provider_type' => ProviderType::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->service->create($request);
        return redirect()
            ->route('providers.index')
            ->with('success', 'Provider created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        $provider = Provider::findOrFail($id);


        $data = $this->service->detail($provider);

        return Inertia::render('admin/provider/show', $data);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {
        return inertia('admin/provider/edit', [
            'provider' => $provider->load('providerType:id,name'),
            'provider_type' => ProviderType::select('id', 'name')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProviderRequest $request, Provider $provider)
    {
        $this->service->update($provider, $request);

        return redirect()
            ->route('providers.index')
            ->with('success', 'Provider updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Provider $provider)
    {
        $this->service->delete($provider);
        return redirect()
            ->route('providers.index')
            ->with('success', 'Provider deleted successfully.');
    }
}
