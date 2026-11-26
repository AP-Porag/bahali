<?php

namespace App\Support;

/**
 * Keeps each kind of provider information in the right part of the public profile (client review, 25 Nov 2026):
 *   - degrees, licences and certifications  → Credentials
 *   - therapeutic methods                    → Treatment Approaches (or Specialized Training)
 *   - concerns the provider supports         → Areas of Support
 * e.g. "Cognitive Processing Therapy" or "Postpartum Anxiety & Depression" are not credentials.
 *
 * Mirrors resources/js/lib/credentialEntries.ts (form guidance). Used by the provider form requests
 * (validation) and by ProviderService (public profile: older entries are shown in the right section).
 */
class ProviderEntryCategory
{
    public const APPROACH = 'approach';
    public const TRAINING = 'training';
    public const AREA = 'area';

    /** Therapeutic methods — the Treatment Approaches list plus other common methods and their short forms. */
    private const APPROACHES = [
        'Acceptance & Commitment Therapy (ACT)',
        'Cognitive Behavioral Therapy (CBT)',
        'Cognitive Behavioural Therapy (CBT)',
        'Cognitive Processing Therapy (CPT)',
        'Dialectical Behavior Therapy (DBT)',
        'Eye Movement Desensitization & Reprocessing (EMDR)',
        'Exposure & Response Prevention (ERP)',
        'Family Systems Therapy',
        'Gottman Method',
        'Interpersonal Psychotherapy (IPT)',
        'Mindfulness-Based Approaches',
        'Mindfulness-Based Cognitive Therapy (MBCT)',
        'Mindfulness-Based Stress Reduction (MBSR)',
        'Motivational Interviewing (MI)',
        'Person-Centered Therapy',
        'Prolonged Exposure (PE)',
        'Psychodynamic Therapy',
        'Solution-Focused Brief Therapy (SFBT)',
        'Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)',
        'Integrative / Eclectic Therapy',
        'Internal Family Systems (IFS)',
        'Emotionally Focused Therapy (EFT)',
        'Narrative Therapy',
        'Play Therapy',
        'Art Therapy',
        'Music Therapy',
        'Schema Therapy',
        'Somatic Experiencing',
        'Compassion-Focused Therapy (CFT)',
        'Parent-Child Interaction Therapy (PCIT)',
    ];

    private const TRAINING_OPTIONS = [
        'Psychological First Aid (PFA)',
        'Trauma & PTSD',
        'Suicide Prevention & Intervention',
        'Grief & Bereavement',
        'Perinatal Mental Health',
        'Substance Use & Recovery',
        'Domestic & Intimate Partner Violence',
        'Military & Veteran Mental Health',
        'Dementia & Cognitive Care',
        'Couples & Family Therapy',
    ];

    /** Areas of Support as listed on the provider form (resources/js/constants/supportAreas.ts). */
    private const FORM_AREAS = [
        'Anxiety & Worry',
        'Depression & Low Mood',
        'Mood Changes & Bipolar Support',
        'ADHD',
        'Obsessive Thoughts & Compulsive Behaviors (OCD)',
        'Panic Attacks',
        'Stress & Burnout',
        'Managing Emotions',
        'Anger & Irritability',
        'Sleep & Insomnia',
        'Building Self-Confidence',
        'Grief & Loss',
        'Self-Harm Recovery',
        'Big Feelings & Emotional Regulation',
        'Child Behavioral Challenges',
        'Developmental Concerns',
        'Autism & Neurodiversity Support',
        'School & Academic Concerns',
        'Social Skills',
        'Self-Confidence',
        'Parenting Support',
        'Parent-Child Relationship Concerns',
        'Relationship Challenges',
        'Couples Counseling',
        'Premarital Counseling',
        'Family Conflict',
        'Blended Family Concerns',
        'Communication Challenges',
        'Divorce & Separation',
        'Healing from Relationship Abuse',
        'Pregnancy & Prenatal Support',
        'Postpartum Emotional Wellness',
        'Postpartum Anxiety',
        'Postpartum Depression',
        'Pregnancy & Infant Loss',
        'Infertility',
        'Menopause & Midlife',
        'Healthy Aging & Older Adult Well-Being',
        'Memory & Cognitive Concerns',
        'Alzheimer\'s & Dementia Support',
        'Caregiver Support',
        'Retirement & Life Changes',
        'Grief & Loss in Later Life',
        'Care Planning & Aging Transitions',
        'Trauma & PTSD',
        'Community Violence',
        'Disaster Recovery',
        'Relationship Abuse & Trauma',
        'Vicarious Trauma',
        'Military & Service-Related Trauma',
        'First Responder Support',
        'Psychological First Aid',
        'Life Changes & Transitions',
        'Career Changes',
        'Identity & Purpose',
        'Cultural Identity & Belonging',
        'Caribbean & Diaspora Wellness',
        'Immigration & Cultural Adjustment',
        'Racism & Discrimination',
        'LGBTQIA+ Affirming Support',
        'Men\'s Emotional Wellness',
        'Chronic Illness Support',
        'Chronic Pain & Health-Related Stress',
        'Alcohol Use',
        'Substance Use',
        'Lifestyle & Behavior Change',
        'Faith & Spiritual Support',
        'Faith Leader & Ministry Support',
        'Helping Professional Wellness',
        'Community Wellness & Resilience',
        'Psychological Testing & Evaluation',
        'Cognitive Assessment',
        'Memory Assessment',
        'ADHD Assessment',
        'Learning & Academic Assessment',
        'Developmental Assessment',
        'Autism Assessment',
        'Diagnostic Clarification',
    ];

