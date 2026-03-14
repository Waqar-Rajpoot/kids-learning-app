// Learning Data for Kids App

export interface LearningItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: 'animal' | 'bird' | 'fruit';
  food?: string;
  fact?: string;
}

export interface Poem {
  id: string;
  title: string;
  emoji: string;
  lines: string[];
  color: string;
}

export interface AlphabetItem {
  letter: string;
  word: string;
  emoji: string;
  phonics: string;
}

export const animals: LearningItem[] = [
  { id: '1', name: 'Alligator', emoji: '🐊', color: 'bg-green-50', category: 'animal', food: 'Fish & Meat', fact: 'I have very strong jaws!' },
  { id: '2', name: 'Bear', emoji: '🐻', color: 'bg-amber-50', category: 'animal', food: 'Honey & Berries', fact: 'I love to sleep in winter!' },
  { id: '3', name: 'Cat', emoji: '🐱', color: 'bg-orange-50', category: 'animal', food: 'Milk & Fish', fact: 'I can jump very high!' },
  { id: '4', name: 'Dog', emoji: '🐕', color: 'bg-yellow-50', category: 'animal', food: 'Bones', fact: 'I am your best friend!' },
  { id: '5', name: 'Elephant', emoji: '🐘', color: 'bg-slate-50', category: 'animal', food: 'Leaves & Fruit', fact: 'I have a very long trunk!' },
  { id: '6', name: 'Fox', emoji: '🦊', color: 'bg-orange-50', category: 'animal', food: 'Chicken', fact: 'I am very clever and fast!' },
  { id: '7', name: 'Giraffe', emoji: '🦒', color: 'bg-yellow-50', category: 'animal', food: 'Leaves', fact: 'I have a very long neck!' },
  { id: '8', name: 'Horse', emoji: '🐴', color: 'bg-amber-50', category: 'animal', food: 'Hay & Carrots', fact: 'I can run very fast!' },
  { id: '9', name: 'Iguana', emoji: '🦎', color: 'bg-green-50', category: 'animal', food: 'Plants', fact: 'I am a cool green lizard!' },
  { id: '10', name: 'Jaguar', emoji: '🐆', color: 'bg-yellow-50', category: 'animal', food: 'Meat', fact: 'I am a fast spotted cat!' },
  { id: '11', name: 'Kangaroo', emoji: '🦘', color: 'bg-orange-50', category: 'animal', food: 'Grass', fact: 'I carry my baby in a pouch!' },
  { id: '12', name: 'Lion', emoji: '🦁', color: 'bg-amber-50', category: 'animal', food: 'Meat', fact: 'I am the King of the jungle!' },
  { id: '13', name: 'Monkey', emoji: '🐵', color: 'bg-amber-50', category: 'animal', food: 'Bananas', fact: 'I love to swing on trees!' },
  { id: '14', name: 'Narwhal', emoji: '🐋', color: 'bg-blue-50', category: 'animal', food: 'Fish', fact: 'I have a long unicorn horn!' },
  { id: '15', name: 'Octopus', emoji: '🐙', color: 'bg-purple-50', category: 'animal', food: 'Crabs', fact: 'I have eight long arms!' },
  { id: '16', name: 'Panda', emoji: '🐼', color: 'bg-gray-50', category: 'animal', food: 'Bamboo', fact: 'I love to climb trees!' },
  { id: '17', name: 'Quokka', emoji: '🐹', color: 'bg-brown-50', category: 'animal', food: 'Leaves', fact: 'I am the world\'s happiest animal!' },
  { id: '18', name: 'Rabbit', emoji: '🐰', color: 'bg-pink-50', category: 'animal', food: 'Carrots', fact: 'I can hop very fast!' },
  { id: '19', name: 'Snake', emoji: '🐍', color: 'bg-green-50', category: 'animal', food: 'Small bugs', fact: 'I slide on the ground!' },
  { id: '20', name: 'Tiger', emoji: '🐯', color: 'bg-orange-50', category: 'animal', food: 'Meat', fact: 'I have beautiful stripes!' },
  { id: '21', name: 'Unicorn', emoji: '🦄', color: 'bg-pink-50', category: 'animal', food: 'Magic Sparkles', fact: 'I am a magical horse!' },
  { id: '22', name: 'Vulture', emoji: '🦅', color: 'bg-gray-50', category: 'animal', food: 'Meat', fact: 'I fly very high in the sky!' },
  { id: '23', name: 'Whale', emoji: '🐳', color: 'bg-blue-50', category: 'animal', food: 'Plankton', fact: 'I am the biggest animal!' },
  { id: '24', name: 'X-ray Fish', emoji: '🐟', color: 'bg-cyan-50', category: 'animal', food: 'Small bugs', fact: 'You can see through me!' },
  { id: '25', name: 'Yak', emoji: '🐂', color: 'bg-brown-50', category: 'animal', food: 'Grass', fact: 'I have long warm fur!' },
  { id: '26', name: 'Zebra', emoji: '🦓', color: 'bg-slate-50', category: 'animal', food: 'Grass', fact: 'I have black and white stripes!' },
];

