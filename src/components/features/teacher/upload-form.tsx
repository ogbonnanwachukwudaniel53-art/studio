"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud } from "lucide-react";
import { mockStudents, mockSubjects } from "@/lib/mock-data";

export function UploadForm() {
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
