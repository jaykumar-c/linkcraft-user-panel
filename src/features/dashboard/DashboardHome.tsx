import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { useLinks } from '../../hooks/useLinks';
import { useAnalyticsOverview } from '../../hooks/useAnalytics';
import { useProfile } from '../../hooks/useProfile';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { getInitials, generateAvatarColor } from '../../lib/utils';

export function DashboardHome() {
  const user = useAuthStore((state) => state.user);
  const { data: linksData, isLoading: linksLoading } = useLinks();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsOverview();
  const { data: profile } = useProfile();

  const stats = analytics || { totalViews: 0, totalClicks: 0, clickRate: 0 };
  
  const links: any[] = (linksData as any)?.links || (Array.isArray(linksData) ? linksData : []);

  const profileCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    if (profile.display_name || profile.displayName) completed++;
    if (profile.username) completed++;
    if (profile.avatar_url || profile.avatar) completed++;
    if (profile.bio_text || profile.bio) completed++;
    return Math.round((completed / 4) * 100);
  };

  const activeLinksCount = links.filter((l: any) => l.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2">
            <AvatarImage src={profile?.avatar_url || profile?.avatar || user?.avatar_url || user?.avatar || undefined} />
            <AvatarFallback className={generateAvatarColor(user?.display_name || user?.displayName || 'U')}>
              {getInitials(user?.display_name || user?.displayName || 'U')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {(user?.display_name || user?.displayName)?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here's what's happening with your profile
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to="/dashboard/links">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Links</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {linksLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{links.length}</span>
                <span className="text-xs text-muted-foreground">({activeLinksCount} active)</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Profile Views</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</span>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {analyticsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</span>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">AI Tokens Used</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <span className="text-2xl font-bold">{profile?.total_ai_tokens_used || profile?.totalAiTokensUsed || 0}</span>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Profile Complete</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{profileCompletion()}%</span>
              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${profileCompletion()}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Links Table */}
        <div className="lg:col-span-2">
          <Card className="border-2 h-full">
            <CardHeader className="border-b">
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>Your latest added links</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {linksLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : links.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <LinkIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No links yet</p>
                  <Button asChild size="sm">
                    <Link to="/dashboard/links">
                      <Plus className="mr-2 h-4 w-4" />
                      Add your first link
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {links.slice(0, 6).map((link: any) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${link.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{link.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {link.clickCount || 0}
                        </span>
                        <span className="text-xs text-muted-foreground">clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/dashboard/ai-bio">
                  <Sparkles className="mr-3 h-4 w-4" />
                  Generate AI Bio
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/dashboard/links">
                  <Plus className="mr-3 h-4 w-4" />
                  Add New Link
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/dashboard/profile">
                  <LinkIcon className="mr-3 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/dashboard/settings">
                  <Sparkles className="mr-3 h-4 w-4" />
                  Customize Theme
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}