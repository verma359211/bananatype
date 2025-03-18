'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function SignupPage() {

  const router = useRouter();

  const [user, setUser] = useState({
    fullname: '',
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      setLoading(true);
      const response = await axios.post('/api/signup', user);
      console.log(response.data);
      toast.success('Account created successfully');
      router.push('/login');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data?.message || 'Failed to create account');
      console.log("Error while signing up:", error);
    }finally{
      setLoading(false);
    }
  }

  return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-800 text-white dark:bg-background">
			<div className="w-full max-w-md space-y-8 p-10 bg-zinc-900 rounded-xl shadow-md">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white">Create an account</h1>
					<p className="text-zinc-400 mt-2">Sign up to get started</p>
				</div>
				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="fullname">Full Name</Label>
							<Input
								onChange={handleChange}
								id="fullname"
								name="fullname"
								type="text"
								required
								className="mt-1 bg-zinc-800 border-zinc-700 text-white"
								placeholder="Jane Doe"
							/>
						</div>
						<div>
							<Label htmlFor="username">Username</Label>
							<Input
								onChange={handleChange}
								id="username"
								name="username"
								type="text"
								required
								className="mt-1 bg-zinc-800 border-zinc-700 text-white"
								placeholder="janedoe"
							/>
						</div>
						<div>
							<Label htmlFor="email">Email address</Label>
							<Input
								onChange={handleChange}
								id="email"
								name="email"
								type="email"
								required
								className="mt-1 bg-zinc-800 border-zinc-700 text-white"
								placeholder="janedoe@example.com"
							/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								onChange={handleChange}
								id="password"
								name="password"
								type="password"
								required
								className="mt-1 bg-zinc-800 border-zinc-700 text-white"
							/>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full text-white bg-yellow-500 hover:bg-yellow-600"
					>
						{loading ? "Signing Up..." : "Sign up"}
					</Button>
				</form>
				<div className="text-center mt-4">
					<p className="text-sm text-zinc-400">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-yellow-500 hover:text-yellow-400"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
			<Toaster position="bottom-right" reverseOrder={false} />
		</div>
	);
}
