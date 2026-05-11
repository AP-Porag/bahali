export const getVerificationBadge = (verication_status) => {
    switch (verication_status) {
        case 'verified':
            return 'bg-green-100 text-green-700 border-green-300 rounded-sm';

        case 'pending':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300 rounded-sm';

        case 'provisional':
            return 'bg-blue-100 text-blue-700 border-blue-300 rounded-sm';

        case 'rejected':
            return 'bg-red-100 text-red-700 border-red-300 rounded-sm';

        case 'revoked':
            return 'bg-gray-200 text-gray-700 border-gray-300 rounded-sm';

        case 'expired':
            return 'bg-orange-100 text-orange-700 border-orange-300 rounded-sm';

        default:
            return 'bg-gray-100 text-gray-700 border-gray-300 rounded-sm';
    }
};
