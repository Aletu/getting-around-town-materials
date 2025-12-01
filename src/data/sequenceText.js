// Dynamic scenario texts where students sequence locations based on contextual clues
// Traffic safety elements are described in text, but only locations are draggable options
export const SAFE_WALK_SCENARIOS = [
  {
    id: 1,
    text: 'It\'s a busy school day! I start by leaving my house and walking safely on the sidewalk to get to school. When the bell rings, I head to the playground to have some fun. On my way back, I stop at the library to pick up a new storybook before finally returning home.',
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
    text: 'Mom isn\'t feeling well today, so we leave the house to visit the hospital. After the doctor sees her, we stop at the pharmacy for her medicine. We quickly grab some food at the store and then head back home to rest.',
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
    text: 'I\'m visiting my best friend\'s house today! We walk over to the park to run around in the grass. All that playing makes us hungry, so we grab a bite at a restaurant. To end the fun day, we go to the theater to watch a cool new film.',
    sequence: [
      { id: 'house', label: 'Friend s House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 3, alt: 'Theater' }
    ]
  },
  {
    id: 4,
    text: 'Dad needs some help with errands. Leaving from our house, I first go to the bank to deposit some money. Next, I head to the post office to mail a package for grandma. Finally, I stop at the store for milk and bread.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 2, alt: 'Post office' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 5,
    text: 'School is over for the day, but I have one more stop. I go to the library to return a borrowed book. Then, I wait at the bus stop to catch a ride to my dentist appointment.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 1, alt: 'Library' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 2, alt: 'Bus stop' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 3, alt: 'Dentist' }
    ]
  },
  {
    id: 6,
    text: 'It\'s a healthy day! I start with a nice walk in the park. Then, I head to the gym for some exercise. All that moving makes me hungry, so I finish up at a restaurant for a good meal.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 1, alt: 'Gym' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 7,
    text: 'I have a toothache, so I leave my house to see the dentist. The dentist gives me a prescription to help. I go straight to the pharmacy to pick it up.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 8,
    text: 'Mom needs eggs and juice for breakfast, so I run to the store. After shopping, I hurry to the bus stop. I need to catch the bus so I can get to school on time!',
    sequence: [
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 0, alt: 'Store' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' }
    ]
  },
  {
    id: 9,
    text: 'I\'m visiting grandma at the hospital today. She asks me to do a favor and mail a card at the post office. Then, I stop by the bank for her. Before heading home, I buy her favorite snacks at the store.',
    sequence: [
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 0, alt: 'Hospital' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 1, alt: 'Post office' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 2, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 10,
    text: 'My little sister and I are having a fun day out. We start by playing on the swings at the playground. Then, we go to the theater to see a funny movie. Afterwards, we grab some pizza at a restaurant.',
    sequence: [
      { id: 'playground', label: 'Playground', emoji: '🎪', correctIndex: 0, alt: 'Playground' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 1, alt: 'Theater' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 11,
    text: 'I leave my house and walk to the park to meet my friends. We play for a bit before walking to school together. After classes are done, we all head to the gym to shoot some hoops.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 3, alt: 'Gym' }
    ]
  },
  {
    id: 12,
    text: 'I have a few things to do today. First, I drop off some books at the library. Then, I go to the bank to help my dad. Finally, I stop at the store to get snacks for movie night.',
    sequence: [
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 0, alt: 'Library' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 2, alt: 'Store' }
    ]
  },
  {
    id: 13,
    text: 'I just finished my workout at the gym. Now I need to catch a ride at the bus stop. I\'m on my way to the hospital to visit my aunt who isn\'t feeling well.',
    sequence: [
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 0, alt: 'Gym' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 2, alt: 'Hospital' }
    ]
  },
  {
    id: 14,
    text: 'I just saw a great movie at the theater! Now, unfortunately, I have to go to the dentist. Afterwards, I\'ll stop at the pharmacy to pick up medicine for mom.',
    sequence: [
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 0, alt: 'Theater' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 15,
    text: 'It\'s my cousin\'s birthday, so I go to the post office to mail a card. Then, I meet a friend for lunch at a restaurant. We take a nice walk through the park before I head to my friend\'s house.',
    sequence: [
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 0, alt: 'Post office' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 1, alt: 'Restaurant' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 16,
    text: 'Saturday starts with a splash at the pool for my swimming lesson. Swimming makes me hungry, so I visit a cafe for a snack. Then, I head to the bookstore to find a new comic.',
    sequence: [
      { id: 'pool', label: 'Pool', emoji: '🏊', correctIndex: 0, alt: 'Swimming pool' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 1, alt: 'Cafe' },
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 2, alt: 'Bookstore' }
    ]
  },
  {
    id: 17,
    text: 'Our cat needs a checkup, so we take him to the veterinarian. Afterwards, we stop at the pet store for some treats. Then, we go to the park so he can get some fresh air.',
    sequence: [
      { id: 'vet', label: 'Veterinarian', emoji: '🐕‍🦺', correctIndex: 0, alt: 'Veterinarian' },
      { id: 'pet_store', label: 'Pet Store', emoji: '🐾', correctIndex: 1, alt: 'Pet store' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 18,
    text: 'It\'s Grandpa\'s birthday! I go to the bakery to order a delicious cake. Then, I get some colorful balloons at the party store. Finally, I head to his apartment to surprise him.',
    sequence: [
      { id: 'bakery', label: 'Bakery', emoji: '🎂', correctIndex: 0, alt: 'Bakery' },
      { id: 'party_store', label: 'Party Store', emoji: '🎈', correctIndex: 1, alt: 'Party store' },
      { id: 'apartment', label: 'Apartment', emoji: '🏢', correctIndex: 2, alt: 'Apartment building' }
    ]
  },
  {
    id: 19,
    text: 'After school, I have my piano lesson. I walk to the music school near the coffee shop. When I\'m done, I meet my dad at his office, and we walk home together.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'music_school', label: 'Music School', emoji: '🎹', correctIndex: 1, alt: 'Music school' },
      { id: 'office', label: 'Office', emoji: '🏢', correctIndex: 2, alt: 'Office' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 20,
    text: 'Picture day is coming! I go to the salon to get a fresh haircut. Then, I stop at the photo shop to pick up some prints. Finally, I buy a nice frame at the store.',
    sequence: [
      { id: 'salon', label: 'Salon', emoji: '💇', correctIndex: 0, alt: 'Hair salon' },
      { id: 'photo_shop', label: 'Photo Shop', emoji: '📷', correctIndex: 1, alt: 'Photo shop' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 2, alt: 'Store' }
    ]
  },
  {
    id: 21,
    text: 'On Sunday, my family goes to church. After the service, we help out at the community center. As a reward for our hard work, we all go to the ice cream shop for a treat.',
    sequence: [
      { id: 'church', label: 'Church', emoji: '⛪', correctIndex: 0, alt: 'Church' },
      { id: 'community_center', label: 'Community Center', emoji: '🏘️', correctIndex: 1, alt: 'Community center' },
      { id: 'ice_cream', label: 'Ice Cream Shop', emoji: '🍦', correctIndex: 2, alt: 'Ice cream shop' }
    ]
  },
  {
    id: 22,
    text: 'We are on a field trip! First, we explore the museum to learn about history. Then, we eat lunch in the cafeteria. Our last stop is the aquarium to see the amazing fish.',
    sequence: [
      { id: 'museum', label: 'Museum', emoji: '🏛️', correctIndex: 0, alt: 'Museum' },
      { id: 'cafeteria', label: 'Cafeteria', emoji: '🍴', correctIndex: 1, alt: 'Cafeteria' },
      { id: 'aquarium', label: 'Aquarium', emoji: '🐠', correctIndex: 2, alt: 'Aquarium' }
    ]
  },
  {
    id: 23,
    text: 'I need to return my uniform to the sports center. Then, I head to the shoe store to buy new cleats. Finally, I go to the field for soccer practice.',
    sequence: [
      { id: 'sports_center', label: 'Sports Center', emoji: '⚽', correctIndex: 0, alt: 'Sports center' },
      { id: 'shoe_store', label: 'Shoe Store', emoji: '👟', correctIndex: 1, alt: 'Shoe store' },
      { id: 'field', label: 'Field', emoji: '🏟️', correctIndex: 2, alt: 'Sports field' }
    ]
  },
  {
    id: 24,
    text: 'It\'s raining, so we go to the climbing gym to have fun indoors. Climbing makes us hungry, so we grab some burgers. Then, we finish the day playing games at the arcade.',
    sequence: [
      { id: 'climbing_gym', label: 'Climbing Gym', emoji: '🧗', correctIndex: 0, alt: 'Climbing gym' },
      { id: 'burger_place', label: 'Burger Place', emoji: '🍔', correctIndex: 1, alt: 'Burger restaurant' },
      { id: 'arcade', label: 'Arcade', emoji: '🕹️', correctIndex: 2, alt: 'Arcade' }
    ]
  },
  {
    id: 25,
    text: 'I\'m helping my neighbor with her dog. We take a walk to the park so he can run. Then, I take him to the groomer for a bath. Finally, I bring the clean dog back to her house.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'groomer', label: 'Groomer', emoji: '🛁', correctIndex: 1, alt: 'Pet groomer' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 2, alt: 'House' }
    ]
  },
  {
    id: 26,
    text: 'My science project is due! I go to the craft store for supplies. Then, I visit the print shop to copy my notes. Finally, I sit down at the library to put it all together.',
    sequence: [
      { id: 'craft_store', label: 'Craft Store', emoji: '🎨', correctIndex: 0, alt: 'Craft store' },
      { id: 'print_shop', label: 'Print Shop', emoji: '🖨️', correctIndex: 1, alt: 'Print shop' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 2, alt: 'Library' }
    ]
  },
  {
    id: 27,
    text: 'I volunteer at the animal shelter on weekends. Afterwards, I stop at the farmer\'s market for fresh veggies. Then, I deliver the food to the senior center.',
    sequence: [
      { id: 'shelter', label: 'Animal Shelter', emoji: '🐶', correctIndex: 0, alt: 'Animal shelter' },
      { id: 'farmers_market', label: 'Farmer\'s Market', emoji: '🥬', correctIndex: 1, alt: 'Farmer\'s market' },
      { id: 'senior_center', label: 'Senior Center', emoji: '👴', correctIndex: 2, alt: 'Senior center' }
    ]
  },
  {
    id: 28,
    text: 'Tuesday is art day! I start at the art studio for my class. Then, I go to the art store to buy more paint. Finally, I visit my grandma at the nursing home to show her my work.',
    sequence: [
      { id: 'art_studio', label: 'Art Studio', emoji: '🎨', correctIndex: 0, alt: 'Art studio' },
      { id: 'art_store', label: 'Art Store', emoji: '🖌️', correctIndex: 1, alt: 'Art supply store' },
      { id: 'nursing_home', label: 'Nursing Home', emoji: '🏥', correctIndex: 2, alt: 'Nursing home' }
    ]
  },
  {
    id: 29,
    text: 'I love reading! I walk to the bookstore to see the new books. Then, I grab a smoothie at the juice bar. Finally, I settle in at the cafe to read and relax.',
    sequence: [
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 0, alt: 'Bookstore' },
      { id: 'juice_bar', label: 'Juice Bar', emoji: '🥤', correctIndex: 1, alt: 'Juice bar' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 2, alt: 'Cafe' }
    ]
  },
  {
    id: 30,
    text: 'Dad and I are fixing my bike at our house. We need a part, so we walk to the bike shop. Once it\'s fixed, we ride to the beach. Afterwards, we get tacos for dinner.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bike_shop', label: 'Bike Shop', emoji: '🚲', correctIndex: 1, alt: 'Bike shop' },
      { id: 'beach', label: 'Beach', emoji: '🏖️', correctIndex: 2, alt: 'Beach' },
      { id: 'taco_place', label: 'Taco Place', emoji: '🌮', correctIndex: 3, alt: 'Taco restaurant' }
    ]
  }
];
