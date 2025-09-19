"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = "student" | "teacher" | "admin";

function StudentLoginForm() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");

  const handleSignIn = () => {
    if (studentId && pin) {
      router.push(`/student/dashboard?studentId=${studentId}&pin=${pin}`);
    }
  };

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
        <CardDescription>Enter your Student ID and Scratch Card PIN.</CardDescription>
      </CardHeader>
      <div className="space-y-4 pt-4">
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
            type="password"
          />
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn} disabled={!studentId || !pin}>
        Sign in
      </Button>
    </div>
  );
}

function TeacherLoginForm() {
  const handleSignIn = () => {
    window.location.href = "/teacher/dashboard";
  };

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-2xl font-headline">Teacher Login</CardTitle>
        <CardDescription>Enter your credentials to access the teacher portal.</CardDescription>
      </CardHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="teacher-email">Email</Label>
          <Input id="teacher-email" type="email" placeholder="teacher@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="teacher-password">Password</Label>
          <Input id="teacher-password" type="password" required />
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn}>
        Sign in
      </Button>
    </div>
  );
}

function AdminLoginForm() {
  const handleSignIn = () => {
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
        <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
      </CardHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" placeholder="admin@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" type="password" required />
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn}>
        Sign in
      </Button>
    </div>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultRole = (searchParams.get("role") as Role) || "student";

  const handleTabChange = (value: string) => {
    router.push(`/login?role=${value}`, { scroll: false });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue={defaultRole} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <div className="pt-6">
            <TabsContent value="student"><StudentLoginForm /></TabsContent>
            <TabsContent value="teacher"><TeacherLoginForm /></TabsContent>
            <TabsContent value="admin"><AdminLoginForm /></TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}