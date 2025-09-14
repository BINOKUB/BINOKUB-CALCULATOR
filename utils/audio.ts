import type { SoundName } from '../types';

// Simple, royalty-free Base64 encoded WAV sounds
const sounds: Record<SoundName, string> = {
    click: 'data:audio/wav;base64,UklGRlgAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAACEZGRkZGQkJCQg==',
    correct: 'data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAABAAA9QWl9iXVpYVlJPT0tJRkVDQUA/Pjw5ODc2NTQzMjExMC8uLQ==',
    wrong: 'data:audio/wav;base64,UklGRkAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVwAAACamZqZm52dnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8=',
    tick: 'data:audio/wav;base64,UklGRkoAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAQEBAQA==',
};

const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export const playAudio = (sound: SoundName): void => {
  try {
    if (!audioCache[sound]) {
      const audio = new Audio(sounds[sound]);
      audio.volume = 0.7;
      audioCache[sound] = audio;
    }
    const audio = audioCache[sound];
    if (audio) {
      audio.currentTime = 0; // Rewind to the start
      audio.play().catch(error => console.error(`Error playing sound ${sound}:`, error));
    }
  } catch (error) {
    console.error(`Could not play audio sound "${sound}":`, error);
  }
};
