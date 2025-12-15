// app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, ArrowLeft, CreditCard, Webhook, Shield, Bell } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '대시보드', icon: LayoutDashboard },
    { href: '/admin/users', label: '사용자 관리', icon: Users },
    { href: '/admin/subscriptions', label: '구독 관리', icon: CreditCard },
    { href: '/admin/webhooks', label: '웹훅 로그', icon: Webhook },
    { href: '/admin/audit', label: '감사 로그', icon: Shield },
    { href: '/admin/notifications', label: '이메일 알림', icon: Bell },
    { href: '/admin/tools', label: '관리 도구', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 관리자 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                메인으로
              </Link>
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              관리자 모드
            </div>
          </div>
        </div>
      </nav>

      {/* 컨텐츠 */}
      <main>{children}</main>
    </div>
  );
}
