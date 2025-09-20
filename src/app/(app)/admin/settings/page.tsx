
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSubscriptions, type Subscription } from "@/lib/mock-data";
import { BillingInfo } from "@/components/features/student/billing-info";


function AdminSubscriptionView() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);

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

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>
      
      <div className="space-y-6">
        <AdminSubscriptionView />
        <BillingInfo />
      </div>
    </div>
  );
}

