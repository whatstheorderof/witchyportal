/**
 * Quizzes (/quizzes): "Which witch are you?" and "Is Feral Goddess Rising
 * for me?". Original Witchy Portal copy in Yulia's voice (see VOICE.md).
 * The witch quiz is gender-neutral; the retreat quiz is about a women's
 * retreat and only uses facts from content/retreats/awaken-the-wild-goddess.md.
 */

export type WitchType = "sea" | "green" | "moon" | "hearth" | "crystal" | "wild";
export const WITCH_TYPES: WitchType[] = ["sea", "green", "moon", "hearth", "crystal", "wild"];

export interface QuizQuestion<V> { q: string; options: { text: string; value: V }[] }

export interface WitchText {
  title: string;
  keywords: string[];
  summary: string;
  about: string;
  gifts: string;
  practice: string;
  watch: string;
  /** Correspondence slugs: one crystal, one herb, one candle colour. */
  kit: [string, string, string];
}

export const WITCH_QUIZ_INTRO = `Every witch has a home element, the place where their magic comes most naturally. Some feel it at the edge of the sea, some with their hands in the soil, some under the stars or at the kitchen table. Answer seven quick questions from the heart, without overthinking, and find out which kind of witch you are.`;

export const WITCH_QUIZ: QuizQuestion<WitchType>[] = [
  {
    q: "What does your perfect evening look like?",
    options: [
      { value: "hearth", text: "Cooking a big meal for people I love" },
      { value: "sea", text: "A walk along the shore as the tide comes in" },
      { value: "wild", text: "Dancing until my feet hurt" },
      { value: "moon", text: "Stargazing with a blanket and a flask of tea" },
      { value: "crystal", text: "A long bath with candles and my favourite stones" },
      { value: "green", text: "Pottering in the garden or wandering in the woods" },
    ],
  },
  {
    q: "Which place feels like home to your soul?",
    options: [
      { value: "green", text: "An old forest after the rain" },
      { value: "moon", text: "A rooftop under a clear night sky" },
      { value: "sea", text: "An empty beach at dawn" },
      { value: "crystal", text: "A quiet room full of light" },
      { value: "wild", text: "A bonfire on the sand" },
      { value: "hearth", text: "A warm kitchen with herbs drying above the stove" },
    ],
  },
  {
    q: "Choose one thing for your altar.",
    options: [
      { value: "moon", text: "A well-loved tarot deck" },
      { value: "hearth", text: "A wooden spoon and a jar of honey" },
      { value: "crystal", text: "A sparkling cluster of quartz" },
      { value: "sea", text: "A shell filled with sea salt" },
      { value: "green", text: "A bundle of fresh herbs" },
      { value: "wild", text: "A drum or a rattle" },
    ],
  },
  {
    q: "When life gets hard, what do you do?",
    options: [
      { value: "wild", text: "Put on loud music and move it out of my body" },
      { value: "sea", text: "Get into water: a swim, a bath, a long shower" },
      { value: "green", text: "Go outside and put my hands in the soil" },
      { value: "hearth", text: "Bake something and call a friend" },
      { value: "moon", text: "Check what the Moon and the stars are doing" },
      { value: "crystal", text: "Hold a stone, close my eyes and breathe" },
    ],
  },
  {
    q: "What do your friends come to you for?",
    options: [
      { value: "crystal", text: "Good energy and a sense of calm" },
      { value: "wild", text: "Courage, laughter and a push to be brave" },
      { value: "moon", text: "A reading or a deep talk about the universe" },
      { value: "green", text: "Practical remedies and down-to-earth advice" },
      { value: "sea", text: "Peace when everything feels stormy" },
      { value: "hearth", text: "Comfort, good food and a hug" },
    ],
  },
  {
    q: "Which season makes you feel most alive?",
    options: [
      { value: "green", text: "Spring, when everything starts to grow" },
      { value: "sea", text: "High summer by the water" },
      { value: "hearth", text: "Autumn, with its harvest and soups" },
      { value: "moon", text: "The long, dark nights of midwinter" },
      { value: "crystal", text: "The first frost, when everything sparkles" },
      { value: "wild", text: "Midsummer nights that never seem to end" },
    ],
  },
  {
    q: "What do you want more of in your life?",
    options: [
      { value: "sea", text: "Ease and flow" },
      { value: "wild", text: "Freedom to be myself" },
      { value: "hearth", text: "A sense of belonging" },
      { value: "green", text: "Room to grow" },
      { value: "crystal", text: "Clarity and calm" },
      { value: "moon", text: "Deeper wisdom" },
    ],
  },
];

