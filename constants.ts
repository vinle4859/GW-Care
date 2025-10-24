
import { UserData, SupportPlan, JournalEntry, Emotion, TimeOfDay, ChatMessage, DailyActivity } from './types';

export const INITIAL_USER_DATA: UserData = {
  nickname: 'Explorer',
  dob: '',
  statusTagline: 'Ready for a new day!',
};

export const INITIAL_SUPPORT_PLAN: SupportPlan | null = null;
export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];
export const INITIAL_CHAT_HISTORY: ChatMessage[] = [];
export const INITIAL_ASSESSMENT_DATA: null = null;
export const INITIAL_TODAY_ACTIVITIES: null = null;


export const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😊'];

export const EMOTION_COLORS: Record<Emotion, string[]> = {
  joy: ['#FFD700', '#FFC300', '#FFB347', '#FFA07A', '#FF8C69'], // Bright yellows to oranges
  sadness: ['#ADD8E6', '#87CEEB', '#6495ED', '#4169E1', '#0000CD'], // Light blues to deep blues
  anger: ['#FF6347', '#FF4500', '#DC143C', '#B22222', '#8B0000'],   // Tomato red to dark red
  calm: ['#98FB98', '#8FBC8F', '#3CB371', '#2E8B57', '#006400'],   // Pale greens to dark greens
  anxiety: ['#DDA0DD', '#DA70D6', '#BA55D3', '#9932CC', '#8A2BE2'], // Plums to dark purples
};

export const GENERIC_ACTIVITIES: Omit<DailyActivity, 'completed'>[] = [
    { id: 'gen-1', taskKey: 'activities.generic_1' },
    { id: 'gen-2', taskKey: 'activities.generic_2' },
    { id: 'gen-3', taskKey: 'activities.generic_3' },
    { id: 'gen-4', taskKey: 'activities.generic_4' },
    { id: 'gen-5', taskKey: 'activities.generic_5' },
    { id: 'gen-6', taskKey: 'activities.generic_6' },
    { id: 'gen-7', taskKey: 'activities.generic_7' },
];


export const TIME_OF_DAY_ORDER: Record<TimeOfDay, number> = {
  morning: 0,
  noon: 1,
  evening: 2
};

export const DEMO_JOURNAL_ENTRIES: JournalEntry[] = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    const date = new Date();
    date.setDate(day);
    const dateString = date.toISOString().split('T')[0];
    const numEntries = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: numEntries }, (__, j) => {
        const emotions: Emotion[] = ['joy', 'sadness', 'anger', 'calm', 'anxiety'];
        const timesOfDay: TimeOfDay[] = ['morning', 'noon', 'evening'];
        return {
            id: `demo-${i}-${j}`,
            date: dateString,
            timeOfDay: timesOfDay[j % 3],
            emotion: emotions[Math.floor(Math.random() * emotions.length)],
            intensity: Math.floor(Math.random() * 5) + 1,
            note: 'This is a demo entry.'
        };
    });
}).flat();
