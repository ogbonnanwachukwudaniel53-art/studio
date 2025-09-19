"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket, PlusCircle, BookUser, Trash2, CreditCard } from "lucide-react";
import { mockScratchCards, mockSubjects, mockSubscriptions, type ScratchCard, type Subject, type Subscription } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";

function ScratchCardGenerator() {
  const [cards, setCards] = useState<ScratchCard[]>(mockScratchCards);
  const [count, setCount] = useState("10");

  const handleGenerate = () => {
    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount <= 0) return;

    const newCards: ScratchCard[] = Array.from({ length: numCount }, (_, i) => {
      const pin = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        id: `C${cards.length + i + 1}`,
        pin: pin,
        isUsed: false,
        generatedAt: new Date(),
      };
    });

    setCards(prevCards => [...newCards, ...prevCards]);
  };

  return (
    <Card id="scratch-cards">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Scratch Card Management</CardTitle>
        </div>
        <CardDescription>Generate and view one-time use scratch cards for result checking.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4 rounded-lg border p-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="card-count">Number of Cards</Label>
                <Input 
                  id="card-count" 
                  type="number" 
                  placeholder="e.g., 50" 
                  value={count} 
                  onChange={(e) => setCount(e.target.value)} 
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleGenerate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate
              </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Recently Generated Cards</h3>
            <div className="max-h-64 overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PIN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Generated On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map(card => (
                    <TableRow key={card.id}>
                      <TableCell className="font-mono">{card.pin}</TableCell>
                      <TableCell>
                        <Badge variant={card.isUsed ? "secondary" : "default"} className={card.isUsed ? "" : "bg-green-600"}>
                          {card.isUsed ? "Used" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{card.generatedAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectAssignment() {
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

function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  return (
      <Card id="manage-subscriptions">
          <CardHeader>
              <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline">Subscription Management</CardTitle>
              </div>
              <CardDescription>View and manage student app subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="max-h-96 overflow-auto rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Student Name</TableHead>
                              <TableHead>Student ID</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Next Billing Date</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {subscriptions.map(sub => (
                              <TableRow key={sub.id}>
                                  <TableCell className="font-medium">{sub.studentName}</TableCell>
                                  <TableCell>{sub.studentId}</TableCell>
                                  <TableCell>
                                      <Badge variant={sub.status === 'Active' ? 'default' : 'secondary'} className={sub.status === 'Active' ? 'bg-green-600' : ''}>
                                          {sub.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>{sub.nextBillingDate.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="ghost" size="sm">Manage</Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
      </Card>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>
      <div className="space-y-6">
        <ScratchCardGenerator />
        <SubjectAssignment />
        <SubscriptionManagement />
      </div>
    </div>
  );
}
