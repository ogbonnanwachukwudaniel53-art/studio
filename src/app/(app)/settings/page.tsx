

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BillingInfo } from "@/components/features/student/billing-info";
import { useToast } from "@/hooks/use-toast";
import { mockUser, mockSubscriptions, type Subscription } from "@/lib/mock-data";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CreditCard, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Role = "student" | "teacher" | "admin";

function AdminSubscriptionView() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  const isRenewalDue = (renewalDate: Date) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return renewalDate <= thirtyDaysFromNow;
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active');

  return (
      <Card id="manage-subscriptions">
          <CardHeader>
              <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline">Subscription Management</CardTitle>
              </div>
              <CardDescription>View and manage yearly app renewal subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSubscriptions.length > 0 ? (
              <div className="max-h-96 overflow-auto rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Plan</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Renewal Date</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {activeSubscriptions.map(sub => {
                            const renewalDue = isRenewalDue(sub.nextBillingDate);
                            const canRenew = sub.status === 'Inactive' || renewalDue;
                            
                            return (
                              <TableRow key={sub.id}>
                                  <TableCell className="font-medium">EduResult Pro - School Plan (Yearly)</TableCell>
                                  <TableCell>
                                      <Badge variant={sub.status === 'Active' ? 'default' : 'destructive'} className={sub.status === 'Active' ? 'bg-green-600' : ''}>
                                          {sub.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>{sub.nextBillingDate.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="outline" size="sm" disabled={!canRenew}>
                                        <History className="mr-2 h-4 w-4" />
                                        Renew Now
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          )})}
                      </TableBody>
                  </Table>
              </div>
            ) : (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-center">
                    <p className="text-muted-foreground">There are no active subscriptions.</p>
                </div>
            )}
          </CardContent>
      </Card>
  )
}

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

        {role === "admin" ? <AdminSubscriptionView /> : <BillingInfo />}
      </div>
    </div>
  );
}
