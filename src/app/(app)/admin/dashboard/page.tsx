
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { ScratchCardGenerator } from "@/components/features/admin/scratch-card-generator";
import { SubjectAssignment } from "@/components/features/admin/subject-assignment";
import { ErrorReporting } from "@/components/features/admin/error-reporting";

type AdminView = 'scratch-cards' | 'assign-subjects' | 'error-reports' | 'dashboard';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const view = searchParams.get('view') as AdminView;

  useEffect(() => {
    setActiveView(view || 'dashboard');
  }, [view]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the entire school's result ecosystem from here.</p>
      </div>

      {activeView === 'dashboard' && (
        <div className="space-y-6">
          <ErrorReporting />
          <ScratchCardGenerator />
          <SubjectAssignment />
        </div>
      )}
      {activeView === 'error-reports' && <ErrorReporting />}
      {activeView === 'scratch-cards' && <ScratchCardGenerator />}
      {activeView === 'assign-subjects' && <SubjectAssignment />}
    </div>
  );
}
