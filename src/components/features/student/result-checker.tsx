
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockScratchCards } from "@/lib/mock-data";

export function ResultChecker({ onResultChecked }: { onResultChecked: () => void }) {
    const [pin, setPin] = useState("");
    const { toast } = useToast();

    const handleCheckResult = () => {
        if (!pin.trim()) {
            toast({
                title: "Error",
                description: "Please enter a scratch card PIN.",
                variant: "destructive",
            });
            return;
        }

        const card = mockScratchCards.find(c => c.pin === pin);

        if (!card) {
            toast({
                title: "Invalid PIN",
                description: "The scratch card PIN you entered is not valid. Please check and try again.",
                variant: "destructive",
            });
            return;
        }

        if (card.isUsed) {
            toast({
                title: "PIN Already Used",
                description: "This scratch card has already been used to check a result.",
                variant: "destructive",
            });
            return;
        }

        // Mark the card as used (in a real app, this would be a backend call)
        card.isUsed = true;
        
        toast({
            title: "Success!",
            description: "Your result is now visible below.",
        });

        onResultChecked();
    }


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">Check Your Result</CardTitle>
                </div>
                <CardDescription>Enter your scratch card PIN to view your results.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="pin">Scratch Card PIN</Label>
                    <Input 
                        id="pin" 
                        placeholder="XXXX-XXXX-XXXX" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Session</Label>
                    <Select defaultValue="2023/2024">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2023/2024">2023/2024</SelectItem>
                            <SelectItem value="2022/2023">2022/2023</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Term</Label>
                    <Select defaultValue="First Term">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="First Term">First Term</SelectItem>
                            <SelectItem value="Second Term">Second Term</SelectItem>
                            <SelectItem value="Third Term">Third Term</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleCheckResult}
                    disabled={!pin}
                >
                    Check Result
                </Button>
            </CardFooter>
        </Card>
    );
}
