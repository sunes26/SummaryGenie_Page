// app/admin/tools/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, AlertCircle, CheckCircle2, Users } from 'lucide-react';

interface BackfillResult {
  totalUsers: number;
  processedUsers: number;
  errorUsers: number;
  totalHistories: number;
  totalCreated: number;
  totalUpdated: number;
  details?: Array<{
    userId: string;
    email: string;
    histories: number;
    created: number;
    updated: number;
    error?: string;
  }>;
}

export default function AdminToolsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<BackfillResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  // 로그인 확인
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // 전체 사용자 백필 실행
  const handleBackfillAllUsers = async () => {
    setIsBackfilling(true);
    setError(null);
    setBackfillResult(null);

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/admin/backfill-all-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '백필 작업에 실패했습니다.');
      }

      setBackfillResult(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsBackfilling(false);
    }
  };

  // 테스트 히스토리 생성 (오늘 날짜)
  const handleCreateTestHistory = async () => {
    setIsCreatingTest(true);
    setError(null);
    setTestSuccess(null);

    try {
      const token = await user.getIdToken(true); // 강제 갱신

      const response = await fetch('/api/history/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `테스트 요약 - ${new Date().toLocaleString('ko-KR')}`,
          url: `https://example.com/test-${Date.now()}`,
          summary: '관리자 도구에서 생성된 테스트 데이터입니다.',
          metadata: {
            domain: 'example.com',
            tags: ['test', 'admin-tools'],
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || result.error || '테스트 데이터 생성에 실패했습니다.');
      }

      setTestSuccess(`테스트 히스토리가 생성되었습니다! 대시보드를 확인하세요.`);

      // 3초 후 대시보드로 리다이렉트
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsCreatingTest(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">관리자 도구</h1>
        <p className="text-muted-foreground">
          시스템 관리 및 데이터 동기화 도구
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">오류</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 백필 성공 메시지 */}
      {backfillResult && (
        <div className="mb-6 p-4 border border-green-500 bg-green-50 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">백필 완료</h3>
              <div className="text-sm text-green-700 mt-2 space-y-1">
                <p>✅ 처리된 사용자: {backfillResult.processedUsers} / {backfillResult.totalUsers}</p>
                <p>📝 총 히스토리: {backfillResult.totalHistories}개</p>
                <p>➕ 생성된 통계: {backfillResult.totalCreated}개</p>
                <p>🔄 업데이트된 통계: {backfillResult.totalUpdated}개</p>
                {backfillResult.errorUsers > 0 && (
                  <p className="text-red-600">❌ 오류 발생: {backfillResult.errorUsers}명</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 테스트 데이터 생성 성공 메시지 */}
      {testSuccess && (
        <div className="mb-6 p-4 border border-green-500 bg-green-50 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">생성 완료</h3>
              <p className="text-sm text-green-700 mt-1">{testSuccess}</p>
              <p className="text-xs text-green-600 mt-2">3초 후 대시보드로 이동합니다...</p>
            </div>
          </div>
        </div>
      )}

      {/* 데이터 동기화 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            일일 통계 백필
          </CardTitle>
          <CardDescription>
            모든 사용자의 히스토리 데이터를 기반으로 일일 통계를 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">이 작업은 다음을 수행합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>모든 사용자의 히스토리 레코드 조회</li>
                <li>날짜별로 그룹화하여 통계 계산</li>
                <li>누락된 일일 통계 문서 생성</li>
                <li>기존 통계가 있으면 더 큰 값으로 업데이트</li>
              </ul>
              <p className="mt-3 text-yellow-600 font-medium">
                ⚠️ 사용자가 많을 경우 시간이 오래 걸릴 수 있습니다.
              </p>
            </div>

            <Button
              onClick={handleBackfillAllUsers}
              disabled={isBackfilling}
              className="w-full"
              size="lg"
            >
              {isBackfilling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  백필 실행 중...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  전체 사용자 백필 실행
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 테스트 데이터 생성 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            테스트 데이터 생성
          </CardTitle>
          <CardDescription>
            오늘 날짜로 테스트 히스토리를 생성하여 대시보드에서 즉시 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">이 작업은 다음을 수행합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>현재 로그인한 사용자의 히스토리 생성</li>
                <li>오늘 날짜로 daily 통계 자동 업데이트</li>
                <li>대시보드의 &ldquo;최근 7일&rdquo; 차트에 즉시 반영</li>
              </ul>
              <p className="mt-3 text-blue-600 font-medium">
                💡 대시보드에 통계가 표시되지 않을 때 유용합니다.
              </p>
            </div>

            <Button
              onClick={handleCreateTestHistory}
              disabled={isCreatingTest}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {isCreatingTest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  테스트 히스토리 생성
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 상세 결과 (접을 수 있는 섹션) */}
      {backfillResult?.details && backfillResult.details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>상세 결과</CardTitle>
            <CardDescription>
              사용자별 백필 결과
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-2">이메일</th>
                    <th className="text-right p-2">히스토리</th>
                    <th className="text-right p-2">생성</th>
                    <th className="text-right p-2">업데이트</th>
                    <th className="text-left p-2">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {backfillResult.details.map((detail, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">{detail.email}</td>
                      <td className="text-right p-2">{detail.histories}</td>
                      <td className="text-right p-2">{detail.created}</td>
                      <td className="text-right p-2">{detail.updated}</td>
                      <td className="p-2">
                        {detail.error ? (
                          <span className="text-red-600 text-xs">❌ {detail.error}</span>
                        ) : (
                          <span className="text-green-600 text-xs">✅</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
