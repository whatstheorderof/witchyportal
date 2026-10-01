/**
 * The 22 cards of the Major Arcana with short, original interpretations.
 * For reflection and entertainment.
 */
export interface TarotCard {
  n: number;
  numeral: string;
  name: string;
  symbol: string;
  keywords: string;
  upright: string;
  reversed: string;
  prompt: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { n: 0, numeral: "0", name: "The Fool", symbol: "✦", keywords: "beginnings · faith · freedom", upright: "A fresh start is calling. Step forward with an open heart, even if you can't see the whole path yet.", reversed: "Pause before you leap. Is this freedom, or are you running from something?", prompt: "Where in your life are you ready to begin again?" },
  { n: 1, numeral: "I", name: "The Magician", symbol: "∞", keywords: "will · skill · manifestation", upright: "You already have everything you need. Focus your intention and act — this is a day to make things happen.", reversed: "Scattered energy, or talents left unused. Gather yourself before you cast.", prompt: "What could you create today with what's already in your hands?" },
  { n: 2, numeral: "II", name: "The High Priestess", symbol: "☽︎", keywords: "intuition · mystery · inner knowing", upright: "Be still and listen. The answer you're looking for is already whispering inside you.", reversed: "You're overriding your intuition. Quiet the noise and trust what you sense.", prompt: "What does your gut already know?" },
  { n: 3, numeral: "III", name: "The Empress", symbol: "♀︎", keywords: "abundance · nurture · beauty", upright: "Fertile, abundant energy. Nourish yourself, enjoy your senses and let things grow.", reversed: "You've been giving more than you receive. Time to mother yourself.", prompt: "How can you nurture yourself as lovingly as you nurture others?" },
  { n: 4, numeral: "IV", name: "The Emperor", symbol: "♈︎", keywords: "structure · leadership · boundaries", upright: "Take charge with calm authority. Clear boundaries and steady structure will serve you now.", reversed: "Control has tipped into rigidity. Where can you lead with more softness?", prompt: "Which boundary would make your life feel safer?" },
  { n: 5, numeral: "V", name: "The Hierophant", symbol: "⚷", keywords: "tradition · learning · guidance", upright: "Learn from teachers and traditions. There's wisdom in the old ways.", reversed: "Question the rules you've inherited. Your path may be your own.", prompt: "Whose wisdom are you ready to learn from — or let go of?" },
  { n: 6, numeral: "VI", name: "The Lovers", symbol: "♡", keywords: "love · union · choice", upright: "A meaningful connection or an important choice made from the heart. Choose in line with your values.", reversed: "Disharmony or a choice that doesn't feel aligned. Come back to what you truly value.", prompt: "What choice would your most loving self make?" },
  { n: 7, numeral: "VII", name: "The Chariot", symbol: "➶", keywords: "willpower · momentum · victory", upright: "Determination carries you forward. Hold the reins and keep your eyes on the goal.", reversed: "Pulled in different directions. Decide where you're really going.", prompt: "What victory are you driving towards?" },
  { n: 8, numeral: "VIII", name: "Strength", symbol: "♌︎", keywords: "courage · compassion · inner power", upright: "Your real power is gentle. Meet challenges with patience, courage and an open heart.", reversed: "Self-doubt is roaring louder than you. You are stronger than you feel.", prompt: "Where could softness be your strength?" },
  { n: 9, numeral: "IX", name: "The Hermit", symbol: "✧", keywords: "solitude · reflection · wisdom", upright: "Step back from the noise. Time alone will light your way.", reversed: "Isolation has gone on too long — or you're avoiding the quiet. Find the balance.", prompt: "What would you hear if the world went quiet for an hour?" },
  { n: 10, numeral: "X", name: "Wheel of Fortune", symbol: "☸︎", keywords: "cycles · luck · turning points", upright: "The wheel is turning in your favour. Say yes to the change that's arriving.", reversed: "A cycle is repeating. What lesson hasn't been learned yet?", prompt: "What is changing, and how can you move with it?" },
  { n: 11, numeral: "XI", name: "Justice", symbol: "⚖︎", keywords: "truth · fairness · balance", upright: "Truth and fairness prevail. Make decisions you can stand behind.", reversed: "Something feels unbalanced. Be honest with yourself about your part.", prompt: "Where is life asking you for honesty?" },
  { n: 12, numeral: "XII", name: "The Hanged One", symbol: "⟲", keywords: "surrender · pause · new perspective", upright: "Pause and surrender. Seeing things from a new angle will change everything.", reversed: "You're stalling. The waiting is over — it's time to move.", prompt: "What would you see if you looked at this upside down?" },
  { n: 13, numeral: "XIII", name: "Death", symbol: "☠︎", keywords: "endings · transformation · rebirth", upright: "Not an ending to fear but a door closing so another can open. Let the old self go.", reversed: "Resisting a change that has already begun. Release your grip.", prompt: "What is ready to end so something new can be born?" },
  { n: 14, numeral: "XIV", name: "Temperance", symbol: "⚗︎", keywords: "balance · patience · healing", upright: "Blend, soften, take the middle path. Healing happens gently and over time.", reversed: "Too much of one thing. Bring yourself back into balance.", prompt: "What needs a little more moderation — or a little more joy?" },
  { n: 15, numeral: "XV", name: "The Devil", symbol: "⛧", keywords: "attachment · desire · shadow", upright: "Notice what has a hold on you — a habit, a person, a fear. The chains are looser than they look.", reversed: "Breaking free. You're reclaiming your power.", prompt: "What are you ready to stop giving your power to?" },
  { n: 16, numeral: "XVI", name: "The Tower", symbol: "⚡︎", keywords: "upheaval · revelation · awakening", upright: "Sudden change clears away what was built on shaky ground. Truth sets you free.", reversed: "A storm avoided, or one brewing inside. Let the walls come down gently.", prompt: "What false structure in your life is ready to fall?" },
  { n: 17, numeral: "XVII", name: "The Star", symbol: "★", keywords: "hope · healing · inspiration", upright: "After the storm comes hope. You're being renewed — keep faith in your dreams.", reversed: "Your light feels dim. Small acts of self-care will rekindle it.", prompt: "What gives you hope right now?" },
  { n: 18, numeral: "XVIII", name: "The Moon", symbol: "☾", keywords: "dreams · illusion · the subconscious", upright: "Not everything is as it seems. Trust your intuition and pay attention to your dreams.", reversed: "Confusion is lifting. The truth is coming to the surface.", prompt: "What are your dreams trying to tell you?" },
  { n: 19, numeral: "XIX", name: "The Sun", symbol: "☉︎", keywords: "joy · success · vitality", upright: "Pure joy and warmth. Let yourself shine and celebrate how far you've come.", reversed: "Joy is there, slightly clouded. Look for the light in small things.", prompt: "What made you feel most alive this week?" },
  { n: 20, numeral: "XX", name: "Judgement", symbol: "♆︎", keywords: "awakening · calling · renewal", upright: "A calling is rising. Answer it — you're ready to rise into who you're becoming.", reversed: "Self-criticism is drowning out your calling. Forgive yourself and listen.", prompt: "What is your soul calling you towards?" },
  { n: 21, numeral: "XXI", name: "The World", symbol: "◯", keywords: "completion · wholeness · celebration", upright: "A cycle completes beautifully. Celebrate — you've arrived.", reversed: "Almost there. Tie up the loose ends before you begin again.", prompt: "What are you ready to celebrate completing?" },
];

/** Same card for everyone on a given UK date. */
export function cardOfTheDay(date = new Date()): TarotCard {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(date);
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return MAJOR_ARCANA[Math.abs(h) % MAJOR_ARCANA.length];
}
