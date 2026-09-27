import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ─── Types ──────────────────────────────────────────────────────────

interface RecentCourse {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  danhMuc: string;
  nguoiTao: string;
  soLuongHocVien: number;
  luotXem: number;
  ngayTao: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────
// Dữ liệu tĩnh cho Phase A — sẽ thay bằng API thật ở Phase B

const MOCK_RECENT_COURSES: RecentCourse[] = [
  {
    maKhoaHoc: "react-ts-2024",
    tenKhoaHoc: "React & TypeScript Masterclass",
    danhMuc: "Front-end",
    nguoiTao: "Nguyễn Văn A",
    soLuongHocVien: 145,
    luotXem: 3200,
    ngayTao: "10/09/2026",
  },
  {
    maKhoaHoc: "nodejs-adv",
    tenKhoaHoc: "Node.js Advanced",
    danhMuc: "Back-end",
    nguoiTao: "Trần Thị B",
    soLuongHocVien: 98,
    luotXem: 2100,
    ngayTao: "08/09/2026",
  },
  {
    maKhoaHoc: "python-ds",
    tenKhoaHoc: "Python for Data Science",
    danhMuc: "Data Science",
    nguoiTao: "Lê Văn C",
    soLuongHocVien: 210,
    luotXem: 4500,
    ngayTao: "05/09/2026",
  },
  {
    maKhoaHoc: "uiux-fund",
    tenKhoaHoc: "UI/UX Design Fundamentals",
    danhMuc: "Design",
    nguoiTao: "Phạm Thị D",
    soLuongHocVien: 76,
    luotXem: 1800,
    ngayTao: "01/09/2026",
  },
  {
    maKhoaHoc: "devops-docker",
    tenKhoaHoc: "DevOps with Docker & Kubernetes",
    danhMuc: "DevOps",
    nguoiTao: "Hoàng Văn E",
    soLuongHocVien: 52,
    luotXem: 1200,
    ngayTao: "28/08/2026",
  },
];

// ─── Component ──────────────────────────────────────────────────────

export function DashboardRecentCourses() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Courses</CardTitle>
          <Link
            href="/admin/courses"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_COURSES.map((course) => (
                <TableRow key={course.maKhoaHoc}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{course.tenKhoaHoc}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.nguoiTao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.danhMuc}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {course.soLuongHocVien.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {course.luotXem.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {course.ngayTao}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

    </Card>
  );
}
