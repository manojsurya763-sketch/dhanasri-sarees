import { AttendanceClock } from "@/components/attendance/AttendanceClock";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AttendancePage() {
  return (
    <div>
      <PageHeader title="My Attendance" />
      <AttendanceClock />
    </div>
  );
}
