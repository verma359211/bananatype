'use client'
import { Key, Mail, LogOut, Edit, Settings } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Activity,
	Award,
	Clock,
	Target,
	Trophy,
	User,
	Loader2,
} from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";



type User = {
	_id: string;
	email: string;
	fullname: string;
	username: string;
	joinDate: string; //
	bio: string;
	profilePicUrl: string;
	testAttempted: number;
	topSpeed: number;
	accuracy: number;
	avgSpeed: number;
	avgaccuracy: number; //
	history: {
		_id: string;
		speed: number;
		accuracy: number;
		mode: string; //
		testPlayed: string;
	}[];
	achievement: string[];
};

async function getProfileData() {
  
  try {
	const response = await axios.get('/api/profile');
	toast.success('Profile fetched successfully');
	return response.data.user || {}; 
  } catch (error) {
	toast.error('login to view profile');
	console.error('Failed to fetch profile data:', error);
	return {}; 
  }
}


export default function ProfilePage() {
    const router = useRouter();
	const [userData, setUserData] = React.useState<User>();
	const [showresult, setShowresult] = useState<number>(-5);
	const [viewall, setViewall] = useState<boolean>(false);

  useEffect(() => {
	async function fetchData() {
	  const data = await getProfileData();
	  if(!data._id) {
		router.push('/login');
	  }
	  setUserData(data);
	}
	fetchData();
  },[]);

  if (!userData) {
	return (
	  <div className="flex items-center justify-center h-screen">
		<div className="animate-spin  text-yellow-500">
		  <Loader2 />
		</div>
	  </div>
	);
  }

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true, // Optional: Change to false for 24-hour format
	};


	// Mock user data
	const user = {
		name: userData.fullname,
		email: userData.email,
		joinDate: userData.joinDate,
		stats: {
			testsCompleted: userData?.testAttempted || 0,
			averageWpm: (userData?.avgSpeed || 0).toFixed(2).slice(0, 2),
			highestWpm: userData.topSpeed,
			averageAccuracy: userData.avgaccuracy,
			// totalTimePlayed: "",
		},
		recentTests: userData.history || [],
		// [
		// { id: 1, date: "2 hours ago", wpm: 78, accuracy: 97, mode: "time-30" },
		// ]
		achievements: [
			{
				id: 1,
				name: "Speed Demon",
				description: "Reach 80 WPM",
				completed: userData.topSpeed > 79 ? true : false,
				progress: Math.round((userData.topSpeed / 100) * 100),
			},
			{
				id: 2,
				name: "Accuracy Master",
				description: "Achieve 98% accuracy",
				completed: userData.accuracy > 98 ? true : false,
				progress: (Math.round(userData.accuracy / 100) * 100),
			},
			{
				id: 3,
				name: "Marathon Typer",
				description: "Complete 300 tests",
				completed: userData.history.length > 299 ? true : false,
				progress: Math.round((userData.history.length / 100) * 100),
			},
			{
				id: 4,
				name: "Multiplayer Champion",
				description: "Win 50 multiplayer races",
				completed: false,
				progress: 0,
			},
		],
	};
	const handleLogout = async () => {
		try {
			await axios.get("/api/logout");
			router.push("/");
		} catch (error) {
			console.error("Error Logging Out", error);
		}
	};
	const handleViewAll = () => {
		if (viewall) {
			setShowresult(-5);
			setViewall(false);
		}
		else {
			setShowresult(0);
			setViewall(true);
		}

	}

	return (
		<div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-300">
			{/* Header */}
			<Navbar />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-8">
				<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
					{/* Profile Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
							<div className="flex flex-col items-center text-center mb-4 sm:mb-6">
								<div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-zinc-700 flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
									{user.name.substring(0, 2)}
								</div>

								<h2 className="text-lg sm:text-xl font-medium">{user.name}</h2>
								<p className="text-xs sm:text-sm text-zinc-400">
									Member since {user.joinDate}
								</p>
							</div>

							<div className="space-y-3 sm:space-y-4">
								<div className="flex justify-between items-center">
									<div className="text-xs sm:text-sm text-zinc-400">
										Tests Completed
									</div>
									<div className="font-medium text-xs sm:text-sm">
										{user.stats.testsCompleted}
									</div>
								</div>

								<div className="flex justify-between items-center">
									<div className="text-xs sm:text-sm text-zinc-400">
										Average WPM
									</div>
									<div className="font-medium text-xs sm:text-sm">
										{user.stats.averageWpm}
									</div>
								</div>

								<div className="flex justify-between items-center">
									<div className="text-xs sm:text-sm text-zinc-400">
										Highest WPM
									</div>
									<div className="font-medium text-xs sm:text-sm text-yellow-500">
										{user.stats.highestWpm}
									</div>
								</div>

								<div className="flex justify-between items-center">
									<div className="text-xs sm:text-sm text-zinc-400">
										Average Accuracy
									</div>
									<div className="font-medium text-xs sm:text-sm">
										{user.stats.averageAccuracy}%
									</div>
								</div>

								{/* <div className="flex justify-between items-center">
									<div className="text-xs sm:text-sm text-zinc-400">
										Total Time Played
									</div>
									<div className="font-medium text-xs sm:text-sm">
										{user.stats.totalTimePlayed}
									</div>
								</div> */}
							</div>
						</div>

						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
								Account Settings
							</h3>

							<div className="space-y-2 sm:space-y-3">
								{/* <button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 text-xs sm:text-sm">
									<Edit className="h-3 w-3 sm:h-4 sm:w-4" />
									Edit Profile
								</button>

								<button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 text-xs sm:text-sm">
									<Key className="h-3 w-3 sm:h-4 sm:w-4" />
									Change Password
								</button>

								<button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 text-xs sm:text-sm">
									<Mail className="h-3 w-3 sm:h-4 sm:w-4" />
									Update Email
								</button>

								<button className="w-full text-left bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 text-xs sm:text-sm">
									<Settings className="h-3 w-3 sm:h-4 sm:w-4" />
									Preferences
								</button> */}

								<button
									className="w-full text-left bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-red-400 flex items-center gap-2 mt-4 sm:mt-6 text-xs sm:text-sm"
									onClick={handleLogout}
								>
									<LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
									Sign Out
								</button>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
								<h3 className="text-base sm:text-lg font-medium">
									Recent Tests
								</h3>
								{/* <div className="flex flex-wrap gap-2">
									<button className="bg-yellow-500/20 text-yellow-500 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										All
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										Time
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										Words
									</button>
									<button className="bg-zinc-700 hover:bg-zinc-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
										Multiplayer
									</button>
								</div> */}
							</div>

							<div className="space-y-2 sm:space-y-3">
								{user.recentTests
									.slice(showresult)
									.reverse()
									.map((test) => (
										<div
											key={test._id}
											className="bg-zinc-700 rounded p-3 flex justify-between items-center"
										>
											<div>
												<div className="font-medium text-xs sm:text-sm">
													{test.speed} WPM
												</div>
												<div className="text-xs text-zinc-400">
													{test.testPlayed}
												</div>
											</div>

											<div className="text-right">
												<div className="text-xs">
													<span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-sm text-xs">
														{test.mode}
													</span>
												</div>
												<div className="text-xs text-zinc-400 mt-1">
													Accuracy: {test.accuracy}%
												</div>
											</div>
										</div>
									))}
							</div>

							{viewall ? (
								<button
									className="mt-3 sm:mt-4 w-full bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm"
									onClick={handleViewAll}
								>
									View less
								</button>
							) : (
								<button
									className="mt-3 sm:mt-4 w-full bg-zinc-700 hover:bg-zinc-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm"
									onClick={handleViewAll}
								>
									View All
								</button>
							)}
						</div>

						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
								Achievements
							</h3>

							<div className="space-y-3 sm:space-y-4">
								{user.achievements.map((achievement) => (
									<div key={achievement.id} className="bg-zinc-700 rounded p-3">
										<div className="flex justify-between items-center mb-1 sm:mb-2">
											<div className="font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
												{achievement.name}
												{achievement.completed && (
													<span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-sm text-xs">
														Completed
													</span>
												)}
											</div>

											{!achievement.completed && (
												<div className="text-xs text-zinc-400">
													{achievement.progress}%
												</div>
											)}
										</div>

										<div className="text-xs text-zinc-400 mb-2 sm:mb-3">
											{achievement.description}
										</div>

										{!achievement.completed && (
											<div className="w-full bg-zinc-600 h-1.5 sm:h-2 rounded-full overflow-hidden">
												<div
													className="bg-yellow-500 h-full rounded-full"
													style={{ width: `${achievement.progress}%` }}
												></div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
			<Toaster position="bottom-right" reverseOrder={false} />
			{/* Footer */}
			<Footer />
		</div>
	);
}
