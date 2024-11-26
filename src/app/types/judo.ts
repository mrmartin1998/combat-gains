export interface Technique {
  name: string;
  category: 'tachi-waza' | 'ne-waza' | 'ukemi' | 'other';
  notes?: string;
}

export interface PartnerWork {
  partnerName: string;
  duration: number;
  type: 'uchikomi' | 'nagekomi' | 'drill' | 'situation';
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
  type: string;
  techniques: Technique[];
  partnerWork: PartnerWork[];
  sparringSessions: SparringSession[];
  notes?: string;
} 