export const birds: LearningItem[] = [
  { id: '1', name: 'Albatross', emoji: '🕊️', color: 'bg-white', category: 'bird', food: 'Fish', fact: 'I can fly for a long time!' },
  { id: '2', name: 'Bluebird', emoji: '🐦', color: 'bg-blue-50', category: 'bird', food: 'Worms', fact: 'I am a beautiful blue color!' },
  { id: '3', name: 'Crow', emoji: '🐦‍⬛', color: 'bg-slate-50', category: 'bird', food: 'Seeds', fact: 'I am very smart!' },
  { id: '4', name: 'Duck', emoji: '🦆', color: 'bg-yellow-50', category: 'bird', food: 'Bread', fact: 'I love to quack and swim!' },
  { id: '5', name: 'Eagle', emoji: '🦅', color: 'bg-amber-50', category: 'bird', food: 'Fish', fact: 'I can fly very high!' },
  { id: '6', name: 'Flamingo', emoji: '🦩', color: 'bg-pink-50', category: 'bird', food: 'Shrimp', fact: 'I am pink and stand on one leg!' },
  { id: '7', name: 'Goose', emoji: '🦢', color: 'bg-gray-50', category: 'bird', food: 'Grass', fact: 'I am very gracefull!' },
  { id: '8', name: 'Hummingbird', emoji: '🐦', color: 'bg-green-50', category: 'bird', food: 'Nectar', fact: 'I am the smallest bird!' },
  { id: '9', name: 'Ibis', emoji: '🦜', color: 'bg-orange-50', category: 'bird', food: 'Fish', fact: 'I have a long curved beak!' },
  { id: '10', name: 'Jay', emoji: '🐦', color: 'bg-blue-50', category: 'bird', food: 'Nuts', fact: 'I am a noisy blue bird!' },
  { id: '11', name: 'Kiwi', emoji: '🥝', color: 'bg-brown-50', category: 'bird', food: 'Bugs', fact: 'I am a bird that cannot fly!' },
  { id: '12', name: 'Lark', emoji: '🐦', color: 'bg-yellow-50', category: 'bird', food: 'Seeds', fact: 'I sing early in the morning!' },
  { id: '13', name: 'Magpie', emoji: '🐦‍⬛', color: 'bg-slate-50', category: 'bird', food: 'Insects', fact: 'I like shiny things!' },
  { id: '14', name: 'Nightingale', emoji: '🐦', color: 'bg-brown-50', category: 'bird', food: 'Bugs', fact: 'I sing beautiful songs at night!' },
  { id: '15', name: 'Owl', emoji: '🦉', color: 'bg-slate-50', category: 'bird', food: 'Mice', fact: 'I stay awake at night!' },
  { id: '16', name: 'Parrot', emoji: '🦜', color: 'bg-green-50', category: 'bird', food: 'Seeds', fact: 'I can talk like you!' },
  { id: '17', name: 'Quail', emoji: '🐦', color: 'bg-brown-50', category: 'bird', food: 'Seeds', fact: 'I lay small spotted eggs!' },
  { id: '18', name: 'Robin', emoji: '🐦', color: 'bg-red-50', category: 'bird', food: 'Worms', fact: 'I have a bright red chest!' },
  { id: '19', name: 'Swan', emoji: '🦢', color: 'bg-white', category: 'bird', food: 'Plants', fact: 'I am very graceful!' },
  { id: '20', name: 'Toucan', emoji: '🦜', color: 'bg-orange-50', category: 'bird', food: 'Fruits', fact: 'I have a colorful bill!' },
  { id: '21', name: 'Umbrellabird', emoji: '🐦', color: 'bg-black', category: 'bird', food: 'Fruit', fact: 'I have a top hat of feathers!' },
  { id: '22', name: 'Vulture', emoji: '🦅', color: 'bg-gray-50', category: 'bird', food: 'Meat', fact: 'I am a big strong bird!' },
  { id: '23', name: 'Woodpecker', emoji: '🐦', color: 'bg-red-50', category: 'bird', food: 'Bugs', fact: 'I tap on trees with my beak!' },
  { id: '24', name: 'Xenops', emoji: '🐦', color: 'bg-brown-50', category: 'bird', food: 'Insects', fact: 'I hop on tree branches!' },
  { id: '25', name: 'Yellowhammer', emoji: '🐦', color: 'bg-yellow-50', category: 'bird', food: 'Seeds', fact: 'I am a bright yellow bird!' },
  { id: '26', name: 'Zebra Finch', emoji: '🐦', color: 'bg-gray-50', category: 'bird', food: 'Seeds', fact: 'I have stripes like a zebra!' },
];

