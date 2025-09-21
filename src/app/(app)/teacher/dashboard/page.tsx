
"use client"

import React, { useState } from "react";
import { UploadForm } from "@/components/features/teacher/upload-form";
import { RecentUploads } from "@/components/features/teacher/recent-uploads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents, type Student } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const classesData = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

function AddStudentTab() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [name, setName] = useState("");
    const [studentClass, setStudentClass] = useState("");

    const handleAddStudent = () => {
        if (name && studentClass) {
            const newId = `S${String(students.length + 1).padStart(3, '0')}`;
            const newStudent: Student = { id: newId, name, class: studentClass };
            setStudents(prev => [...prev, newStudent]);
            toast({ title: "Student Added", description: `${name} has been added to ${studentClass}.` });
            setName("");
            setStudentClass("");
        } else {
            toast({ title: "Incomplete Details", description: "Please provide both name and class.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Add New Student</CardTitle>
                <CardDescription>
                    Register a new student into the school database directly from your dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="new-student-name">Full Name</Label>
                    <Input 
                        id="new-student-name" 
                        placeholder="e.g., Samuel Green" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-student-class">Class</Label>
                    <Select onValueChange={setStudentClass} value={studentClass}>
                        <SelectTrigger id="new-student-class"><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>
                            {classesData.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAddStudent} disabled={!name || !studentClass}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Student
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TeacherDashboard() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const renderContent = () => {
    switch (view) {
        case 'add-student':
            return <AddStudentTab />;
        case 'upload':
            return <UploadForm />;
        default:
            return (
                <div className="space-y-6">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <UploadForm />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <RecentUploads />
                    </div>
                </div>
            )
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Mr. David Chen. Manage your assigned classes and student results here.</p>
      </div>
      {renderContent()}
    </div>
  );
}

    