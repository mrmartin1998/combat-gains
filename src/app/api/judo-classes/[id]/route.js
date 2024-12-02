import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import JudoClass from '@/app/models/JudoClass';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const judoClass = await JudoClass.findOne({
      _id: params.id,
      userId: user.userId
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
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    const judoClass = await JudoClass.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
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
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const judoClass = await JudoClass.findOneAndDelete({
      _id: params.id,
      userId: user.userId
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