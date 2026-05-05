export const JOB_CANDIDATE_STAGES = {
    submitted: {
        key: 'submitted',
        label: 'Submitted',
        color: 'border-blue-300 bg-blue-50',
        badge: 'bg-blue-100 text-blue-800',
        headerBg: 'border-blue-300 bg-blue-50',
    },
    interviewing: {
        key: 'interviewing',
        label: 'Interviewing',
        color: 'border-purple-300 bg-purple-50',
        badge: 'bg-purple-100 text-purple-800',
        headerBg: 'border-purple-300 bg-purple-50',
    },
    offered: {
        key: 'offered',
        label: 'Offered',
        color: 'border-amber-300 bg-amber-50',
        badge: 'bg-amber-100 text-amber-800',
        headerBg: 'border-amber-300 bg-amber-50',
    },
    placed: {
        key: 'placed',
        label: 'Placed',
        color: 'border-green-300 bg-green-50',
        badge: 'bg-green-100 text-green-800',
        headerBg: 'border-green-300 bg-green-50',
    },
    rejected: {
        key: 'rejected',
        label: 'Rejected',
        color: 'border-red-300 bg-red-50',
        badge: 'bg-red-100 text-red-800',
        headerBg: 'border-red-300 bg-red-50',
    },
};


export const JOB_CANDIDATE_STAGE_ORDER = [
    'submitted',
    'interviewing',
    'offered',
    'placed',
    'rejected',
];
