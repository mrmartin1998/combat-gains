import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseName = searchParams.get('exerciseName');

    if (!exerciseName) {
      return NextResponse.json({ error: 'Exercise name is required' }, { status: 400 });
    }

    await connectDB();

    // Find the last workout containing this exercise
    const lastWorkout = await Workout.findOne({ 
      'exercises.name': exerciseName 
    }).sort({ date: -1 });

    if (!lastWorkout) {
      return NextResponse.json(null);
    }

    // Find the exercise in the workout
    const exercise = lastWorkout.exercises.find(e => e.name === exerciseName);
    if (!exercise || exercise.sets.length === 0) {
      return NextResponse.json(null);
    }

    // Return the last set
    const lastSet = exercise.sets[exercise.sets.length - 1];
    return NextResponse.json({
      reps: lastSet.reps,
      weight: lastSet.weight,
      date: lastWorkout.date
    });

  } catch (error) {
    console.error('Error fetching last set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 