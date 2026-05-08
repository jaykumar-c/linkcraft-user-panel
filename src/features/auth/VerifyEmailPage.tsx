import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useVerifyEmail } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmail();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const token = searchParams.get('token') || '';

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await verifyEmail.mutateAsync({ token });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  if (status === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4"
      >
        <Card className="w-full max-w-md border-2 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60"
            >
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Verifying email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4"
      >
        <Card className="w-full max-w-md border-2 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600"
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Email verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/dashboard" className="w-full">
              <Button className="w-full">
                Go to dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4"
    >
      <Card className="w-full max-w-md border-2 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600"
          >
            <XCircle className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold">Verification failed</CardTitle>
          <CardDescription>
            This verification link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/forgot-password')}
          >
            Request new verification email
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
