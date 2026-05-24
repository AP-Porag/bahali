<?php

namespace App\Http\Controllers\Admin\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\ProviderRequest;
use App\Http\Resources\ProviderCollection;
use App\Models\Country;
use App\Models\Credential;
use App\Models\Provider;
use App\Models\ProviderProfessionCategory;
use App\Models\ProviderType;
use App\Models\SupportArea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Utils\GlobalConstant;
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
        // $country = Country::with(['regionTypes.regions'])->get();
        $countries = Country::with('regions.regionType')->get();
        $professionCategories = ProviderProfessionCategory::with('professions')
            ->orderBy('id')
            ->get();

        $credentials = Credential::select('id', 'name')->get();
        $supportArea = SupportArea::select('id', 'name')->get();

        return Inertia::render('admin/provider/create', [
            'provider_type' => ProviderType::select('id', 'name')->get(),
            'countries' => $countries,
            'professionCategories' => $professionCategories,
            'supoort_areas' => $supportArea,
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

    /**
     * Change Verification Status
     */

    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', 'string'],
            'type' => ['nullable', 'string'],
        ]);

        $provider = Provider::findOrFail($id);

        if ($request->type === 'verification_status') {
            $provider->update([
                'verification_status' => $request->status,
            ]);
        } else {
            $provider->update([
                'status' => $request->status,
            ]);
        }

        return back()->with('success', 'Updated successfully');
    }



    // GET /api/providers
    public function getProvidersForApi()
    {
        $providers = Provider::where('verification_status', GlobalConstant::VERIFICATION_STATUS_VERIFIED)->with('providerType')->get();
        return new ProviderCollection($providers);
    }
}
