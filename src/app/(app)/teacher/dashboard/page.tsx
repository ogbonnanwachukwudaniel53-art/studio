import { UploadForm } from "@/components/features/teacher/upload-form";
import { RecentUploads } from "@/components/features/teacher/recent-uploads";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Mr. David Chen. Manage your assigned classes and subjects here.</p>
      </div>
      <div className="space-y-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <UploadForm />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <RecentUploads />
        </div>
      </div>
    </div>
  );
}
