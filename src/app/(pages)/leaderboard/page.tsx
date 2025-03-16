'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface User {
  _id: string
  fullname: string
  username: string
  testAttempted: number
  topSpeed: number
}

interface LeaderboardResponse {
  message: string
  users: User[]
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/api/leaderboard", {
					headers: {
						"Cache-Control": "no-cache, no-store, must-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
					params: { nocache: Date.now() }, // Add a timestamp to prevent caching
				});
        toast.success('Leaderboard fetched successfully')
        setLeaderboard(res.data)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        toast.error('Failed to load leaderboard.')
        setError('Failed to load leaderboard. Please try again later.')
      }
    }
    fetchLeaderboard()
  }, [])

  const handleRowClick = (username: string) => {
    router.push(`/${username}`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-300">
      {/* Header */}
      <Navbar />
			<div className="container min-h-screen mx-auto px-4 py-8">
				<Card>
					<CardHeader className="flex flex-row items-center space-x-2">
						<Users className="w-7 h-7" />
						<CardTitle className="text-3xl font-bold"> Leaderboard</CardTitle>
					</CardHeader>
					<CardContent>
						{!leaderboard ? (
							<LeaderboardSkeleton />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">Rank</TableHead>
										<TableHead>Player</TableHead>
										<TableHead>Tests</TableHead>
										<TableHead className="text-right">Top Speed</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{leaderboard.users.map((user, index) => (
										<TableRow
											key={user._id}
											className="cursor-pointer text-xl hover:bg-muted/50 transition-colors"
											onClick={() => handleRowClick(user.username)}
										>
											<TableCell className="font-medium">
												{index === 0 && <p className="mr-1">🥇</p>}
												{index === 1 && <p className="mr-1">🥈</p>}
												{index === 2 && <p className="mr-1">🥉</p>}
												{index > 2 && index + 1}
											</TableCell>
											<TableCell>
												<Link
													href={`/${user.username}`}
													className=" text-md hover:underline"
												>
													{user.fullname.toLowerCase()}
												</Link>
											</TableCell>
											<TableCell>{user.testAttempted}</TableCell>
											<TableCell className="text-right font-semibold">
												{user.topSpeed} WPM
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
				<Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {/* Footer */}
      <Footer />
		</div>
	);
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

