import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Printer, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setSessionPublic, DRAFT_ID, type StoredSession } from '@/lib/sessionStore';

interface Props {
  stored: StoredSession;
  isOwner: boolean;
  onChange: (s: StoredSession) => void;
}

const SessionExport = ({ stored, isOwner, onChange }: Props) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const isDraft = stored.id === DRAFT_ID;
  const link = `${window.location.origin}/session/${stored.id}`;

  const togglePublic = async (value: boolean) => {
    setBusy(true);
    try {
      await setSessionPublic(stored.id, value);
      onChange({ ...stored, isPublic: value });
    } catch (e: unknown) {
      toast({ title: "Couldn't change sharing", description: e instanceof Error ? e.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Link copied',
        description: stored.isPublic ? 'Anyone with the link can view this session.' : 'Sharing is off, so only you can open it.',
      });
    } catch {
      toast({ title: "Couldn't copy the link", description: link, variant: 'destructive' });
    }
  };

  return (
    <div className="flex gap-2">
      {!isDraft && isOwner && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline"><Share2 className="w-4 h-4 mr-2" />Share</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4" align="end">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="public">Anyone with the link can view</Label>
              <Switch id="public" checked={stored.isPublic} disabled={busy} onCheckedChange={togglePublic} />
            </div>
            <Button className="w-full" onClick={copy}>Copy link</Button>
          </PopoverContent>
        </Popover>
      )}
      {isDraft && (
        <Button variant="outline" asChild><Link to="/account"><Share2 className="w-4 h-4 mr-2" />Sign in to share</Link></Button>
      )}
      <Button asChild>
        <Link to={`/session/${stored.id}/print`}><Printer className="w-4 h-4 mr-2" />Print / PDF</Link>
      </Button>
    </div>
  );
};

export default SessionExport;
