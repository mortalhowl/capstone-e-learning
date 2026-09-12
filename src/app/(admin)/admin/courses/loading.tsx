import {
  PageHeaderSkeleton,
  FilterBarSkeleton,
  CourseTableSkeleton,
  PaginationSkeleton,
} from "@/components/admin/table-skeleton";

export default function CoursesLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton hasAction={true} />
      <FilterBarSkeleton />
      <CourseTableSkeleton rowCount={8} />
      <PaginationSkeleton />
    </div>
  );
}
