
"use client"

import { UploadForm } from "@/components/features/teacher/upload-form";
import { RecentUploads } from "@/components/features/teacher/recent-uploads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";

function AssignedClasses() {
    const classes = ["JSS 1", "Basic Science", "JSS 3", "Social Studies"];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Assigned Classes & Subjects</CardTitle>
                 <CardDescription>
                    Here are the classes and subjects assigned to you for this term.
                 </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Subject</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">JSS 1</TableCell>
                                <TableCell>Mathematics</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">JSS 1</TableCell>
                                <TableCell>Basic Science</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">SSS 2</TableCell>
                                <TableCell>Physics</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}


export default function TeacherDashboard() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  const renderContent = () => {
    switch (view) {
        case 'classes':
            return <AssignedClasses />;
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
        <p className="text-muted-foreground">Welcome, Mr. David Chen. Manage your assigned classes and subjects here.</p>
      </div>
      {renderContent()}
    </div>
  );
}

    
