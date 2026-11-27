import { BirthdayExperienceConfig, StepDefinition } from './types';

export const BIRTHDAY_CONFIG: BirthdayExperienceConfig = {
  recipientName: 'My Special Person',
  romanticTitle: 'A Little Surprise Awaits You ❤️',
  welcomeMessage: 'Happy Birthday, Madam ji! ❤️',
  welcomeSubtitle:
    'Today is entirely dedicated to celebrating the most wonderful soul who makes every single moment brighter, softer, and infinitely more beautiful.',
  // Frontend password validation (case-insensitive & trimmed)
  passwords: ['forever', 'birthday', 'special', 'surprise'],
  passwordHint: 'Hint: A word that lasts for eternity ("forever") or today\'s celebration ("birthday")',
  media: {
    passwordBackground: '/images/birthday-bg.jpg',
    welcomeBackground: '/images/welcome-bg.jpg',
    welcomeVideo: '/videos/birthday-background.mp4',
    romanticPhoto: '/images/romantic-photo-1.jpg',
    cupcakeImage: '/images/cupcake.png',
    puzzlePhoto: '/images/puzzle-photo.jpg',
    puzzleBackground: '/images/puzzle-background.jpg',
  },
};

/**
 * Step Architecture:
 * Extensible configuration of all journey steps.
 */
export const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'password',
    index: 0,
    title: 'The Secret Key',
    subtitle: 'Unlock the surprise',
    isUnlocked: true,
  },
  {
    id: 'welcome',
    index: 1,
    title: 'Happy Birthday',
    subtitle: 'Welcome to your journey',
    isUnlocked: false,
  },
  {
    id: 'cake',
    index: 2,
    title: 'Birthday Cupcake',
    subtitle: 'Make a wish & cut the cupcake',
    isUnlocked: false,
  },
  {
    id: 'puzzle',
    index: 3,
    title: 'Memory Puzzle',
    subtitle: 'Piece our memories together',
    isUnlocked: false,
  },
  {
    id: 'memories',
    index: 4,
    title: 'Our Beautiful Memories',
    subtitle: 'Captured moments of joy',
    isUnlocked: false,
  },
];