export const fruits: LearningItem[] = [
  { id: '1', name: 'Apple', emoji: '🍎', color: 'bg-red-50', category: 'fruit', food: 'Sun', fact: 'I am sweet and crunchy!' },
  { id: '2', name: 'Banana', emoji: '🍌', color: 'bg-yellow-50', category: 'fruit', food: 'Sun', fact: 'I give you lots of energy!' },
  { id: '3', name: 'Cherry', emoji: '🍒', color: 'bg-red-50', category: 'fruit', food: 'Sun', fact: 'I am a small sweet red fruit!' },
  { id: '4', name: 'Dragon Fruit', emoji: '🐲', color: 'bg-pink-50', category: 'fruit', food: 'Sun', fact: 'I look like a pink dragon!' },
  { id: '5', name: 'Elderberry', emoji: '🫐', color: 'bg-purple-50', category: 'fruit', food: 'Sun', fact: 'I am a tiny purple berry!' },
  { id: '6', name: 'Fig', emoji: '🫐', color: 'bg-purple-50', category: 'fruit', food: 'Sun', fact: 'I am soft and very sweet!' },
  { id: '7', name: 'Grapes', emoji: '🍇', color: 'bg-purple-50', category: 'fruit', food: 'Sun', fact: 'We grow in big bunches!' },
  { id: '8', name: 'Honeydew', emoji: '🍈', color: 'bg-green-50', category: 'fruit', food: 'Sun', fact: 'I am a sweet green melon!' },
  { id: '9', name: 'Iced Melon', emoji: '🍉', color: 'bg-red-50', category: 'fruit', food: 'Sun', fact: 'I am very juicy and sweet!' },
  { id: '10', name: 'Jackfruit', emoji: '🥭', color: 'bg-yellow-50', category: 'fruit', food: 'Sun', fact: 'I am a very big fruit!' },
  { id: '11', name: 'Kiwi', emoji: '🥝', color: 'bg-green-50', category: 'fruit', food: 'Sun', fact: 'I am fuzzy on the outside!' },
  { id: '12', name: 'Lemon', emoji: '🍋', color: 'bg-yellow-50', category: 'fruit', food: 'Sun', fact: 'I am very sour and yellow!' },
  { id: '13', name: 'Mango', emoji: '🥭', color: 'bg-orange-50', category: 'fruit', food: 'Sun', fact: 'I am the king of fruits!' },
  { id: '14', name: 'Nectarine', emoji: '🍑', color: 'bg-orange-50', category: 'fruit', food: 'Sun', fact: 'I am like a smooth peach!' },
  { id: '15', name: 'Orange', emoji: '🍊', color: 'bg-orange-50', category: 'fruit', food: 'Sun', fact: 'I have lots of Vitamin C!' },
  { id: '16', name: 'Pineapple', emoji: '🍍', color: 'bg-yellow-50', category: 'fruit', food: 'Sun', fact: 'I have a crown on my head!' },
  { id: '17', name: 'Quince', emoji: '🍐', color: 'bg-yellow-50', category: 'fruit', food: 'Sun', fact: 'I look like an orange pear!' },
  { id: '18', name: 'Raspberry', emoji: '🫐', color: 'bg-red-50', category: 'fruit', food: 'Sun', fact: 'I am a soft red berry!' },
  { id: '19', name: 'Strawberry', emoji: '🍓', color: 'bg-pink-50', category: 'fruit', food: 'Sun', fact: 'I have seeds on my skin!' },
  { id: '20', name: 'Tangerine', emoji: '🍊', color: 'bg-orange-50', category: 'fruit', food: 'Sun', fact: 'I am a small sweet orange!' },
  { id: '21', name: 'Ugli Fruit', emoji: '🍊', color: 'bg-green-50', category: 'fruit', food: 'Sun', fact: 'I am sweet inside!' },
  { id: '22', name: 'Vanilla Bean', emoji: '🫘', color: 'bg-brown-50', category: 'fruit', food: 'Sun', fact: 'I make things smell good!' },
  { id: '23', name: 'Watermelon', emoji: '🍉', color: 'bg-red-50', category: 'fruit', food: 'Sun', fact: 'I am green out, red in!' },
  { id: '24', name: 'Xigua', emoji: '🍉', color: 'bg-green-50', category: 'fruit', food: 'Sun', fact: 'I am a type of melon!' },
  { id: '25', name: 'Yellow Peach', emoji: '🍑', color: 'bg-orange-50', category: 'fruit', food: 'Sun', fact: 'I am sweet and juicy!' },
  { id: '26', name: 'Zucchini', emoji: '🥒', color: 'bg-green-50', category: 'fruit', food: 'Sun', fact: 'I am a green fruit-veggie!' },
];

