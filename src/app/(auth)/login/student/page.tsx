
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");

  const handleSignIn = () => {
    // In a real app, you'd do more robust validation here.
    if (studentId && pin) {
        // Pass studentId as a query parameter to the dashboard
        router.push(`/student/dashboard?studentId=${studentId}`);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
        <CardDescription>Enter your Student ID and Scratch Card PIN to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student-id">Student ID</Label>
          <Input 
            id="student-id" 
            placeholder="Your student ID (e.g., S001)" 
            required 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin">Scratch Card PIN</Label>
          <Input 
            id="pin" 
            placeholder="Your scratch card PIN" 
            required 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn} disabled={!studentId || !pin}>
            Sign in
        </Button>
         <div className="text-center text-sm">
            <p>Are you a <Link href="/login/teacher" className="underline text-primary">Teacher</Link> or an <Link href="/login/admin" className="underline text-primary">Admin</Link>?</p>
        </div>
      </CardFooter>
    </Card>
  );
}
