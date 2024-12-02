'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-error">Something went wrong!</h2>
          <p className="text-sm opacity-70">{error.message}</p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={reset}>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 