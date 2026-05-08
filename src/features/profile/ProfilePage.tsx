import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Camera, Loader2, Save, CalendarClock, User, Link as LinkIcon, Mail, CreditCard, Eye, Sparkles } from 'lucide-react';
import { updateProfileSchema, type UpdateProfileFormData } from '../../schemas/profile.schema';
import { useProfile } from '../../hooks/useProfile';
import { useUpdateProfile } from '../../hooks/useProfile';
import { useUploadAvatar } from '../../hooks/useProfile';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { getInitials, generateAvatarColor } from '../../lib/utils';

export function ProfilePage() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const user = useAuthStore((state) => state.user);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const formatLastLogin = (timestamp: string | number | undefined) => {
    if (!timestamp) return 'Never';
    try {
      const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
      if (isNaN(ts)) return 'Never';
      return moment(ts * 1000).format('MMM DD, YYYY');
    } catch {
      return 'Never';
    }
  };

  const lastLoginAt = profile?.last_login_at || user?.last_login_at;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: '',
      username: '',
      bio: '',
      profession: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.display_name || user?.display_name || user?.displayName || '',
        username: profile.username || user?.username || '',
        bio: profile.bio_text || profile.bio || user?.bio_text || user?.bio || '',
        profession: profile.profession || user?.profession || '',
      });
    }
  }, [profile, user, reset]);

  watch(() => {
    setHasChanges(isDirty);
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    const updateData: any = {};
    if (data.displayName) updateData.displayName = data.displayName;
    if (data.username) updateData.username = data.username;
    if (data.bio !== undefined) updateData.bioText = data.bio;
    if (data.profession) updateData.profession = data.profession;
    
    await updateProfile.mutateAsync(updateData);
    setHasChanges(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('File must be an image');
      return;
    }
    setIsUploading(true);
    try {
      await uploadAvatar.mutateAsync(file);
    } finally {
      setIsUploading(false);
    }
  };

  const bioLength = watch('bio')?.length || 0;

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'hsl(var(--primary))' }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and public profile
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border-2 overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        {/* Avatar Section */}
        <div className="relative p-8 text-center" style={{ backgroundColor: 'hsl(var(--primary) / 0.05)' }}>
          <div className="absolute top-4 right-4">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {user?.plan || 'Free'} Plan
            </span>
          </div>
          
          <div className="inline-flex relative">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url || profile?.avatar || user?.avatar_url || user?.avatar || undefined} />
              <AvatarFallback className={generateAvatarColor(profile?.display_name || profile?.displayName || user?.display_name || user?.displayName || 'U')}>
                {getInitials(profile?.display_name || profile?.displayName || user?.display_name || user?.displayName || 'U')}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          
          <div className="mt-4">
            <p className="text-xl font-semibold">{profile?.display_name || user?.display_name || user?.displayName || 'Your Name'}</p>
            <p className="text-muted-foreground">@{profile?.username || user?.username || 'username'}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" /> Display Name
              </Label>
              <Input
                id="displayName"
                placeholder="Your name"
                {...register('displayName')}
                className={`h-11 ${errors.displayName ? 'border-destructive' : ''}`}
              />
              {errors.displayName && (
                <p className="text-xs text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-4 w-4" /> Username
              </Label>
              <div className="flex items-center">
                <span className="h-11 flex items-center rounded-l-xl border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  linkcraft.ai/
                </span>
                <Input
                  id="username"
                  placeholder="username"
                  {...register('username')}
                  className={`h-11 rounded-l-none ${errors.username ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="profession" className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> Profession
            </Label>
            <Input
              id="profession"
              placeholder="e.g., Software Engineer, Designer, Entrepreneur"
              {...register('profession')}
              className={`h-11 ${errors.profession ? 'border-destructive' : ''}`}
            />
            {errors.profession && (
              <p className="text-xs text-destructive">{errors.profession.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" /> Bio
              </Label>
              <span className="text-xs text-muted-foreground">
                {bioLength} characters
              </span>
            </div>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell your story... What do you do? What makes you unique?"
              {...register('bio')}
              className={`w-full rounded-xl border-2 bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.bio ? 'border-destructive' : ''}`}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
            {bioLength === 0 && (
              <p className="text-xs text-muted-foreground">
                💡 Tip: A great bio is 2-3 sentences. Include your profession, expertise, and what makes you unique.
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!hasChanges || updateProfile.isPending}
              className="h-11 px-6"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border-2 overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <h2 className="text-lg font-semibold">Account Information</h2>
          <p className="text-sm text-muted-foreground">View your account details</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>Email</span>
            </div>
            <span className="font-medium">{profile?.email || user?.email || '-'}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CreditCard className="h-5 w-5" />
              <span>Plan</span>
            </div>
            <span className="font-medium capitalize px-3 py-1 rounded-full bg-primary/10" style={{ color: 'hsl(var(--primary))' }}>
              {user?.plan || 'Free'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Eye className="h-5 w-5" />
              <span>Profile Views</span>
            </div>
            <span className="font-medium">{user?.total_profile_views || 0}</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CalendarClock className="h-5 w-5" />
              <span>Last Login</span>
            </div>
            <span className="font-medium">
              {formatLastLogin(lastLoginAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}