import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import JudoClass from '@/app/models/JudoClass';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectDB();
    const user = await verifyAuth(req);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const classData = await req.json();
    const judoClass = await JudoClass.create({
      ...classData,
      userId: user.userId,
    });

    return NextResponse.json(judoClass, { status: 201 });
  } catch (error) {
    console.error('Judo class creation error:', error);
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

    const classes = await JudoClass.find({ userId: user.userId })
      .sort({ date: -1 });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Judo class fetch error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 