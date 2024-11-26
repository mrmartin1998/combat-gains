export interface Set {
  reps: number;
  weight: number;
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: Set[];
  notes?: string;
}

export interface BaseWorkout {
  type: string;
  duration: number;
  exercises: Exercise[];
  notes?: string;
}

export interface Workout extends BaseWorkout {
  _id: string;
  userId: string;
  date: string;
  template: boolean;
  templateName?: string;
  createdAt: string;
}

export interface Template extends BaseWorkout {
  _id: string;
  userId: string;
  templateName: string;
} 