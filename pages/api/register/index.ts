import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Only allow POST requests for registration
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are allowed for this endpoint'
    });
  }

  try {
    const { email, name, password } = request.body;

    if (!email || !name || !password) {
      return response.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Broadcast the new user event to all clients on the "users" channel
    try {
      await pusherServer.trigger("users-channel", "user:new", user);
    } catch (pusherError) {
      console.error("[PUSHER_ERROR]", pusherError);
      // Continue execution even if Pusher fails
    }

    return response.status(200).json(user);
  } catch (error) {
    console.error("[REGISTRATION_ERROR]", error);
    return response.status(500).json({
      error: 'Internal Server Error',
      message: 'Error while registering user'
    });
  }
} 