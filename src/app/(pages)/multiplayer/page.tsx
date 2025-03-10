/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// import { Clock } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, Trophy, Users } from "lucide-react";
import sampleParagraphs from "@/data/sampleParagraphs";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";

interface Player {
	wpm: number;
	accuracy: number;
}

interface Players {
	[key: string]: Player;
}

interface RoomEvent {
	roomId: string;
	isAdmin?: boolean;
	text?: string;
	players?: Players;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function MultiplayerPage() {

	const [selectedTimeOption, setSelectedTimeOption] = useState<number>(30);
	const [roomId, setRoomId] = useState<string>("");
	const [players, setPlayers] = useState<Players>({});
	const [text, setText] = useState<string>("");
	const [typedText, setTypedText] = useState<string>("");
	const [wpm, setWpm] = useState<number>(0);
	const [accuracy, setAccuracy] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(30);
	const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
	const [resultsDisplayed, setResultsDisplayed] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number>(3);
	const [showCountdown, setShowCountdown] = useState<boolean>(false);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [isroomcreated, setisroomcreated] = useState<boolean>(false);

	const createRoom = async () => {
		const newRoomId = Math.random().toString(36).substring(2, 9);
		setRoomId(newRoomId);
		let newuserId = "";
		try {
			const response = await axios.get("/api/profile");
			newuserId = response.data.user.username;
		} catch (error) {
			console.error("Failed to fetch profile data:", error);
		}
		socket.emit("createRoom", { roomId: newRoomId, userId: newuserId });
	};

	const joinRoom = (id: string): void => {
		setIsJoining(true);
		setRoomId(id);
		socket.emit("joinRoom", { roomId: id });
		setTimeout(() => {
			setIsJoining(false);
		}, 2000);
	};

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;
		if (isTestRunning && timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsTestRunning(false);
			setResultsDisplayed(true);
			if (timer) {
				clearInterval(timer);
			}
		}
		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [isTestRunning, timeLeft]);

		// When the user types, if the test hasn't started, start it on the first key press.
		const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
			if (!isTestRunning && !resultsDisplayed) {
				return;
			}
			const typed = e.target.value;
			setTypedText(typed);
	
			// Calculate accuracy.
			const charactersTyped = typed.length;
			const correctChars = text.substring(0, charactersTyped);
			let correctCount = 0;
			for (let i = 0; i < charactersTyped; i++) {
				if (typed[i] === correctChars[i]) {
					correctCount++;
				}
			}
			const accuracyValue =
				charactersTyped > 0 ? (correctCount / charactersTyped) * 100 : 100;
			setAccuracy(accuracyValue);
	
