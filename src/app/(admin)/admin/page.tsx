import { DashboardStats } from "@/components/admin/dashboard-stats";
import { DashboardRecentCourses } from "@/components/admin/dashboard-recent-courses";
import { DashboardRecentEnrollments } from "@/components/admin/dashboard-recent-enrollments";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your e-learning platform
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <DashboardRecentCourses />
        </div>
        <div className="lg:col-span-3">
          <DashboardRecentEnrollments />
        </div>
      </div>
    </div>
  );
}
