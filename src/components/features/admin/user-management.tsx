

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockStudents, type Student } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookUser, User } from "lucide-react";

const teachers = [
    { id: "t1", name: "Mr. David Chen", email: "david.chen@example.com" },
    { id: "t2", name: "Ms. Emily White", email: "emily.white@example.com" }
];

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
                    <CardTitle className="font-headline">User Management</CardTitle>
                </div>
                <CardDescription>Manage teachers and students from one central place.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="teachers" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 sm:w-auto">
                        <TabsTrigger value="teachers"><BookUser className="mr-2 h-4 w-4" /> Teachers</TabsTrigger>
                        <TabsTrigger value="students"><User className="mr-2 h-4 w-4" /> Students</TabsTrigger>
                    </TabsList>
                    <div className="pt-6">
                        <TabsContent value="teachers"><TeachersTab /></TabsContent>
                        <TabsContent value="students"><StudentsTab /></TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
