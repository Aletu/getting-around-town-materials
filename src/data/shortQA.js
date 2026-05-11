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
  }
];
