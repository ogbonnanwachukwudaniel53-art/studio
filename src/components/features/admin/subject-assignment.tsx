"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, BookUser, Trash2 } from "lucide-react";
import { mockSubjects, type Subject } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";

export function SubjectAssignment() {
    const classes = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
    const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
    const [newSubjectName, setNewSubjectName] = useState("");

    const handleAddSubject = () => {
        if (newSubjectName.trim()) {
            const newSubject: Subject = {
                id: `SUB${Date.now()}`,
                name: newSubjectName.trim(),
            };
            setSubjects(prev => [...prev, newSubject]);
            setNewSubjectName("");
        }
    }

    const handleDeleteSubject = (id: string) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
    }

    return (
        <Card id="assign-subjects">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BookUser className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Assign & Manage Subjects</CardTitle>
                </div>
                <CardDescription>Assign subjects and classes to teachers, and manage the list of available subjects.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2">
                {/* Left Column: Assignment */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium font-headline">Teacher Assignment</h3>
                    <div className="space-y-4 rounded-md border p-4">
                        <div className="space-y-2">
                            <Label>Teacher</Label>
                            <Select>
                                <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="t1">Mr. David Chen</SelectItem>
                                    <SelectItem value="t2">Ms. Emily White</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Classes</Label>
                            <div className="grid grid-cols-2 gap-2 rounded-md border p-2 max-h-40 overflow-y-auto">
                                {classes.map(c => (
                                    <div key={c} className="flex items-center gap-2">
                                        <Checkbox id={`class-${c}`} />
                                        <Label htmlFor={`class-${c}`} className="font-normal">{c}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">Save Assignment</Button>
                </div>

                {/* Right Column: Subject Management */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium font-headline">Subject Management</h3>
                     <div className="space-y-4 rounded-md border p-4">
                         <div className="flex gap-2">
                             <Input 
                                 placeholder="Enter new subject name"
                                 value={newSubjectName}
                                 onChange={(e) => setNewSubjectName(e.target.value)}
                            />
                             <Button onClick={handleAddSubject}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                         </div>

                        <div className="space-y-2">
                            <Label>Available Subjects (for assignment)</Label>
                            <div className="grid grid-cols-1 gap-2 rounded-md border p-2 max-h-40 overflow-y-auto">
                                {subjects.map(s => (
                                    <div key={s.id} className="flex items-center justify-between gap-2 group p-1 rounded-md hover:bg-muted">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id={`sub-${s.id}`} />
                                            <Label htmlFor={`sub-${s.id}`} className="font-normal">{s.name}</Label>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                            onClick={() => handleDeleteSubject(s.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