export const WITCHES: Record<WitchType, WitchText> = {
  sea: {
    title: "Sea witch",
    keywords: ["Water", "Tides", "Cleansing"],
    summary: "Your magic lives at the water's edge. You feel the tides in your body and heal through salt, waves and letting go.",
    about: `Sea witches are ruled by water. You are emotional in the most beautiful way: deep, intuitive and always moving, like the tide. The sea calms you when nothing else can, and you probably feel the pull of the Moon more than you would admit.

Your magic is about flow and release. Salt baths, shells, sea water, the sound of waves: these are your tools. You know that what the sea takes away, it often brings back in another form.`,
    gifts: `You are a natural healer of hearts. People feel calmer around you, and you know how to hold space for big feelings without being frightened of them.`,
    practice: `On the next waning Moon, write what you want to release on a piece of paper and dissolve it in a bowl of warm salt water. Pour the water away on the earth or down the drain and wash your hands in clean water.`,
    watch: `Like the sea, you can be pulled by every mood around you. Keep a little salt by the door and cleanse your energy after busy days.`,
    kit: ["moonstone", "lavender", "blue"],
  },
  green: {
    title: "Green witch",
    keywords: ["Earth", "Herbs", "Growth"],
    summary: "Your magic grows from the earth. You heal with herbs and plants and feel most yourself among trees.",
    about: `Green witches are rooted in the earth. You notice the first buds of spring, you know which plant soothes which ache, and a walk among trees can reset your whole mood. Your magic is practical, patient and alive.

Your tools are herbs, flowers, soil and seeds. A sprig of rosemary by the door, a pot of basil on the windowsill, a tea blended with intention: this is where your power lives.`,
    gifts: `You are grounding and wise. You remind people to slow down, eat well, rest and trust that growth takes time.`,
    practice: `Plant a seed for something you want to grow in your life. Each time you water it, say your wish out loud. When it sprouts, thank it.`,
    watch: `You can get stuck in your ways and resist change. Remember that every garden needs pruning before it can bloom again.`,
    kit: ["green-aventurine", "rosemary", "green"],
  },
  moon: {
    title: "Moon witch",
    keywords: ["Cycles", "Stars", "Intuition"],
    summary: "Your magic follows the Moon and the stars. You live by cycles and read the sky like a map.",
    about: `Moon witches are guided by the sky. You know what phase the Moon is in without checking, you feel the full Moon in your sleep, and astrology and tarot speak to you like old friends. Your magic is about timing and intuition.

New Moons are for your intentions, full Moons for gratitude and release. You are a natural reader of signs, and your dreams are often messages.`,
    gifts: `You are a guide. People come to you to understand what is happening to them, and you help them see the bigger picture.`,
    practice: `Keep a Moon journal. On each New Moon write three intentions, and on each full Moon read them back and write what has changed.`,
    watch: `You can live so much in the stars that you forget your body. Ground yourself with food, walks and bare feet on the earth.`,
    kit: ["labradorite", "mugwort", "silver"],
  },
  hearth: {
    title: "Hearth witch",
    keywords: ["Home", "Kitchen", "Love"],
    summary: "Your magic lives at home. You cast spells with food, warmth and love, and everyone feels safe in your space.",
    about: `Hearth witches make magic out of everyday life. Your kitchen is your altar, your wooden spoon is your wand and every meal you cook carries love and intention. Your home feels like a hug.

Your magic is about protection, abundance and belonging. A pinch of cinnamon for luck, bay leaves in the cupboard, a candle in the window: small rituals that keep the people you love safe.`,
    gifts: `You are the heart of every circle. You bring people together and make them feel they belong.`,
    practice: `Next time you cook, stir clockwise and whisper what you want the food to bring: comfort, love, courage. Notice how people feel after they eat.`,
    watch: `You give so much care that you can forget to receive it. Let someone cook for you sometimes.`,
    kit: ["citrine", "bay-leaf", "orange"],
  },
  crystal: {
    title: "Crystal witch",
    keywords: ["Energy", "Light", "Healing"],
    summary: "Your magic works through energy. You feel the vibration of stones, spaces and people, and love to cleanse and heal.",
    about: `Crystal witches are sensitive to energy. You can walk into a room and feel what happened there, and you probably have stones in your pockets, by your bed and on every windowsill. Your magic is about clarity and healing.

You use crystals, candles, sound and light to shift the energy of a space or a person. Cleansing is second nature to you, and you love a beautiful, calm altar.`,
    gifts: `You are a healer of energy. People leave your presence feeling lighter, clearer and more themselves.`,
    practice: `Choose one crystal to carry this week. Cleanse it in moonlight, hold it each morning and set one intention into it. At the end of the week, notice what has changed.`,
    watch: `Being so sensitive, you can soak up other people's energy. Protect yourself before busy days and cleanse after them.`,
    kit: ["clear-quartz", "sage", "white"],
  },
  wild: {
    title: "Wild witch",
    keywords: ["Fire", "Dance", "Freedom"],
    summary: "Your magic is untamed. You raise power through movement, music and fire, and you never fit into a box.",
    about: `Wild witches are pure fire. You feel magic most when you are moving: dancing, drumming, running into the sea, laughing at the stars. You don't follow rules for the sake of it, and you trust your instinct above everything.

Your magic is about courage, passion and freedom. Fire rituals, ecstatic dance and loud, joyful celebrations are your spells. You remind everyone that being fully alive is sacred.`,
    gifts: `You are a spark. You give other people permission to be braver, freer and more themselves.`,
    practice: `Put on a song that makes your body want to move. Light a red candle, dance until the song ends and let go of anything you are holding. Then blow out the candle with a wish.`,
    watch: `Your fire can burn out if you never rest. Make time for stillness so your flame keeps burning bright.`,
    kit: ["carnelian", "cinnamon", "red"],
  },
};

