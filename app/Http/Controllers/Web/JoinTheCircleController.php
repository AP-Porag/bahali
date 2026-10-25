<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\Web\JoinTheCircleService;
use Inertia\Inertia;
use Inertia\Response;

class JoinTheCircleController extends Controller
{
    public function __construct(private JoinTheCircleService $service) {}

    public function index(): Response
    {
        return Inertia::render('web/JoinTheCircle', [
            'content' => $this->service->getContent(),
        ]);
    }
}
