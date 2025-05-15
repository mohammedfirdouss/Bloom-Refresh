import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
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
        <button type="submit" className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
      </form>
    </div>
  );
} 