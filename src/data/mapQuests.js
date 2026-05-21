// Map Quest scenarios — students follow prose directions on a 4x4 town grid
// and tap the destination tile. Cell ids use the `rXcY` convention so the
// component can parse row/column for 2D keyboard navigation. Map convention:
// north = top of screen, south = bottom, east = right, west = left.
// The component renders a compass legend above the grid for reference.

/**
 * @typedef {Object} MapQuestCell
 * @property {string} id        - 'rXcY' (row, col indices 0..gridSize-1)
 * @property {'place' | 'road'} type
 * @property {string} [label]   - shown on place tiles
 * @property {string} [emoji]   - shown on place tiles
 */

/**
 * @typedef {Object} MapQuestScenario
 * @property {number} id
 * @property {string} text       - direction prose (3rd-grade reading level)
 * @property {string} startId    - cell id marked "You are here"
 * @property {string} correctId  - destination cell id
 * @property {MapQuestCell[]} grid - 16 cells, row-major (r0c0 .. r3c3)
 */

const road = (id) => ({ id, type: /** @type {const} */ ('road') });
const place = (id, label, emoji) => ({ id, type: /** @type {const} */ ('place'), label, emoji });

/** @type {MapQuestScenario[]} */
export const MAP_QUESTS = [
    {
        id: 1,
        text: 'You are at home. Use the compass to help you: north is up. Walk north two blocks. Where are you?',
        startId: 'r3c1',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'Park', '🌳'),    place('r0c1', 'School', '🏫'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            place('r1c0', 'Hospital', '🏥'), place('r1c1', 'Bakery', '🥖'),    place('r1c2', 'Store', '🏪'),      place('r1c3', 'Bus Stop', '🚌'),
            road('r2c0'),                    road('r2c1'),                     road('r2c2'),                       road('r2c3'),
            place('r3c0', 'Pharmacy', '💊'), place('r3c1', 'Home', '🏠'),      place('r3c2', 'Café', '☕'),        place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 2,
        text: 'After school, walk south three blocks. Then walk east one block. Where do you arrive?',
        startId: 'r0c0',
        correctId: 'r3c1',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    place('r1c1', 'Café', '☕'),      road('r1c2'),                       place('r1c3', 'Store', '🏪'),
            road('r2c0'),                    road('r2c1'),                     place('r2c2', 'Bus Stop', '🚌'),    road('r2c3'),
            road('r3c0'),                    place('r3c1', 'Park', '🌳'),      place('r3c2', 'Pharmacy', '💊'),    place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 3,
        text: 'Find the place that is directly east of the hospital. Which place is there?',
        startId: 'r3c0',
        correctId: 'r1c2',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Store', '🏪'),       place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'Hospital', '🏥'),  place('r1c2', 'Library', '📚'),     road('r1c3'),
            place('r2c0', 'Bakery', '🥖'),   road('r2c1'),                     road('r2c2'),                        place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Home', '🏠'),     road('r3c1'),                     place('r3c2', 'Café', '☕'),         place('r3c3', 'Bus Stop', '🚌')
        ]
    },
    {
        id: 4,
        text: 'Mom needs medicine. From home, walk east two blocks. Then walk north one block. Where do you go?',
        startId: 'r3c0',
        correctId: 'r2c2',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    place('r1c1', 'Bakery', '🥖'),    road('r1c2'),                       place('r1c3', 'Store', '🏪'),
            place('r2c0', 'Hospital', '🏥'), road('r2c1'),                     place('r2c2', 'Pharmacy', '💊'),    road('r2c3'),
            place('r3c0', 'Home', '🏠'),     road('r3c1'),                     road('r3c2'),                       place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 5,
        text: 'You want to mail a letter. From school, walk south two blocks. Then walk east two blocks. Where do you arrive?',
        startId: 'r0c0',
        correctId: 'r2c2',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    place('r1c1', 'Café', '☕'),      road('r1c2'),                       place('r1c3', 'Store', '🏪'),
            road('r2c0'),                    road('r2c1'),                     place('r2c2', 'Post Office', '📮'), place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Hospital', '🏥'), road('r3c1'),                     place('r3c2', 'Bus Stop', '🚌'),    place('r3c3', 'Park', '🌳')
        ]
    },
    {
        id: 6,
        text: 'You just left the bakery. Walk south three blocks. Where are you now?',
        startId: 'r0c1',
        correctId: 'r3c1',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    road('r1c1'),                     place('r1c2', 'Café', '☕'),       place('r1c3', 'Store', '🏪'),
            place('r2c0', 'School', '🏫'),   road('r2c1'),                     place('r2c2', 'Hospital', '🏥'),    road('r2c3'),
            place('r3c0', 'Pharmacy', '💊'), place('r3c1', 'Home', '🏠'),      road('r3c2'),                       place('r3c3', 'Bus Stop', '🚌')
        ]
    },
    {
        id: 7,
        text: 'Find the place where you can buy fresh bread. It is one block north and one block east of home.',
        startId: 'r2c0',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    place('r1c1', 'Bakery', '🥖'),    road('r1c2'),                       place('r1c3', 'Store', '🏪'),
            place('r2c0', 'Home', '🏠'),     road('r2c1'),                     place('r2c2', 'Pharmacy', '💊'),    road('r2c3'),
            road('r3c0'),                    place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Café', '☕'),        place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 8,
        text: 'You need to catch the bus. From the café, walk south two blocks. Where do you go?',
        startId: 'r0c2',
        correctId: 'r2c2',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Café', '☕'),       place('r0c3', 'Bank', '🏦'),
            place('r1c0', 'Bakery', '🥖'),   road('r1c1'),                     road('r1c2'),                       place('r1c3', 'Library', '📚'),
            place('r2c0', 'Hospital', '🏥'), road('r2c1'),                     place('r2c2', 'Bus Stop', '🚌'),    road('r2c3'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Pharmacy', '💊'),  place('r3c2', 'Store', '🏪'),       place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 9,
        text: 'Look at the top row. Find the place that is between the bakery and the bank.',
        startId: 'r3c0',
        correctId: 'r0c1',
        grid: [
            place('r0c0', 'Bakery', '🥖'),   place('r0c1', 'School', '🏫'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            road('r1c0'),                    road('r1c1'),                     place('r1c2', 'Café', '☕'),       place('r1c3', 'Store', '🏪'),
            place('r2c0', 'Hospital', '🏥'), place('r2c1', 'Pharmacy', '💊'),  road('r2c2'),                       place('r2c3', 'Park', '🌳'),
            place('r3c0', 'Home', '🏠'),     road('r3c1'),                     place('r3c2', 'Bus Stop', '🚌'),    place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 10,
        text: 'From the park, walk north two blocks. Then walk west one block. What place is there?',
        startId: 'r3c2',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Store', '🏪'),
            place('r1c0', 'Café', '☕'),     place('r1c1', 'Library', '📚'),   road('r1c2'),                       place('r1c3', 'Post Office', '📮'),
            place('r2c0', 'Hospital', '🏥'), road('r2c1'),                     road('r2c2'),                       place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Park', '🌳'),        road('r3c3')
        ]
    },
    {
        id: 11,
        text: 'Sara is at school. She walks east one block, then south two blocks. Where does Sara end up?',
        startId: 'r0c0',
        correctId: 'r2c1',
        grid: [
            place('r0c0', 'School', '🏫'),   road('r0c1'),                     place('r0c2', 'Bakery', '🥖'),    place('r0c3', 'Bank', '🏦'),
            place('r1c0', 'Park', '🌳'),     road('r1c1'),                     place('r1c2', 'Café', '☕'),       place('r1c3', 'Store', '🏪'),
            place('r2c0', 'Hospital', '🏥'), place('r2c1', 'Library', '📚'),   road('r2c2'),                       place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Post Office', '📮'), place('r3c3', 'Museum', '🏛️')
        ]
    },
    {
        id: 12,
        text: 'From the gym, walk north one block. Then walk east three blocks. What place is there?',
        startId: 'r3c0',
        correctId: 'r2c3',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Park', '🌳'),
            road('r1c0'),                    place('r1c1', 'Café', '☕'),      place('r1c2', 'Pharmacy', '💊'),    place('r1c3', 'Library', '📚'),
            road('r2c0'),                    road('r2c1'),                     road('r2c2'),                       place('r2c3', 'Museum', '🏛️'),
            place('r3c0', 'Gym', '💪'),      place('r3c1', 'Home', '🏠'),      place('r3c2', 'Bus Stop', '🚌'),    place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 13,
        text: 'You are at home. Walk north two blocks. Then walk east one block. Where do you end up?',
        startId: 'r3c0',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'Gym', '💪'),       road('r1c2'),                       place('r1c3', 'Library', '📚'),
            road('r2c0'),                    place('r2c1', 'Pharmacy', '💊'),  place('r2c2', 'Museum', '🏛️'),     road('r2c3'),
            place('r3c0', 'Home', '🏠'),     road('r3c1'),                     place('r3c2', 'Café', '☕'),        place('r3c3', 'Store', '🏪')
        ]
    },
    {
        id: 14,
        text: 'Find the place that is directly west of the museum. What place is there?',
        startId: 'r3c0',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Park', '🌳'),      place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'Movie Theater', '🎬'),   place('r1c2', 'Museum', '🏛️'),     road('r1c3'),
            place('r2c0', 'Hospital', '🏥'), road('r2c1'),                     place('r2c2', 'Pharmacy', '💊'),    place('r2c3', 'Café', '☕'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), road('r3c2'),                       place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 15,
        text: 'Start at home. Walk north one block. Then walk east two blocks. Then walk south one block. Where are you?',
        startId: 'r2c0',
        correctId: 'r2c2',
        grid: [
            place('r0c0', 'Bakery', '🥖'),   place('r0c1', 'Park', '🌳'),      place('r0c2', 'School', '🏫'),     place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    road('r1c1'),                     road('r1c2'),                       place('r1c3', 'Library', '📚'),
            place('r2c0', 'Home', '🏠'),     road('r2c1'),                     place('r2c2', 'Dentist', '🦷'),    place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Café', '☕'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Post Office', '📮'), place('r3c3', 'Hospital', '🏥')
        ]
    },
    {
        id: 16,
        text: 'Mom is hurt and needs a doctor right away. From home, find the hospital on the map.',
        startId: 'r3c3',
        correctId: 'r0c0',
        grid: [
            place('r0c0', 'Hospital', '🏥'), road('r0c1'),                     place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'School', '🏫'),
            place('r1c0', 'Pharmacy', '💊'), place('r1c1', 'Bank', '🏦'),      place('r1c2', 'Café', '☕'),       place('r1c3', 'Post Office', '📮'),
            place('r2c0', 'Library', '📚'),  road('r2c1'),                     place('r2c2', 'Gym', '💪'),        place('r2c3', 'Bus Stop', '🚌'),
            road('r3c0'),                    place('r3c1', 'Pet Store', '🐾'), place('r3c2', 'Store', '🏪'),      place('r3c3', 'Home', '🏠')
        ]
    },
    {
        id: 17,
        text: 'It is a hot day and you want to swim. From home, walk south two blocks. Then walk east one block. Where do you arrive?',
        startId: 'r1c0',
        correctId: 'r3c1',
        grid: [
            place('r0c0', 'Bakery', '🥖'),   place('r0c1', 'School', '🏫'),    place('r0c2', 'Park', '🌳'),       place('r0c3', 'Bank', '🏦'),
            place('r1c0', 'Home', '🏠'),     place('r1c1', 'Café', '☕'),      place('r1c2', 'Museum', '🏛️'),     place('r1c3', 'Library', '📚'),
            road('r2c0'),                    place('r2c1', 'Bus Stop', '🚌'), road('r2c2'),                       place('r2c3', 'Pharmacy', '💊'),
            road('r3c0'),                    place('r3c1', 'Swimming Pool', '🏊'), place('r3c2', 'Gym', '💪'),    place('r3c3', 'Store', '🏪')
        ]
    },
    {
        id: 18,
        text: 'From home, walk north one block. Then east two blocks. Then south one block. Then west one block. Where are you?',
        startId: 'r2c0',
        correctId: 'r2c1',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'Museum', '🏛️'),   road('r1c2'),                       place('r1c3', 'Library', '📚'),
            place('r2c0', 'Home', '🏠'),     place('r2c1', 'Hospital', '🏥'),  road('r2c2'),                       place('r2c3', 'Pharmacy', '💊'),
            place('r3c0', 'Café', '☕'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Post Office', '📮'), place('r3c3', 'Store', '🏪')
        ]
    },
    {
        id: 19,
        text: 'Find the place between the park and the museum. They are next to each other in the same row.',
        startId: 'r3c0',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Bakery', '🥖'),    place('r0c2', 'Bank', '🏦'),       place('r0c3', 'Library', '📚'),
            place('r1c0', 'Park', '🌳'),     place('r1c1', 'Gym', '💪'),       place('r1c2', 'Museum', '🏛️'),     place('r1c3', 'Post Office', '📮'),
            place('r2c0', 'Hospital', '🏥'), place('r2c1', 'Pharmacy', '💊'),  road('r2c2'),                       place('r2c3', 'Bus Stop', '🚌'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Café', '☕'),      place('r3c2', 'Store', '🏪'),      place('r3c3', 'Movie Theater', '🎬')
        ]
    },
    {
        id: 20,
        text: 'Find the place directly south of the school. It is a fun place for kids to play.',
        startId: 'r3c0',
        correctId: 'r1c1',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'Playground', '🛝'), road('r1c2'),                      place('r1c3', 'Library', '📚'),
            place('r2c0', 'Hospital', '🏥'), road('r2c1'),                     place('r2c2', 'Pharmacy', '💊'),    place('r2c3', 'Café', '☕'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Post Office', '📮'), place('r3c3', 'Museum', '🏛️')
        ]
    },
    {
        id: 21,
        text: 'You need to mail a letter to Grandma. From home, find the post office on the map.',
        startId: 'r3c0',
        correctId: 'r0c2',
        grid: [
            place('r0c0', 'School', '🏫'),   place('r0c1', 'Park', '🌳'),      place('r0c2', 'Post Office', '📮'), place('r0c3', 'Bank', '🏦'),
            place('r1c0', 'Bakery', '🥖'),   place('r1c1', 'Café', '☕'),      place('r1c2', 'Museum', '🏛️'),     place('r1c3', 'Library', '📚'),
            place('r2c0', 'Gym', '💪'),      place('r2c1', 'Pharmacy', '💊'),  place('r2c2', 'Hospital', '🏥'),    place('r2c3', 'Store', '🏪'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Movie Theater', '🎬'),     place('r3c3', 'Dentist', '🦷')
        ]
    },
    {
        id: 22,
        text: 'You are at the hotel. Walk south two blocks. Then walk west one block. Where do you arrive?',
        startId: 'r0c2',
        correctId: 'r2c1',
        grid: [
            place('r0c0', 'Café', '☕'),     place('r0c1', 'Bank', '🏦'),      place('r0c2', 'Hotel', '🏨'),      place('r0c3', 'Library', '📚'),
            place('r1c0', 'Bakery', '🥖'),   place('r1c1', 'Park', '🌳'),      road('r1c2'),                       place('r1c3', 'Museum', '🏛️'),
            place('r2c0', 'Pharmacy', '💊'), place('r2c1', 'Train Station', '🚆'), road('r2c2'),                  place('r2c3', 'Bus Stop', '🚌'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'School', '🏫'),    place('r3c2', 'Gym', '💪'),        place('r3c3', 'Post Office', '📮')
        ]
    },
    {
        id: 23,
        text: 'From the bookstore, walk east one block. Then walk south one block. Where do you eat lunch?',
        startId: 'r1c1',
        correctId: 'r2c2',
        grid: [
            place('r0c0', 'Park', '🌳'),     place('r0c1', 'School', '🏫'),    place('r0c2', 'Bakery', '🥖'),     place('r0c3', 'Bank', '🏦'),
            place('r1c0', 'Library', '📚'),  place('r1c1', 'Bookstore', '📖'), road('r1c2'),                       place('r1c3', 'Post Office', '📮'),
            place('r2c0', 'Hospital', '🏥'), place('r2c1', 'Pharmacy', '💊'),  place('r2c2', 'Restaurant', '🍽️'), place('r2c3', 'Café', '☕'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bus Stop', '🚌'), place('r3c2', 'Museum', '🏛️'),     place('r3c3', 'Gym', '💪')
        ]
    },
    {
        id: 24,
        text: 'There is a small fire! From home, walk north three blocks. Then east two blocks. Then south two blocks. Then west one block. Where do you go for help?',
        startId: 'r3c0',
        correctId: 'r2c1',
        grid: [
            road('r0c0'),                    road('r0c1'),                     road('r0c2'),                       place('r0c3', 'Bank', '🏦'),
            road('r1c0'),                    place('r1c1', 'School', '🏫'),    road('r1c2'),                       place('r1c3', 'Library', '📚'),
            road('r2c0'),                    place('r2c1', 'Fire Station', '🚒'), road('r2c2'),                   place('r2c3', 'Hospital', '🏥'),
            place('r3c0', 'Home', '🏠'),     place('r3c1', 'Bakery', '🥖'),    place('r3c2', 'Café', '☕'),        place('r3c3', 'Park', '🌳')
        ]
    }
];
