import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { useSeo } from '../hooks/useSeo';
import { useEffect } from 'react';

const RegisterPage = lazy(() => import('../features/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../features/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('../features/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LinksPage = lazy(() => import('../features/links/LinksPage').then(m => ({ default: m.LinksPage })));
const AiBioPage = lazy(() => import('../features/ai-bio/AiBioPage').then(m => ({ default: m.AiBioPage })));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PreviewPage = lazy(() => import('../features/preview/PreviewPage').then(m => ({ default: m.PreviewPage })));
// const AnalyticsPage = lazy(() => import('../features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const DashboardHome = lazy(() => import('../features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));

function LoadingFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function GuestPageSeo({ title, children }: { title: string; children: React.ReactNode }) {
  const { setPageSeo } = useSeo();
  useEffect(() => {
    setPageSeo(title);
  }, [title, setPageSeo]);
  return <>{children}</>;
}

function AuthRouteWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GuestPageSeo title={title}>
        <GuestRoute>{children}</GuestRoute>
      </GuestPageSeo>
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <GuestPageSeo title="Login">
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        </GuestPageSeo>
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthRouteWrapper title="Create Account">
        <RegisterPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthRouteWrapper title="Forgot Password">
        <ForgotPasswordPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthRouteWrapper title="Reset Password">
        <ResetPasswordPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <AuthRouteWrapper title="Verify Email">
        <VerifyEmailPage />
      </AuthRouteWrapper>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardHome />
          </Suspense>
        ),
      },
      {
        path: 'links',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LinksPage />
          </Suspense>
        ),
      },
      {
        path: 'ai-bio',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AiBioPage />
          </Suspense>
        ),
      },
      // {
      //   path: 'analytics',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <AnalyticsPage />
      //     </Suspense>
      //   ),
      // },
      {
        path: 'preview',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PreviewPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}