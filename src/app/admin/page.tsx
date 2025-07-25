import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FolderTree, Clock } from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  type: "submitted" | "approved";
  name: string;
  created_at: string;
}

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

interface DashboardStats {
  total_users: number;
  new_users_this_month: number;
  total_courses: number;
  new_courses_this_month: number;
  total_categories: number;
  active_categories: number;
  pending_courses: number;
  recent_activities: Activity[];
  category_stats: CategoryStat[];
}

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch dashboard stats
  const { data: stats, error } = await supabase.rpc("get_dashboard_stats");

  if (error) {
    console.error("Error fetching dashboard stats:", error);
  }

  const dashboardData: DashboardStats = stats || {
    total_users: 0,
    new_users_this_month: 0,
    total_courses: 0,
    new_courses_this_month: 0,
    total_categories: 0,
    active_categories: 0,
    pending_courses: 0,
    recent_activities: [],
    category_stats: [],
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, Admin</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.total_users.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData.new_users_this_month} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.total_courses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData.new_courses_this_month} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.total_categories.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.active_categories} active categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.pending_courses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Courses awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recent_activities?.map(
                (activity: Activity, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.type === "submitted"
                          ? "New course submitted: "
                          : "Course approved: "}
                        &quot;{activity.name}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                )
              )}
              {(!dashboardData.recent_activities ||
                dashboardData.recent_activities.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.category_stats?.map(
                (category: CategoryStat, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.count}{" "}
                        {category.count === 1 ? "course" : "courses"}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.percentage}%
                    </span>
                  </div>
                )
              )}
              {(!dashboardData.category_stats ||
                dashboardData.category_stats.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No categories yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
