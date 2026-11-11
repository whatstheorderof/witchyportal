/**
 * Numerology (/numerology): life path numbers 1–9, 11, 22, 33, the other
 * core numbers and personal years. Original Witchy Portal copy in Yulia's
 * voice (see VOICE.md). For reflection, not prediction. Gender-neutral.
 */
import { msg } from "@/i18n/config";
import type { NumKey } from "@/lib/numerology";

export interface NumberText {
  title: string;
  keywords: string[];
  summary: string;
  path: string;
  love: string;
  work: string;
  shadow: string;
  ritual: string;
}

export const NUM_INTRO = `Numerology is one of the oldest kinds of magic: the belief that numbers carry a vibration, and that the numbers hidden in your birth date and your name describe the energy you came here with. Your life path number is the most important of them. It is worked out from your full date of birth, and it describes the road you are walking, the lessons that keep finding you and the gifts you bring to everyone you meet.

I love numerology because it is so simple. You don't need a birth time or a chart, only a date and a name. Use it the way you would use a tarot card: as a mirror. Read your number, notice what feels true, and keep what helps you.`;

export const NUM_HOW = `To find your life path number, reduce the month, the day and the year of your birth to a single digit each, add them together and reduce again. For 14 July 1992: the month is 7, the day is 1 + 4 = 5, the year is 1 + 9 + 9 + 2 = 21, which becomes 3. Then 7 + 5 + 3 = 15, and 1 + 5 = 6. Life path 6.

If you reach 11, 22 or 33 along the way, stop there. These are the master numbers, and they carry a stronger, more demanding version of the energy of 2, 4 and 6.

Your name numbers use the Pythagorean alphabet, where A, J and S are 1, B, K and T are 2, and so on up to I and R as 9. Use the full name you were given at birth. The vowels give your soul urge, the consonants your personality, and all the letters together your expression number. Here Y always counts as a consonant.`;

export const NUM_NOTE = `Numerology is offered for reflection and fun, not as a prediction or a replacement for professional advice. Your name and date of birth are worked out in your browser and never stored.`;

/** What each core number describes (shown with the calculator results). */
export const CORE_NUMBERS = {
  lifePath: { label: msg("Life path number"), text: `Your life path is the big one: the road you are here to walk and the lessons that keep returning until you learn them.` },
  birthday: { label: msg("Birthday number"), text: `Your birthday number is a gift you were born with, a talent that comes easily to you.` },
  expression: { label: msg("Expression number"), text: `Your expression number, from all the letters of your name, shows your natural abilities and how you express yourself in the world.` },
  soul: { label: msg("Soul urge number"), text: `Your soul urge, from the vowels of your name, is what your heart quietly longs for.` },
  personality: { label: msg("Personality number"), text: `Your personality number, from the consonants of your name, is the first impression you give before people know you well.` },
  personalYear: { label: msg("Personal year"), text: `Your personal year runs through a nine-year cycle and describes the theme of this calendar year for you.` },
} as const;
export type CoreKey = keyof typeof CORE_NUMBERS;

export const PERSONAL_YEARS: Record<number, string> = {
  1: `A year of new beginnings. Plant seeds, start the thing you have been putting off and say yes to fresh chapters. What you begin now grows for nine years.`,
  2: `A slower, softer year of patience, partnership and listening. Seeds are growing underground. Nurture your relationships and trust the timing.`,
  3: `A joyful, social year. Create, celebrate, speak up and let yourself be seen. Say yes to invitations and to your own playfulness.`,
  4: `A year of foundations and steady work. Organise, build routines, look after your body and your home. The effort you make now holds you up later.`,
  5: `A year of change, movement and freedom. Travel, try new things and loosen your grip on plans. Expect the unexpected and enjoy it.`,
  6: `A year of love, home and responsibility. Family, partnerships and caring for others come to the centre. Remember to include yourself in that care.`,
  7: `A quiet, inward year for study, rest and spiritual growth. Spend time alone, read, meditate and listen to your intuition. Answers come from within.`,
  8: `A year of power, ambition and reward. Step into your authority, ask for what you are worth and take your finances seriously. Hard work pays off.`,
  9: `A year of endings and release. Let go of what you have outgrown: habits, places, even people. Clear the ground, because a new cycle begins next year.`,
};

