
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Flag, Send } from "lucide-react";
import { mockResults, mockStudents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type ReportingResult = {
    subject: string;
    grade: string;
};

export function ResultDisplay() {
    const { toast } = useToast();
    const [reportingResult, setReportingResult] = useState<ReportingResult | null>(null);
    const [reportMessage, setReportMessage] = useState("");

    const handleSendReport = () => {
        if (!reportMessage.trim() || !reportingResult) return;

        // In a real app, this would send data to a backend.
        // For now, we just show a success toast.
        console.log({
            student: "Alice Johnson",
            ...reportingResult,
            message: reportMessage,
        });

        toast({
            title: "Report Sent",
            description: `Your error report for ${reportingResult.subject} has been sent to the administrator.`,
        });

        // Close the dialog and reset state
        setReportingResult(null);
        setReportMessage("");
    }

    const studentName = mockStudents.find(s => s.id === 'S001')?.name || 'Student';

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">First Term Results</CardTitle>
                </div>
                <CardDescription>Showing results for {studentName}, JSS 1. If you see an error, click the flag icon to report it.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                                <TableHead className="w-[100px] text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockResults.map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.subject}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{result.grade}</TableCell>
                                    <TableCell className="text-center">
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8"
                                                onClick={() => setReportingResult({ subject: result.subject, grade: result.grade })}
                                            >
                                                <Flag className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">Report Error</span>
                                            </Button>
                                        </DialogTrigger>
                                    </TableCell>
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
             <Dialog open={!!reportingResult} onOpenChange={(isOpen) => !isOpen && setReportingResult(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Report an Error</DialogTitle>
                        <DialogDescription>
                            Let the administrator know what's wrong with your grade for <span className="font-bold">{reportingResult?.subject}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <p><span className="font-medium">Subject:</span> {reportingResult?.subject}</p>
                            <p><span className="font-medium">Reported Grade:</span> {reportingResult?.grade}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea 
                                id="message"
                                placeholder="e.g., 'I believe my grade should be higher based on my test scores.'"
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button 
                                className="bg-primary hover:bg-primary/90"
                                onClick={handleSendReport}
                                disabled={!reportMessage.trim()}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Send Report
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
