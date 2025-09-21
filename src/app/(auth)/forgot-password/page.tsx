
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { sendPasswordResetEmail } from "@/ai/flows/send-reset-email-flow";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetLink = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      // Call the Genkit flow to send the email
      await sendPasswordResetEmail({ email });
      
      toast({
        title: "Password Reset Link Sent",
        description: `If an account exists for ${email}, you will receive an email with reset instructions.`,
      });
      setEmail("");
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      toast({
        title: "Error Sending Email",
        description: "Could not send the password reset link. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Forgot Your Password?</CardTitle>
        <CardDescription>
          No problem. Enter your email address below and we'll send you a link to reset it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleSendResetLink} className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || !email}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" asChild>
          <Link href="/login?role=admin">Back to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
