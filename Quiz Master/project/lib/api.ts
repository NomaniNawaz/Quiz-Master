export async function fetchQuestions(difficulty?: string): Promise<Question[]> {
  // Use local fallback questions since PHP backend is not available in WebContainer
  const fallbackQuestions = [
    // Science & Technology
    {
      id: 1,
      question: "What is the capital of France?",
      option1: "London",
      option2: "Berlin",
      option3: "Paris",
      option4: "Madrid",
      correct_option: 3
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      option1: "Venus",
      option2: "Mars",
      option3: "Jupiter",
      option4: "Saturn",
      correct_option: 2
    },
    {
      id: 3,
      question: "What is the chemical symbol for gold?",
      option1: "Go",
      option2: "Gd",
      option3: "Au",
      option4: "Ag",
      correct_option: 3
    },
    {
      id: 4,
      question: "Who invented the telephone?",
      option1: "Thomas Edison",
      option2: "Alexander Graham Bell",
      option3: "Nikola Tesla",
      option4: "Benjamin Franklin",
      correct_option: 2
    },
    {
      id: 5,
      question: "What is the speed of light in vacuum?",
      option1: "300,000 km/s",
      option2: "150,000 km/s",
      option3: "450,000 km/s",
      option4: "600,000 km/s",
      correct_option: 1
    },
    
    // Mathematics
    {
      id: 6,
      question: "What is 15 × 8?",
      option1: "110",
      option2: "120",
      option3: "130",
      option4: "140",
      correct_option: 2
    },
    {
      id: 7,
      question: "What is the square root of 144?",
      option1: "11",
      option2: "12",
      option3: "13",
      option4: "14",
      correct_option: 2
    },
    {
      id: 8,
      question: "What is 25% of 200?",
      option1: "40",
      option2: "45",
      option3: "50",
      option4: "55",
      correct_option: 3
    },
    {
      id: 9,
      question: "What is the value of π (pi) approximately?",
      option1: "3.14",
      option2: "3.41",
      option3: "2.14",
      option4: "4.14",
      correct_option: 1
    },
    {
      id: 10,
      question: "If x + 5 = 12, what is x?",
      option1: "6",
      option2: "7",
      option3: "8",
      option4: "9",
      correct_option: 2
    },

    // History & Geography
    {
      id: 11,
      question: "In which year did World War II end?",
      option1: "1944",
      option2: "1945",
      option3: "1946",
      option4: "1947",
      correct_option: 2
    },
    {
      id: 12,
      question: "What is the largest ocean on Earth?",
      option1: "Atlantic Ocean",
      option2: "Indian Ocean",
      option3: "Arctic Ocean",
      option4: "Pacific Ocean",
      correct_option: 4
    },
    {
      id: 13,
      question: "Which country is known as the Land of the Rising Sun?",
      option1: "China",
      option2: "Japan",
      option3: "Korea",
      option4: "Thailand",
      correct_option: 2
    },
    {
      id: 14,
      question: "What is the longest river in the world?",
      option1: "Amazon River",
      option2: "Nile River",
      option3: "Yangtze River",
      option4: "Mississippi River",
      correct_option: 2
    },
    {
      id: 15,
      question: "Who was the first President of the United States?",
      option1: "Thomas Jefferson",
      option2: "John Adams",
      option3: "George Washington",
      option4: "Benjamin Franklin",
      correct_option: 3
    },

    // Sports & Entertainment
    {
      id: 16,
      question: "How many players are there in a basketball team on court?",
      option1: "4",
      option2: "5",
      option3: "6",
      option4: "7",
      correct_option: 2
    },
    {
      id: 17,
      question: "Which sport is known as 'The Beautiful Game'?",
      option1: "Basketball",
      option2: "Tennis",
      option3: "Football/Soccer",
      option4: "Cricket",
      correct_option: 3
    },
    {
      id: 18,
      question: "Who directed the movie 'Titanic'?",
      option1: "Steven Spielberg",
      option2: "James Cameron",
      option3: "Christopher Nolan",
      option4: "Martin Scorsese",
      correct_option: 2
    },
    {
      id: 19,
      question: "In which year were the first modern Olympics held?",
      option1: "1892",
      option2: "1896",
      option3: "1900",
      option4: "1904",
      correct_option: 2
    },
    {
      id: 20,
      question: "Which movie won the Academy Award for Best Picture in 2020?",
      option1: "1917",
      option2: "Joker",
      option3: "Parasite",
      option4: "Once Upon a Time in Hollywood",
      correct_option: 3
    },

    // Literature & Arts
    {
      id: 21,
      question: "Who wrote 'Romeo and Juliet'?",
      option1: "Charles Dickens",
      option2: "William Shakespeare",
      option3: "Jane Austen",
      option4: "Mark Twain",
      correct_option: 2
    },
    {
      id: 22,
      question: "Who painted the Mona Lisa?",
      option1: "Vincent van Gogh",
      option2: "Pablo Picasso",
      option3: "Leonardo da Vinci",
      option4: "Michelangelo",
      correct_option: 3
    },
    {
      id: 23,
      question: "Which novel begins with 'It was the best of times, it was the worst of times'?",
      option1: "Great Expectations",
      option2: "A Tale of Two Cities",
      option3: "Oliver Twist",
      option4: "David Copperfield",
      correct_option: 2
    },
    {
      id: 24,
      question: "Who composed 'The Four Seasons'?",
      option1: "Mozart",
      option2: "Beethoven",
      option3: "Vivaldi",
      option4: "Bach",
      correct_option: 3
    },
    {
      id: 25,
      question: "What is the first book in the Harry Potter series?",
      option1: "Chamber of Secrets",
      option2: "Philosopher's Stone",
      option3: "Prisoner of Azkaban",
      option4: "Goblet of Fire",
      correct_option: 2
    },

    // Technology & Programming
    {
      id: 26,
      question: "Which programming language is known as the 'language of the web'?",
      option1: "Python",
      option2: "Java",
      option3: "JavaScript",
      option4: "C++",
      correct_option: 3
    },
    {
      id: 27,
      question: "What does 'HTML' stand for?",
      option1: "Hyper Text Markup Language",
      option2: "High Tech Modern Language",
      option3: "Home Tool Markup Language",
      option4: "Hyperlink and Text Markup Language",
      correct_option: 1
    },
    {
      id: 28,
      question: "Who founded Microsoft?",
      option1: "Steve Jobs",
      option2: "Bill Gates",
      option3: "Mark Zuckerberg",
      option4: "Larry Page",
      correct_option: 2
    },
    {
      id: 29,
      question: "What does 'AI' stand for in technology?",
      option1: "Automated Intelligence",
      option2: "Artificial Intelligence",
      option3: "Advanced Integration",
      option4: "Algorithmic Interface",
      correct_option: 2
    },
    {
      id: 30,
      question: "Which company developed the Android operating system?",
      option1: "Apple",
      option2: "Microsoft",
      option3: "Google",
      option4: "Samsung",
      correct_option: 3
    },

    // General Knowledge
    {
      id: 31,
      question: "What is the smallest country in the world?",
      option1: "Monaco",
      option2: "Nauru",
      option3: "Vatican City",
      option4: "San Marino",
      correct_option: 3
    },
    {
      id: 32,
      question: "How many continents are there?",
      option1: "5",
      option2: "6",
      option3: "7",
      option4: "8",
      correct_option: 3
    },
    {
      id: 33,
      question: "What is the currency of Japan?",
      option1: "Yuan",
      option2: "Won",
      option3: "Yen",
      option4: "Rupiah",
      correct_option: 3
    },
    {
      id: 34,
      question: "Which vitamin is produced when skin is exposed to sunlight?",
      option1: "Vitamin A",
      option2: "Vitamin B",
      option3: "Vitamin C",
      option4: "Vitamin D",
      correct_option: 4
    },
    {
      id: 35,
      question: "What is the hardest natural substance on Earth?",
      option1: "Gold",
      option2: "Iron",
      option3: "Diamond",
      option4: "Platinum",
      correct_option: 3
    },

    // Food & Culture
    {
      id: 36,
      question: "Which spice is derived from the Crocus flower?",
      option1: "Turmeric",
      option2: "Saffron",
      option3: "Cardamom",
      option4: "Cinnamon",
      correct_option: 2
    },
    {
      id: 37,
      question: "What is the main ingredient in guacamole?",
      option1: "Tomato",
      option2: "Avocado",
      option3: "Onion",
      option4: "Pepper",
      correct_option: 2
    },
    {
      id: 38,
      question: "Which country is famous for inventing pizza?",
      option1: "France",
      option2: "Spain",
      option3: "Italy",
      option4: "Greece",
      correct_option: 3
    },
    {
      id: 39,
      question: "What is the most consumed beverage in the world after water?",
      option1: "Coffee",
      option2: "Tea",
      option3: "Juice",
      option4: "Soda",
      correct_option: 2
    },
    {
      id: 40,
      question: "Which festival is known as the 'Festival of Colors'?",
      option1: "Diwali",
      option2: "Holi",
      option3: "Eid",
      option4: "Christmas",
      correct_option: 2
    },

    // Animals & Nature
    {
      id: 41,
      question: "What is the largest mammal in the world?",
      option1: "Elephant",
      option2: "Blue Whale",
      option3: "Giraffe",
      option4: "Hippopotamus",
      correct_option: 2
    },
    {
      id: 42,
      question: "How many hearts does an octopus have?",
      option1: "1",
      option2: "2",
      option3: "3",
      option4: "4",
      correct_option: 3
    },
    {
      id: 43,
      question: "Which bird is known for its ability to mimic human speech?",
      option1: "Eagle",
      option2: "Parrot",
      option3: "Owl",
      option4: "Peacock",
      correct_option: 2
    },
    {
      id: 44,
      question: "What is the fastest land animal?",
      option1: "Lion",
      option2: "Horse",
      option3: "Cheetah",
      option4: "Leopard",
      correct_option: 3
    },
    {
      id: 45,
      question: "Which gas do plants absorb from the atmosphere during photosynthesis?",
      option1: "Oxygen",
      option2: "Nitrogen",
      option3: "Carbon Dioxide",
      option4: "Hydrogen",
      correct_option: 3
    },

    // Bonus Questions
    {
      id: 46,
      question: "What is the study of earthquakes called?",
      option1: "Geology",
      option2: "Seismology",
      option3: "Meteorology",
      option4: "Astronomy",
      correct_option: 2
    },
    {
      id: 47,
      question: "Which element has the chemical symbol 'O'?",
      option1: "Gold",
      option2: "Silver",
      option3: "Oxygen",
      option4: "Iron",
      correct_option: 3
    },
    {
      id: 48,
      question: "In which city is the famous Taj Mahal located?",
      option1: "Delhi",
      option2: "Mumbai",
      option3: "Agra",
      option4: "Jaipur",
      correct_option: 3
    },
    {
      id: 49,
      question: "What is the largest planet in our solar system?",
      option1: "Saturn",
      option2: "Jupiter",
      option3: "Neptune",
      option4: "Uranus",
      correct_option: 2
    },
    {
      id: 50,
      question: "What is the largest desert in the world?",
      option1: "Sahara Desert",
      option2: "Gobi Desert",
      option3: "Antarctica",
      option4: "Arabian Desert",
      correct_option: 3
    }
  ];

  // Apply difficulty-based filtering
  let filteredQuestions = [...fallbackQuestions];
  
  if (difficulty) {
    const questionCount = {
      easy: 10,
      medium: 15,
      hard: 20,
      expert: 25
    }[difficulty] || 15;
    
    // Better shuffling algorithm
    for (let i = fallbackQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fallbackQuestions[i], fallbackQuestions[j]] = [fallbackQuestions[j], fallbackQuestions[i]];
    }
    filteredQuestions = fallbackQuestions.slice(0, questionCount);
  } else {
    // Better shuffling for default case
    for (let i = fallbackQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fallbackQuestions[i], fallbackQuestions[j]] = [fallbackQuestions[j], fallbackQuestions[i]];
    }
    filteredQuestions = fallbackQuestions.slice(0, 15);
  }
  
  // Simulate async behavior to maintain the same interface
  return new Promise((resolve) => {
    setTimeout(() => resolve(filteredQuestions), 100);
  });
}

export async function submitScore(userId: string, score: number, totalQuestions: number): Promise<boolean> {
  // Since we don't have a backend, we'll simulate successful submission
  // In a real application, this would save to a database or external service
  console.log('Score submitted:', { userId, score, totalQuestions });
  
  // Simulate async behavior
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 200);
  });
}