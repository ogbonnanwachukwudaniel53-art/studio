
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  User,
  Ticket,
  BarChart,
  Settings,
  LogOut,
  UploadCloud,
  Users,
  CreditCard,
  BookUser,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { mockUser } from "@/lib/mock-data";

type Role = "student" | "teacher" | "admin";

const studentNavItems = [
  { href: "/student/dashboard", icon: <Home />, label: "Dashboard" },
];

const teacherNavItems = [
  { href: "/teacher/dashboard", icon: <Home />, label: "Dashboard" },
  { href: "#", icon: <UploadCloud />, label: "Upload Results" },
  { href: "#", icon: <BookOpen />, label: "My Subjects" },
];

const adminNavItems = [
  { href: "/admin/dashboard", icon: <Home />, label: "Dashboard", view: 'dashboard' },
  { href: "/admin/dashboard?view=scratch-cards", icon: <Ticket />, label: "Scratch Cards", view: 'scratch-cards' },
  { href: "/admin/dashboard?view=assign-subjects", icon: <BookUser />, label: "Assign Subjects", view: 'assign-subjects' },
  { href: "/admin/dashboard?view=manage-subscriptions", icon: <CreditCard />, label: "Manage Subscriptions", view: 'manage-subscriptions' },
  { href: "#", icon: <Users />, label: "Manage Teachers" },
  { href: "#", icon: <Users />, label: "Manage Students" },
];

function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // This function runs only on the client, after hydration.
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    
    updateClock(); // Set initial time on the client
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []); // Empty dependency array ensures this runs once on mount.

  // Render a placeholder on the server and initial client render
  if (time === null) {
      return (
        <div className="hidden items-center gap-2 md:flex">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium tabular-nums text-muted-foreground">
            00:00:00
          </p>
        </div>
      );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      <p className="text-sm font-medium tabular-nums text-muted-foreground">
        {time}
      </p>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = pathname.split("/")[1] as Role;

  const navItems =
    role === "student"
      ? studentNavItems
      : role === "teacher"
      ? teacherNavItems
      : adminNavItems;
      
  const currentUser = mockUser[role] || {};

  const currentView = searchParams.get('view');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold font-headline md:group-data-[collapsible=icon]:hidden">EduResult Pro</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item, index) => {
              let isActive = pathname === item.href.split('?')[0];
              if (item.href.startsWith('/admin/dashboard')) {
                const itemView = item.view || 'dashboard';
                const activeView = currentView || 'dashboard';
                isActive = itemView === activeView;
              }

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span className="md:group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarMenu>
            {role !== 'student' && (
              <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={{ children: "Settings" }}>
                    <Link href="/settings">
                      <Settings />
                      <span className="md:group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Log Out" }}>
                  <Link href="/">
                    <LogOut />
                    <span className="md:group-data-[collapsible=icon]:hidden">Log Out</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex w-full items-center justify-end gap-4">
            <RealTimeClock />
            <ThemeToggle />
            
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
