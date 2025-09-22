
"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
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
  Ticket,
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
import { SchoolProvider } from "@/lib/school-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";


type Role = "student" | "teacher" | "admin";

const adminNavItems = [
  { href: "/admin/dashboard?view=dashboard", icon: <Home />, label: "Dashboard", view: 'dashboard' },
  { href: "/admin/dashboard?view=user-management", icon: <Users />, label: "Users", view: 'user-management' },
  { href: "/admin/dashboard?view=subjects", icon: <Book />, label: "Subjects", view: 'subjects' },
  { href: "/admin/dashboard?view=assignments", icon: <PenSquare />, label: "Assignments", view: 'assignments' },
  { href: "/admin/dashboard?view=results-management", icon: <ListChecks />, label: "Results", view: 'results-management' },
  { href: "/admin/dashboard?view=scratch-cards", icon: <Ticket />, label: "Student PINs", view: 'scratch-cards' },
  { href: "/admin/dashboard?view=billing", icon: <CreditCard />, label: "Billing", view: 'billing' },
];

function RealTimeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    
    updateClock(); 
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSessionTimeout = () => {
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive"
    });
    handleLogout();
  };

  const { isIdle, reset, idleTime } = useIdle({ onIdle: handleSessionTimeout, idleTimeout: 15 * 60 * 1000 }); 

  const studentNavItems = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    // Keep studentId and pin, remove view
    const studentId = params.get('studentId');
    
    const preservedParams = new URLSearchParams();
    if (studentId) preservedParams.set('studentId', studentId);
    
    // Dashboard link (no 'view' parameter)
    const baseDashboardHref = `/student/dashboard?${preservedParams.toString()}`;

    // Results link (with 'view=results')
    preservedParams.set('view', 'results');
    const resultsHref = `/student/dashboard?${preservedParams.toString()}`;

    return [
      { href: baseDashboardHref, icon: <Home />, label: "Dashboard" },
      { href: resultsHref, icon: <BarChart />, label: "View Results" },
    ];
  }, [searchParams]);

  const teacherNavItems = useMemo(() => {
    const baseDashboardHref = `/teacher/dashboard`;
    return [
      { href: `${baseDashboardHref}?view=dashboard`, icon: <Home />, label: "Dashboard", view: 'dashboard' },
      { href: `${baseDashboardHref}?view=add-student`, icon: <User />, label: "Add Student", view: 'add-student' },
      { href: `${baseDashboardHref}?view=upload`, icon: <UploadCloud />, label: "Upload Results", view: 'upload' },
    ];
  }, []);

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

  const showSettings = role === 'admin';

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
              let isActive = false;
              const itemUrl = new URL(item.href, "http://localhost");
              const currentUrl = new URL(pathname + '?' + searchParams.toString(), "http://localhost");

              if (role === 'student') {
                const isDashboardActive = !currentUrl.searchParams.has('view') && !itemUrl.searchParams.has('view');
                const isResultsActive = currentUrl.searchParams.get('view') === 'results' && itemUrl.searchParams.get('view') === 'results';
                isActive = isDashboardActive || isResultsActive;
              } else {
                 const itemView = (item as any).view || item.href.split('?view=')[1];
                 const defaultView = role === 'admin' ? 'dashboard' : (role === 'teacher' ? 'dashboard' : undefined);
                 const activeView = currentView || defaultView;
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
            {showSettings && (
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{ children: "Settings" }} onClick={handleLinkClick}>
                      <Link href={`/${role}/settings`}>
                        <Settings />
                        <span className="md:group-data-[collapsible=icon]:hidden">Settings</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )}
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: "Log Out" }} onClick={() => { handleLinkClick(); handleLogout(); }}>
                    <LogOut />
                    <span className="md:group-data-[collapsible=icon]:hidden">Log Out</span>
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
    <SchoolProvider>
        <ResultsProvider>
            <SidebarProvider>
                <MainAppLayout>{children}</MainAppLayout>
            </SidebarProvider>
        </ResultsProvider>
    </SchoolProvider>
  )
}
