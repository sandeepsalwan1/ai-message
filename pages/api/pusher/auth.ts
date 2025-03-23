import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse
) {
	// Only allow POST requests for Pusher auth
	if (request.method !== 'POST') {
		return response.status(405).json({ 
			error: 'Method not allowed',
			message: 'Only POST requests are allowed for this endpoint'
		});
	}

	try {
		// @ts-ignore (needs ts-ignore due to type mismatch in NextAuth versions)
		const session = await getServerSession(request, response, authOptions);

		if (!session?.user?.email) {
			console.warn('Pusher auth failed: No authenticated session');
			return response.status(401).json({ 
				error: 'Unauthorized',
				message: 'Authentication required'
			});
		}

		const socketId = request.body.socket_id;
		const channel = request.body.channel_name;
		
		if (!socketId || !channel) {
			console.warn('Pusher auth failed: Missing socket_id or channel_name');
			return response.status(400).json({ 
				error: 'Bad Request',
				message: 'Missing required Pusher parameters'
			});
		}

		const data = {
			user_id: session.user.email,
		};

		const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
		return response.status(200).json(authResponse);
	} catch (error) {
		console.error('Pusher auth error:', error);
		return response.status(500).json({ 
			error: 'Internal Server Error',
			message: 'An error occurred during Pusher authentication'
		});
	}
}
