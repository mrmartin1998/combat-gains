import { getServerSession } from 'next-auth';

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session?.user?.name}!</p>
    </div>
  );
} 