import {
  BookOpen,
  Users,
  ClipboardList,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ─── Types ──────────────────────────────────────────────────────────

interface StatItem {
  title: string;
  value: string;
  trendValue: string;
  trendLabel: string;
  trendUp: boolean;
  icon: React.ElementType;
}

// ─── Mock Data ──────────────────────────────────────────────────────
// Dữ liệu tĩnh cho Phase A — sẽ thay bằng API thật ở Phase B

const MOCK_STATS: StatItem[] = [
  {
    title: "Total Courses",
    value: "156",
    trendValue: "+12",
    trendLabel: "from last month",
    trendUp: true,
    icon: BookOpen,
  },
  {
    title: "Total Students",
    value: "2,350",
    trendValue: "+180",
    trendLabel: "from last month",
    trendUp: true,
    icon: Users,
  },
  {
    title: "Enrollments",
    value: "4,720",
    trendValue: "+340",
    trendLabel: "from last month",
    trendUp: true,
    icon: ClipboardList,
  },
  {
    title: "Total Views",
    value: "89,400",
    trendValue: "-1,200",
    trendLabel: "from last month",
    trendUp: false,
    icon: Eye,
  },
];

// ─── Component ──────────────────────────────────────────────────────

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MOCK_STATS.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              <span
                className={
                  stat.trendUp ? "text-emerald-600" : "text-red-500"
                }
              >
                {stat.trendValue}
              </span>{" "}
              {stat.trendLabel}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
