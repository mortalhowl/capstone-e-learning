"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Palette,
  Smartphone,
  Layout,
  Layers,
  Brain,
  Users,
  GraduationCap,
  UserCog,
  ClipboardList,
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
        title: "Trang chủ",
        url: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Quản lý đào tạo",
    items: [
      {
        title: "Quản lý khóa học",
        url: "/admin/courses",
        icon: BookOpen,
        items: [
          { title: "Tất cả khóa học", url: "/admin/courses", icon: BookOpen },
          { title: "Lập trình Backend", url: "/admin/courses?category=BackEnd", icon: Code2 },
          { title: "Thiết kế Web", url: "/admin/courses?category=Design", icon: Palette },
          { title: "Lập trình di động", url: "/admin/courses?category=DiDong", icon: Smartphone },
          { title: "Lập trình Front end", url: "/admin/courses?category=FrontEnd", icon: Layout },
          { title: "Lập trình Full Stack", url: "/admin/courses?category=FullStack", icon: Layers },
          { title: "Tư duy lập trình", url: "/admin/courses?category=TuDuy", icon: Brain },
        ],
      },
      {
        title: "Quản lý người dùng",
        url: "/admin/users",
        icon: Users,
        items: [
          { title: "Tất cả người dùng", url: "/admin/users", icon: Users },
          { title: "Học viên", url: "/admin/users?role=HV", icon: GraduationCap },
          { title: "Giảng viên / Giáo vụ", url: "/admin/users?role=GV", icon: UserCog },
        ],
      },
      {
        title: "Quản lý ghi danh",
        url: "/admin/enrollments",
        icon: ClipboardList,
      },
    ],
  },
];

// ─── Sidebar Component ──────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  // Kiểm tra xem một URL có đang active không
  // Hỗ trợ cả query params (ví dụ ?role=HV, ?role=GV, ?category=BackEnd)
  const isActive = (url: string) => {
    if (url === "/admin") return pathname === "/admin";
    if (url.includes("?")) {
      const [path, query] = url.split("?");
      const params = new URLSearchParams(query);
      const role = params.get("role");
      const category = params.get("category");
      if (role) {
        return pathname === path && searchParams.get("role") === role;
      }
      if (category) {
        return (
          pathname === path &&
          searchParams.get("category")?.toLowerCase() === category.toLowerCase()
        );
      }
    }
    if (url === "/admin/courses") {
      return (
        pathname === "/admin/courses" &&
        (!searchParams.get("category") || searchParams.get("category") === "ALL")
      );
    }
    if (url === "/admin/users") {
      return (
        pathname === "/admin/users" &&
        (!searchParams.get("role") || searchParams.get("role") === "ALL")
      );
    }
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
              tooltip="Trang chủ Quản trị"
            >
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                <LogoIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">E-Learning</span>
                <span className="text-xs text-muted-foreground">Quản trị hệ thống</span>
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

