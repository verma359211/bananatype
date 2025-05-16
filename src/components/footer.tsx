import Link from "next/link";
import { MessageSquare, Github, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="p-4 flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
			<Link
				href="https://www.chandanverma.tech/"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-zinc-300 flex items-center gap-1"
			>
				<MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
				<span>contact</span>
			</Link>
			{/* <Link href="#" className="hover:text-zinc-300 flex items-center gap-1">
				<span>support</span>
			</Link> */}
			<a
				href="https://github.com/verma359211/bananatype"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-zinc-300 flex items-center gap-1"
			>
				<Github className="h-3 w-3 sm:h-4 sm:w-4" />
				<span>github</span>
			</a>
			{/* <Link href="#" className="hover:text-zinc-300 flex items-center gap-1">
				<MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
				<span>discord</span>
			</Link>
			<Link href="#" className="hover:text-zinc-300 flex items-center gap-1">
				<Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
				<span>twitter</span>
			</Link>
			<Link href="#" className="hover:text-zinc-300">
				terms
			</Link>
			<Link href="#" className="hover:text-zinc-300">
				security
			</Link>
			<Link href="#" className="hover:text-zinc-300">
				privacy
			</Link> */}
		</footer>
	);
}
