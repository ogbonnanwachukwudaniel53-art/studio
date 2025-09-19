
"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { mockSubjects } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


export function UploadForm() {
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
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <UploadCloud className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Upload Student Result</CardTitle>
                </div>
                <CardDescription>Select class, subject, and upload a result file (e.g., CSV, Excel). Offline changes will be synced automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Class and Subject Selection */}
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

                    {/* File Dropzone and Upload */}
                    <div className="space-y-2 md:col-span-2 lg:col-span-1 lg:row-start-2">
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
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="space-y-2 self-end lg:row-start-2">
                        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleUpload}>Upload</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
