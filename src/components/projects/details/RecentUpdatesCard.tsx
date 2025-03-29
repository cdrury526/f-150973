
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useProjectUpdates, ProjectUpdate } from '@/hooks/useProjectUpdates';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentUpdatesCardProps {
  projectId: string;
}

const getUpdateIcon = (updateType: string) => {
  switch (updateType) {
    case 'cost_update':
      return '💰';
    case 'category_add':
      return '➕';
    case 'category_delete':
      return '🗑️';
    default:
      return '📝';
  }
};

const RecentUpdatesCard: React.FC<RecentUpdatesCardProps> = ({ projectId }) => {
  const { data: updates, isLoading, error, refetch, isError } = useProjectUpdates(projectId);

  const formatUpdateTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Updates</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetch()}
          title="Refresh updates"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-4 text-destructive gap-2">
            <AlertTriangle className="h-6 w-6" />
            <div className="text-sm text-center">
              Unable to load recent updates.
              <div className="text-xs mt-1 text-muted-foreground">
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            </div>
          </div>
        ) : updates && updates.length > 0 ? (
          <div className="space-y-4">
            {updates.map((update: ProjectUpdate) => (
              <div key={update.id} className="pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">{getUpdateIcon(update.update_type)}</span>
                  <div>
                    <div className="font-medium">{update.update_text}</div>
                    <div className="text-sm text-muted-foreground">{formatUpdateTime(update.created_at)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-4 text-center">
            No recent updates found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUpdatesCard;