			// Calculate words per minute.
			const words = typed
				.trim()
				.split(/\s+/)
				.filter((word) => word.length > 0);
			const elapsedSeconds = selectedTimeOption - timeLeft;
			const wpmValue =
				elapsedSeconds > 0 ? words.length / (elapsedSeconds / 60) : 0;
			setWpm(Math.round(wpmValue));
			socket.emit("updateProgress", {
				roomId,
				typedText: typed,
				accuracy: accuracyValue,
				wpm: wpmValue
			});
		};
	// const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>): void => {
	// 	if (!isTestRunning) return;
	// 	const input = e.target.value;
	// 	setTypedText(input);

	// 	const correctChars = [...input].filter(
	// 		(char, idx) => char === text[idx]
	// 	).length;
	// 	const newAccuracy = (correctChars / input.length) * 100 || 100;
	// 	const wordsTyped = input.length / 5;
	// 	const newWpm = parseFloat((wordsTyped / ((60 - timeLeft) / 60)).toFixed(2));

	// 	setWpm(newWpm);
	// 	setAccuracy(newAccuracy);

	// 	socket.emit("updateProgress", {
	// 		roomId,
	// 		typedText: input,
	// 	});
	// };

	const paragraphs = sampleParagraphs.paragraphs.map((p) => p.text);

	useEffect(() => {
		const randomParagraph =
			paragraphs[Math.floor(Math.random() * paragraphs.length)];
		setText(randomParagraph);
	}, []);

	useEffect(() => {
		socket.on("roomCreated", ({ roomId, isAdmin: adminStatus }: RoomEvent) => {
			setIsAdmin(adminStatus || false);
			setisroomcreated(true);
		});

		socket.on(
			"roomJoined",
			({ text: roomText, isAdmin: adminStatus }: RoomEvent) => {
				setIsAdmin(adminStatus || false);
			}
		);

		socket.on("updateLeaderboard", ({ players }: RoomEvent) => {
			setPlayers(players || {});
		});

		socket.on("playerJoined", ({ players }: RoomEvent) => {
			setPlayers(players || {});
		});

		socket.on("countdown", ({ count }: { count: number }) => {
			setShowCountdown(true);
			setCountdown(count);
		});

		socket.on("startTyping", () => {
			setShowCountdown(false);
			setIsTestRunning(true);
			setTimeLeft(30);
			setTypedText("");
		});

		socket.on("finalResults", ({ players }: RoomEvent) => {
			setPlayers(players || {});
			setIsTestRunning(false);
			setResultsDisplayed(true);
		});

		return () => {
			socket.off("roomCreated");
			socket.off("roomJoined");
			socket.off("updateLeaderboard");
			socket.off("playerJoined");
			socket.off("countdown");
			socket.off("startTyping");
			socket.off("finalResults");
		};
	}, []);

	const startTest = (): void => {
		if (isAdmin) {
			socket.emit("startTest", { roomId });
		}
	};



	return (
		<div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-300">
			{/* Header */}
			<Navbar showBackButton={true} />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-8">
				<div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
					{/* Room Management */}
					<div className="lg:col-span-1">
						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
							<h2 className="text-lg sm:text-xl font-medium text-yellow-500 mb-4 sm:mb-6">
								Multiplayer Mode
							</h2>

							<div className="space-y-4 sm:space-y-6">
								<div>
									<h3 className="text-base sm:text-lg mb-2">Create a Room</h3>
									<div className="space-y-2 sm:space-y-3">
										<input
											type="text"
											placeholder="Room name"
											className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-sm"
										/>
										{/* <input
											type="text"
											placeholder="Your nickname"
											className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-sm"
										/> */}
										<select
											defaultValue="6"
											className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-sm"
											disabled
										>
											<option value="2">2 players</option>
											<option value="3">3 players</option>
											<option value="4">4 players</option>
											<option value="5">5 players</option>
											<option value="6">6 players</option>
										</select>

										<button
											onClick={createRoom}
											className="w-full bg-yellow-500 text-zinc-900 px-4 py-2 rounded font-medium hover:bg-yellow-400 text-sm"
										>
											Create Room
										</button>
									</div>
								</div>

								<div className="border-t border-zinc-700 pt-4 sm:pt-6">
									<h3 className="text-base sm:text-lg mb-2">Join a Room</h3>
									<div className="space-y-2 sm:space-y-3">
										<input
											type="text"
											placeholder="Room code"
											className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-sm"
											onChange={(e) => setRoomId(e.target.value)}
										/>
										{/* <input
											type="text"
											placeholder="Your nickname"
											className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:border-yellow-500 text-sm"
										/> */}
										<button
											className="w-full bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium hover:bg-zinc-600 border border-zinc-600 text-sm"
											onClick={() => joinRoom(roomId)}
										>
											Join Room
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* <div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
							<h3 className="text-base sm:text-lg mb-3 sm:mb-4">
								Active Rooms
							</h3>
							<div className="space-y-2">
								<div className="bg-zinc-700 rounded p-3 flex justify-between items-center">
									<div>
										<div className="font-medium text-sm sm:text-base">
											Speed Demons
										</div>
										<div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1">
											3/5 players
										</div>
									</div>
									<button className="bg-yellow-500 text-zinc-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium hover:bg-yellow-400">
										Join
									</button>
								</div>

								<div className="bg-zinc-700 rounded p-3 flex justify-between items-center">
									<div>
										<div className="font-medium text-sm sm:text-base">
											Typing Masters
										</div>
										<div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1">
											2/4 players
										</div>
									</div>
									<button className="bg-yellow-500 text-zinc-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium hover:bg-yellow-400">
										Join
									</button>
								</div>

								<div className="bg-zinc-700 rounded p-3 flex justify-between items-center">
									<div>
										<div className="font-medium text-sm sm:text-base">
											Practice Room
										</div>
										<div className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1">
											<Clock className="h-3 w-3" /> Starting in 30s
										</div>
									</div>
									<button className="bg-yellow-500 text-zinc-900 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium hover:bg-yellow-400">
										Join
									</button>
								</div>
							</div>
						</div> */}
					</div>

					{/* Game Area */}
					<div className="lg:col-span-3">
						<div className="bg-zinc-800 rounded-lg p-4 sm:p-6 mb-4">
							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
								<h2 className="text-lg sm:text-xl font-medium text-yellow-500">
									Room Name
								</h2>
								<div className="flex flex-wrap gap-2">
									<div className="bg-zinc-700 px-2 py-1 rounded text-xs">
										Room Code: {roomId}
									</div>
									{isroomcreated && !isTestRunning && !showCountdown && (
										<div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
											Waiting for players
										</div>
									)}
									{showCountdown && (
										<div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">
											Get ready... {countdown}
										</div>
									)}
									{isTestRunning && (
										<div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
											Start Typing
										</div>
									)}
								</div>
							</div>

							<div className="text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6 bg-zinc-700 p-3 sm:p-4 rounded-lg">
								<div className="relative min-h-[200px] w-full rounded-lg text-xl">
									{/* The textarea is disabled when the test has ended */}

									<textarea
										value={typedText}
										onChange={handleTyping}
										disabled={!isTestRunning}
										className="absolute min-h-[200px] h-full w-full text-transparent resize-none caret-white bg-transparent p-0 font-inherit leading-relaxed tracking-wide focus:outline-none focus:ring-0"
										style={{ wordSpacing: "0.2em" }}
										onPaste={(e) => e.preventDefault()}
										onContextMenu={(e) => e.preventDefault()}
										autoFocus
									/>

									{/* Overlay that shows the sample text and typed text with color coding */}
									<div
										className="inset-0 pointer-events-none whitespace-pre-wrap break-words leading-relaxed tracking-wide"
										style={{ wordSpacing: "0.2em" }}
										aria-hidden="true"
									>
										{Array.from({
											length: Math.max(text.length, typedText.length),
										}).map((_, index) => {
											const sampleChar = text[index] || "";
											const typedChar = typedText[index] || "";
											let className = "text-zinc-500";
											if (index < typedText.length) {
												if (sampleChar) {
													className =
														typedChar === sampleChar
															? "text-white"
															: "text-red-500";
												} else {
													className = "text-red-500";
												}
											}
											return (
												<span key={index} className={className}>
													{sampleChar || typedChar}
												</span>
											);
										})}
									</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
								<div className="flex flex-wrap gap-3 sm:gap-4">
									<div className="text-xs sm:text-sm">
										<span className="text-zinc-400">Time: </span>
										<span className="text-yellow-500 font-medium">
											{timeLeft}s
										</span>
									</div>
									<div className="text-xs sm:text-sm">
										<span className="text-zinc-400">WPM: </span>
										<span className="text-yellow-500 font-medium">{wpm}</span>
									</div>
									<div className="text-xs sm:text-sm">
										<span className="text-zinc-400">Accuracy: </span>
										<span className="text-yellow-500 font-medium">
											{accuracy.toFixed(1)}%
										</span>
									</div>
								</div>

								{isAdmin && (
									<button
										className="bg-yellow-500 text-zinc-900 px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-yellow-400 w-full sm:w-auto"
										onClick={startTest}
									>
										Start Race
									</button>
								)}
							</div>

							<div>
								<h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">
									Players
								</h3>

								<div className="space-y-2">
									{Object.entries(players).map(([playerId, player]) => (
										<div
											key={playerId}
											// className="bg-zinc-700 rounded p-3 flex justify-between items-center"
											className={`bg-zinc-700 rounded p-3 flex justify-between items-center ${
												isAdmin ? "border border-yellow-500/30" : ""
											}`}
										>
											<div className="flex items-center gap-2 sm:gap-3">
												<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-600 flex items-center justify-center text-xs">
													KW
												</div>
												<div>
													<div className="font-medium text-xs sm:text-sm">
														{playerId.slice(0, 6).toLowerCase()}
													</div>

													<div className="text-xs text-zinc-400">
														{isAdmin ? "Admin" : "Ready"}
													</div>
												</div>
											</div>

											<div className="flex items-center gap-2 sm:gap-4">
												<div className="text-right">
													<div className="font-medium text-xs sm:text-sm">
														{Math.round(player.wpm)} WPM
													</div>
													<div className="text-xs text-zinc-400">
														92% accuracy
													</div>
												</div>
												<div className="w-1 h-10 sm:h-12 bg-yellow-500 rounded-full"></div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* <div className="text-center text-xs sm:text-sm text-zinc-500">
							<p>
								Press <span className="bg-zinc-800 px-2 py-1 rounded">ESC</span>{" "}
								to leave room • Press{" "}
								<span className="bg-zinc-800 px-2 py-1 rounded">TAB</span> to
								restart
							</p>
						</div> */}
					</div>
				</div>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
