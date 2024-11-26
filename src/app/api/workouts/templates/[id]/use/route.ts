import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import { authOptions } from '../../../../auth/[...nextauth]/route';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const template = await Workout.findOne({
      _id: params.id,
      userId: session.user.id,
      template: true
    });

    if (!template) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    const workout = await Workout.create({
      userId: session.user.id,
      type: template.type,
      date: new Date(),
      duration: template.duration,
      exercises: template.exercises,
      notes: template.notes,
      template: false
    });

    return NextResponse.json(workout);
  } catch (error: any) {
    console.error('Template use error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 