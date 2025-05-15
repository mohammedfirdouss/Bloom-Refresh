import React from 'react';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form className="w-full max-w-xs space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Role (e.g., volunteer)"
          className="input input-bordered w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="btn btn-primary w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Sign Up</button>
      </form>
    </div>
  );
} 