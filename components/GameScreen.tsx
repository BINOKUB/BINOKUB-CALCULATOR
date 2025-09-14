import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DIFFICULTY_SETTINGS } from '../constants';
import type { ThemeConfig, Translations, PlaySoundFunction, Difficulty } from '../types';
import { calculateBase, generateNumber } from '../utils/binokub';

interface GameScreenProps {
  onGameOver: (finalScore: number) => void;
  themeConfig: ThemeConfig;
  translations: Translations;
  playSound: PlaySoundFunction;
  difficulty: Difficulty;
}

const ROUND_LIMIT = 10;

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, themeConfig, translations, playSound, difficulty }) => {
  const [score, setScore] = useState(0);
  const [currentNumber, setCurrentNumber] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [initialTimeForRound, setInitialTimeForRound] = useState(10);
  const [scoreAnimationKey, setScoreAnimationKey] = useState(0);
  const [numberAnimationKey, setNumberAnimationKey] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];

  const nextChallenge = useCallback(() => {
    const { minDigits, maxDigits } = difficultySettings;
    const digits = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;
    
    let timeForRound: number;
    if (difficultySettings.time) {
      timeForRound = difficultySettings.time;
    } else if (difficultySettings.dynamicTime) {
      timeForRound = Math.ceil(difficultySettings.dynamicTime.base + digits * difficultySettings.dynamicTime.perDigit);
    } else {
      timeForRound = 10; // Fallback
    }

    setCurrentNumber(generateNumber(digits));
    setTimeLeft(timeForRound);
    setInitialTimeForRound(timeForRound);
    setNumberAnimationKey(prev => prev + 1);
  }, [difficultySettings]);

  useEffect(() => {
    setScore(0);
    nextChallenge();
    inputRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      playSound('wrong');
      onGameOver(score);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if(newTime > 0 && newTime <= 3) {
            playSound('tick');
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score, playSound]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(inputValue, 10);
    if (isNaN(answer)) return;

    const correctBase = calculateBase(currentNumber);

    if (answer === correctBase) {
      playSound('correct');
      setScoreAnimationKey(prev => prev + 1);
      const newScore = score + 1;

      if (newScore === ROUND_LIMIT) {
        onGameOver(newScore);
      } else {
        setScore(newScore);
        setInputValue('');
        nextChallenge();
      }
    } else {
      playSound('wrong');
      onGameOver(score);
    }
  };

  const timePercentage = (timeLeft / initialTimeForRound) * 100;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex justify-between items-center text-lg">
        <div>
          <span className="font-semibold opacity-80">{translations.score}: </span>
          <span key={scoreAnimationKey} className={`font-bold text-xl ${themeConfig.accentColor} inline-block animate-score-pop`}>{score} / {ROUND_LIMIT}</span>
        </div>
         <div>
          {translations.time}: <span className={`font-bold text-xl ${themeConfig.accentColor}`}>{timeLeft}s</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <div 
           className="h-2.5 rounded-full transition-all duration-500 ease-linear" 
           style={{ 
             width: `${timePercentage}%`, 
             backgroundColor: timePercentage < 25 ? '#ef4444' : timePercentage < 50 ? '#f97316' : '#22c55e' 
            }}
          >
        </div>
      </div>
      
      <div key={numberAnimationKey} className="my-4 p-4 bg-black/30 rounded-lg animate-new-number">
        <p className={`font-mono text-4xl md:text-5xl lg:text-6xl tracking-widest ${themeConfig.accentColor} select-all break-all`}>
          {currentNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={translations.your_answer}
          className={`w-full text-center text-2xl p-4 rounded-lg ${themeConfig.inputBg} ${themeConfig.textColor} border-2 ${themeConfig.inputBorder} focus:outline-none focus:ring-4 ${themeConfig.focusRing} transition-shadow duration-200`}
          autoFocus
        />
      </form>
    </div>
  );
};

export default GameScreen;