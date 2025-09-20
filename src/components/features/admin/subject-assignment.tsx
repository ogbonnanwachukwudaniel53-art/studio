

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookUser, Trash2 } from "lucide-react";
import { mockSubjects, type Subject, mockStudents } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TeacherAssignment = {
    teacherId: string;
    classIds: string[];
}

export function SubjectAssignment() {
    const classes = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
    const teachers = [
        { id: "t1", name: "Mr. David Chen" },
        { id: "t2", name: "Ms. Emily White" }
    ];

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
            toast({ title: "Subject Added", description: `"${newSubject.name}" has been added to the list.` });
        }
    }

    const handleDeleteSubject = (id: string) => {
        const subjectName = subjects.find(s => s.id === id)?.name;
        setSubjects(prev => prev.filter(s => s.id !== id));
        toast({ title: "Subject Deleted", description: `"${subjectName}" has been removed.`, variant: "destructive" });
    }

    const handleSaveAssignment = (subjectName: string) => {
        toast({
            title: "Assignment Saved",
            description: `Teacher and class assignments for "${subjectName}" have been updated.`
        });
    }

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BookUser className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Subject & Teacher Management</CardTitle>
                </div>
                <CardDescription>Add, remove, and assign teachers and classes to subjects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add New Subject Form */}
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

                {/* Subject List and Assignment Area */}
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {subjects.map(subject => (
                        <AccordionItem value={subject.id} key={subject.id} className="border rounded-lg">
                           <div className="flex items-center pr-4">
                                <AccordionTrigger className="flex-1 p-4 font-medium hover:no-underline">
                                    {subject.name}
                                </AccordionTrigger>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent accordion from toggling
                                        handleDeleteSubject(subject.id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete {subject.name}</span>
                                </Button>
                           </div>
                            <AccordionContent className="p-4 pt-0 border-t">
                                <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Teacher Selection */}
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
                                        {/* Class Selection */}
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
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
