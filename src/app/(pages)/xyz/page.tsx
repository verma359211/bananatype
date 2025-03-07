/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Trophy } from "lucide-react";
import sampleParagraphs from "@/data/sampleParagraphs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LeaderboardPage from "../leaderboard/page";

const TIME_LIMIT = 10;

export default function TypingTest() {
	const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
	const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
	const [typedText, setTypedText] = useState<string>("");
	const [text, setText] = useState<string>("");
	const [accuracy, setAccuracy] = useState<number>(100);
	const [wpm, setWpm] = useState<number>(0);
	const [resultsDisplayed, setResultsDisplayed] = useState<boolean>(false);

	// Returns a random sample text.
	const selectRandomSampleText = (): string => {
		const randomIndex = Math.floor(
			Math.random() * sampleParagraphs.paragraphs.length
		);
		return sampleParagraphs.paragraphs[randomIndex].text;
	};

	// On mount, load a sample text so it's visible immediately.
	useEffect(() => {
		setText(selectRandomSampleText());
	}, []);

	// Start the test on the first key press.
	const startTest = (initialText: string = ""): void => {
		setIsTestRunning(true);
		setTimeLeft(TIME_LIMIT);
		setTypedText(initialText);
		setResultsDisplayed(false);
		setAccuracy(100);
		setWpm(0);
	};

	// Reset the test to default (like the page load state).
	const resetTest = (): void => {
		setIsTestRunning(false);
		setResultsDisplayed(false);
		setTypedText("");
		setTimeLeft(TIME_LIMIT);
		setAccuracy(100);
		setWpm(0);
		setText(selectRandomSampleText());
	};

	// Timer: if the test is running, decrease timeLeft every second.
	useEffect(() => {
		if (isTestRunning && timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && isTestRunning) {
			setIsTestRunning(false);
			setResultsDisplayed(true);
		}
	}, [isTestRunning, timeLeft]);

	// Store results in the DB when the test ends.
	useEffect(() => {
		if (resultsDisplayed) {
			const storeresult = async () => {
				try {
					const response = await axios.put("/api/store-result", {
						speed: wpm,
						accuracy: accuracy,
					});
					console.log("Result stored:", response.data);
					toast.success("Result stored successfully");
				} catch (error) {
					toast.error("Failed to store result");
					console.log("Error while storing the result");
				}
			};
			storeresult();
		}
	}, [resultsDisplayed, wpm, accuracy]);

	// When the user types, if the test hasn't started, start it on the first key press.
	const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		if (!isTestRunning && !resultsDisplayed) {
			startTest(e.target.value);
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
		const elapsedSeconds = TIME_LIMIT - timeLeft;
		const wpmValue =
			elapsedSeconds > 0 ? words.length / (elapsedSeconds / 60) : 0;
		setWpm(Math.round(wpmValue));
	};

	// Global listener: when Tab is pressed, reset the test.
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Tab") {
				e.preventDefault(); // Prevent default tab behavior (like focus change)
				resetTest();
			}
		};
		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => window.removeEventListener("keydown", handleGlobalKeyDown);
	}, []);

	return (
		<div className="container min-h-screen mx-auto px-6 py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl font-bold">Typing Test</CardTitle>
				</CardHeader>
				<CardContent>
					{(isTestRunning || resultsDisplayed) && (
						<div className="flex items-center justify-between text-lg font-medium mb-4">
							<div className="flex items-center space-x-3">
								<Clock className="w-6 h-6" />
								<span>{timeLeft}s</span>
							</div>
							<div className="flex items-center space-x-3">
								<AlertCircle className="w-6 h-6" />
								<span className="font-bold">{accuracy.toFixed(2)}%</span>
							</div>
							<div className="flex items-center space-x-3">
								<Trophy className="w-6 h-6" />
								<span>{wpm} WPM</span>
							</div>
						</div>
					)}

					<div className="relative min-h-[200px] w-full rounded-lg bg-background p-4 font-mono text-2xl">
						{/* Overlay that shows the sample text and typed text with color coding */}
						<div
							className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words leading-relaxed tracking-wide"
							style={{ wordSpacing: "0.25em" }}
							aria-hidden="true"
						>
							{Array.from({
								length: Math.max(text.length, typedText.length),
							}).map((_, index) => {
								const sampleChar = text[index] || "";
								const typedChar = typedText[index] || "";
								let className = "text-gray-500";
								if (index < typedText.length) {
									if (sampleChar) {
										className =
											typedChar === sampleChar
												? "text-green-500"
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

						{/* The textarea is disabled when the test has ended */}
						<textarea
							value={typedText}
							onChange={handleTyping}
							disabled={resultsDisplayed}
							className="relative min-h-[200px] h-full w-full text-transparent caret-black resize-none bg-transparent p-0 font-inherit leading-relaxed tracking-wide focus:outline-none focus:ring-0"
							style={{ wordSpacing: "0.25em" }}
							onPaste={(e) => e.preventDefault()}
							onContextMenu={(e) => e.preventDefault()}
							autoFocus
						/>
					</div>

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
							<p className="text-lg">Press Tab to reset the test.</p>
						</div>
					)}
				</CardContent>
			</Card>
			<LeaderboardPage />
			<Toaster position="bottom-right" reverseOrder={false} />
		</div>
	);
}
