import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { pusher } from '@/lib/pusher';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const channelName = `private-user-${session.user.id}`;
    
    // Test trigger
    await pusher.trigger(
      channelName,
      'test-event',
      { message: 'Test successful!', timestamp: new Date().toISOString() }
    );

    return NextResponse.json({ success: true, channelName });
  } catch (error: any) {
    console.error('Pusher test error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      message: error.message 
    }, { status: 500 });
  }
} 