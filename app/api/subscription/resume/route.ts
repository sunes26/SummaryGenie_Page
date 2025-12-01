// app/api/subscription/resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin-utils';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { 
  resumePaddleSubscription, 
  cancelScheduledChange,
  getPaddleSubscription 
} from '@/lib/paddle-server';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * 취소 예정인 구독 재개
 * POST /api/subscription/resume
 * 
 * 플로우:
 * 1. Firebase ID 토큰 인증
 * 2. Firestore에서 구독 정보 조회
 * 3. 구독 상태에 따라:
 *    - paused: resumePaddleSubscription 호출
 *    - cancelAtPeriodEnd: cancelScheduledChange 호출
 * 4. Firestore subscription 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Firebase ID 토큰 인증
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // 2. Firestore에서 구독 정보 조회
    const db = getAdminFirestore();
    const subscriptionRef = db.collection('subscription');
    
    const subscriptionsSnapshot = await subscriptionRef
      .where('userId', '==', userId)
      .where('status', 'in', ['active', 'trialing', 'paused'])
      .limit(1)
      .get();

    if (subscriptionsSnapshot.empty) {
      return NextResponse.json(
        {
          error: 'No active subscription',
          message: '활성화된 구독이 없습니다.',
        },
        { status: 404 }
      );
    }

    const subscriptionDoc = subscriptionsSnapshot.docs[0];
    const subscriptionData = subscriptionDoc.data();
    const paddleSubscriptionId = subscriptionData.paddleSubscriptionId;

    if (!paddleSubscriptionId) {
      console.error('Missing paddleSubscriptionId:', subscriptionData);
      return NextResponse.json(
        {
          error: 'Invalid subscription data',
          message: '구독 정보가 올바르지 않습니다.',
        },
        { status: 500 }
      );
    }

    console.log(`🔍 Subscription status check:`, {
      paddleSubscriptionId,
      status: subscriptionData.status,
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
    });

    // 3. 이미 활성 상태이고 취소 예정이 아닌 경우
    if (!subscriptionData.cancelAtPeriodEnd && subscriptionData.status !== 'paused') {
      return NextResponse.json({
        success: true,
        alreadyActive: true,
        message: '구독이 이미 활성화되어 있습니다.',
        subscription: {
          status: subscriptionData.status,
          cancelAtPeriodEnd: false,
        },
      });
    }

    let updatedSubscription;

    // 4. 상태에 따라 다른 API 호출
    try {
      if (subscriptionData.status === 'paused') {
        // paused 상태: resume API 호출
        console.log(`⏯️ Resuming paused subscription: ${paddleSubscriptionId}`);
        updatedSubscription = await resumePaddleSubscription(paddleSubscriptionId);
      } else if (subscriptionData.cancelAtPeriodEnd) {
        // 취소 예정 상태: scheduled_change 취소
        console.log(`🔄 Canceling scheduled cancellation: ${paddleSubscriptionId}`);
        updatedSubscription = await cancelScheduledChange(paddleSubscriptionId);
      } else {
        // 그 외의 경우: 현재 상태 조회
        updatedSubscription = await getPaddleSubscription(paddleSubscriptionId);
      }
    } catch (error) {
      console.error('Paddle API error:', error);
      return NextResponse.json(
        {
          error: 'Failed to resume subscription',
          message: 'Paddle 구독 재개에 실패했습니다.',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // 5. Firestore 업데이트
    await subscriptionDoc.ref.update({
      status: updatedSubscription.status,
      cancelAtPeriodEnd: updatedSubscription.scheduled_change?.action === 'cancel' || false,
      canceledAt: null,
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Subscription resumed successfully: ${paddleSubscriptionId}`);

    // 6. 성공 응답
    return NextResponse.json({
      success: true,
      message: '구독이 재개되었습니다. 다음 결제일에 정상적으로 갱신됩니다.',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancelAtPeriodEnd: updatedSubscription.scheduled_change?.action === 'cancel' || false,
        currentPeriodEnd: updatedSubscription.current_billing_period.ends_at,
        nextBilledAt: updatedSubscription.next_billed_at,
      },
    });

  } catch (error) {
    console.error('Subscription resume error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: '구독 재개 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}