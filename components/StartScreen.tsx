import React, { useState } from 'react';
import type { Language, Theme, ThemeConfig, Translations, PlaySoundFunction, Difficulty } from '../types';
import { THEMES, TRANSLATIONS, DIFFICULTY_SETTINGS } from '../constants';
import HowToPlayModal from './HowToPlayModal';

// SVGs for sound toggle button
const SpeakerOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);
const SpeakerOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25l-4-4m0 4l4-4M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

interface StartScreenProps {
  onStart: () => void;
  currentLang: Language;
  setLang: (lang: Language) => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  currentDifficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  translations: Translations;
  themeConfig: ThemeConfig;
  playSound: PlaySoundFunction;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  currentLang, 
  setLang, 
  currentTheme, 
  setTheme,
  currentDifficulty,
  setDifficulty,
  translations,
  themeConfig,
  playSound,
  soundEnabled,
  setSoundEnabled
}) => {
  const [showHelp, setShowHelp] = useState(false);

  const handleStartClick = () => {
    playSound('click');
    onStart();
  };
  
  const handleHelpToggle = () => {
    playSound('click');
    setShowHelp(!showHelp);
  };

  const handleSoundToggle = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    if (newSoundState) {
        playSound('click');
    }
  };

  return (
    <>
      {showHelp && (
        <HowToPlayModal 
          onClose={handleHelpToggle} 
          translations={translations} 
          themeConfig={themeConfig} 
        />
      )}
      <div className="flex flex-col gap-6 animate-fade-in">
        <h1 className={`text-4xl md:text-5xl font-bold ${themeConfig.accentColor} tracking-wide`}>
          {translations.title}
        </h1>
        <p className="text-md leading-relaxed">
          {translations.description}
        </p>
        
        <button
          onClick={handleStartClick}
          className={`w-full py-3 px-6 text-xl font-bold text-white ${themeConfig.buttonBg} rounded-lg shadow-lg transform transition-transform duration-200 ${themeConfig.buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${themeConfig.focusRing}`}
        >
          {translations.start_game}
        </button>

        <button onClick={handleHelpToggle} className={`text-sm ${themeConfig.accentColor} opacity-80 hover:opacity-100 transition-opacity`}>
          {translations.how_to_play}
        </button>

        <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
          <div>
              <label className="block text-sm font-medium mb-1 opacity-80 text-left">{translations.select_difficulty}</label>
              <select
                  value={currentDifficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className={`w-full p-2 ${themeConfig.inputBg} ${themeConfig.textColor} border ${themeConfig.inputBorder} rounded-md focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
              >
                  {Object.keys(DIFFICULTY_SETTINGS).map(diffKey => (
                      <option key={diffKey} value={diffKey} className="bg-gray-800">
                          {translations[`difficulty_${diffKey}`]}
                      </option>
                  ))}
              </select>
          </div>
          <div className="grid grid-cols-5 gap-4">
              <div className="col-span-5 sm:col-span-2">
                  <label className="block text-sm font-medium mb-1 opacity-80 text-left">{translations.select_theme}</label>
                  <select 
                      value={currentTheme}
                      onChange={(e) => setTheme(e.target.value as Theme)}
                      className={`w-full p-2 ${themeConfig.inputBg} ${themeConfig.textColor} border ${themeConfig.inputBorder} rounded-md focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
                  >
                      {Object.keys(THEMES).map(themeKey => (
                      <option key={themeKey} value={themeKey} className="bg-gray-800">
                          {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium mb-1 opacity-80 text-left">{translations.select_language}</label>
                  <select 
                      value={currentLang}
                      onChange={(e) => setLang(e.target.value as Language)}
                      className={`w-full p-2 ${themeConfig.inputBg} ${themeConfig.textColor} border ${themeConfig.inputBorder} rounded-md focus:outline-none focus:ring-2 ${themeConfig.focusRing}`}
                  >
                      {Object.keys(TRANSLATIONS).map(langKey => (
                      <option key={langKey} value={langKey} className="bg-gray-800">
                          {langKey.toUpperCase()}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button
                      onClick={handleSoundToggle}
                      aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
                      className={`w-full h-[42px] flex items-center justify-center ${themeConfig.inputBg} ${themeConfig.textColor} border ${themeConfig.inputBorder} rounded-md focus:outline-none focus:ring-2 ${themeConfig.focusRing} transition-opacity hover:opacity-80`}
                  >
                      {soundEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
                  </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartScreen;