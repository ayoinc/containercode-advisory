import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize DeepSeek client using OpenAI SDK
const getDeepSeekClient = () => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.deepseek.com',
  });
};

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversation_history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message is required' },
        { status: 400 }
      );
    }

    const deepseek = getDeepSeekClient();

    // Build conversation context with system prompt
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: context || `You are an AI assistant for ContainerCode Advisory, a leading cloud consulting company specializing in enterprise cloud solutions.

Your primary objectives:
- Help users understand our comprehensive service offerings
- Guide qualified prospects toward booking consultations
- Provide expert insights on cloud computing, DevOps, cybersecurity, and digital transformation
- Maintain a professional, knowledgeable, and solution-oriented tone

Our Core Services:
🔹 Multi-Cloud Strategy & Migration (AWS, Azure, Google Cloud Platform)
🔹 DevOps & Automation (CI/CD pipelines, Infrastructure as Code, Monitoring & Observability)
🔹 Cybersecurity Solutions (Zero Trust Architecture, Compliance, Security Audits, Incident Response)
🔹 Digital Transformation (Legacy System Modernization, Microservices Architecture, API Development)
🔹 Software Engineering (Full-stack Development, Cloud-native Applications, Performance Optimization)

Contact Information:
📧 Email: contact@containercode.com
📞 Phone: +1 (555) 123-4567
🌐 Website: containercode.com

Response Guidelines:
- Keep responses concise yet comprehensive (200-300 words max)
- Use bullet points for clarity when listing services or benefits
- Suggest consultations for complex technical discussions or project planning
- Reference specific technologies, frameworks, and industry best practices
- Ask follow-up questions to better understand user needs
- Be encouraging about cloud adoption and digital transformation initiatives
- Include relevant emojis sparingly for visual appeal`
      }
    ];

    // Add conversation history for context (limit to last 6 messages for performance)
    if (conversation_history && Array.isArray(conversation_history)) {
      const recentHistory = conversation_history.slice(-6);
      recentHistory.forEach((msg: any) => {
        if (msg.role && msg.content && typeof msg.content === 'string') {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Make API call to DeepSeek
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: 600,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response content from DeepSeek');
      return NextResponse.json(
        { error: 'AI service returned empty response' },
        { status: 500 }
      );
    }

    // Log usage for monitoring
    console.log('DeepSeek API Usage:', {
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      total_tokens: completion.usage?.total_tokens
    });

    return NextResponse.json({
      response: aiResponse,
      usage: completion.usage || null,
      model: completion.model || 'deepseek-chat'
    });

  } catch (error: any) {
    console.error('DeepSeek API Route Error:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    });

    // Handle specific error types
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'API authentication failed' },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'DeepSeek AI Chat API - POST only' },
    { status: 405 }
  );
}