/* "Is Feral Goddess Rising for me?" */

export type RetreatResult = "ready" | "calling" | "notyet";

export const RETREAT_QUIZ_INTRO = `Feral Goddess Rising is a seven-day retreat for women by the sea: tarot, crystal and candle rituals, sea and nature ceremonies, island boat adventures and dancing under the stars. It is a big step, and I want it to be the right one for you. Answer six honest questions to see whether this is your moment.`;

export const RETREAT_QUIZ: QuizQuestion<number>[] = [
  {
    q: "What is drawing you to this retreat right now?",
    options: [
      { value: 2, text: "I'm healing from a painful break-up or a string of toxic relationships" },
      { value: 2, text: "I feel lost and unsure of my next chapter" },
      { value: 2, text: "I'm craving to finally find myself" },
      { value: 2, text: "I'm ready to step into my full power in life and business" },
      { value: 1, text: "Mostly curiosity" },
    ],
  },
  {
    q: "How do you feel about the sea?",
    options: [
      { value: 2, text: "It's where I feel most alive" },
      { value: 1, text: "I love being near it, even if I don't always go in" },
      { value: 0, text: "I'd rather stay away from the water" },
    ],
  },
  {
    q: "Dancing freely on the sand under the stars?",
    options: [
      { value: 2, text: "Yes! I can't wait" },
      { value: 1, text: "It makes me nervous, but I'd love to try" },
      { value: 0, text: "That's really not for me" },
    ],
  },
  {
    q: "Tarot readings, crystal and candle rituals?",
    options: [
      { value: 2, text: "I already love them" },
      { value: 2, text: "They're new to me, but I'm curious" },
      { value: 0, text: "I'm not interested in that side of things" },
    ],
  },
  {
    q: "How do you feel about journaling and sharing in a small circle?",
    options: [
      { value: 2, text: "I'd love to open up and be held by a group" },
      { value: 1, text: "I'd need a little time, but I'm open to it" },
      { value: 0, text: "I'd rather keep my inner world private" },
    ],
  },
  {
    q: "Could you give yourself seven days away?",
    options: [
      { value: 2, text: "Yes, I need this" },
      { value: 1, text: "I'd need to plan ahead, but I could make it happen" },
      { value: 0, text: "Not this year" },
    ],
  },
];

export const RETREAT_RESULTS: Record<RetreatResult, { title: string; text: string }> = {
  ready: {
    title: "This is your moment",
    text: `Everything you've told me says you are ready. You are called by the sea, open to ritual and ready to let your wild self out to dance. Feral Goddess Rising was made for women like you, and I would love to welcome you into the circle.

Join the waitlist below and you'll be the first to hear when dates and prices are announced.`,
  },
  calling: {
    title: "The call is there",
    text: `Part of you is ready and part of you is nervous, and that is exactly how most transformations begin. You don't have to be fearless to join, only willing.

Join the waitlist below to hear about dates first, and write any questions in the note. I'm happy to answer them before you decide.`,
  },
  notyet: {
    title: "Maybe not yet, and that's okay",
    text: `From your answers, this retreat might not be the right fit for you right now. It is full of sea, dance, ritual and sharing, and it is meant to feel like a celebration, not something to get through.

You can still start your journey with a personal reading or the free tools on the site. And if something changes, join the waitlist below. There is no commitment, and you'll simply hear when new dates are announced.`,
  },
};

export const retreatResult = (score: number): RetreatResult => (score >= 10 ? "ready" : score >= 6 ? "calling" : "notyet");
