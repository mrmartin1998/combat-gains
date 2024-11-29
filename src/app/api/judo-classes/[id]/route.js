import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import JudoClass from '@/app/models/JudoClass';
import { authOptions } from '@/app/lib/auth';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const judoClass = await JudoClass.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!judoClass) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(judoClass);
  } catch (error) {
    console.error('Fetch judo class error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    const judoClass = await JudoClass.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!judoClass) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json(judoClass);
  } catch (error) {
    console.error('Update judo class error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const judoClass = await JudoClass.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!judoClass) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete judo class error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 