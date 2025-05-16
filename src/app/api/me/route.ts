import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get("token")?.value;

		if (!token) {
			return NextResponse.json({ isLoggedIn: false }, { status: 401 });
		}

		const user = jwt.verify(token, process.env.TOKEN_SECRET!);
		return NextResponse.json({ isLoggedIn: true, user }, { status: 200 });
    } catch (error) {
        console.error(error);
		return NextResponse.json({ isLoggedIn: false }, { status: 401 });
	}
}
