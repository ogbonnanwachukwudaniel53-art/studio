"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from "lucide-react";
import { mockResults } from "@/lib/mock-data";

export function ResultDisplay() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">First Term Results</CardTitle>
                </div>
                <CardDescription>Showing results for Alice Johnson, JSS 1</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockResults.map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.subject}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{result.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mt-4 flex justify-end gap-4 text-right">
                    <p><span className="text-muted-foreground">Total:</span> 255</p>
                    <p><span className="text-muted-foreground">Average:</span> 85.00%</p>
                    <p className="font-bold"><span className="text-muted-foreground">Overall Grade:</span> A</p>
                </div>
            </CardContent>
        </Card>
    );
}
