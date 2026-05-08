import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Smartphone, Monitor, Copy, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLinks } from '../../hooks/useLinks';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { copyToClipboard, getInitials, generateAvatarColor } from '../../lib/utils';

export function PreviewPage() {
  const user = useAuthStore((state) => state.user);
  const { data: linksData, isLoading } = useLinks();
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  const links = linksData?.links || [];
  const activeLinks = links?.filter((link: any) => link.isActive) || [];

  const handleCopyProfileUrl = () => {
    const profileUrl = `https://linkcraft.ai/${user?.username}`;
    copyToClipboard(profileUrl);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Preview</h1>
          <p className="text-muted-foreground">See how your profile looks to visitors</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={device === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </Button>
          <Button
            variant={device === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('desktop')}
          >
            <Monitor className="mr-2 h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyProfileUrl}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 ${
            device === 'mobile'
              ? 'w-full max-w-sm'
              : 'w-full max-w-2xl'
          }`}
        >
          <Card className="border-2 overflow-hidden">
            <CardContent className="p-0">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className={generateAvatarColor(user?.displayName || 'User')}>
                    {getInitials(user?.displayName || 'User')}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{user?.displayName}</h2>
                <p className="text-muted-foreground mb-4">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-sm max-w-md mx-auto">{user.bio}</p>
                )}
              </div>

              {/* Links */}
              <div className="p-6 space-y-3">
                {activeLinks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No links to display
                  </p>
                ) : (
                  activeLinks.map((link) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="block"
                    >
                      <div className="p-4 border-2 rounded-xl hover:border-primary transition-colors bg-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {link.iconUrl && (
                                <img
                                  src={link.iconUrl}
                                  alt=""
                                  className="h-6 w-6"
                                />
                              )}
                              <span className="font-medium">{link.title}</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </motion.a>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 text-center text-xs text-muted-foreground border-t">
                Powered by LinkCraft AI
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
