import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import JudoClass from '@/app/models/JudoClass';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';import { startOfMonth } from 'date-fns';

export const dynamic = 'force-dynamic';

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

    const startOfCurrentMonth = startOfMonth(new Date());

    // Get workouts
    const workouts = await Workout.find({ 
      userId: session.user.id 
    }).sort({ date: -1 });

    const workoutsThisMonth = workouts.filter(
      workout => new Date(workout.date) >= startOfCurrentMonth
    );

    // Get judo classes
    const judoClasses = await JudoClass.find({ 
      userId: session.user.id 
    }).sort({ date: -1 });

    const judoClassesThisMonth = judoClasses.filter(
      judoClass => new Date(judoClass.date) >= startOfCurrentMonth
    );

    return NextResponse.json({
      stats: {
        totalWorkouts: workouts.length,
        totalJudoClasses: judoClasses.length,
        thisMonth: {
          workouts: workoutsThisMonth.length,
          judoClasses: judoClassesThisMonth.length,
        },
      },
      recentActivity: {
        workouts: workouts.slice(0, 3),
        judoClasses: judoClasses.slice(0, 3),
      },
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 