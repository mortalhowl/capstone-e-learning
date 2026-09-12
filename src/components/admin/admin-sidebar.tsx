"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Layers,
  FileText,
  Star,
  Users,
  GraduationCap,
  UserCog,
  ClipboardList,
  TrendingUp,
  CreditCard,
  Receipt,
  ShoppingCart,
  RotateCcw,
  Megaphone,
  Bell,
  MessageSquare,
  LifeBuoy,
  BarChart3,
  DollarSign,
  UserCheck,
  PieChart,
  Shield,
  Settings,
  ChevronRight,
  GraduationCap as LogoIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─── Navigation Config ──────────────────────────────────────────────
// Mỗi item có: title, url, icon
// Nếu có submenu → items[]
// Tách config ra khỏi component để dễ maintain và mở rộng

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: (NavItem & { items?: NavItem[] })[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Course Management",
        url: "/admin/courses",
        icon: BookOpen,
        items: [
          { title: "All Courses", url: "/admin/courses", icon: BookOpen },
          { title: "Categories", url: "/admin/courses/categories", icon: FolderTree },
          { title: "Chapters", url: "/admin/courses/chapters", icon: Layers },
          { title: "Lessons", url: "/admin/courses/lessons", icon: FileText },
          { title: "Reviews", url: "/admin/courses/reviews", icon: Star },
        ],
      },
      {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
        items: [
          { title: "All Users", url: "/admin/users", icon: Users },
          { title: "Students", url: "/admin/users/students", icon: GraduationCap },
          { title: "Instructors", url: "/admin/users/instructors", icon: UserCog },
        ],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Enrollment Management",
        url: "/admin/enrollments",
        icon: ClipboardList,
        items: [
          { title: "All Enrollments", url: "/admin/enrollments", icon: ClipboardList },
          { title: "Learning Progress", url: "/admin/enrollments/progress", icon: TrendingUp },
        ],
      },
      {
        title: "Payment Management",
        url: "/admin/payments",
        icon: CreditCard,
        items: [
          { title: "Transactions", url: "/admin/payments/transactions", icon: Receipt },
          { title: "Orders", url: "/admin/payments/orders", icon: ShoppingCart },
          { title: "Refunds", url: "/admin/payments/refunds", icon: RotateCcw },
        ],
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      {
        title: "Communication",
        url: "/admin/communication",
        icon: Megaphone,
        items: [
          { title: "Announcements", url: "/admin/communication/announcements", icon: Megaphone },
          { title: "Notifications", url: "/admin/communication/notifications", icon: Bell },
          { title: "Comments", url: "/admin/communication/comments", icon: MessageSquare },
        ],
      },
      {
        title: "Support",
        url: "/admin/support",
        icon: LifeBuoy,
        items: [
          { title: "Support Tickets", url: "/admin/support/tickets", icon: LifeBuoy },
        ],
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/admin/reports",
        icon: BarChart3,
        items: [
          { title: "Overview", url: "/admin/reports", icon: PieChart },
          { title: "Revenue", url: "/admin/reports/revenue", icon: DollarSign },
          { title: "User Analytics", url: "/admin/reports/users", icon: UserCheck },
          { title: "Course Analytics", url: "/admin/reports/courses", icon: BarChart3 },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Roles & Permissions",
        url: "/admin/roles",
        icon: Shield,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

// ─── Sidebar Component ──────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  // Kiểm tra xem một URL có đang active không
  // So sánh chính xác cho trang chính, startsWith cho sub-pages
  const isActive = (url: string) => {
    if (url === "/admin") return pathname === "/admin";
    return pathname === url || pathname.startsWith(url + "/");
  };

  // Kiểm tra xem group có chứa active item không (để auto-expand)
  const isGroupActive = (items?: NavItem[]) => {
    if (!items) return false;
    return items.some((item) => isActive(item.url));
  };

  return (
    <Sidebar collapsible="icon">
      {/* ── Header: Logo ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/admin" onClick={handleNavClick} />}
              tooltip="Admin Dashboard"
            >
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                <LogoIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">E-Learning</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Navigation ── */}
      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label || "main"}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) =>
                  item.items ? (
                    // Menu có submenu → dùng Collapsible
                    <CollapsibleNavItem
                      key={item.title}
                      item={item}
                      isActive={isActive}
                      defaultOpen={isGroupActive(item.items)}
                      onNavClick={handleNavClick}
                    />
                  ) : (
                    // Menu đơn → link trực tiếp
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} onClick={handleNavClick} />}
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>


      {/* ── Footer: User Info ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={user?.hoTen || "Admin"}>
              <Avatar className="size-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user?.hoTen?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-sm truncate">
                  {user?.hoTen || "Admin"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@example.com"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ─── Collapsible Nav Item ───────────────────────────────────────────
// Component riêng cho menu có submenu
// Dùng Collapsible từ shadcn để xử lý expand/collapse

interface CollapsibleNavItemProps {
  item: NavItem & { items?: NavItem[] };
  isActive: (url: string) => boolean;
  defaultOpen: boolean;
  onNavClick?: () => void;
}

function CollapsibleNavItem({
  item,
  isActive,
  defaultOpen,
  onNavClick,
}: CollapsibleNavItemProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
            <item.icon />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  render={<Link href={subItem.url} onClick={onNavClick} />}
                  isActive={isActive(subItem.url)}
                >
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

