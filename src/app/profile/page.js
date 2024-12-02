export default function Profile() {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center mb-8">Your Profile</h1>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome, [User's Name]</h2>
            <p>
              Here you can view and update your personal information, track your progress, and manage your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 