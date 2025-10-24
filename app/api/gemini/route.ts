import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, type } = await request.json();

    console.log('Received request:', { message, type, hasApiKey: !!process.env.GEMINI_API_KEY });

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    if (!message || !type) {
      console.error('Missing required fields:', { message, type });
      return NextResponse.json(
        { error: 'Missing required fields: message and type' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';

    if (type === 'chat') {
      // For moment of clarity section
      prompt = `You are DilSe AI, a compassionate mental health companion for students and young adults. You provide empathetic, supportive responses that help users explore their feelings without judgment. Keep responses concise (1-2 sentences), warm, and encouraging. 

User message: "${message}"

Respond as DilSe AI:`;
    } else if (type === 'emoji') {
      // For emoji-based responses
      const emojiResponses = {
        '😊': 'Good to hear you\'re feeling good! It\'s wonderful to see positive energy. Keep spreading that joy!',
        '😐': 'It\'s okay to feel neutral sometimes. Every emotion is valid. How about we chat to explore what\'s on your mind?',
        '😟': 'I can sense you might be feeling a bit worried. It\'s completely normal to feel this way. Would you like to talk about what\'s on your mind?',
        '😢': 'It\'s alright to feel low sometimes. Your feelings are valid and you\'re not alone. Chat with us to feel better, maybe?',
        '😡': 'I understand you\'re feeling frustrated or angry. These emotions are natural. Let\'s talk through what\'s bothering you.'
      };
      
      const response = emojiResponses[message as keyof typeof emojiResponses] || 'Thank you for sharing how you feel. We\'re here to listen and support you.';
      console.log('Emoji response:', response);
      return NextResponse.json({ response });
    } else {
      console.error('Invalid type:', type);
      return NextResponse.json(
        { error: 'Invalid type. Must be "chat" or "emoji"' },
        { status: 400 }
      );
    }

    console.log('Sending prompt to Gemini:', prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      } else if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
