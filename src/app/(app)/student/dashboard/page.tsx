
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar } from "@/components/ui/avatar";
import { mockStudents, mockScratchCards } from "@/lib/mock-data";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { LogIn, Hourglass, ShieldAlert, User, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useResults } from "@/lib/results-context";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <Card className="flex flex-col items-center justify-center py-12 text-center">
                <CardHeader>
                    <Hourglass className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4 font-headline text-2xl">Loading Dashboard</CardTitle>
                    <CardDescription>
                        Please wait while we verify your details...
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}

function StudentDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { areResultsOnHold } = useResults();
  
  const studentId = searchParams.get('studentId');
  const pin = searchParams.get('pin');
  const view = searchParams.get('view');

  const student = React.useMemo(() => mockStudents.find(s => s.id === studentId), [studentId]);

  useEffect(() => {
    const validateCredentials = () => {
        if (!studentId || !pin) {
            router.push('/login?role=student');
            return;
        }

        const studentExists = mockStudents.some(s => s.id === studentId);
        if (!studentExists) {
            toast({ title: "Invalid Student", description: "The Registration Number you entered is not valid.", variant: "destructive" });
            router.push('/login?role=student');
            return;
        }

        const card = mockScratchCards.find(c => c.pin === pin);
        
        if (!card) {
            toast({ title: "Invalid PIN", description: "The PIN you entered does not exist.", variant: "destructive" });
            router.push('/login?role=student');
            return;
        }

        // The card is already used and assigned to someone else
        if (card.used && card.studentId !== studentId) {
            toast({ title: "PIN Mismatch", description: "This PIN has already been used and is assigned to another student.", variant: "destructive" });
            router.push('/login?role=student');
            return;
        }

        // The card is fresh and unused, so assign it to this student
        if (!card.used) {
            // In a real app, this would be a database update
            card.used = true;
            card.studentId = studentId;
            toast({ title: "Login Successful!", description: "Welcome! Your PIN has been activated and is now locked to your account." });
        } else if (card.used && card.studentId === studentId) {
            // The card is already assigned to this student, so it's a valid returning login
            toast({ title: "Welcome Back!", description: "Successfully logged in." });
        }
        
        setIsAuthenticated(true);
    };

    validateCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, pin, router, toast]);

  if (!isAuthenticated || !student) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
             <Card className="w-full max-w-md text-center animate-fade-in-up">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground"/>
                    </div>
                    <CardTitle className="font-headline text-2xl">Access Your Dashboard</CardTitle>
                    <CardDescription>
                        Please log in with your Registration Number and unique PIN to view your results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/login?role=student">
                            <LogIn className="mr-2 h-4 w-4" />
                            Go to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  const shouldShowResults = view === 'results';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome, {student.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Registration Number: {student.id} | Class: {student.class}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {shouldShowResults ? (
            areResultsOnHold ? (
                <Card className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up bg-destructive/10 border-destructive">
                    <CardHeader>
                        <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
                        <CardTitle className="mt-4 font-headline text-2xl text-destructive">Results On Hold</CardTitle>
                        <CardDescription className="text-destructive/80">
                            Results are currently unavailable. Please check back later or contact the school administration.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <ResultDisplay />
            )
        ) : (
          <Card className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
                <Hourglass className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4 font-headline text-2xl">Dashboard</CardTitle>
                <CardDescription>
                    Welcome! Use the menu to navigate and view your results.
                </CardDescription>
            </CardHeader>
        </Card>
        )}
      </div>
    </div>
  );
}


export default function StudentDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <StudentDashboardClient />
        </Suspense>
    )
}
