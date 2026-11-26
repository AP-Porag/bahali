import { AREAS_OF_SUPPORT_GROUPS } from '@/constants/supportAreas';

/**
 * Keeps each kind of information in the right part of the provider profile (client review, 25 Nov 2026):
 *   - degrees, licences and certifications           → Credentials
 *   - therapeutic methods                             → Treatment Approaches (or Specialized Training)
 *   - concerns the provider supports                  → Areas of Support
 * e.g. "Cognitive Processing Therapy" or "Postpartum Anxiety & Depression" are not credentials.
 *
 * Mirrors App\Support\ProviderEntryCategory (server-side validation + public profile).
 */
export type EntryCategory = 'approach' | 'training' | 'area';

const norm = (s: string) =>
    s
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');

const withoutBrackets = (s: string) => s.replace(/\([^)]*\)/g, ' ').trim();

/* Therapeutic methods — the Treatment Approaches list plus other common methods and their short forms. */
const APPROACHES = [
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

const TRAINING = [
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

const names = (list: string[]) => {
    const out = new Set<string>();
    list.forEach((item) => {
        out.add(norm(item));
        out.add(norm(withoutBrackets(item)));
        const short = item.match(/\(([^)]+)\)/);
        if (short) out.add(norm(short[1]));
    });
    out.delete('');
    return out;
};

const APPROACH_NAMES = names(APPROACHES);
const TRAINING_NAMES = names(TRAINING);
const AREA_NAMES = names(AREAS_OF_SUPPORT_GROUPS.flatMap((g) => g.items));

/* Words that show an entry IS a credential (degree, licence, certification, membership). */
const CREDENTIAL_WORDS =
    /\b(certif\w*|licen[cs]\w*|registered|registration|board|degree|diploma|accredit\w*|credential\w*|fellow\w*|masters?|master's|bachelors?|bachelor's|doctor\w*|graduate|postgraduate|member\w*|chartered|ordained|qualified|bsc|msc|ba|ma|ms|bs)\b/i;
/* Concern abbreviations that are not credentials. */
const CONCERN_ABBREVIATIONS = new Set(['ptsd', 'ocd', 'adhd', 'asd', 'gad']);
/* An abbreviation such as PhD, PsyD, LCSW, PMH-C or MSW (two or more capitals) that is not a method or a concern. */
const hasCredentialAbbreviation = (text: string) =>
    text
        .split(/[\s,/]+/)
        .filter((token) => /^[A-Za-z][A-Za-z.-]{1,11}$/.test(token) && (token.match(/[A-Z]/g) || []).length >= 2)
        .some((token) => {
            const key = norm(token);
            return !APPROACH_NAMES.has(key) && !TRAINING_NAMES.has(key) && !CONCERN_ABBREVIATIONS.has(key);
        });
const METHOD_WORDS = /\b(therapy|therapies|therapeutic|psychotherapy|modality|modalities|technique|techniques|intervention|method|approach)\b/i;
const TRAINING_WORDS = /\b(training|trained|course|workshop|seminar)\b/i;
const CONCERN_WORDS =
    /\b(anxiety|anxious|depression|depressive|low mood|postpartum|post partum|perinatal|prenatal|grief|bereavement|loss|trauma|ptsd|stress|burnout|anger|panic|ocd|bipolar|insomnia|sleep|self harm|suicid\w*|addiction|substance|alcohol|eating|infertility|menopause|divorce|separation|relationship\w*|marriage|parenting|caregiv\w*|loneliness|isolation|phobia\w*|abuse|adhd|autism|neurodiver\w*|dementia|self esteem|confidence)\b/i;

/** Which section an entry typed under Credentials really belongs to, or null when it reads as a credential. */
export function misplacedCredential(entry: string): EntryCategory | null {
    const raw = entry.trim();
    if (!raw) return null;
    const key = norm(raw);
    const plain = withoutBrackets(raw);

    if (APPROACH_NAMES.has(key) || APPROACH_NAMES.has(norm(plain))) return 'approach';
    if (TRAINING_NAMES.has(key) || TRAINING_NAMES.has(norm(plain))) return 'training';
    if (AREA_NAMES.has(key) || AREA_NAMES.has(norm(plain))) return 'area';

    // Anything that names a degree, licence or certification is accepted as a credential.
    if (CREDENTIAL_WORDS.test(norm(plain)) || hasCredentialAbbreviation(plain)) return null;

    const words = norm(plain);
    // "Trauma-Focused CBT": a method short form (CBT, DBT, EMDR …) makes it a method.
    if (METHOD_WORDS.test(words) || words.split(' ').some((w) => w.length >= 3 && APPROACH_NAMES.has(w))) return 'approach';
    if (TRAINING_WORDS.test(words)) return 'training';
    if (CONCERN_WORDS.test(words)) return 'area';

    return null;
}

/** For "Other" text typed under Treatment Approaches or Specialized Training: true when it names a concern instead. */
export function isConcernNotMethod(entry: string): boolean {
    const raw = entry.trim();
    if (!raw) return false;
    const plain = norm(withoutBrackets(raw));
    if (AREA_NAMES.has(norm(raw)) || AREA_NAMES.has(plain)) return true;
    if (METHOD_WORDS.test(plain) || TRAINING_WORDS.test(plain) || CREDENTIAL_WORDS.test(plain)) return false;
    if (APPROACH_NAMES.has(plain) || TRAINING_NAMES.has(plain)) return false;

    return CONCERN_WORDS.test(plain);
}

/** "PsyD, LCSW; PMH-C" → ["PsyD", "LCSW", "PMH-C"] */
export const splitCredentials = (text: string) =>
    text
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

/** Message shown under the field, telling the provider where the entry belongs. */
export function placementMessage(entry: string, category: EntryCategory): string {
    if (category === 'approach') {
        return `“${entry}” is a therapeutic method, not a credential. Select it under Treatment Approaches (step “Professional Expertise”), or add it under Specialized Training if you completed a training in it.`;
    }
    if (category === 'training') {
        return `“${entry}” is specialized training, not a credential. Add it under Specialized Training (step “Professional Expertise”).`;
    }
    return `“${entry}” is a concern you support, not a credential. Select it under Areas of Support.`;
}

/** First misplaced entry in a credentials list (or free-text credentials), with its message. */
export function credentialProblem(entries: string[]): string | undefined {
    for (const entry of entries) {
        const category = misplacedCredential(entry);
        if (category) return placementMessage(entry, category);
    }
    return undefined;
}
