
export type Language = 'vi' | 'en';
export type View = 'dashboard' | 'premium' | 'settings' | 'plan' | 'assessment';
export type SubscriptionTier = 'free' | 'plus' | 'pro';

export interface AssessmentAnswers {
  // FIX: Allow string for textarea answers in addition to number for multiple-choice answers.
  [questionId: string]: number | string;
}

export interface AssessmentResult {
  profileKey: string;
  score: number;
}

export interface AssessmentData {
  answers: AssessmentAnswers;
  result: AssessmentResult | null;
  lastCompleted: string | null; // ISO date string
}

export interface UserData {
  nickname: string;
  dob: string; // YYYY-MM-DD, can be partial
  statusTagline: string;
}

export interface DailyActivity {
  id: string;
  task?: string; // For AI-generated tasks
  taskKey?: string; // For generic, translatable tasks
  completed: boolean;
}

export interface SupportPlan {
  profile: string;
  plan: {
    weeks: {
      themeKey: string;
      focusKey: string;
    }[];
  }
}

export type Emotion = 'joy' | 'sadness' | 'anger' | 'calm' | 'anxiety';
export type TimeOfDay = 'morning' | 'noon' | 'evening';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timeOfDay: TimeOfDay;
  emotion: Emotion;
  intensity: number; // 1-5
  note: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}