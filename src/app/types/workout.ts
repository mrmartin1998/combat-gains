import type { Exercise } from './exercise';

export type { Exercise };

export interface Workout {
  _id?: string;
  type: string;
  date: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
  template?: boolean;
  templateName?: string;
  userId?: string;
  createdAt?: string;
}

export interface Template extends Workout {
  templateName: string;
  template: true;
} 