export interface Technique {
  name: string;
  category: 'throws' | 'pins' | 'submissions' | 'combinations' | 'drills';
  notes?: string;
}

export interface PartnerWork {
  partnerName: string;
  duration: number;
  type: 'drilling' | 'situational' | 'sparring';
  notes?: string;
}

export interface SparringSession {
  duration: number;
  intensity: 'light' | 'medium' | 'hard';
  notes?: string;
}

export interface JudoClass {
  _id?: string;
  date: string;
  duration: number;
  techniques: Technique[];
  partnerWork: PartnerWork[];
  sparringSessions: SparringSession[];
  notes?: string;
} 