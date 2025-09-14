import React, { useState, useCallback } from 'react';
import type { ThemeConfig, Translations, PlaySoundFunction } from '../types';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  translations: Translations;
  themeConfig: ThemeConfig;
  playSound: PlaySoundFunction;
}

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart, translations, themeConfig, playSound }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleRestartClick = () => {
    playSound('click');
    onRestart();
  };
  
  const handleShare = useCallback(async () => {
    playSound('click');
    const shareText = translations.share_text.replace('{score}', score.toString());
    const shareUrl = window.location.href;
    const isWebUrl = shareUrl.startsWith('http');

    const sharePayload: ShareData = {
      title: translations.title,
      text: shareText,
    };
    if (isWebUrl) {
      sharePayload.url = shareUrl;
    }

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (error) {
        // User cancelling the share action is not an error.
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        const textToCopy = isWebUrl ? `${shareText} ${shareUrl}` : shareText;
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        alert('Could not copy score to clipboard.');
      }
    }
  }, [score, translations, playSound]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h2 className={`text-4xl md:text-5xl font-bold ${themeConfig.accentColor}`}>
        {translations.game_over}
      </h2>
      
      <div className="flex flex-col gap-2 text-xl bg-black/20 p-6 rounded-lg">
        <div>
          <span className="font-semibold opacity-80">{translations.score}: </span>
          <span className={`font-bold text-2xl ${themeConfig.accentColor}`}>{score}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleRestartClick}
          className={`w-full py-3 px-6 text-xl font-bold text-white ${themeConfig.buttonBg} rounded-lg shadow-lg transform transition-transform duration-200 ${themeConfig.buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${themeConfig.focusRing}`}
        >
          {translations.play_again}
        </button>
        <button
          onClick={handleShare}
          className={`w-full py-3 px-6 text-lg font-bold text-white bg-opacity-80 ${isCopied ? 'bg-green-600' : themeConfig.buttonBg} rounded-lg shadow-lg transform transition-all duration-200 ${themeConfig.buttonHoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${themeConfig.focusRing} flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed`}
          disabled={isCopied}
        >
          {!isCopied && <ShareIcon />}
          {isCopied ? translations.copied_to_clipboard : translations.share_score}
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;