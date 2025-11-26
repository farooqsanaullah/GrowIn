"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  timeAgo: string;
  color: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-green-500';
      case 'primary': return 'bg-primary';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const founderId = "673615f87cdf80bbbb5d7cd7"; // This should come from auth context in real app
        const response = await fetch(`/api/activities?founderId=${founderId}&limit=6`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setActivities(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Fallback to static data if API fails
        setActivities([
          {
            id: '1',
            type: 'view',
            title: 'New investor viewed EcoTech Solutions',
            timeAgo: '2 hours ago',
            color: 'success'
          },
          {
            id: '2',
            type: 'feature',
            title: 'Profile featured in trending founders',
            timeAgo: '5 hours ago',
            color: 'primary'
          },
          {
            id: '3',
            type: 'rating',
            title: 'HealthTech AI received new rating',
            timeAgo: '1 day ago',
            color: 'blue'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activities to show
            </p>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 ${
                  index < activities.length - 1 ? 'pb-3 border-b border-border/50' : ''
                } animate-in slide-in-from-left duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-2 h-2 ${getColorClass(activity.color)} rounded-full mt-2 transition-all duration-200`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground hover:text-primary transition-colors duration-200">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}