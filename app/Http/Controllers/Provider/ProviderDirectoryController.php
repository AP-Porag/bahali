<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Requests\Provider\StoreProviderRequest;
use App\Models\Country;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProviderDirectoryController extends Controller
{
    /**
     * Show the registration form.
     */
    public function create()
    {
        // Fetch countries with regions, organized for dependent dropdown
        $countries = Country::with('regions.regionType')
            ->orderBy('display_order')
            ->get()
            ->map(fn($country) => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'regions' => $country->regions
                    ->sortBy('display_order')
                    ->map(fn($region) => [
                        'id' => $region->id,
                        'name' => $region->name,
                        'regionTypeName' => $region->regionType?->name,
                        'regionTypeLabel' => $region->regionType?->label,
                    ])
                    ->values()
                    ->toArray(),
            ])
            ->values()
            ->toArray();

        return Inertia::render('web/create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Validate, store files, persist, and redirect back with a flash.
     *
     * Uses storeUpload() helper to bypass getRealPath() issues on Windows.
     */
    public function store(StoreProviderRequest $request)
    {
        $data = $request->validated();

        // Create the login account first
        $user = User::create([
            'name'     => $data['organization_name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'provider',
        ]);

        $data['user_id'] = $user->id;
        unset($data['email'], $data['password']);

        // Handle file uploads without relying on getRealPath()
        $data['verification_document'] = $this->storeUpload(
            $request->file('verification_document'),
            'providers/verification'
        );

        $data['profile_photo'] = $this->storeUpload(
            $request->file('profile_photo'),
            'providers/photos'
        );

        $additional = [];
        foreach (Arr::wrap($request->file('additional_photos', [])) as $photo) {
            if ($path = $this->storeUpload($photo, 'providers/photos')) {
                $additional[] = $path;
            }
        }
        $data['additional_photos'] = $additional;

        Provider::create($data);

        return redirect()
            ->route('providers.create')
            ->with('success', 'Your application has been received.');
    }

    /**
     * Store an uploaded file without any path resolution issues.
     *
     * Uses move_uploaded_file() which is designed for temp uploads and never
     * calls getRealPath(), fopen(), or any path resolution that fails on Windows.
     * Works with all file types: PDFs, JPEGs, PNGs, WebP, etc.
     *
     * @param UploadedFile|null $file
     * @param string $dir Directory path relative to storage/app/public (e.g. 'providers/photos')
     * @return string|null Stored file path relative to public disk, or null if invalid
     */
    private function storeUpload(?UploadedFile $file, string $dir): ?string
    {
        if (!$file instanceof UploadedFile || !$file->isValid()) {
            return null;
        }

        $tempPath = $file->getPathname();
        if (!$tempPath || !is_file($tempPath)) {
            return null;
        }

        // Destination on the public disk
        $publicPath = storage_path('app/public');
        $destDir = $publicPath . DIRECTORY_SEPARATOR . $dir;

        // Create destination directory if it doesn't exist
        if (!is_dir($destDir)) {
            @mkdir($destDir, 0755, true);
        }

        $filename = $file->hashName();
        $destPath = $destDir . DIRECTORY_SEPARATOR . $filename;

        // move_uploaded_file() works directly with temp paths, no getRealPath() involved
        if (move_uploaded_file($tempPath, $destPath)) {
            return $dir . '/' . $filename;
        }

        return null;
    }
}
