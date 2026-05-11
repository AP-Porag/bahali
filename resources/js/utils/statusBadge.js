export const getStatusBadge = (status) => {
    switch (status) {
        case 'draft':
            return 'bg-gray-100 text-gray-700 border-gray-300 rounded-sm';

        case 'pending':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300 rounded-sm';

        case 'published':
            return 'bg-green-100 text-green-700 border-green-300 rounded-sm';

        case 'suspended':
            return 'bg-red-100 text-red-700 border-red-300 rounded-sm';

        case 'expired':
            return 'bg-orange-100 text-orange-700 border-orange-300 rounded-sm';

        case 'archived':
            return 'bg-purple-100 text-purple-700 border-purple-300 rounded-sm';

        default:
            return 'bg-gray-100 text-gray-700 border-gray-300 rounded-sm';
    }
};
