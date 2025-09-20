
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookUser, Trash2, Users, BookOpen, User } from "lucide-react";
import { mockSubjects, type Subject, mockStudents, type Student } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const teachers = [
    { id: "t1", name: "Mr. David Chen", email: "david.chen@example.com" },
    { id: "t2", name: "Ms. Emily White", email: "emily.white@example.com" }
];
const classes = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

function SubjectsTab() {
    const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
    const [newSubjectName, setNewSubjectName] = useState("");
    const { toast } = useToast();

    const handleAddSubject = () => {
        if (newSubjectName.trim()) {
            const newSubject: Subject = {
                id: `SUB${Date.now()}`,
                name: newSubjectName.trim(),
            };
            setSubjects(prev => [newSubject, ...prev]);
            setNewSubjectName("");
            toast({ title: "Subject Added", description: `"${newSubject.name}" has been added.` });
        }
    };

    const handleDeleteSubject = (id: string) => {
        const subjectName = subjects.find(s => s.id === id)?.name;
        setSubjects(prev => prev.filter(s => s.id !== id));
        toast({ title: "Subject Deleted", description: `"${subjectName}" has been removed.`, variant: "destructive" });
    };

    const handleSaveAssignment = (subjectName: string) => {
        toast({
            title: "Assignment Saved",
            description: `Teacher and class assignments for "${subjectName}" have been updated.`
        });
    };

    return (
        <div className="space-y-6">
            <div className="rounded-md border p-4 space-y-4">
                <Label htmlFor="new-subject" className="font-medium">Add New Subject</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        id="new-subject"
                        placeholder="e.g., Further Mathematics"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                    />
                    <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                {subjects.map(subject => (
                    <Card key={subject.id}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-lg font-medium">{subject.name}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={() => handleDeleteSubject(subject.id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete {subject.name}</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Assigned Teacher</Label>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                                        <SelectContent>
                                            {teachers.map(teacher => (
                                                <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Classes</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-md border p-2 max-h-40 overflow-y-auto">
                                        {classes.map(c => (
                                            <div key={c} className="flex items-center gap-2">
                                                <Checkbox id={`class-${subject.id}-${c}`} />
                                                <Label htmlFor={`class-${subject.id}-${c}`} className="font-normal">{c}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={() => handleSaveAssignment(subject.name)}>Save Assignment</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}


function TeachersTab() {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers.map(teacher => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function StudentsTab() {
    const [students, setStudents] = useState<Student[]>(mockStudents);

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reg. Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => (
                            <TableRow key={student.id}>
                                <TableCell className="font-mono">{student.id}</TableCell>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{student.class}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function UserManagement() {
    return (
        <Card id="user-management">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">User & Subject Management</CardTitle>
                </div>
                <CardDescription>Manage subjects, teachers, and students from one central place.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="subjects" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 sm:w-auto">
                        <TabsTrigger value="subjects"><BookOpen className="mr-2 h-4 w-4" /> Subjects</TabsTrigger>
                        <TabsTrigger value="teachers"><BookUser className="mr-2 h-4 w-4" /> Teachers</TabsTrigger>
                        <TabsTrigger value="students"><User className="mr-2 h-4 w-4" /> Students</TabsTrigger>
                    </TabsList>
                    <div className="pt-6">
                        <TabsContent value="subjects"><SubjectsTab /></TabsContent>
                        <TabsContent value="teachers"><TeachersTab /></TabsContent>
                        <TabsContent value="students"><StudentsTab /></TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
