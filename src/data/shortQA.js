// Short Q&A items — common conversational exchanges in town.
// Distractors are intentionally on-topic but pragmatically wrong:
// they sound plausible until you check the actual intent of the question.

export const SHORT_QA_ITEMS = [
  {
    id: 1,
    question: 'Excuse me, I am lost. Can you help me find my way?',
    options: [
      { id: 'a', text: 'Sure! Where do you need to go?' },
      { id: 'b', text: 'Sorry, I lost my pencil too.' },
      { id: 'c', text: 'Yes, this is my favorite way home.' },
      { id: 'd', text: 'Thank you, I am happy you are here.' }
    ],
    answer: 'a'
  },
  {
    id: 2,
    question: 'I want to buy this toy. How much money does it cost?',
    options: [
      { id: 'a', text: 'It costs one thousand colones.' },
      { id: 'b', text: 'I have many toys at home.' },
      { id: 'c', text: 'Yes, I want to buy a toy too.' },
      { id: 'd', text: 'The store opens at nine o\'clock.' }
    ],
    answer: 'a'
  },
  {
    id: 3,
    question: 'May I please have a chocolate bar?',
    options: [
      { id: 'a', text: 'Here you go! Enjoy it.' },
      { id: 'b', text: 'Yes, I love chocolate too.' },
      { id: 'c', text: 'Sorry, the bar is closed today.' },
      { id: 'd', text: 'I have one cookie in my bag.' }
    ],
    answer: 'a'
  },
  {
    id: 4,
    question: 'I need to catch the bus. Do you know where it stops?',
    options: [
      { id: 'a', text: 'Yes, the stop is right in front of the school.' },
      { id: 'b', text: 'I caught a fish last summer.' },
      { id: 'c', text: 'The bus is yellow and very big.' },
      { id: 'd', text: 'Sorry, I don\'t have a bus pass.' }
    ],
    answer: 'a'
  },
  {
    id: 5,
    question: 'Do you have the time? My watch is broken.',
    options: [
      { id: 'a', text: 'It is three o\'clock right now.' },
      { id: 'b', text: 'Yes, I have a lot of free time.' },
      { id: 'c', text: 'Sorry, my watch is broken too.' },
      { id: 'd', text: 'You can buy a new watch at the store.' }
    ],
    answer: 'a'
  },
  {
    id: 6,
    question: 'Is it okay if I sit in this chair?',
    options: [
      { id: 'a', text: 'Yes, of course you can.' },
      { id: 'b', text: 'Yes, I have a chair at home too.' },
      { id: 'c', text: 'I sat in this chair yesterday.' },
      { id: 'd', text: 'The chair is next to the window.' }
    ],
    answer: 'a'
  },
  {
    id: 7,
    question: 'Would you like some ice cream for dessert?',
    options: [
      { id: 'a', text: 'Yes, please! I love ice cream.' },
      { id: 'b', text: 'Yes, ice cream is made from milk.' },
      { id: 'c', text: 'I had a sandwich for lunch.' },
      { id: 'd', text: 'Sorry, my hands are dirty.' }
    ],
    answer: 'a'
  },
  {
    id: 8,
    question: 'I did not hear you. Could you say that again?',
    options: [
      { id: 'a', text: 'Sure, I can repeat it for you.' },
      { id: 'b', text: 'I did not hear the bell either.' },
      { id: 'c', text: 'You should say something nice.' },
      { id: 'd', text: 'Yes, I heard you very clearly.' }
    ],
    answer: 'a'
  },
  {
    id: 9,
    question: 'The bus is here! Are you ready to go?',
    options: [
      { id: 'a', text: 'Yes, I am coming now!' },
      { id: 'b', text: 'The bus has four big wheels.' },
      { id: 'c', text: 'Yes, I am ready for lunch.' },
      { id: 'd', text: 'I want to ride the train tomorrow.' }
    ],
    answer: 'a'
  },
  {
    id: 10,
    question: 'I do not have cash. Can I use my card to pay?',
    options: [
      { id: 'a', text: 'Sorry, we only take cash here.' },
      { id: 'b', text: 'Yes, I have a card too.' },
      { id: 'c', text: 'Cards are made of plastic.' },
      { id: 'd', text: 'You can pay tomorrow if you want.' }
    ],
    answer: 'a'
  },
  {
    id: 11,
    question: 'Hi! How are you doing today?',
    options: [
      { id: 'a', text: 'I am doing well, thank you!' },
      { id: 'b', text: 'Yes, I am doing my homework.' },
      { id: 'c', text: 'Today is Wednesday.' },
      { id: 'd', text: 'Hi, my name is Maria.' }
    ],
    answer: 'a'
  },
  {
    id: 12,
    question: 'Do you speak English?',
    options: [
      { id: 'a', text: 'Yes, I speak a little bit.' },
      { id: 'b', text: 'Yes, English is hard to learn.' },
      { id: 'c', text: 'I have one English book at home.' },
      { id: 'd', text: 'My teacher is from England.' }
    ],
    answer: 'a'
  },
  {
    id: 13,
    question: 'Welcome to the cafe! What would you like to eat?',
    options: [
      { id: 'a', text: 'I would like a sandwich, please.' },
      { id: 'b', text: 'Thank you, the cafe looks very nice.' },
      { id: 'c', text: 'Yes, I would love to come back.' },
      { id: 'd', text: 'I will eat here next week.' }
    ],
    answer: 'a'
  },
  {
    id: 14,
    question: 'I like these pants. Can I try them on to see if they fit?',
    options: [
      { id: 'a', text: 'Yes, the fitting rooms are over there.' },
      { id: 'b', text: 'Yes, the pants are blue.' },
      { id: 'c', text: 'I like to try new foods.' },
      { id: 'd', text: 'The pants cost ten dollars.' }
    ],
    answer: 'a'
  },
  {
    id: 15,
    question: 'Where do you live?',
    options: [
      { id: 'a', text: 'I live near the big park.' },
      { id: 'b', text: 'Yes, I have a house.' },
      { id: 'c', text: 'I live with my family.' },
      { id: 'd', text: 'My house is very big.' }
    ],
    answer: 'a'
  },
  {
    id: 16,
    question: 'We are finished eating. Can we pay now?',
    options: [
      { id: 'a', text: 'Yes, I will bring the bill right away.' },
      { id: 'b', text: 'Yes, the food was delicious.' },
      { id: 'c', text: 'I am also finished eating.' },
      { id: 'd', text: 'You should try the dessert.' }
    ],
    answer: 'a'
  },
  {
    id: 17,
    question: 'Is anyone sitting in this seat?',
    options: [
      { id: 'a', text: 'No, it is free. You can sit there.' },
      { id: 'b', text: 'Yes, I sit in many seats every day.' },
      { id: 'c', text: 'The seat is very soft.' },
      { id: 'd', text: 'I am standing right now.' }
    ],
    answer: 'a'
  },
  {
    id: 18,
    question: 'I cannot find the museum. Can you show me where it is?',
    options: [
      { id: 'a', text: 'Yes, it is across from the bank. Let me show you on the map.' },
      { id: 'b', text: 'Yes, I have been to the museum before.' },
      { id: 'c', text: 'The museum opens at ten o\'clock.' },
      { id: 'd', text: 'Sorry, I lost my map yesterday.' }
    ],
    answer: 'a'
  },
  {
    id: 19,
    question: 'Do you need a bag for your groceries?',
    options: [
      { id: 'a', text: 'Yes, please. I have too many things to carry.' },
      { id: 'b', text: 'Yes, my bag is at home.' },
      { id: 'c', text: 'I bought a lot of groceries today.' },
      { id: 'd', text: 'Plastic bags are bad for the planet.' }
    ],
    answer: 'a'
  },
  {
    id: 20,
    question: 'Is there anything else you want to buy?',
    options: [
      { id: 'a', text: 'No, that is all for today, thanks.' },
      { id: 'b', text: 'Yes, I want to go home.' },
      { id: 'c', text: 'I bought ten things already.' },
      { id: 'd', text: 'The store has many nice things.' }
    ],
    answer: 'a'
  },
  {
    id: 21,
    question: 'Excuse me, I think I am lost. Can you help me find my way home?',
    options: [
      { id: 'a', text: 'Of course. Do you remember your street name?' },
      { id: 'b', text: 'Sorry, I lost my book yesterday.' },
      { id: 'c', text: 'Yes, my home is a long way from here.' },
      { id: 'd', text: 'Thank you, the road is very pretty today.' }
    ],
    answer: 'a'
  },
  {
    id: 22,
    question: 'Officer, I cannot find my mom in this big store. Can you help me?',
    options: [
      { id: 'a', text: 'Yes, stay with me. We will call your mom right away.' },
      { id: 'b', text: 'Yes, the store has many things to buy.' },
      { id: 'c', text: 'I have not seen your mom today.' },
      { id: 'd', text: 'The store opens at ten in the morning.' }
    ],
    answer: 'a'
  },
  {
    id: 23,
    question: 'I lost my class on the field trip. What should I do?',
    options: [
      { id: 'a', text: 'Stay where you are and wait for your teacher to find you.' },
      { id: 'b', text: 'Run quickly back to the school by yourself.' },
      { id: 'c', text: 'Yes, field trips are always very fun.' },
      { id: 'd', text: 'Sorry, I lost my pencil too.' }
    ],
    answer: 'a'
  },
  {
    id: 24,
    question: 'I do not feel well. My stomach hurts.',
    options: [
      { id: 'a', text: 'I am sorry. Let\'s tell a grown-up so you can rest.' },
      { id: 'b', text: 'Yes, my stomach is full from lunch.' },
      { id: 'c', text: 'Stomachs are an important part of the body.' },
      { id: 'd', text: 'I had a small breakfast this morning.' }
    ],
    answer: 'a'
  },
  {
    id: 25,
    question: 'Ouch! I fell and scraped my knee. Can you help me?',
    options: [
      { id: 'a', text: 'Yes, let\'s wash it with water and find a bandage.' },
      { id: 'b', text: 'Yes, knees bend when you sit down.' },
      { id: 'c', text: 'I scraped my elbow at school last week.' },
      { id: 'd', text: 'Sorry, I have never fallen down before.' }
    ],
    answer: 'a'
  },
  {
    id: 26,
    question: 'It is so sunny today. What should we do?',
    options: [
      { id: 'a', text: 'Let\'s wear hats and go play at the park!' },
      { id: 'b', text: 'Yes, it rained a lot yesterday.' },
      { id: 'c', text: 'The sun is very, very far away from us.' },
      { id: 'd', text: 'I think it is going to snow soon.' }
    ],
    answer: 'a'
  },
  {
    id: 27,
    question: 'It is raining hard. Do you have an umbrella?',
    options: [
      { id: 'a', text: 'Yes, you can share mine on the way home.' },
      { id: 'b', text: 'Yes, umbrellas come in many bright colors.' },
      { id: 'c', text: 'I love the smell of rain in the morning.' },
      { id: 'd', text: 'No, my shoes are still at home.' }
    ],
    answer: 'a'
  },
  {
    id: 28,
    question: 'Here is two thousand colones. How much change do I get back?',
    options: [
      { id: 'a', text: 'You get five hundred colones back. Thank you!' },
      { id: 'b', text: 'Colones are the money we use in Costa Rica.' },
      { id: 'c', text: 'Yes, I have a lot of coins in my pocket.' },
      { id: 'd', text: 'I bought a small toy here last week.' }
    ],
    answer: 'a'
  },
  {
    id: 29,
    question: 'What is the total for this bread and these eggs?',
    options: [
      { id: 'a', text: 'It comes to one thousand five hundred colones.' },
      { id: 'b', text: 'Yes, fresh bread tastes the best.' },
      { id: 'c', text: 'Eggs come from chickens on a farm.' },
      { id: 'd', text: 'You can pay tomorrow if that is easier.' }
    ],
    answer: 'a'
  },
  {
    id: 30,
    question: 'What time does the library open today?',
    options: [
      { id: 'a', text: 'It opens at nine o\'clock in the morning.' },
      { id: 'b', text: 'Yes, the library has many new books.' },
      { id: 'c', text: 'I went to the library last week.' },
      { id: 'd', text: 'Reading is my favorite thing to do.' }
    ],
    answer: 'a'
  },
  {
    id: 31,
    question: 'Excuse me, when does this store close tonight?',
    options: [
      { id: 'a', text: 'We close at eight o\'clock. You still have time.' },
      { id: 'b', text: 'Yes, the store is very busy tonight.' },
      { id: 'c', text: 'Sorry, we are closed on Sundays.' },
      { id: 'd', text: 'The store sells food and clothes.' }
    ],
    answer: 'a'
  },
  {
    id: 32,
    question: 'Thank you so much for helping me find the bus!',
    options: [
      { id: 'a', text: 'You are very welcome. I am glad I could help.' },
      { id: 'b', text: 'Yes, you helped me a lot last week too.' },
      { id: 'c', text: 'Thank you for saying thank you.' },
      { id: 'd', text: 'I will help someone else tomorrow.' }
    ],
    answer: 'a'
  },
  {
    id: 33,
    question: 'Oh! I am so sorry I bumped into you. Are you okay?',
    options: [
      { id: 'a', text: 'It\'s okay, no problem. I am fine.' },
      { id: 'b', text: 'Yes, I bumped into the wall yesterday.' },
      { id: 'c', text: 'Yes, the floor is a little slippery here.' },
      { id: 'd', text: 'Sorry, I am in a big hurry today.' }
    ],
    answer: 'a'
  },
  {
    id: 34,
    question: 'Excuse me, how do I get to the post office from here?',
    options: [
      { id: 'a', text: 'Walk two blocks north, then turn east. It will be on your left.' },
      { id: 'b', text: 'Yes, the post office is always very busy.' },
      { id: 'c', text: 'I mailed a letter from the post office last week.' },
      { id: 'd', text: 'The post office is closed on Sundays.' }
    ],
    answer: 'a'
  },
  {
    id: 35,
    question: 'Hi there! I do not know you. Do you want a ride in my car?',
    options: [
      { id: 'a', text: 'No thank you. I will wait for my mom right here.' },
      { id: 'b', text: 'Yes, your car looks very fast and shiny.' },
      { id: 'c', text: 'Sorry, I do not feel like riding in cars today.' },
      { id: 'd', text: 'Where are you going on your trip?' }
    ],
    answer: 'a'
  }
];
