import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Exercise from '@/app/models/Exercise';
import { authOptions } from '@/app/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const exercise = await Exercise.findOne({
      _id: params.id,
      $or: [
        { isPublic: true },
        { createdBy: session.user.id }
      ]
    });

    if (!exercise) {
      return NextResponse.json(
        { message: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Exercise fetch error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const exercise = await Exercise.findOneAndUpdate(
      { 
        _id: params.id,
        createdBy: session.user.id // Only creator can update
      },
      data,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return NextResponse.json(
        { message: 'Exercise not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Update exercise error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const exercise = await Exercise.findOneAndDelete({
      _id: params.id,
      createdBy: session.user.id // Only creator can delete
    });

    if (!exercise) {
      return NextResponse.json(
        { message: 'Exercise not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 