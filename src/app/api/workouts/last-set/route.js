import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const exerciseName = searchParams.get('exerciseName');

    if (!exerciseName) {
      return NextResponse.json(
        { message: 'Exercise name is required' },
        { status: 400 }
      );
    }

    const lastWorkout = await Workout.findOne({
      userId: user.userId,
      'exercises.name': exerciseName,
      template: false
    }).sort({ date: -1 });

    if (!lastWorkout) {
      return NextResponse.json(null);
    }

    const exercise = lastWorkout.exercises.find(e => e.name === exerciseName);
    return NextResponse.json(exercise?.sets || null);
  } catch (error) {
    console.error('Last set fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 