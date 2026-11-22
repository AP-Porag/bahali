<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admin-only pages (Bahali Connect blog CMS). Provider accounts never get editorial access
 * (BLOG_AND_GET_HELP.md). Used directly on routes, so bootstrap/app.php does not change.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless($request->user()?->role === 'admin', 403);

        return $next($request);
    }
}
