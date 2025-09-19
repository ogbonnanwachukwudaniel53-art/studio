"use client";

import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { SubjectAssignment } from "@/components/features/admin/subject-assignment";
import { SubscriptionManagement } from "@/components/features/admin/subscription-management";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>
      <div className="space-y-6">
        <ScratchCardGenerator />
        <SubjectAssignment />
        <SubscriptionManagement />
      </div>
    </div>
  );
}
