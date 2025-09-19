
"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { mockUser, mockStudents } from "@/lib/mock-data";
import { ResultChecker } from "@/components/features/student/result-checker";
import { ResultDisplay } from "@/components/features/student/result-display";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

export default function StudentDashboard() {
  const [showResult, setShowResult] = useState(false);
  const [studentId, setStudentId] = useState<string | null>('S001'); // Mock login

  const student = mockStudents.find(s => s.id === studentId);

  if (!student) {
      // In a real app, you might redirect to a login page
      // or show a "not logged in" message.
      // For this prototype, we'll just show nothing if no student is "logged in".
      return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
            
            
        </Avatar>
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
