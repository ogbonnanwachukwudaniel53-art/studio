"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gem, PlusCircle, BookUser } from "lucide-react";
import { mockScratchCards, mockSubjects, mockStudents, type ScratchCard } from "@/lib/mock-data";
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Gem className="h-6 w-6 text-primary" />
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
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BookUser className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Assign Subjects & Classes</CardTitle>
                </div>
                <CardDescription>Assign subjects and classes to teachers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
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
                        <div className="grid grid-cols-2 gap-2 rounded-md border p-2">
                            {classes.map(c => (
                                <div key={c} className="flex items-center gap-2">
                                    <Checkbox id={`class-${c}`} />
                                    <Label htmlFor={`class-${c}`} className="font-normal">{c}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Subjects</Label>
                        <div className="grid grid-cols-1 gap-2 rounded-md border p-2">
                            {mockSubjects.map(s => (
                                 <div key={s.id} className="flex items-center gap-2">
                                    <Checkbox id={`sub-${s.id}`} />
                                    <Label htmlFor={`sub-${s.id}`} className="font-normal">{s.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">Assign</Button>
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
      </div>
    </div>
  );
}
