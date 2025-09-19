
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { mockStudents, mockResults, mockScratchCards } from "@/lib/mock-data";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { LogIn, Hourglass } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showResult, setShowResult] = useState(false);
  
  const studentId = searchParams.get('studentId');
  const pin = searchParams.get('pin');

  useEffect(() => {
    if (studentId && pin) {
      validatePin(studentId, pin);
    }
  }, [studentId, pin]);

  const validatePin = (id: string, pin: string) => {
    const card = mockScratchCards.find(c => c.pin === pin);
    
    if (!card) {
        toast({ title: "Invalid PIN", description: "The scratch card PIN you entered is not valid.", variant: "destructive" });
        return;
    }
    if (card.studentId !== id) {
        toast({ title: "Incorrect Student", description: "This scratch card is not assigned to you.", variant: "destructive" });
        return;
    }
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (card.generatedAt < oneWeekAgo) {
        toast({ title: "Card Expired", description: "This scratch card has expired.", variant: "destructive" });
        return;
    }
    if (card.usageCount >= 3) {
        toast({ title: "Usage Limit Reached", description: "This card has been used the maximum number of times.", variant: "destructive" });
        return;
    }

    card.usageCount += 1;
    
    const hasResults = mockResults.some(r => r.studentId === id);
    if(hasResults) {
        setShowResult(true);
        toast({ title: "Success!", description: `Your result is now visible. You have ${3 - card.usageCount} uses left.` });
    } else {
        setShowResult(false);
    }
  };

  const student = mockStudents.find(s => s.id === studentId);

  if (!studentId || !student) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
             <Card className="w-full max-w-md text-center animate-fade-in-up">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Access Your Dashboard</CardTitle>
                    <CardDescription>
                        Please log in with your Student ID and Scratch Card PIN to view your results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Go to Login
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      );
  }

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
            <p className="text-muted-foreground">Student ID: {student.id} | Class: {student.class}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {showResult ? (
          <ResultDisplay />
        ) : (
          <Card className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
                <Hourglass className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4 font-headline text-2xl">Result is on Hold</CardTitle>
                <CardDescription>
                    Your results for the current term have not been released yet. Please check back later.
                </CardDescription>
            </CardHeader>
        </Card>
        )}
      </div>
    </div>
  );
}
