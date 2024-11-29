import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { authOptions } from '@/app/api/auth/config';

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized or missing user ID' },
        { status: 401 }
      );
    }

    const workoutData = await req.json();
    
    const workout = await Workout.create({
      ...workoutData,
      userId: session.user.id,
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

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workouts = await Workout.find({ userId: session.user.id })
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