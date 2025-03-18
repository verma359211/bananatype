'use client'
import { Search, Trophy } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
	_id: string;
	fullname: string;
	username: string;
	testAttempted: number;
	topSpeed: number;
	avgaccuracy: number;
	rank: number;
	history: {
		_id: string;
		speed: number;
		accuracy: number;
		mode: string; //
		testPlayed: string;
	}[];
}

interface LeaderboardResponse {
	message: string;
	users: User[];
}


export default function LeaderboardPage() {

    const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null)
      const [error, setError] = useState<string | null>(null)
    //   const router = useRouter()
    
    useEffect(() => {
			const fetchLeaderboard = async () => {
				try {
					// const res = await fetch("/api/leaderboard", { cache: "no-store" });
					const res = await axios.get("/api/leaderboard");
					toast.success("Leaderboard fetched successfully");
					// const data = await res.json();
					// setLeaderboard(data)
					setLeaderboard(res.data);
				} catch (err) {
					console.error("Error fetching leaderboard:", err);
					toast.error("Failed to load leaderboard.");
					setError("Failed to load leaderboard. Please try again later.");
				}
			};
			fetchLeaderboard();
		}, []);



	// Mock leaderboard data
    const leaderboardData =
        [
		{
			id: 1,
			rank: 1,
			name: "SpeedDemon",
			wpm: 145,
			accuracy: 99.2,
			tests: 1243,
		},
		{
			id: 2,
			rank: 2,
			name: "TypeMaster",
			wpm: 138,
			accuracy: 98.7,
			tests: 987,
		},
		{
			id: 3,
			rank: 3,
			name: "KeyboardWizard",
			wpm: 132,
			accuracy: 97.5,
			tests: 1567,
		},
		{
			id: 4,
			rank: 4,
			name: "SwiftFingers",
			wpm: 129,
			accuracy: 98.1,
			tests: 876,
		},
		{ id: 5, rank: 5, name: "TypeFury", wpm: 127, accuracy: 96.8, tests: 1032 },
		{
			id: 6,
			rank: 6,
			name: "RapidTyper",
			wpm: 125,
			accuracy: 97.2,
			tests: 754,
		},
		{
			id: 7,
			rank: 7,
			name: "KeyMaster",
			wpm: 123,
			accuracy: 98.5,
			tests: 1124,
		},
		{
			id: 8,
			rank: 8,
			name: "SpeedyKeys",
			wpm: 121,
			accuracy: 96.9,
			tests: 892,
		},
		{
			id: 9,
			rank: 9,
			name: "TypingNinja",
			wpm: 119,
			accuracy: 97.8,
			tests: 1345,
		},
		{
			id: 10,
			rank: 10,
			name: "FlashFingers",
			wpm: 118,
			accuracy: 96.5,
			tests: 765,
		},
	];

    function getAccuracyBySpeed(user: User, x: number) {
			const entry = user.history.find((h) => h.speed === x);
			return entry ? entry.accuracy : null; // Return accuracy if found, otherwise null
		}
	return (
		<div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-300">
			{/* Header */}
			<Navbar />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-8">
				{!leaderboard?.users ? (
					<div>Loading.....</div>
				) : (
					<div className="w-full max-w-6xl">
						<div className="flex flex-col items-center mb-4 sm:mb-8">
							<h1 className="text-xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
								<Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
								Global Leaderboard
							</h1>
							<p className="text-xs sm:text-sm text-zinc-400 text-center max-w-2xl">
								The fastest typists from around the world. Can you make it to
								the top?
							</p>
						</div>

						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
							{/* <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-zinc-500" />
									<input
										placeholder="Search by username"
										className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 sm:py-2 pl-8 sm:pl-10 focus:outline-none focus:border-yellow-500 text-xs sm:text-sm"
									/>
								</div>

								<div className="flex flex-wrap gap-2 sm:gap-3">
									<select className="bg-zinc-700 border border-zinc-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:border-yellow-500 text-xs sm:text-sm">
										<option value="all-time">All Time</option>
										<option value="this-month">This Month</option>
										<option value="this-week">This Week</option>
										<option value="today">Today</option>
									</select>

									<select className="bg-zinc-700 border border-zinc-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:border-yellow-500 text-xs sm:text-sm">
										<option value="wpm">Sort by: WPM</option>
										<option value="accuracy">Sort by: Accuracy</option>
										<option value="tests">Sort by: Tests</option>
									</select>
								</div>
							</div> */}

							<div className="overflow-x-auto -mx-4 sm:mx-0">
								<div className="min-w-[600px] px-4 sm:px-0 sm:min-w-0">
									<table className="w-full">
										<thead>
											<tr className="border-b border-zinc-700">
												<th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-zinc-400 font-medium text-xs sm:text-sm">
													Rank
												</th>
												<th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-zinc-400 font-medium text-xs sm:text-sm">
													User
												</th>
												<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-zinc-400 font-medium text-xs sm:text-sm">
													WPM
												</th>
												<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-zinc-400 font-medium text-xs sm:text-sm">
													Accuracy
												</th>
												<th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-zinc-400 font-medium text-xs sm:text-sm">
													Tests
												</th>
											</tr>
										</thead>
										<tbody>
											{leaderboard.users.map((user) => (
												<tr
													key={user._id}
													className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors"
												>
													<td className="py-2 sm:py-4 px-2 sm:px-4">
														<div className="flex items-center">
															{user.rank <= 3 ? (
																<div
																	className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
																		user.rank === 1
																			? "bg-yellow-500 text-zinc-900"
																			: user.rank === 2
																				? "bg-zinc-400 text-zinc-900"
																				: "bg-amber-700 text-zinc-200"
																	} text-xs sm:text-sm font-bold`}
																>
																	{user.rank}
																</div>
															) : (
																<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-zinc-700 text-zinc-400 text-xs sm:text-sm font-medium">
																	{user.rank}
																</div>
															)}
														</div>
													</td>
													<td className="py-2 sm:py-4 px-2 sm:px-4">
														<div className="flex items-center gap-2 sm:gap-3">
															<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
																{user.username.substring(0, 2)}
															</div>
															<span className="font-medium text-xs sm:text-sm">
																{user.username}
															</span>
														</div>
													</td>
													<td className="py-2 sm:py-4 px-2 sm:px-4 text-right font-bold text-yellow-500 text-xs sm:text-sm">
														{user.topSpeed}
													</td>
													<td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">
														{getAccuracyBySpeed(user, user.topSpeed)}%
													</td>
													<td className="py-2 sm:py-4 px-2 sm:px-4 text-right text-xs sm:text-sm">
														{user.testAttempted}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							{/* <div className="flex justify-center mt-4 sm:mt-6">
								<div className="flex gap-1 sm:gap-2">
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										Previous
									</button>
									<button className="bg-yellow-500 text-zinc-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										1
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										2
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										3
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										Next
									</button>
								</div>
							</div> */}
						</div>

						{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
							<div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
								<h2 className="text-base sm:text-xl font-medium mb-3 sm:mb-4 flex items-center gap-2">
									<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
									Top Speed
								</h2>

								<div className="space-y-2 sm:space-y-3">
									{leaderboardData.slice(0, 5).map((user) => (
										<div
											key={user.id}
											className="flex items-center justify-between bg-zinc-700 rounded p-2 sm:p-3"
										>
											<div className="flex items-center gap-2 sm:gap-3">
												<div
													className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
														user.rank === 1
															? "bg-yellow-500 text-zinc-900"
															: user.rank === 2
																? "bg-zinc-400 text-zinc-900"
																: user.rank === 3
																	? "bg-amber-700 text-zinc-200"
																	: "bg-zinc-600 text-zinc-400"
													} text-xs font-bold`}
												>
													{user.rank}
												</div>
												<span className="font-medium text-xs sm:text-sm">
													{user.name}
												</span>
											</div>
											<div className="font-bold text-yellow-500 text-xs sm:text-sm">
												{user.wpm} WPM
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
								<h2 className="text-base sm:text-xl font-medium mb-3 sm:mb-4 flex items-center gap-2">
									<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
									Top Accuracy
								</h2>

								<div className="space-y-2 sm:space-y-3">
									{[...leaderboardData]
										.sort((a, b) => b.accuracy - a.accuracy)
										.slice(0, 5)
										.map((user, index) => (
											<div
												key={user.id}
												className="flex items-center justify-between bg-zinc-700 rounded p-2 sm:p-3"
											>
												<div className="flex items-center gap-2 sm:gap-3">
													<div
														className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
															index === 0
																? "bg-yellow-500 text-zinc-900"
																: index === 1
																	? "bg-zinc-400 text-zinc-900"
																	: index === 2
																		? "bg-amber-700 text-zinc-200"
																		: "bg-zinc-600 text-zinc-400"
														} text-xs font-bold`}
													>
														{index + 1}
													</div>
													<span className="font-medium text-xs sm:text-sm">
														{user.name}
													</span>
												</div>
												<div className="font-bold text-green-400 text-xs sm:text-sm">
													{user.accuracy}%
												</div>
											</div>
										))}
								</div>
							</div>
						</div> */}
					</div>
				)}
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
