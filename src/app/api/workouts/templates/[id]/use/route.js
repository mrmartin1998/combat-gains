import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const template = await Workout.findOne({
      _id: params.id,
      userId: user.userId,
      template: true
    });

    if (!template) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    const workout = await Workout.create({
      userId: user.userId,
      type: template.type,
      date: new Date(),
      duration: template.duration,
      exercises: template.exercises,
      notes: template.notes,
      template: false
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Template use error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 