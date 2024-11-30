import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import JudoClass from '@/app/models/JudoClass';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    const judoClass = await JudoClass.create({
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(judoClass, { status: 201 });
  } catch (error) {
    console.error('Judo class creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const classes = await JudoClass.find({ userId: session.user.id })
      .sort({ date: -1 });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Fetch judo classes error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 