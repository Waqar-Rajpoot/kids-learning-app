import { useState, useEffect } from 'react';
import { Volume2, Check, RotateCcw, ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { spellingWords } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { starBurst, quickPop } from '@/lib/confetti';
import { playTap, playCorrect, playWrong } from '@/lib/sounds';

const SpellingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const currentWord = spellingWords[currentIndex];

  const shuffleLetters = () => {
    const letters = currentWord.word.split('');
    const extras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .filter((l) => !letters.includes(l))
      .slice(0, 2);
    const allLetters = [...letters, ...extras].sort(() => Math.random() - 0.5);
    setAvailableLetters(allLetters);
    setUserInput([]);
    setIsCorrect(null);
  };

  useEffect(() => {
    shuffleLetters();
  }, [currentIndex]);

  const speak = (text: string) => {
    speakText(text);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (userInput.length >= currentWord.word.length) return;
    playTap();

    setUserInput([...userInput, letter]);
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
    speak(letter);
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userInput[index];
    const newInput = [...userInput];
    newInput.splice(index, 1);
    setUserInput(newInput);
    setAvailableLetters([...availableLetters, letter]);
  };

  const checkAnswer = () => {
    const answer = userInput.join('');
    const correct = answer === currentWord.word;
    setIsCorrect(correct);
    if (correct) {
      playCorrect();
      starBurst();
    } else {
      playWrong();
    }
    speak(correct ? 'Excellent! ' + currentWord.word : 'Try again!');
  };

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % spellingWords.length);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-primary active:scale-95 bg-primary/5 rounded-xl"
          >
            <Home className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black text-gray-900 font-display">Spelling Fun</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 w-full flex flex-col gap-6">
        {/* Progress Bar */}
        <div className="flex gap-1">
          {spellingWords.slice(0, 8).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${i === currentIndex ? 'bg-primary' : i < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>

        {/* Word Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-8 animate-speed-in">
          <div className="text-center">
            <span className="text-8xl block mb-4 select-none animate-float">{currentWord.emoji}</span>
            <p className="text-gray-500 font-bold italic">"{currentWord.hint}"</p>
          </div>

          <button
            onClick={() => speak(currentWord.word)}
            className="w-full py-5 bg-primary/5 border-2 border-primary/20 text-primary rounded-2xl
              font-black flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <Volume2 className="w-6 h-6" />
            Hear Word
          </button>

          {/* Answer Boxes */}
          <div className="flex justify-center gap-2">
            {currentWord.word.split('').map((_, i) => (
              <div
                key={i}
                onClick={() => userInput[i] && handleRemoveLetter(i)}
                className={`w-12 h-14 rounded-xl flex items-center justify-center
                  text-2xl font-black border-2 transition-all cursor-pointer
                  ${userInput[i]
                    ? isCorrect === true
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : isCorrect === false
                        ? 'bg-red-50 border-red-500 text-red-600 animate-shake'
                        : 'bg-primary border-primary text-white shadow-md'
                    : 'bg-gray-50 border-gray-100 text-gray-200'
                  }`}
              >
                {userInput[i] || ''}
              </div>
            ))}
          </div>

          {/* Letter Selection Grid */}
          <div className="grid grid-cols-5 gap-2">
            {availableLetters.map((letter, i) => (
              <button
                key={`${letter}-${i}`}
                onClick={() => handleLetterClick(letter, i)}
                className="aspect-square bg-white border-2 border-gray-100 text-gray-900 active:bg-gray-100
                  rounded-xl text-xl font-black shadow-sm active:scale-90 transition-all active:border-primary active:text-primary"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={shuffleLetters}
              className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black active:bg-gray-200 transition-colors shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isCorrect === true ? (
              <button
                onClick={nextWord}
                className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                Next Word
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={checkAnswer}
                disabled={userInput.length === 0}
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-30"
              >
                Check!
                <Check className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SpellingPage;
