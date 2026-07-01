export type PlanItemType = 'lesson' | 'ai_conversation' | 'new_words' | 'video_call';

export type PlanItem = {
  id: string;
  type: PlanItemType;
  title: string;
  subtitle: string;
  iconBg: string;
  iconName: 'book' | 'headphones' | 'chat';
};

export const TODAY_PLAN: PlanItem[] = [
  {
    id: 'plan_lesson',
    type: 'lesson',
    title: 'Lesson',
    subtitle: 'At the café',
    iconBg: '#6C4EF5',
    iconName: 'book',
  },
  {
    id: 'plan_ai_conversation',
    type: 'ai_conversation',
    title: 'AI Conversation',
    subtitle: 'Talk about your day',
    iconBg: '#6C4EF5',
    iconName: 'headphones',
  },
  {
    id: 'plan_new_words',
    type: 'new_words',
    title: 'New words',
    subtitle: '10 words',
    iconBg: '#EF4444',
    iconName: 'chat',
  },
];
