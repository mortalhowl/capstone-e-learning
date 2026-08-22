"use client";

import * as React from "react";
import {
  CheckCircle2,
  BookOpen,
  Users,
  Layers,
  GraduationCap,
  PlayCircle,
  FileText,
} from "lucide-react";

import type { Course } from "@/schemas/course.schema";
import { useAuthStore } from "@/stores/auth.store";
import { useEnrollStudent } from "@/hooks/useCourses";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseDetailTabsProps {
  course: Course;
}

const emptySubscribe = () => () => {};

export function CourseDetailTabs({ course }: CourseDetailTabsProps) {
  const user = useAuthStore((state) => state.user);
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isAuthenticated = isHydrated && Boolean(user);

  const { data: enrollData, isLoading: isLoadingStudents } = useEnrollStudent(
    course.maKhoaHoc,
    isAuthenticated
  );

  const students = enrollData?.lstHocVien || [];

  const learningOutcomes = [
    "Nắm vững các kiến thức nền tảng và chuyên sâu về công nghệ",
    "Tự tin xây dựng và triển khai các dự án thực tế từ con số 0",
    "Rèn luyện tư duy lập trình logic và giải quyết vấn đề hiệu quả",
    "Sử dụng thành thạo các công cụ và thư viện tiêu chuẩn trong ngành",
    "Hiểu rõ quy trình làm việc chuẩn trong các doanh nghiệp phần mềm",
    "Sẵn sàng ứng tuyển vào các vị trí lập trình viên với mức lương tốt",
  ];

  const curriculumModules = [
    {
      title: "Chương 1: Giới thiệu tổng quan & Thiết lập môi trường",
      lessons: [
        "Tổng quan về khóa học và lộ trình học tập",
        "Cài đặt các công cụ phát triển phần mềm cần thiết",
        "Chương trình đầu tiên và cú pháp căn bản",
      ],
    },
    {
      title: "Chương 2: Kiến thức nền tảng & Cấu trúc dữ liệu",
      lessons: [
        "Biến, kiểu dữ liệu và toán tử cơ bản",
        "Cấu trúc điều kiện rẽ nhánh và vòng lặp",
        "Hàm và phạm vi biến trong chương trình",
      ],
    },
    {
      title: "Chương 3: Lập trình nâng cao & Thư viện thực tế",
      lessons: [
        "Lập trình hướng đối tượng (OOP) thực chiến",
        "Làm việc với API và bất đồng bộ",
        "Xử lý lỗi và tối ưu hóa hiệu năng",
      ],
    },
    {
      title: "Chương 4: Xây dựng dự án thực tế & Triển khai",
      lessons: [
        "Phân tích yêu cầu và thiết kế kiến trúc dự án",
        "Xây dựng tính năng hoàn chỉnh cho ứng dụng",
        "Đóng gói, kiểm thử và triển khai lên môi trường thực tế",
      ],
    },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full space-y-6">
      <TabsList variant="line" className="border-b border-border/50 w-full justify-start gap-6 h-auto p-0">
        <TabsTrigger
          value="overview"
          className="pb-3 text-sm font-semibold cursor-pointer data-active:border-b-2 data-active:border-primary rounded-none"
        >
          <Layers className="size-4 mr-2" />
          <span>Tổng quan</span>
        </TabsTrigger>
        <TabsTrigger
          value="curriculum"
          className="pb-3 text-sm font-semibold cursor-pointer data-active:border-b-2 data-active:border-primary rounded-none"
        >
          <BookOpen className="size-4 mr-2" />
          <span>Nội dung khóa học</span>
        </TabsTrigger>
        {isAuthenticated && (
          <TabsTrigger
            value="students"
            className="pb-3 text-sm font-semibold cursor-pointer data-active:border-b-2 data-active:border-primary rounded-none"
          >
            <Users className="size-4 mr-2" />
            <span>Học viên ({students.length})</span>
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="overview" className="space-y-8 pt-2">
        <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <span>Bạn sẽ học được gì?</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-3.5">
            {learningOutcomes.map((item, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Mô tả khóa học</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {course.moTa ||
              "Khóa học được thiết kế đặc biệt giúp học viên tiếp cận công nghệ một cách bài bản, dễ hiểu và ứng dụng trực tiếp vào công việc hàng ngày."}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border/40">
          <h2 className="text-lg font-bold text-foreground">Yêu cầu khóa học</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Máy tính cá nhân có kết nối Internet ổn định.</li>
            <li>Không yêu cầu kiến thức chuyên sâu từ trước, bài giảng bắt đầu từ mức cơ bản nhất.</li>
            <li>Tinh thần học tập chủ động, kiên trì thực hành và làm bài tập sau mỗi buổi học.</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="curriculum" className="space-y-4 pt-2">
        <div className="space-y-3">
          {curriculumModules.map((module, mIdx) => (
            <div
              key={mIdx}
              className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary shrink-0" />
                  <span>{module.title}</span>
                </h3>
                <span className="text-xs text-muted-foreground shrink-0 font-medium">
                  {module.lessons.length} bài học
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                {module.lessons.map((lesson, lIdx) => (
                  <div
                    key={lIdx}
                    className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <PlayCircle className="size-3.5 text-muted-foreground/70" />
                      <span>{lesson}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Video</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {isAuthenticated && (
        <TabsContent value="students" className="space-y-4 pt-2">
          {isLoadingStudents ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : students.length > 0 ? (
            <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-16">STT</TableHead>
                    <TableHead>Họ tên học viên</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, idx) => (
                    <TableRow key={student.taiKhoan || idx}>
                      <TableCell className="font-medium text-muted-foreground text-xs">
                        {String(idx + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground text-sm">
                        {student.hoTen}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {student.taiKhoan}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                          Đang học
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center rounded-xl border border-dashed border-border/70 bg-muted/20 space-y-2">
              <Users className="size-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">
                Chưa có học viên ghi danh
              </p>
              <p className="text-xs text-muted-foreground">
                Hãy là người đầu tiên tham gia khóa học này ngay hôm nay!
              </p>
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}