export const poems: Poem[] = [
  { id: '1', title: 'Twinkle Star', emoji: '⭐', color: 'from-yellow-400 to-amber-500', lines: ['Twinkle, twinkle, little star,', 'How I wonder what you are!', 'Up above the world so high,', 'Like a diamond in the sky.'] },
  { id: '2', title: 'Little Teapot', emoji: '🫖', color: 'from-blue-400 to-cyan-500', lines: ['I am a little teapot,', 'Short and stout.', 'Here is my handle,', 'Here is my spout.'] },
  { id: '3', title: 'Rain Rain', emoji: '🌧️', color: 'from-blue-500 to-indigo-500', lines: ['Rain, rain, go away,', 'Come again another day.', 'Little Johnny wants to play,', 'Rain, rain, go away.'] },
  { id: '4', title: 'Baa Baa Sheep', emoji: '🐑', color: 'from-slate-400 to-slate-600', lines: ['Baa, baa, black sheep,', 'Have you any wool?', 'Yes sir, yes sir,', 'Three bags full!'] },
  { id: '5', title: 'Humpty Dumpty', emoji: '🥚', color: 'from-orange-400 to-red-500', lines: ['Humpty Dumpty sat on a wall,', 'Humpty Dumpty had a great fall.', 'All the kings horses,', 'And all the kings men.'] },
  { id: '6', title: 'Incy Spider', emoji: '🕷️', color: 'from-purple-400 to-blue-500', lines: ['The incy wincy spider,', 'Climbed up the spout.', 'Down came the rain,', 'And washed him out!'] },
  { id: '7', title: 'Mary Lamb', emoji: '🐑', color: 'from-pink-400 to-rose-500', lines: ['Mary had a little lamb,', 'Its fleece was white as snow.', 'And everywhere that Mary went,', 'The lamb was sure to go.'] },
  { id: '8', title: 'Hey Diddle', emoji: '🐮', color: 'from-indigo-400 to-purple-500', lines: ['Hey diddle diddle,', 'The cat and the fiddle.', 'The cow jumped over,', 'Over the moon!'] },
  { id: '9', title: 'Jack and Jill', emoji: '🪣', color: 'from-emerald-400 to-green-500', lines: ['Jack and Jill went up,', 'Up the big hill.', 'To fetch a pail,', 'Of nice cool water.'] },
  { id: '10', title: 'Wheels on Bus', emoji: '🚌', color: 'from-yellow-500 to-orange-400', lines: ['The wheels on the bus,', 'Go round and round.', 'All through the town,', 'Round and round!'] },
];

