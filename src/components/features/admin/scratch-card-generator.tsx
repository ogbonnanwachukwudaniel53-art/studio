
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket, PlusCircle } from "lucide-react";
import { mockScratchCards, type ScratchCard, mockStudents } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


export function ScratchCardGenerator() {
  const [cards, setCards] = useState<ScratchCard[]>(mockScratchCards);
  const [count, setCount] = useState("10");
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleGenerate = () => {
    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount <= 0) return;
    if (!selectedStudent) {
        toast({
            title: "Error",
            description: "Please select a student to generate cards for.",
            variant: "destructive",
        })
        return;
    }

    const newCards: ScratchCard[] = Array.from({ length: numCount }, (_, i) => {
      const pin = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        id: `C${cards.length + i + 1}`,
        pin: pin,
        studentId: selectedStudent,
        usageCount: 0,
        generatedAt: new Date(),
      };
    });

    setCards(prevCards => [...newCards, ...prevCards]);
    toast({
        title: "Success",
        description: `${numCount} new scratch cards generated for the selected student.`
    })
  };
  
  const getStatus = (card: ScratchCard) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (card.generatedAt < oneWeekAgo) return { text: "Expired", variant: "destructive" as const };
    if (card.usageCount >= 3) return { text: "Used Up", variant: "secondary" as const };
    return { text: "Active", variant: "default" as const };
  }

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
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="student-select">Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger id="student-select"><SelectValue placeholder="Select a student" /></SelectTrigger>
                    <SelectContent>
                        {mockStudents.map(student => (
                            <SelectItem key={student.id} value={student.id}>{student.name} ({student.id})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-count">Number of Cards</Label>
                <Input 
                  id="card-count" 
                  type="number" 
                  placeholder="e.g., 10" 
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
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Generated On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime()).map(card => {
                    const student = mockStudents.find(s => s.id === card.studentId);
                    const status = getStatus(card);
                    return (
                        <TableRow key={card.id}>
                          <TableCell className="font-mono">{card.pin}</TableCell>
                          <TableCell>{student?.name || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className={status.variant === 'default' ? "bg-green-600" : ""}>
                                {status.text}
                            </Badge>
                          </TableCell>
                          <TableCell>{card.usageCount} / 3</TableCell>
                          <TableCell>{card.generatedAt.toLocaleDateString()}</TableCell>
                        </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
