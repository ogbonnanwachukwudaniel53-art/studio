
"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File as FileIcon, X, Edit, ListChecks } from "lucide-react";
import { mockSubjects, mockStudents, type Result } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Score = {
    studentId: string;
    caScore: number | string;
    examScore: number | string;
};

// Helper function to determine grade
const getGrade = (total: number) => {
    if (total >= 75) return 'A';
    if (total >= 65) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
};

function ManualEntryForm() {
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [scores, setScores] = useState<Score[]>([]);

    const handleClassChange = (classId: string) => {
        setSelectedClass(classId);
        // Pre-fill scores state for students in the selected class
        const studentsInClass = mockStudents.filter(s => s.class === classId);
        setScores(studentsInClass.map(s => ({ studentId: s.id, caScore: '', examScore: '' })));
    };

    const handleScoreChange = (studentId: string, field: 'caScore' | 'examScore', value: string) => {
        const numericValue = value === '' ? '' : Math.max(0, Math.min(100, Number(value)));
        setScores(prevScores => 
            prevScores.map(score => 
                score.studentId === studentId ? { ...score, [field]: numericValue } : score
            )
        );
    };

    const handleSaveScores = () => {
        toast({
            title: "Scores Saved!",
            description: `Scores for ${selectedSubject} in ${selectedClass} have been successfully saved.`
        });
        console.log("Saving scores:", scores);
    }

    const studentsToShow = mockStudents.filter(s => s.class === selectedClass);
    const isFormReady = selectedClass && selectedSubject;

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select onValueChange={handleClassChange} value={selectedClass}>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="JSS 1">JSS 1</SelectItem>
                            <SelectItem value="JSS 2">JSS 2</SelectItem>
                            <SelectItem value="JSS 3">JSS 3</SelectItem>
                            <SelectItem value="SSS 1">SSS 1</SelectItem>
                            <SelectItem value="SSS 2">SSS 2</SelectItem>
                            <SelectItem value="SSS 3">SSS 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>
                            {mockSubjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isFormReady && (
                <div className="space-y-4">
                    <div className="rounded-md border max-h-96 overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>CA Score (40%)</TableHead>
                                    <TableHead>Exam Score (60%)</TableHead>
                                    <TableHead>Total (100%)</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsToShow.map(student => {
                                    const score = scores.find(s => s.studentId === student.id);
                                    const ca = typeof score?.caScore === 'number' ? score.caScore : 0;
                                    const exam = typeof score?.examScore === 'number' ? score.examScore : 0;
                                    const total = ca + exam;
                                    const grade = getGrade(total);

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    className="h-8" 
                                                    max={40}
                                                    value={score?.caScore}
                                                    onChange={(e) => handleScoreChange(student.id, 'caScore', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    className="h-8" 
                                                    max={60}
                                                    value={score?.examScore}
                                                    onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>{total || '...'}</TableCell>
                                            <TableCell className="font-bold">{grade}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveScores}>Save Scores</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function BulkUploadForm() {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    };
    
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast({
                title: "No File Selected",
                description: "Please select a file to upload.",
                variant: "destructive"
            });
            return;
        }

        // In a real application, you would handle the file upload to a server here.
        // For this mock, we'll just show a success toast.
        toast({
            title: "Upload Successful",
            description: `Processing results from ${selectedFile.name}. You will be notified upon completion.`
        });
        
        // Reset the file input
        setSelectedFile(null);
    };

    return (
         <div className="space-y-4">
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="jss1">JSS 1</SelectItem>
                            <SelectItem value="jss2">JSS 2</SelectItem>
                            <SelectItem value="jss3">JSS 3</SelectItem>
                            <SelectItem value="sss1">SSS 1</SelectItem>
                            <SelectItem value="sss2">SSS 2</SelectItem>
                            <SelectItem value="sss3">SSS 3</SelectItem>
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
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label>Result File</Label>
                    <div
                        className={cn(
                            "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center transition-colors h-28",
                            { "border-primary bg-primary/10": isDragOver }
                        )}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-2 text-sm text-foreground">
                                <FileIcon className="h-8 w-8" />
                                <span>{selectedFile.name}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                                <UploadCloud className="h-8 w-8" />
                                <span>Drag & drop or click to upload</span>
                                <span className="text-xs">Supports CSV, XLS, XLSX</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={handleUpload}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload File
                </Button>
            </div>
        </div>
    );
}

export function UploadForm() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <ListChecks className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Enter Student Results</CardTitle>
                </div>
                <CardDescription>Choose between manual score entry or bulk uploading a file. Offline changes will be synced automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="manual">
                    <TabsList className="grid w-full grid-cols-2 md:w-96">
                        <TabsTrigger value="manual"><Edit className="mr-2 h-4 w-4" />Manual Entry</TabsTrigger>
                        <TabsTrigger value="bulk"><UploadCloud className="mr-2 h-4 w-4"/>Bulk Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual" className="pt-4">
                        <ManualEntryForm />
                    </TabsContent>
                    <TabsContent value="bulk" className="pt-4">
                        <BulkUploadForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    
