"use client";

import { X, BarChart2, RefreshCw, Share2, Trophy } from "lucide-react";

type TestResultsProps = {
	wpm: number;
	accuracy: number;
	time: number;
	characters: number;
	correctChars: number;
	incorrectChars: number;
	onClose: () => void;
	onRestart: () => void;
};

export default function TestResults({
	wpm,
	accuracy,
	time,
	characters,
	correctChars,
	incorrectChars,
	onClose,
	onRestart,
}: TestResultsProps) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
			<div className="bg-zinc-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
				<div className="p-4 sm:p-6 flex flex-col">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg sm:text-xl font-medium text-yellow-500">
							Test Results
						</h2>
						<button
							onClick={onClose}
							className="text-zinc-400 hover:text-zinc-200"
							aria-label="Close results"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="bg-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<div className="text-2xl sm:text-3xl font-bold text-yellow-500">
								{wpm}
							</div>
							<div className="text-xs sm:text-sm text-zinc-400">WPM</div>
						</div>
						<div className="bg-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center">
							<div className="text-2xl sm:text-3xl font-bold text-green-400">
								{accuracy}%
							</div>
							<div className="text-xs sm:text-sm text-zinc-400">Accuracy</div>
						</div>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex justify-between items-center">
							<div className="text-xs sm:text-sm text-zinc-400">Time</div>
							<div className="text-xs sm:text-sm">{time} seconds</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-xs sm:text-sm text-zinc-400">Characters</div>
							<div className="text-xs sm:text-sm">{characters}</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-xs sm:text-sm text-zinc-400">Correct</div>
							<div className="text-xs sm:text-sm text-green-400">
								{correctChars}
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div className="text-xs sm:text-sm text-zinc-400">Incorrect</div>
							<div className="text-xs sm:text-sm text-red-400">
								{incorrectChars}
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
						<button
							onClick={onRestart}
							className="flex-1 bg-yellow-500 text-zinc-900 px-4 py-2 rounded font-medium hover:bg-yellow-400 text-sm flex items-center justify-center gap-2"
						>
							<RefreshCw className="h-4 w-4" />
							Restart Test
						</button>
						<button className="flex-1 bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium hover:bg-zinc-600 border border-zinc-600 text-sm flex items-center justify-center gap-2">
							<Share2 className="h-4 w-4" />
							Share Results
						</button>
					</div>

					<div className="mt-4 pt-4 border-t border-zinc-700">
						<button className="w-full bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-medium hover:bg-zinc-600 text-sm flex items-center justify-center gap-2">
							<BarChart2 className="h-4 w-4" />
							View Detailed Stats
						</button>
					</div>

					<div className="mt-4 pt-4 border-t border-zinc-700 flex items-center justify-between">
						<div className="text-xs text-zinc-400">Personal Best: 92 WPM</div>
						<button className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1">
							<Trophy className="h-4 w-4" />
							Leaderboard
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
