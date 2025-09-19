"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket, PlusCircle } from "lucide-react";
import { mockScratchCards, type ScratchCard } from "@/lib/mock-data";

export function ScratchCardGenerator() {
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
