
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUpRight } from "lucide-react";

export function BillingInfo() {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6" />
            <CardTitle className="font-headline">App Subscription</CardTitle>
        </div>
        <CardDescription className="text-primary-foreground/80">Manage your subscription for EduResult Pro.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your subscription is currently <span className="font-bold">Active</span>.</p>
        <p className="text-sm opacity-80">Next billing date: 30th October, 2024</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
            <Link href="https://paystack.shop/pay/ecs8d7d7fa" target="_blank">
                Manage Billing with Paystack
                <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
