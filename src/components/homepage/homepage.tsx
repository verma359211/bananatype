"use client";

import {
	AlignLeft,
	// Hash,
	Clock,
	// Quote,
	// Feather,
	// Settings,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import React, { useState, useEffect } from "react";

import sampleParagraphs from "@/data/sampleParagraphs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// const WORD_LIMIT = 100;

export default function Homepage() {
	const [selectedTimeOption, setSelectedTimeOption] = useState<number>(30);

	const [timeLeft, setTimeLeft] = useState<number>(selectedTimeOption);
	const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
	const [typedText, setTypedText] = useState<string>("");
	const [text, setText] = useState<string>("");
	const [accuracy, setAccuracy] = useState<number>(100);
	const [wpm, setWpm] = useState<number>(0);
	const [resultsDisplayed, setResultsDisplayed] = useState<boolean>(false);

	const handleTime = (p0: number): void => {
		setSelectedTimeOption(p0);
		setTimeLeft(p0);
	};

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
		setTimeLeft(selectedTimeOption);
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
		setTimeLeft(selectedTimeOption);
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
					console.log("Error while storing the result", error);
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
		const elapsedSeconds = selectedTimeOption - timeLeft;
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
	});

	return (
		<div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-300">
			{/* Header */}
			<Navbar />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4">
				{/* Test Options */}
				<div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
					{/* <button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<AlignLeft className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>punctuation</span>
					</button>
					<button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<Hash className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>numbers</span>
					</button> */}
					<button className="bg-yellow-500/20 text-yellow-500 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-yellow-500/30">
						<Clock className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>time</span>
					</button>
					<button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<AlignLeft className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>words</span>
					</button>
					{/* <button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<Quote className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>quote</span>
					</button>
					<button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<Feather className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>zen</span>
					</button>
					<button className="bg-zinc-800 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-zinc-700">
						<Settings className="h-3 w-3 sm:h-4 sm:w-4" />
						<span>custom</span>
					</button> */}
				</div>

				{/* Time Options */}
				<div className="flex gap-2 mb-6 sm:mb-8">
					<button
						className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
							selectedTimeOption === 15
								? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
								: "hover:bg-zinc-800"
						}`}
						onClick={() => handleTime(15)}
					>
						15
					</button>
					<button
						className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
							selectedTimeOption === 30
								? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
								: "hover:bg-zinc-800"
						}`}
						onClick={() => handleTime(30)}
					>
						30
					</button>
					<button
						className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
							selectedTimeOption === 60
								? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
								: "hover:bg-zinc-800"
						}`}
						onClick={() => handleTime(60)}
					>
						60
					</button>
					<button
						className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
							selectedTimeOption === 120
								? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
								: "hover:bg-zinc-800"
						}`}
						onClick={() => handleTime(120)}
					>
						120
					</button>
				</div>
				{/* Language Selector */}
				{/* <div className="mb-8">
					<button className="bg-zinc-800 px-4 py-1 rounded text-sm flex items-center gap-2 hover:bg-zinc-700">
						<span>english</span>
					</button>
				</div> */}

				{/* Typing Area */}
				<div className="max-w-7xl w-full mb-8 text-lg">
					<div className="flex items-center justify-between mb-4 mx-4">
						<div className="flex items-center space-x-3 text-yellow-500">
							{/* <Clock className="h-4 w-4" /> */}
							<span>{timeLeft}</span>
						</div>
						<div className="flex items-center space-x-3">
							{/* <AlertCircle className="h-4 w-4" /> */}
							<span>{accuracy.toFixed(2)}%</span>
						</div>
						<div className="flex items-center space-x-3">
							{/* <Trophy className="h-4 w-4" /> */}
							<span>{wpm} wpm</span>
						</div>
					</div>

					<div className="relative min-h-[200px] w-full rounded-lg p-4 text-2xl">
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
								let className = "text-gray-600";
								if (index < typedText.length) {
									if (sampleChar) {
										className =
											typedChar === sampleChar ? "text-white" : "text-red-500";
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
							className="relative min-h-[200px] h-full w-full text-transparent resize-none caret-white bg-transparent p-0 font-inherit leading-relaxed tracking-wide focus:outline-none focus:ring-0"
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
				</div>
				{/* Keyboard Shortcuts */}
				<div className="text-zinc-500 text-sm mb-4">
					<span className="bg-zinc-800 px-2 py-1 rounded">tab</span> - restart
					test
				</div>
				{/* <div className="text-zinc-500 text-sm mb-8">
					<span className="bg-zinc-800 px-2 py-1 rounded">esc</span> or{" "}
					<span className="bg-zinc-800 px-2 py-1 rounded">ctrl</span> +{" "}
					<span className="bg-zinc-800 px-2 py-1 rounded">shift</span> +{" "}
					<span className="bg-zinc-800 px-2 py-1 rounded">p</span> - command
					line
				</div> */}
			</main>

			{/* Footer */}
			<Footer />
			<Toaster position="bottom-right" reverseOrder={false} />
		</div>
	);
}
