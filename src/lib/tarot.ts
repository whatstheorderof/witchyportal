/**
 * The tarot deck: 22 Major Arcana cards here, 56 Minor Arcana in tarot-minor.ts,
 * all with short, original interpretations. For reflection and entertainment.
 */
import { MINOR_ARCANA, MINOR_DEPTH, type Suit } from "./tarot-minor";

export interface TarotCard {
  n: number;
  numeral: string;
  name: string;
  symbol: string;
  keywords: string;
  upright: string;
  reversed: string;
  prompt: string;
  /** Minor Arcana only */
  suit?: Suit;
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

/** All 78 cards */
export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];
export const isMajor = (c: TarotCard) => c.n < 22;

/** Same card for everyone on a given UK date, from the full deck. */
export function cardOfTheDay(date = new Date()): TarotCard {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(date);
  let h = 2166136261;
  for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return FULL_DECK[Math.abs(h) % FULL_DECK.length];
}

/** Deeper readings for each card — original text, for reflection. */
export interface TarotDepth {
  /** short phrase used when combining cards in a spread */
  theme: string;
  meaning: string;
  love: string;
  work: string;
  spirit: string;
}

export const TAROT_DEPTH: Record<number, TarotDepth> = {
  0: {
    theme: "a leap of faith",
    meaning: "The Fool stands at the edge of the cliff with a light bag and a lighter heart. This card is the very beginning of the journey — pure potential before experience has taught you to be careful. It asks you to trust life enough to take the first step, even if you can't see where the path leads. Bring your curiosity, not your fear. Mistakes made with an open heart are how magic is learned.",
    love: "Let love be playful and new. Say yes to the unexpected date or the fresh start.",
    work: "A new path, project or idea wants to begin. Start before you feel ready.",
    spirit: "Beginner's mind is a gift. Approach your practice as if for the very first time.",
  },
  1: {
    theme: "focused will",
    meaning: "The Magician has every tool on the table — the cup, the wand, the sword and the coin — and knows how to use them. One hand reaches up to the heavens, the other points to the earth: as above, so below. This is the card of manifestation. Your thoughts, words and actions are lining up, and what you focus on now will grow. Be clear about what you want, then act on it.",
    love: "Speak your desires out loud. Confidence is magnetic right now.",
    work: "You have the skills. Pitch the idea, send the email, make the thing.",
    spirit: "Spellwork is especially potent. Set a clear intention and back it with action.",
  },
  2: {
    theme: "inner knowing",
    meaning: "The High Priestess sits between the pillars of light and dark, guarding the veil to the unseen. She doesn't speak — she knows. This card asks you to stop searching outside yourself for answers and to listen to the quiet voice within: your dreams, your gut feelings, the little synchronicities. Not everything needs to be explained yet. Trust what you sense, even before you can prove it.",
    love: "Your intuition about this person is right. Watch what isn't said.",
    work: "Hold your cards close for now. Gather information before you act.",
    spirit: "Keep a dream journal and spend time in silence. Your psychic senses are open.",
  },
  3: {
    theme: "abundance and nurture",
    meaning: "The Empress is Mother Earth herself — lush, sensual and overflowing. She reminds you that growth is natural when it's nourished. This is a card of creativity, fertility in every sense, beauty and pleasure. Slow down and enjoy your body, good food, nature and the people you love. Anything you plant now with care has every chance to flourish. Receiving is as sacred as giving.",
    love: "Tenderness and affection are blossoming. Let yourself be cared for, too.",
    work: "Creative projects thrive. Make it beautiful, and let it take the time it needs.",
    spirit: "Ground yourself in nature. Walk barefoot, tend plants, honour the seasons.",
  },
  4: {
    theme: "structure and self-leadership",
    meaning: "The Emperor sits on his stone throne, steady and sure. Where the Empress grows, the Emperor builds the walls that protect what has grown. This card asks you to take responsibility, set clear boundaries and create structure that supports your dreams. Leadership here isn't about control — it's about being the calm, reliable presence in your own life. Make the plan and keep the promise you made to yourself.",
    love: "Stability matters. Be clear about what you need and what you won't accept.",
    work: "Take the lead. Organise, plan and claim your authority.",
    spirit: "Create a regular practice. Discipline is a form of devotion.",
  },
  5: {
    theme: "wisdom and tradition",
    meaning: "The Hierophant is the keeper of sacred knowledge passed down through generations. This card speaks of learning, teachers, rituals and belonging to something bigger than yourself. It may be time to study, to find a mentor or community, or to honour traditions that ground you. If the old rules feel too tight, it can also ask you to examine which beliefs are truly yours.",
    love: "Shared values matter. Commitment, ceremony or meeting the family may be in the air.",
    work: "Learn from those who have walked the path. A course or mentor will help.",
    spirit: "Study your craft. Old practices hold real wisdom when they resonate.",
  },
  6: {
    theme: "a heartfelt choice",
    meaning: "The Lovers shows two people beneath an angel's blessing, but this card is about more than romance. It's about alignment — choosing what you truly value and letting your choices reflect who you are. A meaningful connection or an important decision is before you. Choose from the heart, not from fear or habit. When you're honest with yourself, the right path becomes clear.",
    love: "Deep connection and soul-level attraction. A relationship may reach a new level.",
    work: "Choose the opportunity that fits your values, not just your wallet.",
    spirit: "Integrate the parts of yourself that feel opposed. Self-love comes first.",
  },
  7: {
    theme: "determined momentum",
    meaning: "The Chariot rides forward pulled by two creatures pulling in different directions — and still moves ahead, because the driver holds the reins with will alone. This is a card of victory through focus and self-discipline. You can get where you want to go if you stop scattering your energy. Decide on your direction, keep your eyes on the horizon and don't let doubts steer.",
    love: "Go after what you want, but don't try to control the other person.",
    work: "Push forward — success comes from consistent effort and a clear goal.",
    spirit: "Harness opposing feelings rather than fighting them. Both can carry you.",
  },
  8: {
    theme: "gentle courage",
    meaning: "Strength shows a woman calmly closing the jaws of a lion — not with force, but with patience and love. Your real power is soft and steady. This card asks you to meet challenges, and your own wild emotions, with compassion rather than control. You're braver than you think. Taming fear doesn't mean silencing it; it means holding it kindly while you keep going.",
    love: "Patience and kindness heal. Lead with an open heart.",
    work: "Quiet confidence wins. Stay calm under pressure and you'll earn respect.",
    spirit: "Befriend your inner beast — your desires, anger and passion are sacred too.",
  },
  9: {
    theme: "solitude and reflection",
    meaning: "The Hermit climbs the mountain alone, holding up a lantern with a single star inside. He has stepped away from the noise to find his own light. This card invites a pause: time alone, rest and honest reflection. The answer you're looking for won't be found in more advice or more scrolling. It's already glowing inside you — you just need enough quiet to see it.",
    love: "Time alone isn't loneliness. Know yourself first, and love follows clearly.",
    work: "Step back to think strategically. Deep, focused work beats busy work.",
    spirit: "Meditation, journaling and long walks bring real insight now.",
  },
  10: {
    theme: "a turning point",
    meaning: "The Wheel of Fortune is always turning — what goes up comes down, and what is down rises again. This card marks a shift: luck, timing and destiny are in motion. Something is changing whether you planned it or not. Rather than gripping tightly, move with the turn. Notice the cycles in your life; they hold the lesson, and this one is turning in your favour.",
    love: "Fate is playing its part. An unexpected meeting or change is possible.",
    work: "A lucky break or sudden change. Be ready to say yes.",
    spirit: "Trust divine timing. Everything moves in cycles, just like the moon.",
  },
  11: {
    theme: "truth and balance",
    meaning: "Justice holds the scales in one hand and the sword of truth in the other. This card asks for honesty — with others, and especially with yourself. Every action has consequences, and fairness is being restored. If you've acted with integrity, you'll be rewarded. If something is out of balance, now is the time to take responsibility and set it right. Clear thinking cuts through confusion.",
    love: "Be honest about what's fair in your relationship. Balance giving and receiving.",
    work: "Contracts, agreements and decisions go well when you're clear and fair.",
    spirit: "Karma is at work. Act in line with your values and trust the outcome.",
  },
  12: {
    theme: "surrender and a new perspective",
    meaning: "The Hanged One hangs upside down, calm and even glowing. This isn't punishment — it's a chosen pause. Sometimes progress means stopping, letting go of control and seeing things from a completely different angle. What looked like a dead end may be an invitation to surrender. When you stop forcing, the insight you need can finally arrive.",
    love: "Stop pushing for an answer. Let things unfold without forcing them.",
    work: "A delay is useful. Use the pause to rethink your approach.",
    spirit: "Surrender is a spiritual practice. Let go and let the universe work.",
  },
  13: {
    theme: "transformation",
    meaning: "Death is the most misunderstood card in the deck. It rarely means a physical death — it means an ending that makes space for new life. A chapter, a relationship, a belief or an old version of you is complete. Grieving is natural, but holding on only prolongs the pain. Like the snake shedding its skin, you're becoming something new. Let the old self go with gratitude.",
    love: "A relationship transforms or ends so that something truer can begin.",
    work: "One door closes for a reason. Clear the way for what's next.",
    spirit: "Rebirth is underway. Release old patterns in a ritual of letting go.",
  },
  14: {
    theme: "balance and healing",
    meaning: "Temperance pours water between two cups, blending opposites into something new and harmonious. This card is about moderation, patience and healing that happens slowly. Not too much, not too little. It's a reminder that the middle path is often the magical one, and that real change comes from small, steady steps. Mix your energies wisely and give things time.",
    love: "Harmony and compromise bring you closer. Healing after difficulty.",
    work: "Find the balance between ambition and rest. Steady wins.",
    spirit: "Alchemy is happening within. Tend your body, mind and spirit equally.",
  },
  15: {
    theme: "freedom from attachment",
    meaning: "The Devil shows two figures chained to a pedestal — yet the chains are loose enough to slip off. This card shines a light on what has a hold on you: a habit, a craving, a toxic pattern or a fear that keeps you small. Naming your shadow takes away its power. You hold the key. It can also point to desire and passion — enjoy them, just don't let them own you.",
    love: "Notice obsession or unhealthy patterns. Passion is wonderful; control isn't.",
    work: "Are you trapped by money worries or a job you've outgrown? You have more choice than you think.",
    spirit: "Shadow work is powerful now. Face what you've been avoiding.",
  },
  16: {
    theme: "sudden revelation",
    meaning: "The Tower is struck by lightning and its crown is blown away. Sudden change shakes foundations that weren't strong enough. It can feel frightening, but what falls now was built on illusion, and the truth sets you free. After the storm comes clarity. If you've felt something wasn't right, this card confirms it. Let the walls come down — you'll build something more honest in their place.",
    love: "A truth comes out. Painful, perhaps, but it clears the air.",
    work: "Unexpected change or upheaval. It's making room for a better fit.",
    spirit: "A spiritual awakening. Old beliefs crumble and your vision widens.",
  },
  17: {
    theme: "hope and renewal",
    meaning: "After the Tower comes the Star: a woman kneeling under a sky full of stars, pouring water back into the earth and the pool. This is one of the most healing cards in the deck. Hope returns, faith is restored and you're being gently renewed. Keep your dreams alive and trust that you are guided. You are exactly where you need to be to begin again.",
    love: "Healing and hope. Love feels possible again.",
    work: "Your vision is inspired. Share your gifts — the right people will notice.",
    spirit: "You are guided. Make wishes on the stars and trust they're heard.",
  },
  18: {
    theme: "dreams and the unseen",
    meaning: "The Moon lights a winding path between two towers, with a dog and a wolf howling and a creature crawling from the water. Things are not as they seem. This is the realm of dreams, intuition, illusion and the subconscious. Feelings may be heightened and the way ahead unclear. Don't rush to decide. Pay attention to your dreams and instincts — they see what logic can't.",
    love: "Something's hidden or unclear. Trust your instincts but check the facts.",
    work: "Avoid big decisions while things are foggy. More will be revealed.",
    spirit: "Your intuition and psychic gifts are strong. Work with the moon.",
  },
  19: {
    theme: "joy and vitality",
    meaning: "The Sun shines on a child riding a white horse beneath sunflowers. This is pure joy — success, warmth, confidence and the freedom to be fully yourself. Whatever you've been working towards is blessed with light. Celebrate! Let yourself be seen, play, and soak up the good things. This card brings optimism and energy to everything around it.",
    love: "Happiness, warmth and celebration. Love in full bloom.",
    work: "Success and recognition. Your efforts are paying off.",
    spirit: "Reconnect with your inner child. Joy is a spiritual practice too.",
  },
  20: {
    theme: "an awakening call",
    meaning: "Judgement shows an angel's trumpet waking people from their graves. This is a calling — a moment of awakening when you see your life clearly and rise to meet who you're becoming. Forgive yourself and others for the past; it was part of the path. An important decision or a powerful sense of purpose is arriving. Answer it.",
    love: "A reckoning or a fresh start. Forgive and rise together, or rise alone.",
    work: "Your true calling is knocking. Listen to it.",
    spirit: "Rebirth and purpose. You're ready to step into a higher version of yourself.",
  },
  21: {
    theme: "completion and celebration",
    meaning: "The World shows a dancer inside a laurel wreath, held by the four elements. A cycle is complete — you've learned the lessons, done the work and arrived. This card brings wholeness, accomplishment and a sense of belonging to the whole universe. Celebrate how far you've come and honour the journey. Soon, a new cycle will begin, and you'll start it whole.",
    love: "Fulfilment and commitment. A relationship reaches a beautiful milestone.",
    work: "Goals achieved. Celebrate, then decide what's next.",
    spirit: "You are whole. Travel, expansion and a feeling of oneness with life.",
  },
};

Object.assign(TAROT_DEPTH, MINOR_DEPTH);

/** Spreads for a reading */
export const SPREADS = [
  { key: "one", label: "One card", positions: [{ name: "Your message", hint: "What you most need to hear right now" }] },
  { key: "ppf", label: "Past · Present · Future", positions: [{ name: "Past", hint: "What's behind you and still shaping things" }, { name: "Present", hint: "Where you are now" }, { name: "Future", hint: "Where this is heading if nothing changes" }] },
  { key: "mbs", label: "Mind · Body · Spirit", positions: [{ name: "Mind", hint: "Your thoughts and focus" }, { name: "Body", hint: "Your physical world and energy" }, { name: "Spirit", hint: "Your soul's message" }] },
  { key: "sao", label: "Situation · Action · Outcome", positions: [{ name: "Situation", hint: "What you're facing" }, { name: "Action", hint: "What would help" }, { name: "Outcome", hint: "What can come of it" }] },
] as const;
