import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, CreditCard, Award, ArrowUpRight } from "lucide-react";
import { mockUser, mockResults } from "@/lib/mock-data";
import Link from "next/link";

function ResultChecker() {
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
                    <Input id="pin" placeholder="XXXX-XXXX-XXXX" />
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
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">Check Result</Button>
            </CardFooter>
        </Card>
    );
}

function ResultDisplay() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">First Term Results</CardTitle>
                </div>
                <CardDescription>Showing results for Alice Johnson, JSS 1</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockResults.map(result => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.subject}</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{result.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mt-4 flex justify-end gap-4 text-right">
                    <p><span className="text-muted-foreground">Total:</span> 255</p>
                    <p><span className="text-muted-foreground">Average:</span> 85.00%</p>
                    <p className="font-bold"><span className="text-muted-foreground">Overall Grade:</span> A</p>
                </div>
            </CardContent>
        </Card>
    );
}

function BillingInfo() {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6" />
            <CardTitle className="font-headline">Subscription Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p>Your subscription is currently <span className="font-bold">Active</span>.</p>
        <p className="text-sm opacity-80">Next billing date: 30th October, 2024</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
            <Link href="https://paystack.com/" target="_blank">
                Manage Billing with Paystack
                <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function StudentDashboard() {
  const { student } = mockUser;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome, {student.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Student ID: {student.id} | Class: {student.class}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <ResultChecker />
        <ResultDisplay />
        <BillingInfo />
      </div>
    </div>
  );
}