    private const CONCERN_ABBREVIATIONS = ['ptsd', 'ocd', 'adhd', 'asd', 'gad'];

    private const CREDENTIAL_WORDS = '/\b(certif\w*|licen[cs]\w*|registered|registration|board|degree|diploma|accredit\w*|credential\w*|fellow\w*|masters?|master s|bachelors?|bachelor s|doctor\w*|graduate|postgraduate|member\w*|chartered|ordained|qualified|bsc|msc|ba|ma|ms|bs)\b/i';
    private const METHOD_WORDS = '/\b(therapy|therapies|therapeutic|psychotherapy|modality|modalities|technique|techniques|intervention|method|approach)\b/i';
    private const TRAINING_WORDS = '/\b(training|trained|course|workshop|seminar)\b/i';
    private const CONCERN_WORDS = '/\b(anxiety|anxious|depression|depressive|low mood|postpartum|post partum|perinatal|prenatal|grief|bereavement|loss|trauma|ptsd|stress|burnout|anger|panic|ocd|bipolar|insomnia|sleep|self harm|suicid\w*|addiction|substance|alcohol|eating|infertility|menopause|divorce|separation|relationship\w*|marriage|parenting|caregiv\w*|loneliness|isolation|phobia\w*|abuse|adhd|autism|neurodiver\w*|dementia|self esteem|confidence)\b/i';

    /** Which section an entry typed under Credentials really belongs to, or null when it reads as a credential. */
    public static function misplacedCredential(?string $entry): ?string
    {
        $raw = trim((string) $entry);
        if ($raw === '') {
            return null;
        }
        $key = self::norm($raw);
        $plain = self::withoutBrackets($raw);
        $plainKey = self::norm($plain);

        if (isset(self::approachNames()[$key]) || isset(self::approachNames()[$plainKey])) {
            return self::APPROACH;
        }
        if (isset(self::trainingNames()[$key]) || isset(self::trainingNames()[$plainKey])) {
            return self::TRAINING;
        }
        if (isset(self::areaNames()[$key]) || isset(self::areaNames()[$plainKey])) {
            return self::AREA;
        }

        // Anything that names a degree, licence or certification is accepted as a credential.
        if (preg_match(self::CREDENTIAL_WORDS, $plainKey) || self::hasCredentialAbbreviation($plain)) {
            return null;
        }

        // "Trauma-Focused CBT": a method short form (CBT, DBT, EMDR …) makes it a method.
        foreach (explode(' ', $plainKey) as $word) {
            if (strlen($word) >= 3 && isset(self::approachNames()[$word])) {
                return self::APPROACH;
            }
        }
        if (preg_match(self::METHOD_WORDS, $plainKey)) {
            return self::APPROACH;
        }
        if (preg_match(self::TRAINING_WORDS, $plainKey)) {
            return self::TRAINING;
        }
        if (preg_match(self::CONCERN_WORDS, $plainKey)) {
            return self::AREA;
        }

        return null;
    }

    /** For "Other" text typed under Treatment Approaches or Specialized Training: true when it names a concern instead. */
    public static function isConcernNotMethod(?string $entry): bool
    {
        $raw = trim((string) $entry);
        if ($raw === '') {
            return false;
        }
        $plainKey = self::norm(self::withoutBrackets($raw));
        if (isset(self::areaNames()[self::norm($raw)]) || isset(self::areaNames()[$plainKey])) {
            return true;
        }
        if (preg_match(self::METHOD_WORDS, $plainKey) || preg_match(self::TRAINING_WORDS, $plainKey) || preg_match(self::CREDENTIAL_WORDS, $plainKey)) {
            return false;
        }
        if (isset(self::approachNames()[$plainKey]) || isset(self::trainingNames()[$plainKey])) {
            return false;
        }

        return (bool) preg_match(self::CONCERN_WORDS, $plainKey);
    }

    /** True when the entry is one of the listed Treatment Approaches / Specialized Training options. */
    public static function isListedOption(?string $entry): bool
    {
        $key = self::norm((string) $entry);

        return isset(self::approachNames()[$key]) || isset(self::trainingNames()[$key]);
    }

    /** "PsyD, LCSW; PMH-C" → ["PsyD", "LCSW", "PMH-C"] */
    public static function splitCredentials(?string $text): array
    {
        return array_values(array_filter(array_map('trim', preg_split('/[,;\n]/', (string) $text) ?: [])));
    }

