<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Path A — remap existing provider_support_areas rows from the OLD registration
     * taxonomy to the canonical guide taxonomy (§3.2). Area strings not found in the
     * map are LEFT UNTOUCHED (no data loss). Category is re-derived from the canonical
     * area so the admin verification view stays consistent.
     *
     * ⚠️ REVIEW LEGACY_AREA_MAP below — a few old strings have no exact canonical twin
     * and were mapped to the nearest fit. Adjust any line you disagree with, then run.
     */
    public function up(): void
    {
        DB::transaction(function () {
            $rows = DB::table('provider_support_areas')->get(['id', 'area']);

            foreach ($rows as $row) {
                $old = trim((string) $row->area);
                if ($old === '') {
                    continue;
                }

                // Already canonical? normalise its category and move on.
                $canonical = self::LEGACY_AREA_MAP[$old] ?? ($this->areaToCategory($old) ? $old : null);
                if ($canonical === null) {
                    continue; // unknown/custom "Other" area — leave as-is.
                }

                $category = $this->areaToCategory($canonical);
                if ($category === null) {
                    continue;
                }

                DB::table('provider_support_areas')
                    ->where('id', $row->id)
                    ->update(['area' => $canonical, 'category' => $category]);
            }
        });
    }

    public function down(): void
    {
        // One-way remap — reversing string-level data isn't reliable. No-op.
    }

    /** Resolve which canonical category an area belongs to (null if not canonical). */
    private function areaToCategory(string $area): ?string
    {
        foreach (self::CANONICAL as $category => $areas) {
            if (in_array($area, $areas, true)) {
                return $category;
            }
        }
        return null;
    }

    /** Canonical taxonomy (mirror of supportAreas.ts). */
    private const CANONICAL = [
        'Emotional & Mental Health' => ['Anxiety & Worry', 'Depression & Low Mood', 'Mood Changes & Bipolar Support', 'ADHD', 'Obsessive Thoughts & Compulsive Behaviors (OCD)', 'Panic Attacks', 'Stress & Burnout', 'Managing Emotions', 'Anger & Irritability', 'Sleep & Insomnia', 'Building Self-Confidence', 'Grief & Loss', 'Self-Harm Recovery'],
        'Children, Teens & Parenting' => ['Big Feelings & Emotional Regulation', 'Child Behavioral Challenges', 'Developmental Concerns', 'ADHD', 'Autism & Neurodiversity Support', 'School & Academic Concerns', 'Social Skills', 'Self-Confidence', 'Parenting Support', 'Parent-Child Relationship Concerns'],
        'Relationships & Family' => ['Relationship Challenges', 'Couples Counseling', 'Premarital Counseling', 'Family Conflict', 'Blended Family Concerns', 'Communication Challenges', 'Divorce & Separation', 'Healing from Relationship Abuse'],
        'Pregnancy, Postpartum & Reproductive Health' => ['Pregnancy & Prenatal Support', 'Postpartum Emotional Wellness', 'Postpartum Anxiety', 'Postpartum Depression', 'Pregnancy & Infant Loss', 'Infertility', 'Menopause & Midlife'],
        'Older Adults, Memory & Caregiving' => ['Healthy Aging & Older Adult Well-Being', 'Memory & Cognitive Concerns', "Alzheimer's & Dementia Support", 'Caregiver Support', 'Retirement & Life Changes', 'Grief & Loss in Later Life', 'Care Planning & Aging Transitions'],
        'Trauma & Recovery' => ['Trauma & PTSD', 'Community Violence', 'Disaster Recovery', 'Relationship Abuse & Trauma', 'Vicarious Trauma', 'Military & Service-Related Trauma', 'First Responder Support', 'Psychological First Aid'],
        'Life Changes, Identity & Belonging' => ['Life Changes & Transitions', 'Career Changes', 'Identity & Purpose', 'Cultural Identity & Belonging', 'Caribbean & Diaspora Wellness', 'Immigration & Cultural Adjustment', 'Racism & Discrimination', 'LGBTQIA+ Affirming Support', "Men's Emotional Wellness"],
        'Health, Substance Use & Wellness' => ['Chronic Illness Support', 'Chronic Pain & Health-Related Stress', 'Alcohol Use', 'Substance Use', 'Lifestyle & Behavior Change'],
        'Faith, Community & Helping Professionals' => ['Faith & Spiritual Support', 'Faith Leader & Ministry Support', 'Helping Professional Wellness', 'First Responder Support', 'Vicarious Trauma', 'Community Wellness & Resilience'],
        'Assessment & Evaluation' => ['Psychological Testing & Evaluation', 'Cognitive Assessment', 'Memory Assessment', 'ADHD Assessment', 'Learning & Academic Assessment', 'Developmental Assessment', 'Autism Assessment', 'Diagnostic Clarification'],
    ];

    /**
     * OLD (registration/seed) area string  =>  CANONICAL area string.
     * Identity mappings (same string in both) are omitted — handled automatically.
     * ⚠️ Nearest-fit lines are marked; review these.
     */
    private const LEGACY_AREA_MAP = [
        // Emotional & Mental Health
        'Mood Changes'                       => 'Mood Changes & Bipolar Support',
        'Trauma & Recovery'                  => 'Trauma & PTSD',
        'Self-Harm'                          => 'Self-Harm Recovery',
        'Suicidal Thoughts & Behaviors'      => 'Self-Harm Recovery',   // nearest
        'Suicide Prevention'                 => 'Self-Harm Recovery',   // nearest
        'Crisis Support'                     => 'Trauma & PTSD',        // nearest (crisis excluded as a filter §3.3)
        'Stress Management'                  => 'Stress & Burnout',
        'Workplace Stress'                   => 'Stress & Burnout',
        'Managing Anger'                     => 'Anger & Irritability',

        // Children, Teens & Parenting
        'Autism & Neurodiversity'            => 'Autism & Neurodiversity Support',
        'School Challenges'                  => 'School & Academic Concerns',
        'Academic Stress'                    => 'School & Academic Concerns',
        'College & University Adjustment'    => 'School & Academic Concerns',
        'Bullying'                           => 'School & Academic Concerns', // nearest
        'Teen Emotional Wellness'            => 'Big Feelings & Emotional Regulation', // nearest
        'Parent-Child Relationships'         => 'Parent-Child Relationship Concerns',
        'Childhood Trauma'                   => 'Trauma & PTSD',
        'Building Self-Confidence'           => 'Building Self-Confidence', // stays cat1 (kept)

        // Relationships & Family
        'Couples & Relationship Counseling'  => 'Couples Counseling',
        'Marriage Counseling'                => 'Couples Counseling',
        'Blended Families'                   => 'Blended Family Concerns',
        'Sex Therapy'                        => 'Relationship Challenges', // nearest
        'Co-Parenting'                       => 'Family Conflict',        // nearest
        'Fatherhood'                         => 'Parenting Support',      // nearest

        // Pregnancy / Postpartum
        'Pregnancy Support'                  => 'Pregnancy & Prenatal Support',

        // Older Adults
        'Memory Concerns'                    => 'Memory & Cognitive Concerns',
        'Dementia Support'                   => "Alzheimer's & Dementia Support",
        "Alzheimer's Disease Support"        => "Alzheimer's & Dementia Support",
        'Coping with Chronic Illness'        => 'Chronic Illness Support',

        // Trauma & Recovery
        'Trauma'                             => 'Trauma & PTSD',
        'PTSD'                               => 'Trauma & PTSD',
        'Sexual Assault & Sexual Trauma'     => 'Relationship Abuse & Trauma', // nearest
        'Domestic & Intimate Partner Violence' => 'Relationship Abuse & Trauma',
        'Disaster & Displacement'            => 'Disaster Recovery',
        'Support for First Responders'       => 'First Responder Support',

        // Life Changes, Identity & Belonging
        'Identity & Purpose'                 => 'Identity & Purpose',
        'Immigration & Adjusting to a New Culture' => 'Immigration & Cultural Adjustment',
        'Experiences of Racism & Discrimination'   => 'Racism & Discrimination',
        'LGBTQIA+ Support'                   => 'LGBTQIA+ Affirming Support',

        // Health, Substance Use & Wellness
        'Living with Chronic Illness'        => 'Chronic Illness Support',
        'Living with Chronic Pain'           => 'Chronic Pain & Health-Related Stress',
        'Health-Related Anxiety'             => 'Chronic Pain & Health-Related Stress', // nearest
        'Lifestyle Changes'                  => 'Lifestyle & Behavior Change',
        'Emotional Eating & Weight Concerns' => 'Lifestyle & Behavior Change', // nearest
        'Recovery Support'                   => 'Substance Use',   // nearest
        'Relapse Prevention'                 => 'Substance Use',   // nearest

        // Work / helping professionals -> Faith, Community & Helping Professionals
        'Compassion Fatigue'                 => 'Helping Professional Wellness',
        'Support for Helping Professionals'  => 'Helping Professional Wellness',
        'Leadership & Executive Wellness'    => 'Career Changes', // nearest (cat7)

        // Culture, Faith & Community
        'Church & Ministry Support'          => 'Faith Leader & Ministry Support',
    ];
};
