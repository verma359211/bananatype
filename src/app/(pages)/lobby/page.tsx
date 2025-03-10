/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

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

export default function TypingTest() {
	const [roomId,  setRoomId] = useState<string>("");
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

	const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>): void => {
		if (!isTestRunning) return;
		const input = e.target.value;
		setTypedText(input);

		const correctChars = [...input].filter(
			(char, idx) => char === text[idx]
		).length;
		const newAccuracy = (correctChars / input.length) * 100 || 100;
		const wordsTyped = input.length / 5;
		const newWpm = parseFloat((wordsTyped / ((60 - timeLeft) / 60)).toFixed(2));

		setWpm(newWpm);
		setAccuracy(newAccuracy);

		socket.emit("updateProgress", {
			roomId,
			typedText: input,
		});
	};

	const paragraphs = sampleParagraphs.paragraphs.map((p) => p.text);

	useEffect(() => {
		const randomParagraph =
			paragraphs[Math.floor(Math.random() * paragraphs.length)];
		setText(randomParagraph);
	}, []);

	useEffect(() => {
		socket.on("roomCreated", ({ roomId, isAdmin: adminStatus }: RoomEvent) => {
			setIsAdmin(adminStatus || false);
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
			<Navbar />
			<div className="container mx-auto p-4 min-h-screen">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Typing Test Room
				</h1>
				<div className="flex flex-col gap-10">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold">Typing Test</CardTitle>
						</CardHeader>
						<CardContent>
							{showCountdown && (
								<div className="text-center">
									<h2 className="text-7xl font-extrabold mb-4">{countdown}</h2>
									<p className="text-lg text-muted-foreground">Get ready...</p>
								</div>
							)}
							{(isTestRunning || resultsDisplayed) && (
								<div className="space-y-6">
									<div className="flex items-center justify-between text-lg font-medium">
										<div className="flex items-center space-x-3">
											<Clock className="w-6 h-6" />
											<span>{timeLeft}s</span>
										</div>
										<div className="flex items-center space-x-3">
											<AlertCircle className="w-6 h-6" />
											<span>{accuracy.toFixed(2)}%</span>
										</div>
										<div className="flex items-center space-x-3">
											<Trophy className="w-6 h-6" />
											<span>{wpm} WPM</span>
										</div>
									</div>
									<Progress
										value={(typedText.length / text.length) * 100}
										className="w-full h-4 rounded-full"
									/>
									<div className="relative min-h-[400px] w-full rounded-lg border p-4 font-mono text-2xl">
										<div
											className="absolute  inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words leading-relaxed tracking-wide"
											style={{ wordSpacing: "0.25em" }}
											aria-hidden="true"
										>
											{text.split("").map((char, index) => (
												<span
													key={index}
													className={
														index < typedText.length
															? typedText[index] === char
																? "text-white"
																: " text-red-500"
															: "text-gray-500"
													}
												>
													{char}
												</span>
											))}
										</div>

										{/* Input textarea */}
										<textarea
											value={typedText}
											onChange={handleTyping}
											className="relative min-h-[200px] h-full w-full text-transparent caret-black dark:caret-white  resize-none bg-transparent p-0 font-inherit leading-relaxed tracking-wide focus:outline-none focus:ring-0"
											style={{ wordSpacing: "0.25em" }}
											placeholder=""
											disabled={!isTestRunning}
											onPaste={(e) => e.preventDefault()}
											onContextMenu={(e) => e.preventDefault()}
										/>
									</div>
								</div>
							)}
							{!isTestRunning &&
								Object.keys(players).length > 0 &&
								!resultsDisplayed &&
								isAdmin && (
									<Button
										onClick={startTest}
										className=" text-white text-lg py-3 bg-gray-700 hover:bg-gray-900"
									>
										Start Typing Test
									</Button>
								)}
							{resultsDisplayed && (
								<div className="space-y-4 mt-6">
									<h2 className="text-3xl font-bold">Final Results</h2>
									<p className="text-xl">
										Your WPM: <span className="font-bold">{wpm}</span>
									</p>
									<p className="text-xl">
										Your Accuracy:{" "}
										<span className="font-bold">{accuracy.toFixed(2)}%</span>
									</p>
								</div>
							)}
						</CardContent>
					</Card>
					<div className="flex flex-col md:flex-row justify-between gap-2">
						<Card className="w-full md:w-1/2">
							<CardHeader>
								<CardTitle>Room Controls</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Button
										onClick={createRoom}
										className=" text-white text-xl hover:bg-gray-900 bg-gray-700"
									>
										Create Room
									</Button>
									{roomId && (
										<div className="p-2 bg-muted rounded-md">
											<p className="text-sm">Share this room ID with others:</p>
											<p className="font-mono text-lg">{roomId}</p>
										</div>
									)}
									<div className="flex space-x-2">
										{!roomId && (
											<Input
												type="text"
												placeholder="Enter Room ID"
												onChange={(e) => setRoomId(e.target.value)}
											/>
										)}
										<Button
											className="text-xl"
											variant="outline"
											onClick={() => joinRoom(roomId)}
										>
											{isJoining ? "Joining" : "Join"}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						{/* ------------------------------------ */}
						<Card className="w-full md:w-1/2">
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Users className="w-5 h-5" />
									<span>Leaderboard</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-2   overflow-y-auto max-h-[200px]">
									{Object.keys(players).length > 0 && (
										<div className="flex justify-between text-sm  font-semibold mb-2">
											<span className="ml-3">Player ID</span>
											<span className="mr-4">Speed (WPM)</span>
										</div>
									)}
									{Object.entries(players).map(([playerId, player]) => (
										<div
											key={playerId}
											className="flex justify-between items-center p-3 bg-gray-50 dark:bg-black rounded-lg"
										>
											<span className="font-medium text-sm">
												{playerId.slice(0, 6).toLowerCase()}
											</span>
											<span className="text-sm">{player.wpm}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			{/* Footer */}
			<Footer />
		</div>
	);
}
