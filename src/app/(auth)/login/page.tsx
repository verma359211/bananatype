'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useStore' 
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {

  const router = useRouter();
  const { login } = useAuthStore(); 

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true); 

    try {
      const response = await axios.post('/api/login', user);
      const userData = response.data.user; 
      login(userData); 
      toast.success('Logged in successfully');
	  router.refresh();
      router.push('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data?.message || 'Failed to login');
      console.error("Error during login:", error);
    } finally {
      setLoading(false); // Set loading back to false after request completes
    }
  };

  return (
		<div className="bg-zinc-800 min-h-screen flex items-center justify-center dark:bg-background">
			<div className="bg-zinc-900 w-full max-w-md space-y-8 p-10 rounded-xl shadow-md border border-zinc-700">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white">Welcome back</h1>
					<p className="text-zinc-400 mt-2">Log in to your account</p>
				</div>
				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="email" className="text-zinc-300">
								Email address
							</Label>
							<Input
								onChange={handleChange}
								id="email"
								name="email"
								type="email"
								required
								className="mt-1 bg-zinc-700 border border-zinc-600 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
								placeholder="janedoe@example.com"
								value={user.email}
							/>
						</div>
						<div>
							<Label htmlFor="password" className="text-zinc-300">
								Password
							</Label>
							<Input
								onChange={handleChange}
								id="password"
								name="password"
								type="password"
								required
								className="mt-1 bg-zinc-700 border border-zinc-600 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
								value={user.password}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between">
						{/* <div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-zinc-700 border-zinc-600 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-zinc-300"
							>
								Remember me
							</label>
						</div> */}
						{/* <div className="text-sm">
							<Link
								href="/forgot-password"
								className="font-medium text-yellow-500 hover:text-yellow-400"
							>
								Forgot your password?
							</Link>
						</div> */}
					</div>
					<Button
						type="submit"
						className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Log in"}
					</Button>
				</form>
				<div className="text-center mt-4">
					<p className="text-sm text-zinc-400">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="font-medium text-yellow-500 hover:text-yellow-400"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
			<Toaster position="bottom-right" reverseOrder={false} />
		</div>
	);
}
