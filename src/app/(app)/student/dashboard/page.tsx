
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Avatar } from "@/components/ui/avatar";
import { mockStudents } from "@/lib/mock-data";
import { ResultChecker } from "@/components/features/student/result-checker";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { BarChart, LogIn } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const [showResult, setShowResult] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('studentId');
    setStudentId(id);
  }, [searchParams]);

  const student = mockStudents.find(s => s.id === studentId);

  if (!studentId || !student) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
             <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Access Your Dashboard</CardTitle>
                    <CardDescription>
                        Please log in with your Student ID and Scratch Card PIN to view your results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/login/student">
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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary" />
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome, {student.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Student ID: {student.id} | Class: {student.class}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <ResultChecker 
            studentId={student.id} 
            onResultChecked={() => setShowResult(true)} 
        />
        {showResult && (
          <>
            <div className="flex justify-end">
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Past Results
              </Button>
            </div>
            <ResultDisplay />
          </>
        )}
      </div>
    </div>
  );
}
