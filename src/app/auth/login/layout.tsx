// src/app/auth/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | Evaluation-UI',
  description: 'Sign in to your Evaluation-UI account to access AI model evaluation tools and dashboard.',
  robots: 'noindex, nofollow', // Don't index auth pages
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout min-h-screen">
      {children}
    </div>
  );
}