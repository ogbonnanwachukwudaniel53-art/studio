
"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Flag, Send, Printer } from "lucide-react";
import { mockResults, mockStudents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

type ReportingResult = {
    subject: string;
    grade: string;
};

// New component for the printable result sheet layout
const PrintableResultSheet = React.forwardRef<HTMLDivElement>((props, ref) => {
    const student = mockStudents.find(s => s.id === 'S001');
    const totalScore = mockResults.reduce((acc, result) => acc + result.caScore + result.examScore, 0);
    const averageScore = totalScore / mockResults.length;

    const getOverallGrade = (avg: number) => {
        if (avg >= 75) return 'A';
        if (avg >= 65) return 'B';
        if (avg >= 50) return 'C';
        if (avg >= 45) return 'D';
        if (avg >= 40) return 'E';
        return 'F';
    };
    
    if (!student) return null;

    return (
        <div ref={ref} className="p-8 text-black bg-white">
            <header className="flex items-center justify-between pb-4 border-b-2 border-black">
                <div className="flex items-center gap-3">
                    <Logo className="h-16 w-16 text-black" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline">EduResult Pro High School</h1>
                        <p className="text-sm">123 Education Lane, Knowledge City</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-semibold font-headline">Student's Termly Report Sheet</h2>
                </div>
            </header>

            <section className="my-6 grid grid-cols-3 gap-4 text-sm">
                <div><strong>Student Name:</strong> {student.name}</div>
                <div><strong>Class:</strong> {student.class}</div>
                <div><strong>Registration No:</strong> {student.id}</div>
                <div><strong>Term:</strong> First Term</div>
                <div><strong>Session:</strong> 2023/2024</div>
            </section>

            <Table className="border border-black">
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead className="border-r border-black font-bold text-black">Subject</TableHead>
                        <TableHead className="text-center border-r border-black font-bold text-black">CA (40%)</TableHead>
                        <TableHead className="text-center border-r border-black font-bold text-black">Exam (60%)</TableHead>
                        <TableHead className="text-center border-r border-black font-bold text-black">Total (100%)</TableHead>
                        <TableHead className="text-center font-bold text-black">Grade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockResults.map(result => (
                        <TableRow key={result.id}>
                            <TableCell className="font-medium border-r border-black">{result.subject}</TableCell>
                            <TableCell className="text-center border-r border-black">{result.caScore}</TableCell>
                            <TableCell className="text-center border-r border-black">{result.examScore}</TableCell>
                            <TableCell className="text-center border-r border-black">{result.caScore + result.examScore}</TableCell>
                            <TableCell className="text-center font-bold">{result.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <section className="my-6 grid grid-cols-3 gap-4 text-sm font-semibold">
                <div>Total Score: {totalScore.toFixed(2)}</div>
                <div>Average Score: {averageScore.toFixed(2)}%</div>
                <div>Overall Grade: {getOverallGrade(averageScore)}</div>
            </section>
            
            <section className="my-6 space-y-4 text-sm">
                 <div className="p-2 border border-black rounded-md">
                    <p><strong>Teacher's Remark:</strong> A very good result. Keep up the excellent work and continue to strive for greatness.</p>
                </div>
                 <div className="p-2 border border-black rounded-md">
                    <p><strong>Principal's Remark:</strong> An outstanding performance. The school is proud of your dedication and hard work.</p>
                </div>
            </section>

            <footer className="mt-12 flex justify-between text-sm">
                <div className="text-center">
                    <div className="w-48 h-12 border-b border-dashed border-black"></div>
                    <p>Teacher's Signature</p>
                </div>
                <div className="text-center">
                    <div className="w-48 h-12 border-b border-dashed border-black"></div>
                    <p>Principal's Signature</p>
                </div>
            </footer>
            
            <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                Generated by EduResult Pro
            </div>
        </div>
    );
});
PrintableResultSheet.displayName = 'PrintableResultSheet';


export function ResultDisplay() {
    const { toast } = useToast();
    const [reportingResult, setReportingResult] = useState<ReportingResult | null>(null);
    const [reportMessage, setReportMessage] = useState("");
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Result-Sheet-${mockStudents.find(s => s.id === 'S001')?.name.replace(' ','-')}`,
        onAfterPrint: () => toast({ title: "Result Downloaded", description: "Your result sheet has been prepared for printing or saving as PDF." })
    });

    const handleSendReport = () => {
        if (!reportMessage.trim() || !reportingResult) return;

        console.log({
            student: "Alice Johnson",
            ...reportingResult,
            message: reportMessage,
        });

        toast({
            title: "Report Sent",
            description: `Your error report for ${reportingResult.subject} has been sent to the administrator.`,
        });

        setReportingResult(null);
        setReportMessage("");
    }

    const studentName = mockStudents.find(s => s.id === 'S001')?.name || 'Student';
    const totalScore = mockResults.reduce((acc, result) => acc + result.caScore + result.examScore, 0);
    const averageScore = totalScore / mockResults.length;
    
    const getOverallGrade = (avg: number) => {
        if (avg >= 75) return 'A';
        if (avg >= 65) return 'B';
        if (avg >= 50) return 'C';
        if (avg >= 45) return 'D';
        if (avg >= 40) return 'E';
        return 'F';
    };

    return (
        <Dialog open={!!reportingResult} onOpenChange={(isOpen) => !isOpen && setReportingResult(null)}>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <Award className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline">First Term Results</CardTitle>
                        </div>
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Download Result
                        </Button>
                    </div>
                    <CardDescription>Showing results for {studentName}, JSS 1. If you see an error, click the flag icon to report it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-center">CA (40%)</TableHead>
                                    <TableHead className="text-center">Exam (60%)</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                    <TableHead className="text-right">Grade</TableHead>
                                    <TableHead className="w-[50px] text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockResults.map(result => (
                                    <TableRow key={result.id}>
                                        <TableCell className="font-medium">{result.subject}</TableCell>
                                        <TableCell className="text-center">{result.caScore}</TableCell>
                                        <TableCell className="text-center">{result.examScore}</TableCell>
                                        <TableCell className="text-center">{result.caScore + result.examScore}</TableCell>
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
                        <p><span className="text-muted-foreground">Total:</span> {totalScore.toFixed(2)}</p>
                        <p><span className="text-muted-foreground">Average:</span> {averageScore.toFixed(2)}%</p>
                        <p className="font-bold"><span className="text-muted-foreground">Overall Grade:</span> {getOverallGrade(averageScore)}</p>
                    </div>
                </CardContent>
            </Card>
            
            <div style={{ display: "none" }}>
                <PrintableResultSheet ref={componentRef} />
            </div>

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
    );
}
