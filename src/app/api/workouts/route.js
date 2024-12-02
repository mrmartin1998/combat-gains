import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectDB();
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized or missing user ID' },
        { status: 401 }
      );
    }

    const workoutData = await req.json();
    
    const workout = await Workout.create({
      ...workoutData,
      userId: user.userId,
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error('Workout creation error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workouts = await Workout.find({ userId: user.userId })
      .sort({ date: -1 });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Workout fetch error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 