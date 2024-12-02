import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongoose';
import Workout from '@/app/models/Workout';
import JudoClass from '@/app/models/JudoClass';
import { startOfMonth } from 'date-fns';
import { verifyAuth } from '@/app/lib/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = await verifyAuth(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const startOfCurrentMonth = startOfMonth(new Date());

    // Get workouts with error handling
    let workouts = [];
    try {
      workouts = await Workout.find({ 
        userId: user.userId 
      }).sort({ date: -1 });
      console.log('Workouts fetched:', workouts.length);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      workouts = [];
    }

    // Get judo classes with error handling
    let judoClasses = [];
    try {
      judoClasses = await JudoClass.find({ 
        userId: user.userId 
      }).sort({ date: -1 });
      console.log('Judo classes fetched:', judoClasses.length);
    } catch (error) {
      console.error('Error fetching judo classes:', error);
      judoClasses = [];
    }

    const workoutsThisMonth = workouts.filter(
      workout => new Date(workout.date) >= startOfCurrentMonth
    );

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
        }
      },
      recentActivity: {
        workouts: workouts.slice(0, 3),
        judoClasses: judoClasses.slice(0, 3),
      }
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 