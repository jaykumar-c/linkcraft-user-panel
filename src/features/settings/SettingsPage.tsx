import { motion } from 'framer-motion';
import { Lock, Monitor, Moon, Sun, Loader2, Check, Smartphone, LogOut, Laptop } from 'lucide-react';
import { useThemeStore, THEME_PALETTES } from '../../store/themeStore';
import { useChangePassword, useSessions, useRevokeAllSessions } from '../../hooks/useSettings';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { changePasswordSchema, type ChangePasswordFormData } from '../../schemas/profile.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function SettingsPage() {
  const { theme, setTheme, palette, setPalette } = useThemeStore();
  const changePassword = useChangePassword();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const revokeAllSessions = useRevokeAllSessions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    await changePassword.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Theme */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how LinkCraft looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label>Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          {/* Light Mode Palettes */}
          <div className="space-y-3">
            <Label>Light Mode Palettes</Label>
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(THEME_PALETTES).filter(key => THEME_PALETTES[key].mode === 'light').map((key) => {
                const pal = THEME_PALETTES[key];
                const isActive = palette === key;
                
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setPalette(key);
                      setTheme('light');
                    }}
                    className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                    style={{ backgroundColor: pal.background }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pal.accent }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: pal.foreground }}>
                      {pal.name}
                    </span>
                    {isActive && (
                      <Check className="absolute top-2 right-2" style={{ color: pal.primary }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dark Mode Palettes */}
          <div className="space-y-3">
            <Label>Dark Mode Palettes</Label>
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(THEME_PALETTES).filter(key => THEME_PALETTES[key].mode === 'dark').map((key) => {
                const pal = THEME_PALETTES[key];
                const isActive = palette === key;
                
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setPalette(key);
                      setTheme('dark');
                    }}
                    className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      isActive ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                    style={{ backgroundColor: pal.background }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pal.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pal.accent }}
                      />
                    </div>
                    <span className="text-xs font-medium" style={{ color: pal.foreground }}>
                      {pal.name}
                    </span>
                    {isActive && (
                      <Check className="absolute top-2 right-2" style={{ color: pal.primary }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput
                id="currentPassword"
                placeholder="Enter current password"
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                placeholder="Enter new password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm new password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Sessions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No active sessions</p>
          ) : (
            <>
              <div className="space-y-3">
                {sessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-xl border-2"
                    style={{ borderColor: "hsl(var(--primary) / 0.1)" }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}>
                      {session.deviceInfo?.toLowerCase().includes('mobile') ? (
                        <Smartphone className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                      ) : (
                        <Laptop className="h-5 w-5" style={{ color: "hsl(var(--primary))" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.deviceInfo || 'Unknown device'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.ipAddress || 'Unknown IP'} · {session.lastUsedAt ? new Date(parseInt(session.lastUsedAt) * 1000).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => revokeAllSessions.mutate()}
                disabled={revokeAllSessions.isPending}
                style={{ borderColor: "hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" }}
              >
                {revokeAllSessions.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Log Out Other Sessions
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
