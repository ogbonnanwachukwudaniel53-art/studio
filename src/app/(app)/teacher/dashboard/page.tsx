import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud } from "lucide-react";
import { mockStudents, mockSubjects, mockResults } from "@/lib/mock-data";

function UploadForm() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <UploadCloud className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Upload Student Result</CardTitle>
                </div>
                <CardDescription>Select class, subject, and student to upload their result. Offline changes will be synced automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jss1">JSS 1</SelectItem>
                                <SelectItem value="jss2">JSS 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>
                                {mockSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Student</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                            <SelectContent>
                                {mockStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 self-end">
                        <Button className="w-full bg-primary hover:bg-primary/90">Upload</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function RecentUploads() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recently Uploaded</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockResults.slice(0,3).map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{mockStudents.find(s => s.id === result.studentId)?.name}</TableCell>
                                    <TableCell>{result.subject}</TableCell>
                                    <TableCell className="text-right">{result.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Mr. David Chen. Manage your assigned classes and subjects here.</p>
      </div>
      <div className="space-y-6">
        <UploadForm />
        <RecentUploads />
      </div>
    </div>
  );
}
