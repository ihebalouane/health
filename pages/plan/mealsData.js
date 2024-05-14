// mealsData.js

export const meals = [
  {
    name: 'Breakfast',
    Bulk: {
      image: '/diet/bulk/1.jpg',
      description: 'A hearty start to the day.',
    },
  },
  {
    name: 'After Snack',
    Cut: {
      image: '/diet/cut/After snack.jpg',
      description: 'A light and healthy breakfast.',
    },
  },
  {
    name: 'Lunch',
    Bulk: {
      image: '/diet/bulk/2.jpg',
      description: 'A large, energy-packed midday meal.',
    },
    Cut: {
      image: '/diet/cut/2.jpg',
      description: 'A balanced, calorie-controlled lunch.',
    },
  },
  {
    name: 'Mid Snack',
    selectedRiskFactors: ['diabetes'],
    Bulk: {
      image: '/diet/bulk/Mid snack.png',
      description: 'A nutritious snack to sustain your energy.',
    },
  },
  {
    name: 'Dinner',
    Bulk: {
      image: '/diet/bulk/dinner.jpeg',
      description: 'A robust and hearty dinner to end your day.',
    },
    Cut: {
      image: '/diet/cut/3.jpeg',
      description: 'A light dinner to support your fitness goals.',
    },
  },
  {
    name: 'Evening Snack',
    selectedRiskFactors: ['cholesterol'],
    Bulk: {
      image: '/diet/bulk/Evening snack.jpg',
      description: 'A final snack to top off your daily caloric intake.',
    },
  },
];
