import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeacherLoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Teacher Login</CardTitle>
        <CardDescription>Enter your credentials to access the teacher portal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="teacher@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/teacher/dashboard">Sign in</Link>
        </Button>
         <div className="text-center text-sm">
            <p>Are you a <Link href="/login/student" className="underline text-primary">Student</Link> or an <Link href="/login/admin" className="underline text-primary">Admin</Link>?</p>
        </div>
      </CardFooter>
    </Card>
  );
}
