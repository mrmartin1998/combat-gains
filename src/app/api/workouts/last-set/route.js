import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
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
      userId: session.user.id,
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