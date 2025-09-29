
"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents, mockScratchCards, type ScratchCard, type Student } from "@/lib/mock-data";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { LogIn, Hourglass, ShieldAlert, User, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useResults } from "@/lib/results-context";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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
  const [student, setStudent] = useState<Student | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const { areResultsOnHold } = useResults();
  
  const identifier = searchParams.get('identifier');
  const pin = searchParams.get('pin');
  const view = searchParams.get('view');
  const studentIdParam = searchParams.get('studentId');

  useEffect(() => {
    const validateCredentials = () => {
        // If we already have a studentId, we are "logged in"
        if (studentIdParam) {
            // In a real app, we'd fetch the student from Firestore here.
            // For now, we'll create a dummy student object to proceed.
            const foundStudent: Student = { id: studentIdParam, name: "Authenticated Student", class: "JSS 1" };
            setStudent(foundStudent);
            setIsAuthenticated(true);
            return;
        }

        // If there's no identifier or pin, they need to log in.
        if (!identifier || !pin) {
            setAuthFailed(true);
            return;
        }
        
        // This is a temporary validation to allow login to proceed without a real student database.
        // We are assuming any non-empty identifier and PIN is for a student with ID 'S001'.
        // This will be replaced with a real database call.
        const foundStudent: Student = { id: 'S001', name: identifier, class: 'JSS 1' };
        
        toast({ title: "Login Successful!", description: `Welcome!` });
        
        setStudent(foundStudent);
        setIsAuthenticated(true);
        setAuthFailed(false);
        
        // Update URL to a "logged in" state, removing identifier and pin
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('studentId', foundStudent.id);
        currentParams.delete('identifier');
        currentParams.delete('pin');
        router.replace(`${window.location.pathname}?${currentParams.toString()}`);
    };

    if (!isAuthenticated) {
        validateCredentials();
    }
  }, [identifier, pin, router, toast, isAuthenticated, searchParams, studentIdParam]);

  if (authFailed || !student) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
             <Card className="w-full max-w-md text-center animate-fade-in-up">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground"/>
                    </div>
                    <CardTitle className="font-headline text-2xl">Access Your Dashboard</CardTitle>
                    <CardDescription>
                        Please log in with your Registration Number/Name and unique PIN to view your results.
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
  
  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
            <Image src={`https://i.pravatar.cc/150?u=${student.id}`} alt={student.name} width={64} height={64} />
            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
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
