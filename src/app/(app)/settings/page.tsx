
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BillingInfo } from "@/components/features/student/billing-info";
import { useToast } from "@/hooks/use-toast";
import { mockUser } from "@/lib/mock-data";
import { usePathname } from "next/navigation";

type Role = "student" | "teacher" | "admin";


export default function SettingsPage() {
  const { toast } = useToast();
  const pathname = usePathname();
  
  // Determine role from URL to fetch correct mock user
  const role = pathname.split("/")[1] as Role;
  const currentUser = mockUser[role] || {};
  
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");

  useEffect(() => {
    setName(currentUser.name || "");
    setEmail(currentUser.email || "");
  }, [currentUser]);

  const handleSaveChanges = () => {
    // In a real application, you would send this data to your backend.
    console.log("Saving data:", { name, email });
    toast({
      title: "Success!",
      description: "Your profile information has been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground">Manage your account and app preferences.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveChanges}>Save Changes</Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <BillingInfo />
      </div>
    </div>
  );
}
