<?php

namespace App\Utils;

final class JobCandidateStage
{
    // 🔑 Stage keys (DB values)
    public const SUBMITTED     = 'submitted';
    public const INTERVIEWING  = 'interviewing';
    public const OFFERED       = 'offered';
    public const PLACED        = 'placed';
    public const REJECTED      = 'rejected';

    /**
     * Ordered list (used for pipeline)
     */
    public const ORDER = [
        self::SUBMITTED,
        self::INTERVIEWING,
        self::OFFERED,
        self::PLACED,
        self::REJECTED,
    ];

    /**
     * Human readable labels
     */
    public const LABELS = [
        self::SUBMITTED     => 'Submitted',
        self::INTERVIEWING  => 'Interviewing',
        self::OFFERED       => 'Offered',
        self::PLACED        => 'Placed',
        self::REJECTED      => 'Rejected',
    ];

    /**
     * UI color tokens (shared with frontend)
     */
    public const COLORS = [
        self::SUBMITTED     => 'gray',
        self::INTERVIEWING  => 'blue',
        self::OFFERED       => 'yellow',
        self::PLACED        => 'green',
        self::REJECTED      => 'red',
    ];

    /**
     * Allowed stage transitions
     */
    public const TRANSITIONS = [
        self::SUBMITTED => [
            self::INTERVIEWING,
            self::REJECTED,
        ],

        self::INTERVIEWING => [
            self::OFFERED,
            self::REJECTED,
        ],

        self::OFFERED => [
            self::PLACED,
            self::REJECTED,
        ],

        self::PLACED => [],

        self::REJECTED => [],
    ];

    /**
     * Helper: validate stage key
     */
    public static function isValid(string $stage): bool
    {
        return in_array($stage, self::ORDER, true);
    }
}
