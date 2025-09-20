
"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  User,
  LogOut,
  UploadCloud,
  Users,
  Settings,
  ChevronDown,
  Book,
  PenSquare,
  ListChecks,
  BarChart,
  CreditCard,
  Ticket
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { useIdle } from "@/hooks/use-idle";
import { SessionTimeoutDialog } from "@/components/features/session-timeout";
import { useToast } from "@/hooks/use-toast";
import { ResultsProvider } from "@/lib/results-context";

type Role = "student" | "teacher" | "admin";

const studentNavItems = [
  { href: "/student/dashboard", icon: <Home />, label: "Dashboard" },
  { href: "/student/dashboard?view=results", icon: <BarChart />, label: "View Results" },
];

const teacherNavItems = [
  { href: "/teacher/dashboard", icon: <Home />, label: "Dashboard" },
  { href: "/teacher/dashboard?view=classes", icon: <Users />, label: "Assigned Classes" },
  { href: "/teacher/dashboard?view=upload", icon: <UploadCloud />, label: "Upload Results" },
];

const adminNavItems = [
  { href: "/admin/dashboard?view=dashboard", icon: <Home />, label: "Dashboard", view: 'dashboard' },
  { href: "/admin/dashboard?view=user-management", icon: <Users />, label: "Users", view: 'user-management' },
  { href: "/admin/dashboard?view=subjects", icon: <Book />, label: "Subjects", view: 'subjects' },
  { href: "/admin/dashboard?view=assignments", icon: <PenSquare />, label: "Assignments", view: 'assignments' },
  { href: "/admin/dashboard?view=results-management", icon: <ListChecks />, label: "Results", view: 'results-management' },
  { href: "/admin/dashboard?view=scratch-cards", icon: <Ticket />, label: "Cards", view: 'scratch-cards' },
  { href: "/admin/dashboard?view=billing", icon: <CreditCard />, label: "Billing", view: 'billing' }
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

function MainAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const role = pathname.split("/")[1] as Role;
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLogout = () => {
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive"
    });
    router.push('/login');
  };

  const { isIdle, reset, idleTime } = useIdle({ onIdle: handleLogout, idleTimeout: 15 * 60 * 1000 }); // 15 minutes


  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const navItems =
    role === "student"
      ? studentNavItems
      : role === "teacher"
      ? teacherNavItems
      : adminNavItems;
      
  const currentUser = mockUser[role] || {};

  const currentView = searchParams.get('view');

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <>
      <SessionTimeoutDialog
        isOpen={isIdle && idleTime > 0}
        onContinue={() => reset()}
        onLogout={handleLogout}
        countdown={Math.max(0, 60 - Math.floor((idleTime) / 1000))}
      />
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
               // For views within a dashboard
              if (item.href.includes('?view=')) {
                const itemView = item.href.split('?view=')[1];
                const activeView = currentView || (role === 'admin' ? 'dashboard' : undefined);
                isActive = itemView === activeView;
              }

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label }}
                    onClick={handleLinkClick}
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
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Settings" }} onClick={handleLinkClick}>
                  <Link href={`/${role}/settings`}>
                    <Settings />
                    <span className="md:group-data-[collapsible=icon]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: "Log Out" }} onClick={handleLinkClick}>
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
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ResultsProvider>
        <SidebarProvider>
            <MainAppLayout>{children}</MainAppLayout>
        </SidebarProvider>
    </ResultsProvider>
  )
}