export const NUMBERS: Record<NumKey, NumberText> = {
  "1": {
    title: "The Pioneer",
    keywords: ["Independence", "Courage", "New beginnings"],
    summary: "The born leader and self-starter, here to be brave, go first and trust their own path.",
    path: `Life path 1 is the number of beginnings. You came here to stand on your own feet, to have ideas and act on them, and to show other people that it is possible to go first. You are happiest when you are building something that is yours.

Your lesson is self-belief. Life will keep putting you in situations where you have to choose for yourself rather than wait for permission. Every time you trust your own instinct, your path opens a little wider.`,
    love: `In love you need a partner who admires your fire and gives you room to breathe. You love loyally and protectively, but you won't shrink yourself to keep anyone. Let people help you sometimes: needing someone is not weakness.`,
    work: `You shine when you lead, start projects or work for yourself. You are full of ideas and hate being micromanaged. Choose work where you can make decisions and see the results of your own courage.`,
    shadow: `On a hard day the 1 can become stubborn, impatient or lonely, insisting on doing everything alone. Pride can stop you asking for help. Remember that true leaders lift others up.`,
    ritual: `On a New Moon, light a red or white candle and write one thing you will begin this month. Sign it with your name as if it were a contract with yourself.`,
  },
  "2": {
    title: "The Peacemaker",
    keywords: ["Harmony", "Sensitivity", "Partnership"],
    summary: "The gentle diplomat and intuitive heart, here to connect, listen and bring people together.",
    path: `Life path 2 is the number of partnership. You feel everything: the mood of a room, the words left unsaid, the tension before anyone else notices it. You came here to bring harmony, to support and to remind the world that softness is a strength.

Your lesson is balance. You give so naturally that you can forget yourself. Your path asks you to keep your gentleness while learning to say what you need.`,
    love: `Love matters deeply to you, and you are a devoted, attentive partner. You need tenderness, kind words and someone who notices your efforts. Choose people who give as much as they take.`,
    work: `You thrive in teams, in caring and creative roles, and anywhere that needs a mediator. You notice the details others miss. You may be the power behind someone else's success: make sure you are credited for it.`,
    shadow: `The 2 can become a people-pleaser, oversensitive or afraid of conflict, swallowing feelings to keep the peace. Too much of that turns into resentment. A clear, kind "no" is also an act of love.`,
    ritual: `On a Full Moon, place two candles side by side, one for you and one for the people you love. Light yours first. Say: "I care for myself as I care for them."`,
  },
  "3": {
    title: "The Creator",
    keywords: ["Joy", "Expression", "Creativity"],
    summary: "The bright storyteller and artist, here to create, communicate and spread joy.",
    path: `Life path 3 is the number of self-expression. Words, colours, music, laughter: you are here to make things and share them. People feel lighter around you, and you have a gift for turning ordinary moments into something magical.

Your lesson is focus and courage. You have so many talents that it is easy to scatter them, or to hide them for fear of being judged. Your path opens when you finish what you start and let yourself be seen.`,
    love: `You love with warmth, fun and romance. You need a partner who laughs with you, celebrates your creativity and talks to you about everything. Boredom is your enemy in love.`,
    work: `You belong in creative, social and communicative work: writing, art, performance, teaching, social media, anything with an audience. You do your best work when you are enjoying yourself.`,
    shadow: `The 3 can scatter energy, avoid difficult feelings with jokes or become self-critical when their art isn't perfect. Let yourself feel sadness too. Your deepest creativity comes from your whole heart.`,
    ritual: `Write or draw something every morning for three days, without judging it. On the third day, read it aloud to the Moon or to someone you trust.`,
  },
  "4": {
    title: "The Builder",
    keywords: ["Stability", "Dedication", "Foundations"],
    summary: "The steady and reliable one, here to build strong foundations that last.",
    path: `Life path 4 is the number of foundations. You are the person others rely on: practical, loyal and hardworking. You came here to build something solid, whether that is a home, a business, a family or a way of life that will hold for years.

Your lesson is flexibility. You like order and plans, and life sometimes refuses to follow them. Your path asks you to stay rooted while learning to bend, like a tree in the wind.`,
    love: `In love you are faithful, protective and committed. You show love through actions more than words: fixing, planning, turning up. You need a partner who is honest and dependable, and who appreciates the quiet ways you care.`,
    work: `You excel at anything that needs patience and structure: managing, crafting, building, organising, finance, healing work with a clear method. You finish what others abandon.`,
    shadow: `The 4 can become rigid, overworked or afraid of change, holding on so tightly to control that joy slips away. Rest is part of building too. Let yourself play.`,
    ritual: `Bury a small crystal or a written wish in a plant pot or in the earth, and water it once a week. Each time, name one thing you are building in your life.`,
  },
  "5": {
    title: "The Free Spirit",
    keywords: ["Freedom", "Adventure", "Change"],
    summary: "The adventurer and explorer, here to experience everything life has to offer.",
    path: `Life path 5 is the number of freedom. You came here to experience: new places, new people, new ideas, all five senses at once. You are curious, magnetic and adaptable, and you teach others that change is not to be feared.

Your lesson is healthy freedom. Without direction, freedom becomes restlessness. Your path asks you to find the commitments that make you feel more free, not less.`,
    love: `You need a partner who is also an adventure: someone curious, spontaneous and secure enough to give you space. You love passionately. When you feel trapped you pull away, so choose love that lets you grow.`,
    work: `You thrive in work that is varied, social and on the move: travel, sales, media, events, anything with variety. Routine drains you. Freelance or flexible work often suits you best.`,
    shadow: `The 5 can become impulsive, scattered or overindulgent, running from feelings by chasing the next thing. If you keep leaving, ask what you are leaving behind.`,
    ritual: `Once a month, do something you have never done before, however small: a new road, a new food, a new song. Afterwards, write down what it taught you.`,
  },
  "6": {
    title: "The Nurturer",
    keywords: ["Love", "Responsibility", "Home"],
    summary: "The caring heart of every circle, here to love, protect and create beauty and home.",
    path: `Life path 6 is the number of love and responsibility. You are the one who remembers birthdays, cooks for friends and holds people when they cry. You came here to nurture, to make homes and communities feel safe, and to bring beauty into the world.

Your lesson is boundaries. You feel responsible for everyone's happiness, and that is a heavy load. Your path asks you to care for others without disappearing into their needs.`,
    love: `Love is at the centre of your life. You are devoted, romantic and generous, and you dream of a home full of warmth. You need a partner who looks after you as tenderly as you look after them.`,
    work: `You belong in caring, teaching, healing, beauty, design and anything that serves a community. You are trusted instantly. Work that feels meaningful matters more to you than status.`,
    shadow: `The 6 can become controlling, self-sacrificing or perfectionist, believing that love must be earned by giving. You don't have to fix everyone. Let people meet you halfway.`,
    ritual: `Make your home a little altar: fresh flowers, a pink candle and something that reminds you of the people you love. Light the candle and add your own photo to the altar.`,
  },
  "7": {
    title: "The Seeker",
    keywords: ["Wisdom", "Intuition", "Mystery"],
    summary: "The mystic and deep thinker, here to search for truth and trust their inner knowing.",
    path: `Life path 7 is the number of the seeker. You are drawn to the hidden side of life: spirituality, nature, books, the stars, the questions that don't have easy answers. You need time alone the way others need company, and your intuition is often startlingly accurate.

Your lesson is trust. You can analyse everything and still feel unsure. Your path asks you to balance the mind with faith, and to share the wisdom you gather instead of keeping it locked away.`,
    love: `You love deeply but let few people in. You need a partner who respects your solitude, enjoys deep conversations and doesn't take your quiet personally. Once you trust someone, you are completely loyal.`,
    work: `You excel at research, writing, science, healing, spiritual work and anything that rewards depth. You need peace and independence to do your best work. Busy, shallow environments drain you.`,
    shadow: `The 7 can become isolated, cynical or lost in thought, pushing people away to avoid being hurt. Not everything can be solved alone. Let someone sit with you in the mystery.`,
    ritual: `Spend one evening a week in silence: no phone, only a candle, a cup of tea and a journal. Ask one question and write whatever comes, without editing.`,
  },
  "8": {
    title: "The Powerhouse",
    keywords: ["Ambition", "Abundance", "Authority"],
    summary: "The ambitious achiever, here to master the material world and use power wisely.",
    path: `Life path 8 is the number of power and abundance. You have a natural authority, a strong will and the ability to turn ideas into results. You came here to succeed, to create wealth and influence, and to learn how to use them with integrity.

Your lesson is balance between the material and the spiritual. Money and success come and go in big waves for the 8. Your path asks you to build wealth that serves your soul, and to share it.`,
    love: `You love strongly and protectively, and you are drawn to capable, confident partners. You may express love by providing. Remember to also offer your softness, your time and your vulnerability.`,
    work: `You belong in leadership, business, finance, law, property and anywhere you can be in charge. You think big and you deliver. You will often end up running the place, or owning it.`,
    shadow: `The 8 can become workaholic, controlling or obsessed with status, measuring worth in money and wins. Power without heart feels empty. Your real strength is in how you lift others.`,
    ritual: `On a New Moon, place a coin, a bay leaf and a green candle on your table. Write the amount you want to earn or save, and one way you will share your abundance.`,
  },
  "9": {
    title: "The Old Soul",
    keywords: ["Compassion", "Wisdom", "Completion"],
    summary: "The wise and generous old soul, here to serve, forgive and inspire.",
    path: `Life path 9 is the number of completion, the last of the single digits, and it carries a little of all the others. You often feel older than your age. You are compassionate, artistic and idealistic, and you came here to give to the world and to help it heal.

Your lesson is letting go. Life brings you many endings, and each one is asking you to release the past with grace. Your path opens when you forgive, including yourself.`,
    love: `You love generously and see the best in everyone, sometimes more than they deserve. You need a partner who shares your values and your big heart. Be careful not to love people for who they could become.`,
    work: `You thrive in work that makes a difference: healing, charity, the arts, teaching, travel, spiritual guidance. You need to feel that your work serves something bigger than yourself.`,
    shadow: `The 9 can become martyr-like, distant or stuck in the past, giving until there is nothing left. Endings hurt you deeply. Release with love, and let yourself receive as much as you give.`,
    ritual: `On a waning Moon, write down what you are ready to release and burn the paper safely in a fireproof bowl. Scatter the cooled ashes on the earth or in moving water.`,
  },
  "11": {
    title: "The Intuitive",
    keywords: ["Intuition", "Inspiration", "Spiritual light"],
    summary: "A master number: the visionary and channel, here to inspire and illuminate others.",
    path: `Life path 11 is the first master number, a higher octave of the 2. You are deeply intuitive, sensitive and often psychic, with a sense that you came here for something important. People feel uplifted by you, sometimes without knowing why.

Your lesson is grounding. This number carries a lot of energy, and it can feel like anxiety until you learn to channel it. Your path asks you to trust your inner voice and share what it tells you.`,
    love: `You need a soul connection, not just a partnership. You feel your partner's emotions as your own, so choose someone gentle and emotionally honest. Protect your energy, even in love.`,
    work: `You are drawn to spiritual, healing, creative and teaching work, anything where you can inspire people. You may feel like a messenger. Your sensitivity is your gift, not something to hide.`,
    shadow: `The 11 can become anxious, overwhelmed or full of self-doubt, feeling the weight of a purpose they can't yet name. Many 11s also live as a 2 until they are ready. Rest, ground yourself and take one small step at a time.`,
    ritual: `Each morning, stand barefoot on the earth or the floor for eleven breaths. Imagine roots growing from your feet, then ask: "What do I need to know today?"`,
  },
  "22": {
    title: "The Master Builder",
    keywords: ["Vision", "Legacy", "Manifestation"],
    summary: "A master number: the visionary builder, here to turn big dreams into reality.",
    path: `Life path 22 is the most powerful of the master numbers, a higher octave of the 4. You combine the intuition of the 11 with the practical strength of the 4, which means you can dream enormous dreams and actually build them. Your work can outlive you.

Your lesson is trusting the size of your vision. The pressure of this number can make you either reach for something huge or freeze in fear. Your path asks you to build step by step, with patience.`,
    love: `You need a steady, supportive partner who believes in your vision and keeps you grounded. You are loyal and practical in love. Make sure your big plans leave space for tenderness.`,
    work: `You belong in work with lasting impact: founding, architecture, organisations, community projects, anything that changes many lives. You are a natural leader of big teams and big ideas.`,
    shadow: `The 22 can become overwhelmed, controlling or paralysed by expectations, their own or others'. Many 22s live as a 4 for years first. You don't have to build it all at once.`,
    ritual: `Draw your dream as a house: the foundations, the walls, the roof. Write on each part what it needs. Choose one brick to lay this week.`,
  },
  "33": {
    title: "The Healer",
    keywords: ["Compassion", "Healing", "Service"],
    summary: "A master number: the master teacher, here to heal and uplift through love.",
    path: `Life path 33 is the rarest master number, a higher octave of the 6. It is the number of the master teacher: someone who heals through love, compassion and example. People come to you for comfort, and you carry their stories with great tenderness.

Your lesson is self-care. This number asks you to give, and if you give without filling your own cup, you burn out. Your path opens when you heal yourself first.`,
    love: `You love with your whole being and want a relationship that feels sacred. You need a partner who nurtures you back, and who understands that your heart is also there for the world.`,
    work: `You are drawn to healing, teaching, counselling, the arts and any vocation of service. Your presence alone can calm a room. You teach most powerfully by how you live.`,
    shadow: `The 33 can become a martyr, take on others' pain or set impossible standards for themselves. Many 33s express their gifts first as a 6. You can't pour from an empty cup.`,
    ritual: `Run a warm bath with rose petals and a handful of salt. Light a pink candle and, as you soak, say three things you love about yourself. Healers need healing too.`,
  },
};
