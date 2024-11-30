/**
 * @typedef {Object} Exercise
 * @property {string} name - Name of the exercise
 * @property {string[]} primaryMuscles - Primary muscles worked
 * @property {string[]} secondaryMuscles - Secondary muscles worked
 * @property {string} equipment - Equipment needed
 * @property {string} description - Exercise description
 * @property {boolean} isPublic - Whether exercise is public
 * @property {string} createdBy - User ID who created the exercise
 */

/**
 * @typedef {Object} JudoClass
 * @property {Date} date - Date of the class
 * @property {number} duration - Duration in minutes
 * @property {string} type - Type of class
 * @property {string} notes - Class notes
 * @property {string} userId - User ID who logged the class
 */

/**
 * @typedef {Object} Workout
 * @property {Date} date - Date of workout
 * @property {string} name - Workout name
 * @property {boolean} template - Whether this is a template
 * @property {string} templateName - Name of template if applicable
 * @property {Array<{
 *   exerciseId: string,
 *   sets: Array<{
 *     reps: number,
 *     weight: number,
 *     notes: string
 *   }>
 * }>} exercises - Exercises in the workout
 * @property {string} userId - User ID who created the workout
 */

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core'
];

export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Machine',
  'Bodyweight',
  'Kettlebell',
  'Resistance Band',
  'Other'
];

export const JUDO_CLASS_TYPES = [
  'Regular',
  'Competition',
  'Technical',
  'Private'
]; 