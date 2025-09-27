import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Share, UserPlus, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const InviteCollaborator = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateAndCopyInviteLink = async () => {
    // Generate a unique invite code
    const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invite?code=${inviteCode}`;
    
    try {
      await (navigator as any).clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Invite link copied!",
        description: "Share this link with your partner or caregiver.",
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      setInviteLink(link);
      toast({
        title: "Link generated",
        description: "Copy the link below to share.",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share && inviteLink) {
      try {
        await navigator.share({
          title: "Baby Tracking App Invitation",
          text: "Join me in tracking our baby's activities!",
          url: inviteLink,
        });
      } catch (err) {
        // User cancelled or sharing failed
        try {
          await (navigator as any).clipboard.writeText(inviteLink);
          toast({
            title: "Link copied!",
            description: "The invite link has been copied to your clipboard.",
          });
        } catch (clipboardErr) {
          toast({
            title: "Failed to share",
            description: "Please copy the link manually.",
            variant: "destructive",
          });
        }
      }
    } else {
      try {
        await (navigator as any).clipboard.writeText(inviteLink);
        toast({
          title: "Link copied!",
          description: "The invite link has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Share Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share tracking with someone so they can view and add activities too.
          </p>

          <Button 
            onClick={generateAndCopyInviteLink}
            className="w-full"
          >
            <Share className="h-4 w-4 mr-2" />
            {copied ? "Link Copied!" : "Copy Invite Link"}
          </Button>

          {inviteLink && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="invite-link">Invite Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-link"
                    value={inviteLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    onClick={() => (navigator as any).clipboard.writeText(inviteLink)}
                    size="icon"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="font-medium mb-1">How it works:</p>
            <ul className="space-y-1">
              <li>• Your collaborator clicks the link</li>
              <li>• They can view and add activities</li>
              <li>• All changes sync in real-time</li>
              <li>• You can revoke access anytime</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-60" />
            <p className="text-sm">No collaborators yet</p>
            <p className="text-xs">Share the link to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};