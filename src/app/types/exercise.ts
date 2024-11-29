export interface Exercise {
  _id?: string;
  name: string;
  sets: {
    reps: number;
    weight: number;
    notes?: string;
  }[];
  notes?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  type?: string;
  isPublic?: boolean;
  description?: string;
  instructions?: string[];
  createdBy?: string;
}

export interface ExerciseForm {
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  type: string;
  isPublic: boolean;
  description: string;
  instructions: string[];
} 