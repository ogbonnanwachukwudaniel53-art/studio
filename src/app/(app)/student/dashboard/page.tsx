import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { ResultChecker } from "@/components/features/student/result-checker";
import { ResultDisplay } from "@/components/features/student/result-display";
import { BillingInfo } from "@/components/features/student/billing-info";

export default function StudentDashboard() {
  const { student } = mockUser;
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold font-headline">Welcome, {student.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Student ID: {student.id} | Class: {student.class}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <ResultChecker />
        <ResultDisplay />
        <BillingInfo />
      </div>
    </div>
  );
}
