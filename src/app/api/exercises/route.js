import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Exercise from '@/app/models/Exercise';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const exerciseData = await req.json();
    const exercise = await Exercise.create({
      ...exerciseData,
      createdBy: session.user.id,
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    console.error('Exercise creation error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Build query based on filters
    const query = {
      $or: [
        { isPublic: true },
        { createdBy: session.user.id }
      ]
    };

    // Add muscle group filter if provided
    const muscleGroup = searchParams.get('muscle');
    if (muscleGroup) {
      query.$or = query.$or.map(condition => ({
        ...condition,
        $or: [
          { primaryMuscles: muscleGroup },
          { secondaryMuscles: muscleGroup }
        ]
      }));
    }

    // Add equipment filter if provided
    const equipment = searchParams.get('equipment');
    if (equipment) {
      query.equipment = equipment;
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Exercise fetch error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 