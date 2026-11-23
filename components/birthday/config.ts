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
  },
};

/**
 * Step Architecture:
 * Extensible configuration of all journey steps.
 * For this phase, only 'password' (Step 1) and 'welcome' (Step 2) are active.
 * Future steps are pre-modeled for seamless plugging.
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
  // Future architecture placeholders ready to be enabled:
  // {
  //   id: 'message',
  //   index: 3,
  //   title: 'Heartfelt Message',
  //   subtitle: 'Words straight from the heart',
  //   isUnlocked: false,
  // },
  // {
  //   id: 'memories',
  //   index: 3,
  //   title: 'Precious Memories',
  //   subtitle: 'Captured moments of joy',
  //   isUnlocked: false,
  // },
  // {
  //   id: 'letter',
  //   index: 4,
  //   title: 'Love Letter',
  //   subtitle: 'A handwritten digital note',
  //   isUnlocked: false,
  // },
];
