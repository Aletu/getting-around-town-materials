// Dynamic scenario texts where students sequence locations based on contextual clues
// Traffic safety elements are described in text, but only locations are draggable options
export const SAFE_WALK_SCENARIOS = [
  {
    id: 1,
    text: 'I leave home in the morning. I walk on the sidewalk to the place where I learn and study. After my classes end, I go to the place with swings and slides to play. Then I stop at the place with books before going back.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 1, alt: 'School building' },
      { id: 'playground', label: 'Playground', emoji: '🎪', correctIndex: 2, alt: 'Playground' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 3, alt: 'Library' },
      { id: 'house_return', label: 'House', emoji: '🏠', correctIndex: 4, alt: 'House' }
    ]
  },
  {
    id: 2,
    text: 'I start my day at home. My mom is sick, so I go to see the doctor with her. After the appointment, I pick up her medicine. Then I buy groceries before we go home.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 1, alt: 'Hospital' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' },
      { id: 'house_return', label: 'House', emoji: '🏠', correctIndex: 4, alt: 'House' }
    ]
  },
  {
    id: 3,
    text: 'I visit my friend at their house. We walk together to play at the green space with trees. When we get hungry, we stop for lunch. Then we go see a movie together.',
    sequence: [
      { id: 'house', label: 'Friend s House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 3, alt: 'Theater' }
    ]
  },
  {
    id: 4,
    text: 'Dad gives me an errand to help. Starting from home, I need to deposit money for him. Next, I mail a package for grandma. Then I buy milk and bread before coming back.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 2, alt: 'Post office' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 5,
    text: 'After school, I need to return a book I borrowed. Then I wait to catch the bus to my dentist appointment.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 1, alt: 'Library' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 2, alt: 'Bus stop' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 3, alt: 'Dentist' }
    ]
  },
  {
    id: 6,
    text: 'I enjoy a walk in the green space with trees. Then I go work out and exercise. After my workout, I am hungry so I stop for food.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 1, alt: 'Gym' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 7,
    text: 'I leave home for my dental checkup. My tooth hurts, so the dentist gives me a prescription. Then I go fill it right away.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 8,
    text: 'Mom sends me to buy eggs and juice. Then I walk to catch the bus to get to class on time.',
    sequence: [
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 0, alt: 'Store' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' }
    ]
  },
  {
    id: 9,
    text: 'I visit grandma at the hospital. She asks me to mail a card for her. Then I deposit her check. Before going home, I buy her favorite snacks.',
    sequence: [
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 0, alt: 'Hospital' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 1, alt: 'Post office' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 2, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 10,
    text: 'My little sister and I play on the swings and slide. Then we go watch a movie together. After the movie, we are hungry so we get pizza.',
    sequence: [
      { id: 'playground', label: 'Playground', emoji: '🎪', correctIndex: 0, alt: 'Playground' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 1, alt: 'Theater' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 11,
    text: 'I walk from home to the green space to meet my friends. We play outside, then we all walk together to our classes. After school, we go to the place where we can shoot hoops and exercise.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 3, alt: 'Gym' }
    ]
  },
  {
    id: 12,
    text: 'I need to return my library books. Then dad asks me to deposit his paycheck for him. After that, I buy snacks for our family movie night.',
    sequence: [
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 0, alt: 'Library' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 2, alt: 'Store' }
    ]
  },
  {
    id: 13,
    text: 'After my workout and exercise class, I catch the bus. I am going to visit my aunt who is not feeling well.',
    sequence: [
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 0, alt: 'Gym' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 2, alt: 'Hospital' }
    ]
  },
  {
    id: 14,
    text: 'After watching a movie, I need to get my teeth checked. Then I pick up some medicine for my mom.',
    sequence: [
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 0, alt: 'Theater' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 15,
    text: 'I need to mail a birthday card to my cousin. Then I meet my friend for lunch. After we eat, we walk through the green space with trees. Finally, I go to my friend\'s house to play.',
    sequence: [
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 0, alt: 'Post office' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 1, alt: 'Restaurant' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  }
];
