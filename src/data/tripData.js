export const PACKING_ITEMS = [
    { id: 'keys', label: 'House Keys', emoji: '🔑', required: true },
    { id: 'wallet', label: 'Wallet/Money', emoji: '👛', required: true },
    { id: 'phone', label: 'Phone', emoji: '📱', required: true },
    { id: 'mask', label: 'Face Mask', emoji: '😷', required: false },
    { id: 'water', label: 'Water Bottle', emoji: '💧', required: false },
    { id: 'umbrella', label: 'Umbrella', emoji: '☂️', required: false },
    { id: 'snack', label: 'Snack', emoji: '🍎', required: false },
    { id: 'jacket', label: 'Jacket', emoji: '🧥', required: false },
    { id: 'hat', label: 'Hat', emoji: '🧢', required: false },
    { id: 'sunglasses', label: 'Sunglasses', emoji: '🕶️', required: false },
    { id: 'book', label: 'Book', emoji: '📖', required: false },
    { id: 'headphones', label: 'Headphones', emoji: '🎧', required: false }
];

export const TRANSPORT_OPTIONS = [
    { 
        id: 'walk', 
        label: 'Walk', 
        emoji: '🚶', 
        description: 'Good exercise! Best for close places.',
        tips: ['Look both ways', 'Use crosswalks', 'Stay on the sidewalk']
    },
    { 
        id: 'bus', 
        label: 'Bus', 
        emoji: '🚌', 
        description: 'Great for going far. Remember your bus pass!',
        tips: ['Wait at the stop', 'Have your pass ready', 'Pull the cord to stop']
    },
    { 
        id: 'car', 
        label: 'Car Ride', 
        emoji: '🚗', 
        description: 'Getting a ride from family or friend.',
        tips: ['Buckle your seatbelt', 'Lock the door', 'Thank the driver']
    },
    { 
        id: 'bike', 
        label: 'Bicycle', 
        emoji: '🚲', 
        description: 'Fun and fast! Don\'t forget your helmet.',
        tips: ['Wear a helmet', 'Use hand signals', 'Watch for cars']
    }
];
