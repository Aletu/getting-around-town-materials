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
  },
  {
    id: 16,
    text: 'I start my Saturday at the swimming pool for my lesson. After swimming, I am tired so I go to a cafe for a snack. Then I walk to the bookstore to buy a new comic.',
    sequence: [
      { id: 'pool', label: 'Pool', emoji: '🏊', correctIndex: 0, alt: 'Swimming pool' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 1, alt: 'Cafe' },
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 2, alt: 'Bookstore' }
    ]
  },
  {
    id: 17,
    text: 'Mom takes me to the place where animals are cared for. Our cat needs a checkup. After the visit, we stop at the pet store to buy food. Then we go to the green space so our cat can enjoy the fresh air.',
    sequence: [
      { id: 'vet', label: 'Veterinarian', emoji: '🐕‍🦺', correctIndex: 0, alt: 'Veterinarian' },
      { id: 'pet_store', label: 'Pet Store', emoji: '🐾', correctIndex: 1, alt: 'Pet store' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 18,
    text: 'I want to surprise grandpa on his birthday. I go to the bakery to order a cake. Then I pick up balloons at the party supply store. Finally, I visit him at his apartment.',
    sequence: [
      { id: 'bakery', label: 'Bakery', emoji: '🎂', correctIndex: 0, alt: 'Bakery' },
      { id: 'party_store', label: 'Party Store', emoji: '🎈', correctIndex: 1, alt: 'Party store' },
      { id: 'apartment', label: 'Apartment', emoji: '🏢', correctIndex: 2, alt: 'Apartment building' }
    ]
  },
  {
    id: 19,
    text: 'After school, I have piano practice. My teacher lives near the coffee shop. After my lesson, I meet my dad at his office. We walk home together.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'music_school', label: 'Music School', emoji: '🎹', correctIndex: 1, alt: 'Music school' },
      { id: 'office', label: 'Office', emoji: '🏢', correctIndex: 2, alt: 'Office' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 20,
    text: 'I need to get my hair cut for school pictures. After my haircut, I stop at the place where they develop photos to pick up prints. Then I buy a frame for my favorite picture.',
    sequence: [
      { id: 'salon', label: 'Salon', emoji: '💇', correctIndex: 0, alt: 'Hair salon' },
      { id: 'photo_shop', label: 'Photo Shop', emoji: '📷', correctIndex: 1, alt: 'Photo shop' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 2, alt: 'Store' }
    ]
  },
  {
    id: 21,
    text: 'Sunday morning, my family goes to church together. After the service, we volunteer at the community center to help serve meals. Then we walk to the ice cream shop as a treat.',
    sequence: [
      { id: 'church', label: 'Church', emoji: '⛪', correctIndex: 0, alt: 'Church' },
      { id: 'community_center', label: 'Community Center', emoji: '🏘️', correctIndex: 1, alt: 'Community center' },
      { id: 'ice_cream', label: 'Ice Cream Shop', emoji: '🍦', correctIndex: 2, alt: 'Ice cream shop' }
    ]
  },
  {
    id: 22,
    text: 'I walk to the museum for a field trip. After learning about history, we go to the cafeteria for lunch. Then we visit the aquarium next door to see the fish.',
    sequence: [
      { id: 'museum', label: 'Museum', emoji: '🏛️', correctIndex: 0, alt: 'Museum' },
      { id: 'cafeteria', label: 'Cafeteria', emoji: '🍴', correctIndex: 1, alt: 'Cafeteria' },
      { id: 'aquarium', label: 'Aquarium', emoji: '🐠', correctIndex: 2, alt: 'Aquarium' }
    ]
  },
  {
    id: 23,
    text: 'I need to return my soccer uniform to the sports center. Then I go to the shoe store to buy new cleats. After shopping, I practice at the soccer field.',
    sequence: [
      { id: 'sports_center', label: 'Sports Center', emoji: '⚽', correctIndex: 0, alt: 'Sports center' },
      { id: 'shoe_store', label: 'Shoe Store', emoji: '👟', correctIndex: 1, alt: 'Shoe store' },
      { id: 'field', label: 'Field', emoji: '🏟️', correctIndex: 2, alt: 'Sports field' }
    ]
  },
  {
    id: 24,
    text: 'On a rainy day, I go to the indoor climbing gym with friends. After climbing, we are hungry so we get burgers. Then we walk to the arcade to play games.',
    sequence: [
      { id: 'climbing_gym', label: 'Climbing Gym', emoji: '🧗', correctIndex: 0, alt: 'Climbing gym' },
      { id: 'burger_place', label: 'Burger Place', emoji: '🍔', correctIndex: 1, alt: 'Burger restaurant' },
      { id: 'arcade', label: 'Arcade', emoji: '🕹️', correctIndex: 2, alt: 'Arcade' }
    ]
  },
  {
    id: 25,
    text: 'I help my neighbor by walking her dog to the park. The dog loves to run and play. Then I take the dog to the groomer for a bath. Finally, I return the clean dog to my neighbor\'s house.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'groomer', label: 'Groomer', emoji: '🛁', correctIndex: 1, alt: 'Pet groomer' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 2, alt: 'House' }
    ]
  },
  {
    id: 26,
    text: 'My science project is due tomorrow! I go to the craft store to buy poster board. Then I stop at the print shop to make copies of my research. Finally, I work on it at the library.',
    sequence: [
      { id: 'craft_store', label: 'Craft Store', emoji: '🎨', correctIndex: 0, alt: 'Craft store' },
      { id: 'print_shop', label: 'Print Shop', emoji: '🖨️', correctIndex: 1, alt: 'Print shop' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 2, alt: 'Library' }
    ]
  },
  {
    id: 27,
    text: 'I volunteer at the animal shelter on weekends. After helping with the animals, I go to the farmer\'s market to buy fresh vegetables. Then I deliver them to the senior center for their meals.',
    sequence: [
      { id: 'shelter', label: 'Animal Shelter', emoji: '🐶', correctIndex: 0, alt: 'Animal shelter' },
      { id: 'farmers_market', label: 'Farmer\'s Market', emoji: '🥬', correctIndex: 1, alt: 'Farmer\'s market' },
      { id: 'senior_center', label: 'Senior Center', emoji: '👴', correctIndex: 2, alt: 'Senior center' }
    ]
  },
  {
    id: 28,
    text: 'I take art classes on Tuesdays. First, I go to the art studio downtown. After class, I need new supplies from the art store. Then I show my artwork to my grandma at her nursing home.',
    sequence: [
      { id: 'art_studio', label: 'Art Studio', emoji: '🎨', correctIndex: 0, alt: 'Art studio' },
      { id: 'art_store', label: 'Art Store', emoji: '🖌️', correctIndex: 1, alt: 'Art supply store' },
      { id: 'nursing_home', label: 'Nursing Home', emoji: '🏥', correctIndex: 2, alt: 'Nursing home' }
    ]
  },
  {
    id: 29,
    text: 'I love reading! I walk to the bookstore to browse new releases. Then I get a smoothie at the juice bar. After my snack, I read my new book at the cozy coffee shop.',
    sequence: [
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 0, alt: 'Bookstore' },
      { id: 'juice_bar', label: 'Juice Bar', emoji: '🥤', correctIndex: 1, alt: 'Juice bar' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 2, alt: 'Cafe' }
    ]
  },
  {
    id: 30,
    text: 'Dad and I fix my bike at home. We need a new tire, so we walk to the bike shop. After the repair, we test it by riding to the beach. Then we get tacos for dinner.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bike_shop', label: 'Bike Shop', emoji: '🚲', correctIndex: 1, alt: 'Bike shop' },
      { id: 'beach', label: 'Beach', emoji: '🏖️', correctIndex: 2, alt: 'Beach' },
      { id: 'taco_place', label: 'Taco Place', emoji: '🌮', correctIndex: 3, alt: 'Taco restaurant' }
    ]
  }
];
