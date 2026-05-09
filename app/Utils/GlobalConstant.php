<?php

namespace App\Utils;

class GlobalConstant
{

    // Status
    public const STATUS_DRAFT = "draft";
    public const STATUS_PENDING = "pending";
    public const STATUS_PUBLISHED = "published";
    // public const STATUS_PROVISIONAL = "Provisional";
    public const STATUS_SUSPENDED = "suspended";
    public const STATUS_EXPIRED = "expired";
    public const STATUS_ARCHIVED = "archived";



    public const VERIFICATION_STATUS_UNVERIFIED = 'unverified';
    public const VERIFICATION_STATUS_VERIFIED = 'verified';
    public const VERIFICATION_STATUS_PROVISIONAL = 'provisional';
    public const VERIFICATION_STATUS_REJECTED = 'rejected';
    public const VERIFICATION_STATUS_EXPIRED = 'expired';
    public const VERIFICATION_STATUS_REVOKED = 'revoked';
}