export const alphabets: AlphabetItem[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', phonics: 'ah' },
  { letter: 'B', word: 'Ball', emoji: '⚽', phonics: 'buh' },
  { letter: 'C', word: 'Cat', emoji: '🐱', phonics: 'kuh' },
  { letter: 'D', word: 'Dog', emoji: '🐶', phonics: 'duh' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', phonics: 'eh' },
  { letter: 'F', word: 'Fish', emoji: '🐟', phonics: 'fuh' },
  { letter: 'G', word: 'Grapes', emoji: '🍇', phonics: 'guh' },
  { letter: 'H', word: 'Horse', emoji: '🐴', phonics: 'huh' },
  { letter: 'I', word: 'Igloo', emoji: '🏠', phonics: 'ih' },
  { letter: 'J', word: 'Jet', emoji: '✈️', phonics: 'juh' },
  { letter: 'K', word: 'Kite', emoji: '🪁', phonics: 'kuh' },
  { letter: 'L', word: 'Lion', emoji: '🦁', phonics: 'ul' },
  { letter: 'M', word: 'Moon', emoji: '🌙', phonics: 'um' },
  { letter: 'N', word: 'Net', emoji: '🕸️', phonics: 'un' },
  { letter: 'O', word: 'Owl', emoji: '🦉', phonics: 'o' },
  { letter: 'P', word: 'Panda', emoji: '🐼', phonics: 'puh' },
  { letter: 'Q', word: 'Queen', emoji: '👸', phonics: 'kwuh' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰', phonics: 'er' },
  { letter: 'S', word: 'Sun', emoji: '☀️', phonics: 'ss' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', phonics: 'tuh' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', phonics: 'uh' },
  { letter: 'V', word: 'Van', emoji: '🚐', phonics: 'vuh' },
  { letter: 'W', word: 'Watch', emoji: '⌚', phonics: 'wuh' },
  { letter: 'X', word: 'Xylophone', emoji: '🎹', phonics: 'ks' },
  { letter: 'Y', word: 'Yo-yo', emoji: '🪀', phonics: 'yuh' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', phonics: 'zuh' },
];

export const matchingPuzzles = [
  [{ id: '1', emoji: '🍎', name: 'Apple' }, { id: '2', emoji: '🍌', name: 'Banana' }, { id: '3', emoji: '🍇', name: 'Grapes' }, { id: '4', emoji: '🍊', name: 'Orange' }],
];

export const spellingWords = [
  { id: '1', word: 'CAT', emoji: '🐱', hint: 'Meow' }, { id: '2', word: 'DOG', emoji: '🐕', hint: 'Woof' }, { id: '3', word: 'SUN', emoji: '☀️', hint: 'Bright' }
];


export const numbers = [
  { num: 1, word: 'One', emoji: '1️⃣', objects: '🍎' },
  { num: 2, word: 'Two', emoji: '2️⃣', objects: '🍎🍎' },
  { num: 3, word: 'Three', emoji: '3️⃣', objects: '🍎🍎🍎' },
  { num: 4, word: 'Four', emoji: '4️⃣', objects: '🍎🍎🍎🍎' },
  { num: 5, word: 'Five', emoji: '5️⃣', objects: '🍎🍎🍎🍎🍎' },
  { num: 6, word: 'Six', emoji: '6️⃣', objects: '🍎🍎🍎🍎🍎🍎' },
  { num: 7, word: 'Seven', emoji: '7️⃣', objects: '🍎🍎🍎🍎🍎🍎🍎' },
  { num: 8, word: 'Eight', emoji: '8️⃣', objects: '🍎🍎🍎🍎🍎🍎🍎🍎' },
  { num: 9, word: 'Nine', emoji: '9️⃣', objects: '🍎🍎🍎🍎🍎🍎🍎🍎🍎' },
  { num: 10, word: 'Ten', emoji: '🔟', objects: '🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎' },
];



































































// =====================  Done   ========================

/*

 // 2. Seed Spelling Words
    const spellingRef = collection(db, "spellingWords");
    const spellingCheck = await getDocs(query(spellingRef, limit(1)));

    if (spellingCheck.empty) {
      const spellingWords = [
        { word: 'CAT', emoji: '🐱', hint: 'Meow' },
        { word: 'DOG', emoji: '🐕', hint: 'Woof' },
        { word: 'SUN', emoji: '☀️', hint: 'Bright' }
      ];

      for (const word of spellingWords) {
        await addDoc(spellingRef, word);
      }
      console.log("✅ Spelling Words seeded!");
    }


*/ 






/*

// 1. Seed Matching Puzzles
    const matchingRef = collection(db, "matchingPuzzles");
    const matchingCheck = await getDocs(query(matchingRef, limit(1)));
    
    if (matchingCheck.empty) {
      const matchingPuzzles = [
        {
          items: [
            { id: '1', emoji: '🍎', name: 'Apple' },
            { id: '2', emoji: '🍌', name: 'Banana' },
            { id: '3', emoji: '🍇', name: 'Grapes' },
            { id: '4', emoji: '🍊', name: 'Orange' }
          ]
        }
      ];

      for (const puzzle of matchingPuzzles) {
        await addDoc(matchingRef, puzzle);
      }
      console.log("✅ Matching Puzzles seeded!");
    }

*/ 





/*
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

export const seedMemoryLevels = async () => {
  try {
    const memoryRef = collection(db, "memoryLevels");
    // Check if collection already exists/has data
    const memoryCheck = await getDocs(query(memoryRef, limit(1)));

    if (memoryCheck.empty) {
      console.log("🌱 Starting database seed...");
      const memoryLevels = [
        { theme: 'Animals', order: 1, emojis: ['🦁', '🐵', '🐱', '🐶'] },
        { theme: 'Fruits', order: 2, emojis: ['🍎', '🍌', '🍇', '🍓'] },
        { theme: 'Space', order: 3, emojis: ['🌍', '🪐', '☄️', '🛰️'] }
      ];

      for (const lv of memoryLevels) {
        await addDoc(memoryRef, lv);
      }
      console.log("✅ Memory Levels saved to Firestore!");
    } else {
      console.log("ℹ️ Collection 'memoryLevels' already exists. No data added.");
    }
  } catch (error) {
    console.error("❌ Firestore Seed Error:", error);
  }
};

*/




/*

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

export const seedColorLevels = async () => {
  try {
    const colorRef = collection(db, "colorLevels");
    const colorCheck = await getDocs(query(colorRef, limit(1)));

    if (colorCheck.empty) {
      console.log("🌱 Seeding Color Levels...");
      const colorLevels = [
        { order: 1, colors: ['#FF0000', '#00FF00', '#0000FF'], names: ['Red', 'Green', 'Blue'] },
        { order: 2, colors: ['#FFFF00', '#FF00FF', '#00FFFF'], names: ['Yellow', 'Pink', 'Cyan'] },
        { order: 3, colors: ['#FFA500', '#800080', '#008000', '#000000'], names: ['Orange', 'Purple', 'Green', 'Black'] },
        { order: 4, colors: ['#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'], names: ['Pink', 'Brown', 'Gray', 'White'] },
        { order: 5, colors: ['#FFD700', '#C0C0C0', '#4B0082', '#808000'], names: ['Gold', 'Silver', 'Indigo', 'Olive'] },
      ];

      for (const lv of colorLevels) {
        await addDoc(colorRef, lv);
      }
      console.log("✅ Color Levels seeded!");
    }
  } catch (error) {
    console.error("❌ Error seeding color levels:", error);
  }
};

*/ 






/*

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

// ... previous seed functions ...

export const seedShadowLevels = async () => {
  try {
    const shadowRef = collection(db, "shadowLevels");
    const shadowCheck = await getDocs(query(shadowRef, limit(1)));

    if (shadowCheck.empty) {
      console.log("🌱 Seeding Shadow Levels...");
      const shadowLevels = [
        { item: '🍎', name: 'Apple', order: 1 },
        { item: '🦁', name: 'Lion', order: 2 },
        { item: '🐘', name: 'Elephant', order: 3 },
        { item: '🍇', name: 'Grapes', order: 4 },
        { item: '🦒', name: 'Giraffe', order: 5 },
        { item: '🦓', name: 'Zebra', order: 6 },
        { item: '🍌', name: 'Banana', order: 7 },
        { item: '🐢', name: 'Turtle', order: 8 },
        { item: '🦋', name: 'Butterfly', order: 9 },
        { item: '🐙', name: 'Octopus', order: 10 },
      ];

      for (const lv of shadowLevels) {
        await addDoc(shadowRef, lv);
      }
      console.log("✅ Shadow Levels seeded!");
    }
  } catch (error) {
    console.error("❌ Error seeding shadow levels:", error);
  }
};

*/ 








/*

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

// ... (keep your existing seed functions)

export const seedAnomalyLevels = async () => {
  try {
    const anomalyRef = collection(db, "anomalyLevels");
    const checkSnapshot = await getDocs(query(anomalyRef, limit(1)));

    if (checkSnapshot.empty) {
      console.log("🌱 Seeding Anomaly Levels...");
      const levels = [
        { items: ['🍎', '🍎', '🍌', '🍎'], odd: 2, msg: 'Banana is the odd one!', order: 1 },
        { items: ['🚗', '🚕', '🚙', '✈️'], odd: 3, msg: 'The airplane flies in the sky!', order: 2 },
        { items: ['🐘', '🐘', '🐘', '🐭'], odd: 3, msg: 'The mouse is tiny!', order: 3 },
        { items: ['☁️', '☁️', '☀️', '☁️'], odd: 2, msg: 'The sun is shining bright!', order: 4 },
        { items: ['🐶', '🐱', '🐶', '🐶'], odd: 1, msg: 'Meow! The cat is different!', order: 5 },
        { items: ['🟢', '🔴', '🔴', '🔴'], odd: 0, msg: 'Green is the different color!', order: 6 },
        { items: ['🍕', '🍕', '🍦', '🍕'], odd: 2, msg: 'Ice cream is cold and yummy!', order: 7 },
        { items: ['👟', '👟', '👟', '🎩'], odd: 3, msg: 'The hat goes on your head!', order: 8 },
        { items: ['🎸', '🎸', '🥁', '🎸'], odd: 2, msg: 'The drum makes a boom boom sound!', order: 9 },
        { items: ['🌙', '⭐', '⭐', '⭐'], odd: 0, msg: 'The moon glows at night!', order: 10 },
      ];

      for (const lv of levels) {
        await addDoc(anomalyRef, lv);
      }
      console.log("✅ Anomaly Levels seeded!");
    }
  } catch (error) {
    console.error("❌ Error seeding anomalies:", error);
  }
};

*/ 






// import { db } from '@/lib/firebase';
// import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

// // ... (keep your existing seed functions)

// export const seedVectorLevels = async () => {
//   try {
//     const vectorRef = collection(db, "vectorLevels");
//     const checkSnapshot = await getDocs(query(vectorRef, limit(1)));

//     if (checkSnapshot.empty) {
//       console.log("🌱 Seeding Vector Lab Levels...");
//       const levels = [
//         { 
//           name: 'Triangle', 
//           order: 1,
//           dots: [{ x: 100, y: 40 }, { x: 160, y: 160 }, { x: 40, y: 160 }] 
//         },
//         { 
//           name: 'Square', 
//           order: 2,
//           dots: [{ x: 45, y: 45 }, { x: 155, y: 45 }, { x: 155, y: 155 }, { x: 45, y: 155 }] 
//         },
//         { 
//           name: 'House', 
//           order: 3,
//           dots: [{ x: 45, y: 160 }, { x: 45, y: 85 }, { x: 100, y: 30 }, { x: 155, y: 85 }, { x: 155, y: 160 }] 
//         },
//         { 
//           name: 'Star', 
//           order: 4,
//           dots: [{ x: 100, y: 20 }, { x: 115, y: 70 }, { x: 170, y: 75 }, { x: 130, y: 110 }, { x: 145, y: 165 }, { x: 100, y: 135 }, { x: 55, y: 165 }, { x: 70, y: 110 }, { x: 30, y: 75 }, { x: 85, y: 70 }] 
//         },
//         { 
//           name: 'Diamond', 
//           order: 5,
//           dots: [{ x: 100, y: 25 }, { x: 175, y: 100 }, { x: 100, y: 175 }, { x: 25, y: 100 }] 
//         },
//       ];

//       for (const lv of levels) {
//         await addDoc(vectorRef, lv);
//       }
//       console.log("✅ Vector Lab seeded!");
//     }
//   } catch (error) {
//     console.error("❌ Error seeding vector levels:", error);
//   }
// };







// export const seedMoreAnomalies = async () => {
//   const anomalyRef = collection(db, "anomalyLevels");
//   const newLevels = [
//     { items: ['🦁', '🦁', '🦁', '🐯'], odd: 3, msg: 'Tiger detected in Pride Lands', order: 11 },
//     { items: ['🚗', '🚲', '🚗', '🚗'], odd: 1, msg: 'Bicycle in the fast lane', order: 12 },
//     // ... add more as needed
//   ];

//   for (const lv of newLevels) {
//     // Check if order exists before adding
//     const q = query(anomalyRef, where("order", "==", lv.order));
//     const snap = await getDocs(q);
//     if (snap.empty) {
//       await addDoc(anomalyRef, lv);
//     }
//   }
// };

