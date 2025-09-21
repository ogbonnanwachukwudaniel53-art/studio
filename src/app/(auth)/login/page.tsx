
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockUser } from "@/lib/mock-data";

type Role = "student" | "teacher" | "admin";

function StudentLoginForm() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePinVisibility = () => setIsPinVisible(!isPinVisible);

  const handleSignIn = () => {
    if (studentId && pin) {
      setIsLoading(true);
      router.push(`/student/dashboard?studentId=${studentId}&pin=${pin}`);
    }
  };

  return (
    <div className="space-y-4">
      <CardHeader className="p-0 text-center">
        <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
        <CardDescription>Enter your Registration Number and PIN to check your result.</CardDescription>
      </CardHeader>
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="student-id">Registration Number</Label>
          <Input 
            id="student-id" 
            placeholder="Your registration number (e.g., S001)" 
            required 
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pin">Result PIN</Label>
          <div className="relative">
            <Input 
              id="pin" 
              placeholder="Your unique result PIN" 
              required 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type={isPinVisible ? "text" : "password"}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePinVisibility}
            >
              {isPinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle PIN visibility</span>
            </Button>
          </div>
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn} disabled={!studentId || !pin || isLoading}>
        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Checking Result..." : "Check Result"}
      </Button>
    </div>
  );
}

function TeacherLoginForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSignIn = () => {
    setIsLoading(true);
    router.push("/teacher/dashboard");
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
          <div className="relative">
            <Input 
              id="teacher-password" 
              type={isPasswordVisible ? "text" : "password"} 
              required 
              className="pr-10"
              placeholder="••••••••"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn} disabled={isLoading}>
        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </div>
  );
}

function AdminLoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleSignIn = () => {
      setIsLoading(true);
      setTimeout(() => {
        if (email === mockUser.admin.email && password === mockUser.admin.password) {
          router.push("/admin/dashboard");
        } else {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }, 500);
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
          <Input id="admin-email" type="email" placeholder="admin@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin-password">Password</Label>
            <Link href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
           <div className="relative">
            <Input 
              id="admin-password" 
              type={isPasswordVisible ? "text" : "password"} 
              required 
              className="pr-10"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">Toggle Password visibility</span>
            </Button>
          </div>
        </div>
      </div>
      <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSignIn} disabled={isLoading || !email || !password}>
        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign in"}
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
