
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents, mockResults } from "@/lib/mock-data";

export function RecentUploads() {
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
                                <TableHead className="text-right">CA Score</TableHead>
                                <TableHead className="text-right">Exam Score</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockResults.slice(0,3).map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{mockStudents.find(s => s.id === result.studentId)?.name}</TableCell>
                                    <TableCell>{result.subject}</TableCell>
                                    <TableCell className="text-right">{result.caScore}</TableCell>
                                    <TableCell className="text-right">{result.examScore}</TableCell>
                                    <TableCell className="text-right font-medium">{result.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

    