// app/api/test-paddle/route.ts
import { NextResponse } from 'next/server';

const PADDLE_API_KEY = process.env.PADDLE_API_KEY || '';
const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox';
const PADDLE_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || '';

// Paddle API Base URL
const PADDLE_API_BASE_URL =
  PADDLE_ENVIRONMENT === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

export async function GET() {
  const results: Record<string, any> = {
    environment: PADDLE_ENVIRONMENT,
    apiBaseUrl: PADDLE_API_BASE_URL,
    priceId: PADDLE_PRICE_ID,
    clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 
      ? `${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.substring(0, 20)}...` 
      : 'NOT SET',
    apiKeySet: !!PADDLE_API_KEY,
  };

  // API Key가 없으면 여기서 중단
  if (!PADDLE_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'PADDLE_API_KEY가 설정되지 않았습니다.',
      results,
    });
  }

  // Price ID 유효성 검사
  if (!PADDLE_PRICE_ID) {
    return NextResponse.json({
      success: false,
      error: 'NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY가 설정되지 않았습니다.',
      results,
    });
  }

  try {
    // 1. Price 정보 조회
    console.log(`🔍 Fetching price: ${PADDLE_PRICE_ID}`);
    
    const priceResponse = await fetch(
      `${PADDLE_API_BASE_URL}/prices/${PADDLE_PRICE_ID}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!priceResponse.ok) {
      const errorText = await priceResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { raw: errorText };
      }
      
      return NextResponse.json({
        success: false,
        error: `Price 조회 실패: ${priceResponse.status} ${priceResponse.statusText}`,
        priceId: PADDLE_PRICE_ID,
        paddleError: errorData,
        results,
        hint: priceResponse.status === 404 
          ? 'Price ID가 존재하지 않습니다. Paddle Dashboard에서 확인하세요.'
          : priceResponse.status === 401
          ? 'API Key가 유효하지 않습니다.'
          : 'Paddle API 오류가 발생했습니다.',
      });
    }

    const priceData = await priceResponse.json();
    results.price = priceData.data;

    // 2. 연결된 Product 정보 조회
    if (priceData.data?.product_id) {
      const productResponse = await fetch(
        `${PADDLE_API_BASE_URL}/products/${priceData.data.product_id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PADDLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (productResponse.ok) {
        const productData = await productResponse.json();
        results.product = productData.data;
      }
    }

    // 3. 결과 반환
    return NextResponse.json({
      success: true,
      message: 'Paddle 설정이 올바릅니다!',
      results,
      priceStatus: priceData.data?.status,
      productStatus: results.product?.status,
      checkList: {
        priceExists: true,
        priceActive: priceData.data?.status === 'active',
        productActive: results.product?.status === 'active',
        correctEnvironment: PADDLE_ENVIRONMENT === 'sandbox',
      },
    });

  } catch (error) {
    console.error('❌ Paddle API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
    });
  }
}