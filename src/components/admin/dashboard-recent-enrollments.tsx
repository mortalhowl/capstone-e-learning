import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Types ──────────────────────────────────────────────────────────

interface RecentEnrollment {
  studentName: string;
  courseName: string;
  timeAgo: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────
// Dữ liệu tĩnh cho Phase A — sẽ thay bằng API thật ở Phase B

const MOCK_RECENT_ENROLLMENTS: RecentEnrollment[] = [
  {
    studentName: "Nguyễn Minh Tuấn",
    courseName: "React & TypeScript Masterclass",
    timeAgo: "2 giờ trước",
  },
  {
    studentName: "Trần Thị Mai",
    courseName: "Python for Data Science",
    timeAgo: "5 giờ trước",
  },
  {
    studentName: "Lê Hoàng Nam",
    courseName: "Node.js Advanced",
    timeAgo: "1 ngày trước",
  },
  {
    studentName: "Phạm Ngọc Ánh",
    courseName: "UI/UX Design Fundamentals",
    timeAgo: "1 ngày trước",
  },
  {
    studentName: "Hoàng Đức Mạnh",
    courseName: "DevOps with Docker & Kubernetes",
    timeAgo: "2 ngày trước",
  },
];

// ─── Helper ─────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

// ─── Component ──────────────────────────────────────────────────────

export function DashboardRecentEnrollments() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Enrollments</CardTitle>
          <Link
            href="/admin/enrollments"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_RECENT_ENROLLMENTS.map((enrollment, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(enrollment.studentName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {enrollment.studentName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  enrolled in {enrollment.courseName}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {enrollment.timeAgo}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
