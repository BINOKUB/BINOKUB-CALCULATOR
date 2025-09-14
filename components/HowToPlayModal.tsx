import React from 'react';
import type { ThemeConfig, Translations } from '../types';

interface HowToPlayModalProps {
  onClose: () => void;
  translations: Translations;
  themeConfig: ThemeConfig;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, translations, themeConfig }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className={`relative w-full max-w-md ${themeConfig.panelBg} rounded-2xl shadow-2xl p-6 md:p-8 text-left flex flex-col gap-4`}>
        <h2 className={`text-2xl font-bold ${themeConfig.accentColor} text-center`}>{translations.how_to_play_title}</h2>
        
        <div className="text-sm space-y-3">
            <p><strong className={themeConfig.accentColor}>{translations.how_to_play_goal}</strong></p>
            <p>{translations.how_to_play_calc}</p>
            <div>
              <p className="font-semibold">{translations.how_to_play_example_title}</p>
              <p className="bg-black/20 p-2 rounded-md font-mono text-center">{translations.how_to_play_example_text}</p>
            </div>
            <p>{translations.how_to_play_game}</p>
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-4 py-2 px-6 font-bold text-white ${themeConfig.buttonBg} rounded-lg shadow-lg transform transition-transform duration-200 ${themeConfig.buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${themeConfig.focusRing}`}
        >
          {translations.got_it}
        </button>
      </div>
    </div>
  );
};

export default HowToPlayModal;