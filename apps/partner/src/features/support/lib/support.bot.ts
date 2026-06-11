const REPLIES: { match: RegExp; text: string }[] = [
  {
    match: /payout|upi|payment|paisa/i,
    text: 'Payout team ko forward kar diya. Monday batch mein UPI credit hota hai — agar miss ho to IFSC screenshot bhejo.',
  },
  {
    match: /job|visit|customer|cancel/i,
    text: 'Job ops ne note kar liya. Agar visit start nahi ho pa rahi to Schedule se job kholo ya decline karo — hum assist karenge.',
  },
  {
    match: /kyc|aadhaar|pan|verify/i,
    text: 'KYC desk review karti hai. Documents dubara upload karo agar reject hui ho — usually 24 ghante mein update.',
  },
  {
    match: /slot|time|schedule/i,
    text: 'Slots screen se active windows update karo. Naye offers sirf aapke active slots + zone se match honge.',
  },
];

export function supportBotReply(userMessage: string, topic?: string): string {
  const hay = `${topic ?? ''} ${userMessage}`;
  for (const row of REPLIES) {
    if (row.match.test(hay)) return row.text;
  }
  return 'Samajh gaye. Partner ops aapko jaldi reply karega — urgent ho to Help tab se call karo.';
}
