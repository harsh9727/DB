export type StepId = 
  | 'password' 
  | 'welcome' 
  | 'message' 
  | 'memories' 
  | 'letter' 
  | 'timeline' 
  | 'surprise';

export interface StepDefinition {
  id: StepId;
  index: number;
  title: string;
  subtitle?: string;
  isUnlocked: boolean;
}

export interface BirthdayExperienceConfig {
  recipientName: string;
  romanticTitle: string;
  welcomeMessage: string;
  welcomeSubtitle: string;
  passwords: string[]; // Accepts a primary or alternative romantic password
  passwordHint?: string;
  media: {
    passwordBackground: string;
    welcomeBackground: string;
    welcomeVideo?: string;
    romanticPhoto?: string;
  };
}
