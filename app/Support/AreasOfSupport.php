<?php

namespace App\Support;

class AreasOfSupport
{
    /**
     * Single source of truth for the grouped Areas of Support taxonomy.
     * Mirror this with the frontend AREAS_OF_SUPPORT_GROUPS.
     * To add an area later, just append it under the right category —
     * nothing else needs to change.
     */
    public const GROUPS = [
        'Mental & Emotional Well-Being' => [
            'Anxiety & Worry',
            'Depression & Low Mood',
            'Stress & Burnout',
            'Trauma & Recovery',
            'Grief & Loss',
            'Anger & Irritability',
            'Building Self-Confidence',
            'Managing Emotions',
            'Life Changes & Transitions',
            'Panic Attacks',
            'Obsessive Thoughts & Compulsive Behaviors (OCD)',
            'Mood Changes',
        ],
        'Relationships & Family' => [
            'Couples & Relationship Counseling',
            'Marriage Counseling',
            'Premarital Counseling',
            'Parenting Support',
            'Co-Parenting',
            'Family Conflict',
            'Divorce & Separation',
            'Blended Families',
            'Communication Challenges',
            'Caregiver Support',
            'Healing from Relationship Abuse',
        ],
        'Children, Teens & Families' => [
            'Child Behavioral Challenges',
            'Teen Emotional Wellness',
            'ADHD',
            'Autism & Neurodiversity',
            'School Challenges',
            'Bullying',
            'Social Skills',
            'Parent-Child Relationships',
            'Childhood Trauma',
            'Big Feelings & Emotional Regulation',
        ],
        "Women's Health & Wellness" => [
            'Pregnancy Support',
            'Pregnancy & Infant Loss',
            'Postpartum Depression',
            'Postpartum Anxiety',
            'Infertility',
            'Menopause & Midlife',
        ],
        "Men's Health & Wellness" => [
            "Men's Emotional Wellness",
            'Fatherhood',
            'Relationship Challenges',
            'Managing Anger',
            'Identity & Purpose',
        ],
        'Older Adults & Aging' => [
            'Healthy Aging & Older Adult Well-Being',
            'Memory Concerns',
            'Dementia Support',
            "Alzheimer's Disease Support",
            'Retirement & Life Changes',
            'Coping with Chronic Illness',
            'Grief & Loss in Later Life',
        ],
        'Trauma, Crisis & Recovery' => [
            'Trauma',
            'PTSD',
            'Childhood Trauma',
            'Sexual Assault & Sexual Trauma',
            'Domestic & Intimate Partner Violence',
            'Military & Service-Related Trauma',
            'Disaster & Displacement',
            'Community Violence',
            'Self-Harm',
            'Suicidal Thoughts & Behaviors',
        ],
        'Health & Everyday Wellness' => [
            'Living with Chronic Illness',
            'Living with Chronic Pain',
            'Sleep & Insomnia',
            'Health-Related Anxiety',
            'Stress Management',
            'Lifestyle Changes',
            'Emotional Eating & Weight Concerns',
        ],
        'Substance Use & Recovery' => [
            'Alcohol Use',
            'Substance Use',
            'Recovery Support',
            'Relapse Prevention',
        ],
        'Work, School & Daily Life' => [
            'Workplace Stress',
            'Compassion Fatigue',
            'Vicarious Trauma',
            'Leadership & Executive Wellness',
            'Career Changes',
            'Academic Stress',
            'College & University Adjustment',
        ],
        'Culture, Faith & Community' => [
            'Caribbean & Diaspora Wellness',
            'Faith & Spiritual Support',
            'Psychological First Aid',
            'Church & Ministry Support',
            'Immigration & Adjusting to a New Culture',
            'Cultural Identity & Belonging',
            'Experiences of Racism & Discrimination',
            'LGBTQIA+ Support',
        ],
    ];

    /** Flat list of every valid area — used for Rule::in validation. */
    public static function flatten(): array
    {
        return array_merge(...array_values(self::GROUPS));
    }

    /** Reverse map: area => category (memoized). */
    public static function reverseMap(): array
    {
        static $map = null;
        if ($map !== null) {
            return $map;
        }
        $map = [];
        foreach (self::GROUPS as $category => $areas) {
            foreach ($areas as $area) {
                $map[$area] = $category;
            }
        }
        return $map;
    }

    /** Category for a given area, or null if unknown. */
    public static function categoryFor(string $area): ?string
    {
        return self::reverseMap()[$area] ?? null;
    }
    /** All category names — used to validate submitted "Other" categories. */
    public static function categories(): array
    {
        return array_keys(self::GROUPS);
    }
}
