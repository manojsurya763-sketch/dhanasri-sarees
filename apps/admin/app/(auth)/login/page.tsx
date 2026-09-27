import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Dhana Sri Sarees — Admin</h1>
      <AdminLoginForm />
    </div>
  );
}