    /** Message telling the provider where the entry belongs (same wording as the form). */
    public static function message(string $entry, string $category): string
    {
        return match ($category) {
            self::APPROACH => "“{$entry}” is a therapeutic method, not a credential. Select it under Treatment Approaches (step “Professional Expertise”), or add it under Specialized Training if you completed a training in it.",
            self::TRAINING => "“{$entry}” is specialized training, not a credential. Add it under Specialized Training (step “Professional Expertise”).",
            default        => "“{$entry}” is a concern you support, not a credential. Select it under Areas of Support.",
        };
    }

    /** First problem in a list of credential entries, or null. */
    public static function credentialProblem(array $entries): ?string
    {
        foreach ($entries as $entry) {
            if (! is_string($entry)) {
                continue;
            }
            $category = self::misplacedCredential($entry);
            if ($category) {
                return self::message(trim($entry), $category);
            }
        }

        return null;
    }

    /**
     * Public profile: split credentials + certifications into the right sections.
     * Returns ['credentials' => string|null, 'certifications' => [], 'approaches' => [], 'training' => [], 'areas' => []].
     */
    public static function sortForProfile(?string $credentials, array $certifications): array
    {
        $out = ['credentials' => [], 'certifications' => [], 'approaches' => [], 'training' => [], 'areas' => []];
        $bucket = [self::APPROACH => 'approaches', self::TRAINING => 'training', self::AREA => 'areas'];

        foreach (self::splitCredentials($credentials) as $entry) {
            $category = self::misplacedCredential($entry);
            $out[$category ? $bucket[$category] : 'credentials'][] = $entry;
        }
        foreach ($certifications as $entry) {
            if (! is_string($entry) || trim($entry) === '') {
                continue;
            }
            $category = self::misplacedCredential($entry);
            $out[$category ? $bucket[$category] : 'certifications'][] = trim($entry);
        }

        $out['credentials'] = $out['credentials'] ? implode(', ', $out['credentials']) : null;

        return $out;
    }

    /* ------------------------------------------------------------------ */
    /*  Validation rules (StoreProviderRequest / UpdateProviderRequest)     */
    /* ------------------------------------------------------------------ */

    /** "Credentials / License" text: degrees, licences and certifications only. */
    public static function credentialRule(): \Closure
    {
        return function (string $attribute, $value, \Closure $fail): void {
            if (is_string($value) && ($problem = self::credentialProblem(self::splitCredentials($value)))) {
                $fail($problem);
            }
        };
    }

    /** "Certifications & Credentials" list: degrees, licences and certifications only. */
    public static function credentialListRule(): \Closure
    {
        return function (string $attribute, $value, \Closure $fail): void {
            if (is_array($value) && ($problem = self::credentialProblem($value))) {
                $fail($problem);
            }
        };
    }

    /** Treatment Approaches / Specialized Training: "Other" text must not be a concern (those go under Areas of Support). */
    public static function methodListRule(): \Closure
    {
        return function (string $attribute, $value, \Closure $fail): void {
            foreach (is_array($value) ? $value : [] as $entry) {
                if (is_string($entry) && ! self::isListedOption($entry) && self::isConcernNotMethod($entry)) {
                    $fail('“' . trim($entry) . '” is a concern you support, not a therapeutic method or training. Select it under Areas of Support.');

                    return;
                }
            }
        };
    }

    private static function norm(string $s): string
    {
        $s = strtolower(str_replace('&', ' and ', $s));
        $s = preg_replace('/[^a-z0-9]+/', ' ', $s);

        return trim(preg_replace('/\s+/', ' ', $s));
    }

    private static function withoutBrackets(string $s): string
    {
        return trim(preg_replace('/\([^)]*\)/', ' ', $s));
    }

    /** PhD, PsyD, LCSW, PMH-C, MSW … (two or more capitals) that is not a method or concern short form. */
    private static function hasCredentialAbbreviation(string $text): bool
    {
        foreach (preg_split('/[\s,\/]+/', $text) ?: [] as $token) {
            if (! preg_match('/^[A-Za-z][A-Za-z.\-]{1,11}$/', $token) || preg_match_all('/[A-Z]/', $token) < 2) {
                continue;
            }
            $key = self::norm($token);
            if (! isset(self::approachNames()[$key]) && ! isset(self::trainingNames()[$key]) && ! in_array($key, self::CONCERN_ABBREVIATIONS, true)) {
                return true;
            }
        }

        return false;
    }

    private static function names(array $list): array
    {
        $out = [];
        foreach ($list as $item) {
            $out[self::norm($item)] = true;
            $out[self::norm(self::withoutBrackets($item))] = true;
            if (preg_match('/\(([^)]+)\)/', $item, $m)) {
                $out[self::norm($m[1])] = true;
            }
        }
        unset($out['']);

        return $out;
    }

    private static function approachNames(): array
    {
        static $names = null;

        return $names ??= self::names(self::APPROACHES);
    }

    private static function trainingNames(): array
    {
        static $names = null;

        return $names ??= self::names(self::TRAINING_OPTIONS);
    }

    private static function areaNames(): array
    {
        static $names = null;

        return $names ??= self::names(array_merge(self::FORM_AREAS, AreasOfSupport::flatten()));
    }
}
