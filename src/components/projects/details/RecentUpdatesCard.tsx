
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const RecentUpdatesCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { update: "Milestone 3 completed", date: "Oct 15, 2023" },
            { update: "Updated project timeline", date: "Oct 10, 2023" },
            { update: "Added new material specifications", date: "Oct 5, 2023" },
          ].map((item, i) => (
            <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
              <div className="font-medium">{item.update}</div>
              <div className="text-sm text-muted-foreground">{item.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUpdatesCard;
