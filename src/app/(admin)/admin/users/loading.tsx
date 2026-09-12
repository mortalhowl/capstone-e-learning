import {
  PageHeaderSkeleton,
  FilterBarSkeleton,
  UserTableSkeleton,
  PaginationSkeleton,
} from "@/components/admin/table-skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton hasAction={true} />
      <FilterBarSkeleton />
      <UserTableSkeleton rowCount={8} />
      <PaginationSkeleton />
    </div>
  );
}
