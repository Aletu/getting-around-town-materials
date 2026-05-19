// Dynamic scenario texts where students sequence locations based on contextual clues
// Traffic safety elements are described in text, but only locations are draggable options
export const SAFE_WALK_SCENARIOS = [
  {
    id: 2,
    text: 'First, we leave home to visit the hospital because Mom feels sick. Next, we go to the pharmacy for medicine. Finally, we stop at the store for food on the way home.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 1, alt: 'Hospital' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 3,
    text: 'First, I visit my friend\'s house. Next, we walk to the park to play. Then, we eat at a restaurant because we are hungry. Finally, we watch a movie at the theater.',
    sequence: [
      { id: 'house', label: 'Friend\'s House', emoji: '🏠', correctIndex: 0, alt: 'Friend\'s house' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 3, alt: 'Theater' }
    ]
  },
  {
    id: 4,
    text: 'First, I leave home to help my dad with errands. Next, we go to the bank. Then, we visit the post office to mail a package. Finally, we stop at the store for groceries.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 2, alt: 'Post office' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 5,
    text: 'First, I return a book at the library. Next, I wait safely at the bus stop. Finally, I ride to my dentist appointment.',
    sequence: [
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 0, alt: 'Library' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 2, alt: 'Dentist' }
    ]
  },
  {
    id: 6,
    text: 'First, I walk in the park. Next, I exercise at the gym. Finally, I eat a healthy meal at a restaurant.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 1, alt: 'Gym' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 7,
    text: 'First, I leave home because my tooth hurts. Next, I visit the dentist. Finally, I go to the pharmacy to get my medicine.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 8,
    text: 'First, I go to the store for eggs and juice. Next, I walk to the bus stop. Finally, I ride the bus to school on time.',
    sequence: [
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 0, alt: 'Store' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' }
    ]
  },
  {
    id: 9,
    text: 'First, I visit Grandma at the hospital. Next, I mail her card at the post office. Then, I go to the bank for her. Finally, I buy snacks at the store before going home.',
    sequence: [
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 0, alt: 'Hospital' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 1, alt: 'Post office' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 2, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 3, alt: 'Store' }
    ]
  },
  {
    id: 10,
    text: 'First, my sister and I play at the playground. Next, we watch a funny movie at the theater. Finally, we eat pizza at a restaurant.',
    sequence: [
      { id: 'playground', label: 'Playground', emoji: '🎪', correctIndex: 0, alt: 'Playground' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 1, alt: 'Theater' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 11,
    text: 'First, I leave my house to meet friends at the park. Next, we walk to school together. Finally, after class, we go to the gym to play basketball.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 1, alt: 'Park' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 2, alt: 'School' },
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 3, alt: 'Gym' }
    ]
  },
  {
    id: 12,
    text: 'First, I return books at the library. Next, I help my dad at the bank. Finally, I buy snacks at the store for movie night.',
    sequence: [
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 0, alt: 'Library' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 2, alt: 'Store' }
    ]
  },
  {
    id: 13,
    text: 'First, I finish my exercise at the gym. Next, I wait at the bus stop. Finally, I visit my aunt at the hospital.',
    sequence: [
      { id: 'gym', label: 'Gym', emoji: '💪', correctIndex: 0, alt: 'Gym' },
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 1, alt: 'Bus stop' },
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 2, alt: 'Hospital' }
    ]
  },
  {
    id: 14,
    text: 'First, I watch a movie at the theater. Next, I go to my dentist appointment. Finally, I pick up medicine at the pharmacy for Mom.',
    sequence: [
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 0, alt: 'Theater' },
      { id: 'dentist', label: 'Dentist', emoji: '🦷', correctIndex: 1, alt: 'Dentist' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 2, alt: 'Pharmacy' }
    ]
  },
  {
    id: 15,
    text: 'First, I mail a birthday card at the post office. Next, I eat lunch at a restaurant. Then, I walk through the park. Finally, I go to my friend\'s house.',
    sequence: [
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 0, alt: 'Post office' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 1, alt: 'Restaurant' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 16,
    text: 'First, I go to the pool for swimming class. Next, I stop at a cafe for a snack. Finally, I visit the bookstore to find a new comic.',
    sequence: [
      { id: 'pool', label: 'Pool', emoji: '🏊', correctIndex: 0, alt: 'Swimming pool' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 1, alt: 'Cafe' },
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 2, alt: 'Bookstore' }
    ]
  },
  {
    id: 17,
    text: 'First, we take our cat to the veterinarian for a checkup. Next, we buy treats at the pet store. Finally, we walk in the park for fresh air.',
    sequence: [
      { id: 'vet', label: 'Vet', emoji: '🐕‍🦺', correctIndex: 0, alt: 'Veterinarian' },
      { id: 'pet_store', label: 'Pet Store', emoji: '🐾', correctIndex: 1, alt: 'Pet store' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 18,
    text: 'First, I go to the bakery to get a birthday cake. Next, I buy balloons at the party store. Finally, I visit Grandpa\'s apartment for the celebration.',
    sequence: [
      { id: 'bakery', label: 'Bakery', emoji: '🥖', correctIndex: 0, alt: 'Bakery' },
      { id: 'party_store', label: 'Party Store', emoji: '🎈', correctIndex: 1, alt: 'Party store' },
      { id: 'apartment', label: 'Apartment', emoji: '🏢', correctIndex: 2, alt: 'Apartment building' }
    ]
  },
  {
    id: 19,
    text: 'First, I finish school. Next, I go to music school for piano class. Then, I meet my dad at his office. Finally, we walk home together.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'music_school', label: 'Music School', emoji: '🎹', correctIndex: 1, alt: 'Music school' },
      { id: 'office', label: 'Office', emoji: '🏢', correctIndex: 2, alt: 'Office' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 20,
    text: 'First, I get a haircut at the salon. Next, I buy a new outfit at the store. Finally, my family takes pictures together at the park.',
    sequence: [
      { id: 'salon', label: 'Salon', emoji: '💇', correctIndex: 0, alt: 'Hair salon' },
      { id: 'store', label: 'Store', emoji: '🏪', correctIndex: 1, alt: 'Store' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 21,
    text: 'First, my family goes to church. Next, we help at the community center. Finally, we celebrate with a treat at the ice cream shop.',
    sequence: [
      { id: 'church', label: 'Church', emoji: '⛪', correctIndex: 0, alt: 'Church' },
      { id: 'community_center', label: 'Community Center', emoji: '🏘️', correctIndex: 1, alt: 'Community center' },
      { id: 'ice_cream', label: 'Ice Cream Shop', emoji: '🍦', correctIndex: 2, alt: 'Ice cream shop' }
    ]
  },
  {
    id: 22,
    text: 'First, our class visits the museum to learn history. Next, we eat lunch in the cafeteria. Finally, we go to the aquarium to see the sea animals.',
    sequence: [
      { id: 'museum', label: 'Museum', emoji: '🏛️', correctIndex: 0, alt: 'Museum' },
      { id: 'cafeteria', label: 'Cafeteria', emoji: '🍴', correctIndex: 1, alt: 'Cafeteria' },
      { id: 'aquarium', label: 'Aquarium', emoji: '🐠', correctIndex: 2, alt: 'Aquarium' }
    ]
  },
  {
    id: 23,
    text: 'First, I return my uniform at the sports center. Next, I buy cleats at the shoe store. Finally, I go to the field for soccer practice.',
    sequence: [
      { id: 'sports_center', label: 'Sports Center', emoji: '⚽', correctIndex: 0, alt: 'Sports center' },
      { id: 'shoe_store', label: 'Shoe Store', emoji: '👟', correctIndex: 1, alt: 'Shoe store' },
      { id: 'field', label: 'Field', emoji: '🏟️', correctIndex: 2, alt: 'Sports field' }
    ]
  },
  {
    id: 24,
    text: 'First, because it is raining, we go to the climbing gym indoors. Next, we eat burgers. Finally, we play games at the arcade.',
    sequence: [
      { id: 'climbing_gym', label: 'Climbing Gym', emoji: '🧗', correctIndex: 0, alt: 'Climbing gym' },
      { id: 'burger_place', label: 'Burger Place', emoji: '🍔', correctIndex: 1, alt: 'Burger restaurant' },
      { id: 'arcade', label: 'Arcade', emoji: '🕹️', correctIndex: 2, alt: 'Arcade' }
    ]
  },
  {
    id: 25,
    text: 'First, I help my neighbor by walking her dog in the park. Next, I take the dog to the groomer for a bath. Finally, I bring the dog back to her house.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'groomer', label: 'Groomer', emoji: '🛁', correctIndex: 1, alt: 'Pet groomer' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 2, alt: 'House' }
    ]
  },
  {
    id: 26,
    text: 'First, I buy supplies for my science project at the craft store. Next, I read books about my topic at the library. Finally, I work on my project at home.',
    sequence: [
      { id: 'craft_store', label: 'Craft Store', emoji: '🎨', correctIndex: 0, alt: 'Craft store' },
      { id: 'library', label: 'Library', emoji: '📚', correctIndex: 1, alt: 'Library' },
      { id: 'house', label: 'Home', emoji: '🏠', correctIndex: 2, alt: 'Home' }
    ]
  },
  {
    id: 27,
    text: 'First, I help feed the dogs at the animal shelter. Next, I buy fresh fruit at the farmer\'s market. Finally, I take cookies to my grandma\'s house.',
    sequence: [
      { id: 'shelter', label: 'Animal Shelter', emoji: '🐶', correctIndex: 0, alt: 'Animal shelter' },
      { id: 'farmers_market', label: 'Farmer\'s Market', emoji: '🥬', correctIndex: 1, alt: 'Farmer\'s market' },
      { id: 'grandmas_house', label: 'Grandma\'s House', emoji: '🏡', correctIndex: 2, alt: 'Grandma\'s house' }
    ]
  },
  {
    id: 28,
    text: 'First, I go to art class at the art studio. Next, I buy paint at the art store. Finally, I show my new artwork to my grandma at her house.',
    sequence: [
      { id: 'art_studio', label: 'Art Studio', emoji: '🎨', correctIndex: 0, alt: 'Art studio' },
      { id: 'art_store', label: 'Art Store', emoji: '🖌️', correctIndex: 1, alt: 'Art supply store' },
      { id: 'grandmas_house', label: 'Grandma\'s House', emoji: '🏡', correctIndex: 2, alt: 'Grandma\'s house' }
    ]
  },
  {
    id: 29,
    text: 'First, I visit the bookstore to look for new books. Next, I buy a smoothie at the juice bar. Finally, I sit in a cafe and read quietly.',
    sequence: [
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 0, alt: 'Bookstore' },
      { id: 'juice_bar', label: 'Juice Bar', emoji: '🥤', correctIndex: 1, alt: 'Juice bar' },
      { id: 'cafe', label: 'Cafe', emoji: '☕', correctIndex: 2, alt: 'Cafe' }
    ]
  },
  {
    id: 30,
    text: 'First, Dad and I fix my bike at home. Next, we get a part from the bike shop. Then, we ride to the beach. Finally, we eat tacos for dinner.',
    sequence: [
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 0, alt: 'House' },
      { id: 'bike_shop', label: 'Bike Shop', emoji: '🚲', correctIndex: 1, alt: 'Bike shop' },
      { id: 'beach', label: 'Beach', emoji: '🏖️', correctIndex: 2, alt: 'Beach' },
      { id: 'taco_place', label: 'Taco Place', emoji: '🌮', correctIndex: 3, alt: 'Taco restaurant' }
    ]
  },
  {
    id: 31,
    text: 'First, Mom and I take a taxi to the airport to meet my uncle. Next, we have dinner together at a restaurant. Finally, we drive him to his hotel.',
    sequence: [
      { id: 'airport', label: 'Airport', emoji: '✈️', correctIndex: 0, alt: 'Airport' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 1, alt: 'Restaurant' },
      { id: 'hotel', label: 'Hotel', emoji: '🏨', correctIndex: 2, alt: 'Hotel' }
    ]
  },
  {
    id: 32,
    text: 'First, we walk to the train station. Next, after our train ride, we have a snack at a café. Then, we visit the museum. Finally, we sleep at the hotel.',
    sequence: [
      { id: 'train_station', label: 'Train Station', emoji: '🚆', correctIndex: 0, alt: 'Train station' },
      { id: 'cafe', label: 'Café', emoji: '☕', correctIndex: 1, alt: 'Café' },
      { id: 'museum', label: 'Museum', emoji: '🏛️', correctIndex: 2, alt: 'Museum' },
      { id: 'hotel', label: 'Hotel', emoji: '🏨', correctIndex: 3, alt: 'Hotel' }
    ]
  },
  {
    id: 33,
    text: 'First, we go to the mall to buy a new shirt. Next, I get a haircut at the barbershop. Then, we buy roses at the flower shop. Finally, we mail a card at the post office.',
    sequence: [
      { id: 'mall', label: 'Mall', emoji: '🏬', correctIndex: 0, alt: 'Shopping mall' },
      { id: 'barbershop', label: 'Barbershop', emoji: '💈', correctIndex: 1, alt: 'Barbershop' },
      { id: 'flower_shop', label: 'Flower Shop', emoji: '💐', correctIndex: 2, alt: 'Flower shop' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 3, alt: 'Post office' }
    ]
  },
  {
    id: 34,
    text: 'First, Mom and I stop at the ATM to get cash. Next, we go to the bank to pay a bill. Then, we visit city hall to get a special paper. Finally, we have lunch at a café.',
    sequence: [
      { id: 'atm', label: 'ATM', emoji: '🏧', correctIndex: 0, alt: 'ATM' },
      { id: 'bank', label: 'Bank', emoji: '🏦', correctIndex: 1, alt: 'Bank' },
      { id: 'city_hall', label: 'City Hall', emoji: '🏛️', correctIndex: 2, alt: 'City hall' },
      { id: 'cafe', label: 'Café', emoji: '☕', correctIndex: 3, alt: 'Café' }
    ]
  },
  {
    id: 35,
    text: 'First, we walk to the swimming pool for a swim. Next, we eat lunch at the café next door. Finally, we play at the park before going home.',
    sequence: [
      { id: 'swimming_pool', label: 'Swimming Pool', emoji: '🏊', correctIndex: 0, alt: 'Swimming pool' },
      { id: 'cafe', label: 'Café', emoji: '☕', correctIndex: 1, alt: 'Café' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 36,
    text: 'It is a busy weekend! First, we get cash at the ATM. Next, we buy groceries at the supermarket. Then, we drop off a card at the post office. Then, we fill the car at the gas station. Finally, we have dinner at the restaurant.',
    sequence: [
      { id: 'atm', label: 'ATM', emoji: '🏧', correctIndex: 0, alt: 'ATM' },
      { id: 'supermarket', label: 'Supermarket', emoji: '🛒', correctIndex: 1, alt: 'Supermarket' },
      { id: 'post_office', label: 'Post Office', emoji: '📮', correctIndex: 2, alt: 'Post office' },
      { id: 'gas_station', label: 'Gas Station', emoji: '⛽', correctIndex: 3, alt: 'Gas station' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 4, alt: 'Restaurant' }
    ]
  },
  {
    id: 37,
    text: 'It is a long Tuesday. First, I go to school. Next, I have piano class at the music school. Then, I meet my dad at his office. Then, I get a quick haircut at the barbershop. Finally, we walk home together.',
    sequence: [
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 0, alt: 'School' },
      { id: 'music_school', label: 'Music School', emoji: '🎹', correctIndex: 1, alt: 'Music school' },
      { id: 'office', label: 'Office', emoji: '🏢', correctIndex: 2, alt: 'Office' },
      { id: 'barbershop', label: 'Barbershop', emoji: '💈', correctIndex: 3, alt: 'Barbershop' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 4, alt: 'House' }
    ]
  },
  {
    id: 38,
    text: 'Because it is raining, we change our plans. First, we drive to the mall to stay dry. Next, we watch a movie at the theater. Finally, we eat dinner at the restaurant inside.',
    sequence: [
      { id: 'mall', label: 'Mall', emoji: '🏬', correctIndex: 0, alt: 'Shopping mall' },
      { id: 'theater', label: 'Theater', emoji: '🎬', correctIndex: 1, alt: 'Movie theater' },
      { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', correctIndex: 2, alt: 'Restaurant' }
    ]
  },
  {
    id: 39,
    text: 'Because it is sunny and warm today, we go outside. First, we walk to the park to play. Next, we have ice cream at the ice cream shop. Finally, we go for a swim at the swimming pool.',
    sequence: [
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 0, alt: 'Park' },
      { id: 'ice_cream', label: 'Ice Cream Shop', emoji: '🍦', correctIndex: 1, alt: 'Ice cream shop' },
      { id: 'swimming_pool', label: 'Swimming Pool', emoji: '🏊', correctIndex: 2, alt: 'Swimming pool' }
    ]
  },
  {
    id: 40,
    text: 'Early in the morning, I help deliver newspapers. First, I pick them up at the bakery. Next, I drop one at the café. Then, I leave one at the bookstore. Finally, I ride home for breakfast.',
    sequence: [
      { id: 'bakery', label: 'Bakery', emoji: '🥖', correctIndex: 0, alt: 'Bakery' },
      { id: 'cafe', label: 'Café', emoji: '☕', correctIndex: 1, alt: 'Café' },
      { id: 'bookstore', label: 'Bookstore', emoji: '📖', correctIndex: 2, alt: 'Bookstore' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  },
  {
    id: 41,
    text: 'After dinner, our family goes out together. First, we walk to the playground for swings. Next, we get treats at the ice cream shop. Finally, we visit Grandma at her apartment.',
    sequence: [
      { id: 'playground', label: 'Playground', emoji: '🛝', correctIndex: 0, alt: 'Playground' },
      { id: 'ice_cream', label: 'Ice Cream Shop', emoji: '🍦', correctIndex: 1, alt: 'Ice cream shop' },
      { id: 'apartment', label: 'Apartment', emoji: '🏢', correctIndex: 2, alt: 'Apartment building' }
    ]
  },
  {
    id: 42,
    text: 'Our dog ran away! First, we ask for help at the police station. Next, we check the animal shelter to see if she is there. Finally, we find her at the park playing with other dogs.',
    sequence: [
      { id: 'police_station', label: 'Police Station', emoji: '👮', correctIndex: 0, alt: 'Police station' },
      { id: 'shelter', label: 'Animal Shelter', emoji: '🐶', correctIndex: 1, alt: 'Animal shelter' },
      { id: 'park', label: 'Park', emoji: '🌳', correctIndex: 2, alt: 'Park' }
    ]
  },
  {
    id: 43,
    text: 'I do not feel well today. First, Mom takes me to the hospital for a checkup. Next, we get my medicine at the pharmacy. Finally, we have warm soup at the café before going home.',
    sequence: [
      { id: 'hospital', label: 'Hospital', emoji: '🏥', correctIndex: 0, alt: 'Hospital' },
      { id: 'pharmacy', label: 'Pharmacy', emoji: '💊', correctIndex: 1, alt: 'Pharmacy' },
      { id: 'cafe', label: 'Café', emoji: '☕', correctIndex: 2, alt: 'Café' }
    ]
  },
  {
    id: 44,
    text: 'It is the first day of school! First, Dad and I walk to the bus stop. Next, the bus takes me to school. Then, after class, I play at the playground. Finally, I walk home with new friends.',
    sequence: [
      { id: 'bus_stop', label: 'Bus Stop', emoji: '🚏', correctIndex: 0, alt: 'Bus stop' },
      { id: 'school', label: 'School', emoji: '🏫', correctIndex: 1, alt: 'School' },
      { id: 'playground', label: 'Playground', emoji: '🛝', correctIndex: 2, alt: 'Playground' },
      { id: 'house', label: 'House', emoji: '🏠', correctIndex: 3, alt: 'House' }
    ]
  }
];
