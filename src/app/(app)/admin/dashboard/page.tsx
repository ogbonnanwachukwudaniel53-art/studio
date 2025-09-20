

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { UserManagement } from "@/components/features/admin/user-management";
import { ErrorReporting } from "@/components/features/admin/error-reporting";
import { SubjectAssignment } from "@/components/features/admin/subject-assignment";
import { SubscriptionManagement } from "@/components/features/admin/subscription-management";

type AdminView = 'scratch-cards' | 'user-management' | 'error-reports' | 'dashboard' | 'subjects' | 'subscriptions';

export default function AdminDashboard({ searchParams }: { searchParams: { view?: AdminView } }) {
  const activeView = searchParams?.view || 'dashboard';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>

      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}><ErrorReporting /></div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}><ScratchCardGenerator /></div>
          </div>
          <div className="space-y-6">
             <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}><UserManagement /></div>
             <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}><SubjectAssignment /></div>
             <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}><SubscriptionManagement /></div>
          </div>
        </div>
      )}
      {activeView === 'error-reports' && <div className="animate-fade-in-up"><ErrorReporting /></div>}
      {activeView === 'scratch-cards' && <div className="animate-fade-in-up"><ScratchCardGenerator /></div>}
      {activeView === 'user-management' && <div className="animate-fade-in-up"><UserManagement /></div>}
      {activeView === 'subjects' && <div className="animate-fade-in-up"><SubjectAssignment /></div>}
      {activeView === 'subscriptions' && <div className="animate-fade-in-up"><SubscriptionManagement /></div>}
    </div>
  );
}
