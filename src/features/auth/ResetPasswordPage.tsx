import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../schemas/auth.schema';
import { useResetPassword } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { PasswordInput } from '../../components/forms/PasswordInput';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const resetPassword = useResetPassword();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setIsLoading(true);
    try {
      await resetPassword.mutateAsync({ token, newPassword: data.password });
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4"
      >
        <Card className="w-full max-w-md border-2 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Invalid reset link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/forgot-password" className="w-full">
              <Button variant="outline" className="w-full">
                Request new reset link
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (isSuccess) {
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
            <CardTitle className="text-3xl font-bold">Password reset</CardTitle>
            <CardDescription>
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/login" className="w-full">
              <Button className="w-full">
                Sign in with new password
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
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60"
          >
            <span className="text-3xl">🔑</span>
          </motion.div>
          <CardTitle className="text-3xl font-bold">Reset password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || resetPassword.isPending}
            >
              {isLoading || resetPassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
