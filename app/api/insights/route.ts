import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { summary, userHealth } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { insight: 'AI insights are not configured. Add GEMINI_API_KEY to your .env.local file to enable this feature.' },
        { status: 200 }
      );
    }

    const healthContext = userHealth
      ? `\n\nUser Profile: Age ${userHealth.age}, Weight ${userHealth.weight}kg, Height ${userHealth.height}cm, BMI ${userHealth.bmi}, Country: ${userHealth.country}, Monthly Income: ₹${userHealth.monthlyIncome}, Occupation: ${userHealth.occupation}, Daily Exercise: ${userHealth.dailyExercise}.`
      : '';

    const prompt = `You are a concise personal financial advisor. Analyze this data and provide 4-5 actionable insights. Be direct and practical. Include:
1. One spending pattern observation
2. One specific cost-cutting suggestion
3. One savings/investment recommendation
4. One health-related financial tip (if user health data is available)
5. One warning or risk alert if any pattern is concerning

Data:
- Total Income: ₹${summary.totalIncome}
- Total Expenses: ₹${summary.totalExpense}
- Balance: ₹${summary.balance}
- Savings Rate: ${summary.savingsRate}%
- Top spending categories: ${JSON.stringify(summary.topCategories)}${healthContext}

Format each insight as a short paragraph. No bullet points, no emojis. Keep it under 250 words total.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json(
        { insight: 'AI service temporarily unavailable. Please check your GEMINI_API_KEY and try again.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const insight = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No insight generated.';

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Insight API error:', error);
    return NextResponse.json(
      { insight: 'Failed to generate insight. Please try again.' },
      { status: 200 }
    );
  }
}
