<?php

namespace App\Support;

/**
 * Bahali Connect search vocabulary (Marsha's handoff, 18 November 2026: HelpPage.jsx, directoryData.js).
 *
 * The design shows 13 plain-language concerns. Each one is mapped here to the approved
 * areas of support providers select (resources/js/constants/supportAreas.ts), so search only
 * matches what a provider explicitly listed — nothing is inferred from biography or identity.
 * "Type of service" uses the same 16 professional titles as the provider application.
 *
 * Review the topic → area mapping with Marsha before launch.
 */
class ConnectTaxonomy
{
    /** name, short description, search aliases, matching approved areas of support. */
    public const TOPICS = [
        ['Stress & burnout', 'Support when responsibilities feel heavy.', 'work overwhelmed exhaustion',
            ['Stress & Burnout', 'Helping Professional Wellness']],
        ['Anxiety & worry', 'When worry feels difficult to manage.', 'anxious nervous panic',
            ['Anxiety & Worry', 'Panic Attacks', 'Obsessive Thoughts & Compulsive Behaviors (OCD)']],
        ['Depression', 'Support with low mood or depression.', 'sad sadness low mood',
            ['Depression & Low Mood', 'Mood Changes & Bipolar Support']],
        ['Grief & loss', 'Support after a loss or major change.', 'bereavement death',
            ['Grief & Loss', 'Grief & Loss in Later Life', 'Pregnancy & Infant Loss']],
        ['Relationships & family', 'Support for relationships and family life.', 'couples marriage parenting',
            ['Relationship Challenges', 'Couples Counseling', 'Premarital Counseling', 'Family Conflict', 'Blended Family Concerns',
                'Communication Challenges', 'Divorce & Separation', 'Healing from Relationship Abuse']],
        ['Caregiver stress', 'Space for you while you care for someone else.', 'caregiving aging parent',
            ['Caregiver Support', 'Care Planning & Aging Transitions']],
        ['Trauma & PTSD', 'Explore providers with trauma experience.', 'traumatic ptsd',
            ['Trauma & PTSD', 'Relationship Abuse & Trauma', 'Community Violence', 'Disaster Recovery', 'Vicarious Trauma',
                'Military & Service-Related Trauma', 'Psychological First Aid']],
        ['Parenting', 'Explore guidance for parents and caregivers.', 'parent children child family',
            ['Parenting Support', 'Parent-Child Relationship Concerns', 'Child Behavioral Challenges', 'Big Feelings & Emotional Regulation']],
        ['Substance use & recovery', 'Support with alcohol or other substance use.', 'addiction drinking drugs recovery',
            ['Alcohol Use', 'Substance Use']],
        ['Sleep concerns', 'Explore support when sleep feels difficult.', 'insomnia tired sleeping',
            ['Sleep & Insomnia']],
        ['Pregnancy & postpartum', 'Support through pregnancy and life after birth.', 'perinatal mother motherhood new parent',
            ['Pregnancy & Prenatal Support', 'Postpartum Emotional Wellness', 'Postpartum Anxiety', 'Postpartum Depression']],
        ['Memory & aging', 'Explore support for memory changes and later life.', 'older adult cognitive dementia senior',
            ['Memory & Cognitive Concerns', "Alzheimer's & Dementia Support", 'Healthy Aging & Older Adult Well-Being', 'Retirement & Life Changes']],
        ['Attention & ADHD', 'Explore support with attention and daily routines.', 'focus concentration adhd',
            ['ADHD']],
    ];

    /** "Type of service" groups → professional titles stored in providers.professional_title. */
    public const ROLE_GROUPS = [
        'Therapy and psychological care' => [
            'Clinical Psychologist', 'Neuropsychologist', 'School Psychologist', 'Clinical Social Worker',
            'Mental Health Counselor', 'Marriage and Family Therapist',
        ],
        'Medical and medication care' => [
            'Psychiatrist', 'Psychiatric Mental Health Nurse Practitioner', 'Addiction Medicine Specialist',
            'Developmental-Behavioral Pediatrician',
        ],
        'Specialized support' => [
            'Board Certified Behavior Analyst (BCBA)', 'Substance Use Counselor',
        ],
        'Community, peer and faith-based support' => [
            'Pastoral Counselor', 'Peer Support Specialist', 'Community Health Worker', 'Parent Coach',
        ],
    ];

    /** Short label shown above a provider's name on cards and profiles. */
    private const GROUP_LABELS = [
        'Therapy and psychological care'           => 'Therapy & psychological care',
        'Medical and medication care'              => 'Medical & medication care',
        'Specialized support'                      => 'Specialized support',
        'Community, peer and faith-based support'  => 'Community, peer & faith-based support',
    ];

    private const TYPE_LABELS = [
        'organization'      => 'Organization',
        'support_group'     => 'Support group',
        'faith_based'       => 'Faith-based organization',
        'community_program' => 'Community program',
    ];

    /** Topics for the frontend (no area lists — those stay on the server). */
    public static function topics(): array
    {
        return array_map(fn ($t) => ['name' => $t[0], 'description' => $t[1], 'terms' => $t[2]], self::TOPICS);
    }

    public static function isTopic(string $name): bool
    {
        return $name !== '' && in_array($name, array_column(self::TOPICS, 0), true);
    }

    /** Approved areas of support that match a topic. */
    public static function areasFor(string $topic): array
    {
        foreach (self::TOPICS as $t) {
            if ($t[0] === $topic) {
                return $t[3];
            }
        }
        return [];
    }

    public static function isRole(string $value): bool
    {
        return $value !== '' && (isset(self::ROLE_GROUPS[$value]) || in_array($value, array_merge(...array_values(self::ROLE_GROUPS)), true));
    }

    /** A group name → all of its titles; a single title → itself. */
    public static function professionsFor(string $value): array
    {
        if ($value === '') {
            return [];
        }
        return self::ROLE_GROUPS[$value] ?? [$value];
    }

    /** Card/profile label: the service group of the first professional title, or the organisation type. */
    public static function kindLabel(?string $providerType, array $titles): string
    {
        if ($providerType && isset(self::TYPE_LABELS[$providerType])) {
            return self::TYPE_LABELS[$providerType];
        }
        foreach ($titles as $title) {
            foreach (self::ROLE_GROUPS as $group => $roles) {
                if (in_array($title, $roles, true)) {
                    return self::GROUP_LABELS[$group];
                }
            }
        }
        return 'Support provider';
    }
}
