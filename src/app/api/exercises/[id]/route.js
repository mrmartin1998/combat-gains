import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Exercise from '@/app/models/Exercise';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

// GET /api/exercises/[id]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercise = await Exercise.findOne({
      _id: params.id,
      $or: [
        { isPublic: true },
        { createdBy: user.userId }
      ]
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Exercise fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/exercises/[id]
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const exercise = await Exercise.findOneAndUpdate(
      { _id: params.id, createdBy: user.userId },
      data,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Exercise update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/exercises/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercise = await Exercise.findOneAndDelete({
      _id: params.id,
      createdBy: user.userId
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Exercise delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 