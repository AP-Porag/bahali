// CANONICAL Areas of Support taxonomy (guide §3.2 — the "final category taxonomy").
// One source of truth for registration (create/edit), the public "See all" modal,
// and profile display. Categories are navigation containers only — matching happens
// on the individual area value (guide §3.3 / §9).

export const AREAS_OF_SUPPORT_GROUPS: { category: string; items: string[] }[] = [
    {
        category: 'Emotional & Mental Health',
        items: [
            'Anxiety & Worry', 'Depression & Low Mood', 'Mood Changes & Bipolar Support', 'ADHD',
            'Obsessive Thoughts & Compulsive Behaviors (OCD)', 'Panic Attacks', 'Stress & Burnout',
            'Managing Emotions', 'Anger & Irritability', 'Sleep & Insomnia', 'Building Self-Confidence',
            'Grief & Loss', 'Self-Harm Recovery',
        ],
    },
    {
        category: 'Children, Teens & Parenting',
        items: [
            'Big Feelings & Emotional Regulation', 'Child Behavioral Challenges', 'Developmental Concerns',
            'ADHD', 'Autism & Neurodiversity Support', 'School & Academic Concerns', 'Social Skills',
            'Self-Confidence', 'Parenting Support', 'Parent-Child Relationship Concerns',
        ],
    },
    {
        category: 'Relationships & Family',
        items: [
            'Relationship Challenges', 'Couples Counseling', 'Premarital Counseling', 'Family Conflict',
            'Blended Family Concerns', 'Communication Challenges', 'Divorce & Separation',
            'Healing from Relationship Abuse',
        ],
    },
    {
        category: 'Pregnancy, Postpartum & Reproductive Health',
        items: [
            'Pregnancy & Prenatal Support', 'Postpartum Emotional Wellness', 'Postpartum Anxiety',
            'Postpartum Depression', 'Pregnancy & Infant Loss', 'Infertility', 'Menopause & Midlife',
        ],
    },
    {
        category: 'Older Adults, Memory & Caregiving',
        items: [
            'Healthy Aging & Older Adult Well-Being', 'Memory & Cognitive Concerns',
            "Alzheimer's & Dementia Support", 'Caregiver Support', 'Retirement & Life Changes',
            'Grief & Loss in Later Life', 'Care Planning & Aging Transitions',
        ],
    },
    {
        category: 'Trauma & Recovery',
        items: [
            'Trauma & PTSD', 'Community Violence', 'Disaster Recovery', 'Relationship Abuse & Trauma',
            'Vicarious Trauma', 'Military & Service-Related Trauma', 'First Responder Support',
            'Psychological First Aid',
        ],
    },
    {
        category: 'Life Changes, Identity & Belonging',
        items: [
            'Life Changes & Transitions', 'Career Changes', 'Identity & Purpose',
            'Cultural Identity & Belonging', 'Caribbean & Diaspora Wellness',
            'Immigration & Cultural Adjustment', 'Racism & Discrimination', 'LGBTQIA+ Affirming Support',
            "Men's Emotional Wellness",
        ],
    },
    {
        category: 'Health, Substance Use & Wellness',
        items: [
            'Chronic Illness Support', 'Chronic Pain & Health-Related Stress', 'Alcohol Use',
            'Substance Use', 'Lifestyle & Behavior Change',
        ],
    },
    {
        category: 'Faith, Community & Helping Professionals',
        items: [
            'Faith & Spiritual Support', 'Faith Leader & Ministry Support', 'Helping Professional Wellness',
            'First Responder Support', 'Vicarious Trauma', 'Community Wellness & Resilience',
        ],
    },
    {
        category: 'Assessment & Evaluation',
        items: [
            'Psychological Testing & Evaluation', 'Cognitive Assessment', 'Memory Assessment',
            'ADHD Assessment', 'Learning & Academic Assessment', 'Developmental Assessment',
            'Autism Assessment', 'Diagnostic Clarification',
        ],
    },
];

// Six common concerns on the opening screen (guide §2.2 / mockup 2).
// Most are single areas; "Relationships & Family" is a category shortcut that
// matches ANY area in that category — so each chip carries its match value(s).
export const COMMON_SUPPORT_AREAS: { label: string; areas: string[] }[] = [
    { label: 'Anxiety & Worry', areas: ['Anxiety & Worry'] },
    { label: 'Depression & Low Mood', areas: ['Depression & Low Mood'] },
    { label: 'Trauma & PTSD', areas: ['Trauma & PTSD'] },
    { label: 'Grief & Loss', areas: ['Grief & Loss'] },
    { label: 'Stress & Burnout', areas: ['Stress & Burnout'] },
    {
        label: 'Relationships & Family',
        areas: AREAS_OF_SUPPORT_GROUPS.find((g) => g.category === 'Relationships & Family')!.items,
    },
];

// Flat list of every canonical area (for the modal's cross-category search).
export const ALL_SUPPORT_AREAS = AREAS_OF_SUPPORT_GROUPS.flatMap((g) => g.items);
