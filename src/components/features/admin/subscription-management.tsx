"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { mockSubscriptions, type Subscription } from "@/lib/mock-data";

export function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  return (
      <Card id="manage-subscriptions">
          <CardHeader>
              <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline">Subscription Management</CardTitle>
              </div>
              <CardDescription>View and manage app renewal subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="max-h-96 overflow-auto rounded-md border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Plan</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Next Billing Date</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {subscriptions.map(sub => (
                              <TableRow key={sub.id}>
                                  <TableCell className="font-medium">EduResult Pro - School Plan</TableCell>
                                  <TableCell>
                                      <Badge variant={sub.status === 'Active' ? 'default' : 'secondary'} className={sub.status === 'Active' ? 'bg-green-600' : ''}>
                                          {sub.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>{sub.nextBillingDate.toLocaleDateString()}</TableCell>
                                  <TableCell className="text-right">
                                      <Button variant="ghost" size="sm">Manage</Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
      </Card>
  )
}
