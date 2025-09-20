
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents, mockScratchCards } from "@/lib/mock-data";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { LogIn, Hourglass, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useResults } from "@/lib/results-context";

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { areResultsOnHold } = useResults();
  
  const studentId = searchParams.get('studentId');
  const pin = searchParams.get('pin');
  const view = searchParams.get('view');

  const validatePin = (id: string, pin: string) => {
    const card = mockScratchCards.find(c => c.pin === pin);
    
    if (!card) {
        toast({ title: "Invalid PIN", description: "The scratch card PIN you entered does not exist.", variant: "destructive" });
        router.push('/login?role=student');
        return;
    }

    const studentExists = mockStudents.some(s => s.id === id);
    if (!studentExists) {
        toast({ title: "Invalid Student", description: "The Registration Number you entered is not valid.", variant: "destructive" });
        router.push('/login?role=student');
        return;
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (card.generatedAt < oneWeekAgo) {
        toast({ title: "Card Expired", description: "This scratch card has expired.", variant: "destructive" });
        router.push('/login?role=student');
        return;
    }

    if (card.usageCount >= 3) {
        toast({ title: "Usage Limit Reached", description: "This card has been used the maximum number of times.", variant: "destructive" });
        router.push('/login?role=student');
        return;
    }

    if (card.studentId === null) {
      card.studentId = id;
      card.usageCount += 1;
      toast({ title: "PIN Activated!", description: `This card is now locked to your account. You have ${3 - card.usageCount} uses left.` });
      setIsAuthenticated(true);
    } else if (card.studentId === id) {
      card.usageCount += 1;
      toast({ title: "Success!", description: `Your result is now visible. You have ${3 - card.usageCount} uses left.` });
      setIsAuthenticated(true);
    } else {
      toast({ title: "PIN In Use", description: "This scratch card has already been used by another student.", variant: "destructive" });
      router.push('/login?role=student');
      return;
    }
  };

  useEffect(() => {
    if (studentId && pin) {
      validatePin(studentId, pin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, pin]);

  const student = mockStudents.find(s => s.id === studentId);

  if (!isAuthenticated || !student) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
             <Card className="w-full max-w-md text-center animate-fade-in-up">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Access Your Dashboard</CardTitle>
                    <CardDescription>
                        Please log in with your Registration Number and Scratch Card PIN to view your results.
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
            <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
                {student.name.charAt(0)}
            </AvatarFallback>
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
                        <CardTitle className="mt-4 font-headline text-2xl text-destructive">Result on Hold</CardTitle>
                        <CardDescription className="text-destructive/80">
                            Your result is currently on hold. Please check back later.
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
                    Welcome to your dashboard. Use the menu to navigate to view your results or profile.
                </CardDescription>
            </CardHeader>
        </Card>
        )}
      </div>
    </div>
  );
}
