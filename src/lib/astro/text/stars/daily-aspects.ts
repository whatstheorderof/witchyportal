/**
 * Daily horoscope add-ons in Yulia's voice.
 * MOON_ASPECT_DAY: the Moon's most exact aspect today to another planet (same sky for everyone).
 * ENERGY_NOTE: closing line about the day's energy level.
 * SKY_RETROGRADE_NOTE: reminder shown while a planet is retrograde.
 */

type AspectPlanet =
  | "Sun"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

type RetroPlanet = Exclude<AspectPlanet, "Sun">;

export const MOON_ASPECT_DAY: Record<
  AspectPlanet,
  { conjunction: string[]; harmonious: string[]; challenging: string[] }
> = {
  Sun: {
    conjunction: [
      "The Moon meets the Sun today, and feelings and will pull in the same direction. What you want and what you need are briefly one thing. Name it clearly, light a gold candle, and take the first step before evening.",
      "A fresh start sits quietly inside today. With the Moon beside the Sun, your energy gathers into one bright point, so don't scatter it. Write a single intention on paper, fold it twice and keep it in your pocket.",
      "Heart and head finally agree. This is a day for honest choices, not compromises you will regret later. I always say the Universe rewards clarity — so say yes only to what truly feels like yours today.",
    ],
    harmonious: [
      "An easy current runs through the day. The Moon flows kindly with the Sun, so what you feel and what you do sit comfortably together. Use this calm to mend a small rift or finish something you began.",
      "Today feels balanced, almost generous. Others respond warmly when you are simply yourself. Wear something golden or yellow, let your natural confidence show, and ask for the help you have been too proud to request.",
      "Inner and outer life are in harmony, so trust your instincts in practical matters. Small decisions come easily now. Clear one corner of your home with salt and sage, and feel how lightly your energy moves afterwards.",
    ],
    challenging: [
      "There is a tug between what you want and what you need today. Don't force a choice in a rush. Sit with the tension for an hour, drink some moon water, and let the honest answer surface in its own time.",
      "Your mood and your plans may disagree, and little frictions with others can follow. Treat it as information, not a battle. Notice what irritates you most — it is pointing straight at something that needs to change.",
      "Feeling pulled in two directions is tiring, so pace yourself. Light a white candle for balance and write down both sides of the argument. Seeing them on paper softens the pressure and shows you a middle road.",
    ],
  },
  Mercury: {
    conjunction: [
      "Thoughts and feelings speak at once today, and words come out fast. Say what you mean, but say it kindly. A journal is your best friend now — write it all down first, before you send anything important.",
      "The mind is busy and curious under this Moon. Conversations carry emotional weight, so listen for what lies beneath the words. Keep a piece of clear quartz on your desk to keep your thinking bright and honest.",
      "Your intuition talks in plain language today. Pay attention to the phrase that repeats in your head, or the message that arrives at exactly the right moment. Witches notice these details. Trust what you hear, and act on it.",
    ],
    harmonious: [
      "Words flow easily, and today is good for the conversation you have been putting off. Speak from the heart and you will be understood. Light a yellow candle beforehand to bring clarity and a gentle tongue.",
      "Ideas arrive quickly and fit together neatly. Use this for planning, writing or learning something new. Make a short list of what truly matters this week, and let your clever, practical side lead the way.",
      "A friendly, chatty energy surrounds you. Reach out to someone you miss — a message sent today lands well. My advice today: say thank you out loud to at least one person who made your life easier.",
    ],
    challenging: [
      "Nerves and overthinking are close to the surface. Not every thought deserves an answer. Put your phone down for an hour, breathe slowly, and come back to that message when your head feels quieter and kinder.",
      "Misunderstandings come easily today, so check what others really meant before you react. Ask one more question than usual. A sprig of rosemary on your desk keeps the mind clear and the tongue careful.",
      "Head says one thing, heart says another. Don't argue with yourself all day. Write both voices down, then go for a walk; movement settles a restless mind, and the right words will find you on the way.",
    ],
  },
  Venus: {
    conjunction: [
      "Softness and pleasure fill the day. The Moon rests beside Venus, so make room for beauty — flowers on the table, music, a meal shared with someone you love. Your warmth is magnetic now, so let it shine.",
      "A sweet, affectionate mood colours everything. It is a lovely day for self-care rituals: a bath with rose petals and a handful of salt, a pink candle, and a kind word to your own reflection in the mirror.",
      "Hearts open easily today. Whether you are single or partnered, let yourself receive affection without questioning it. Wear rose quartz close to your skin, and notice how gently the world responds to you in return.",
    ],
    harmonious: [
      "Charm comes naturally, and people are glad to see you. Use this sweetness for reconciliations, creative work or simply enjoying good company. A drop of rose oil on your wrists sets the tone beautifully for the whole day.",
      "Harmony settles over your relationships today. Small gestures carry great meaning, so send the flowers, write the note, cook the favourite dish. Love in any form grows when it is tended, and today it grows quickly.",
      "Your sense of beauty is sharp and true. Rearrange a room, choose new colours, start a creative project. The Universe is sweetening the day, so accept the pleasure without guilt and share some of it.",
    ],
    challenging: [
      "Feelings may run hotter than usual, and you might want more than others can give right now. Don't measure love by today. Give yourself the tenderness you crave first — a pink candle, a warm drink, a slow evening.",
      "A craving for comfort can tip into overspending or overindulging. Pause before you buy or promise anything. Ask whether you need it or simply want soothing — then find that soothing in something simple and free.",
      "Small jealousies or hurt feelings may surface today. Let them teach you, not rule you. Write what you truly long for on a piece of paper scented with rose, and keep it under your pillow tonight.",
    ],
  },
  Mars: {
    conjunction: [
      "Energy surges today, and so does impatience. The Moon joins Mars, so you feel everything quickly and want to act at once. Put that fire to work: start the hard task, clean deeply, move your body.",
      "Courage is easy to find now. Say the brave thing, but never the cruel thing. Light a red candle in the morning with a clear intention, and let that flame carry your boldness in a useful direction.",
      "Your passion is strong and your fuse is short. Use the force for something you care about rather than scattering it on small irritations. A brisk walk or a dance in your kitchen will clear the excess.",
    ],
    harmonious: [
      "Motivation comes easily, and you have energy to spare. Tackle the task you have been dreading — today it feels lighter than you expect. Carnelian in your pocket keeps the spark steady and your actions confident.",
      "You feel brave and capable without needing to fight. A great day to stand up for yourself calmly, ask for what you deserve, or begin a new routine. Your energy is clean and strong; trust it.",
      "Action and instinct work together today. When you feel the urge to move, move. Gardening, cleaning or exercise turns this fire into real progress, and by evening you will feel proud of what you have done.",
    ],
    challenging: [
      "Tempers run quick today, yours and everyone else's. Don't take the bait. Channel the energy into movement instead — a long walk, a hard workout, a good scrub of the kitchen floor. Fire always needs a task.",
      "Frustration may flare when things don't move fast enough. Count to ten before replying. Then light a red candle, name what really makes you angry, and turn it into one clear action for tomorrow.",
      "Restless energy is looking for a target. Give it one you choose: a project, a boundary, a long-overdue no. I always say anger is information — listen to it, then let it move through your body, not your words.",
    ],
  },
  Jupiter: {
    conjunction: [
      "Optimism swells today, and generosity comes easily. The Moon meets Jupiter, so think big and feel hopeful — but keep one foot on the ground. Write down your widest wish, then circle one realistic step towards it.",
      "Your heart feels open and expansive. Share what you have — time, kindness, a good meal. Light a purple candle for abundance and say thank you for three things before you sleep. Gratitude invites more blessings in.",
      "Faith in yourself grows stronger today. This is a lovely moment to study, to travel in your mind, or to ask a wise friend for advice. Just watch for promising too much; enthusiasm is precious, so spend it well.",
    ],
    harmonious: [
      "Luck feels a little closer today, mostly because you are open to it. Say yes to invitations and new ideas. Keep a citrine in your pocket, and notice how often doors open when you simply knock.",
      "A generous, easy mood surrounds you. People are kind, and you are kinder still. Use this warmth to offer encouragement to someone who needs it; what you give today returns to you in its own good time.",
      "Hope and good sense work together now. Plan something that excites you — a trip, a course, a fresh chapter. The Universe likes a confident request, so state your intention out loud and mean every word.",
    ],
    challenging: [
      "Everything feels like it should be bigger today, including your appetite and your plans. Don't overcommit. Choose one generous gesture instead of ten, and you will feel the abundance without the exhaustion that follows.",
      "Restlessness can make your ordinary life look small. It isn't. Notice what you want more of, then honour it in a modest way today — a new book, a longer walk, a candle lit for future adventures.",
      "Big promises come easily, so take care with them. Enthusiasm is beautiful, but your time is not endless. Before agreeing to anything new, sleep on it. My advice today: keep tomorrow's energy for tomorrow.",
    ],
  },
  Saturn: {
    conjunction: [
      "The mood is serious and a little heavy today. That is not a bad thing — it is a day for responsibility and quiet effort. Finish one solid task, and you will feel the ground firm beneath your feet.",
      "Feelings may seem cooler, as if wrapped in winter wool. Respect the need for structure. Tidy your space, pay attention to your commitments, and light a black candle to protect your boundaries while you work.",
      "Old lessons come back for review today. Don't scold yourself; look at how far you have come. Write down one rule you live by and ask whether it still serves you. Then keep it, or let it go.",
    ],
    harmonious: [
      "Steady, patient energy makes this a wonderful day for building. Commitments feel natural, and discipline comes easily. Start the routine you keep postponing, and trust that small daily effort is its own quiet magic.",
      "Wisdom and calm sit well together today. You can handle practical matters without stress. Organise your week, sort your papers, set a boundary kindly. Black tourmaline by the door keeps the energy grounded.",
      "Maturity comes easily now, and others may lean on you. Offer help without carrying everything yourself. A grounded day like this is perfect for long-term plans — plant the seed now and tend it patiently.",
    ],
    challenging: [
      "You may feel tired, lonely or blocked today, as if the world asks too much of you. Slow down and look after yourself. Rest is not failure. One small, careful step forward is more than enough for now.",
      "Doubts and duties weigh more than usual. Don't let them convince you that you are not enough. Write down what is truly yours to carry, safely burn the paper listing the rest, and breathe out slowly.",
      "Delays and strict voices — inside or outside — can test your patience today. Treat them as teachers. Ask what this pressure is building in you. Strength grown on a day like this will hold for a long time.",
    ],
  },
  Uranus: {
    conjunction: [
      "Surprises are in the air, and your feelings may shift suddenly. Let yourself be curious rather than unsettled. Break one small routine today — a new route, a new recipe — and see what wakes up inside you.",
      "Your need for freedom is strong right now. Don't cling to what feels stale. Open a window, change the music, rearrange a shelf. Fresh air in your space invites fresh ideas into your mind and heart.",
      "Intuition strikes like lightning today. A sudden insight may arrive in the most ordinary moment, so write it down immediately. Not every flash is an instruction, but some are the keys you have been searching for.",
    ],
    harmonious: [
      "Something new feels exciting rather than frightening today. Say yes to an unusual invitation or an unexpected idea. A little freedom refreshes your spirit, and you may discover a side of yourself you had forgotten.",
      "Inventive energy flows easily now. Try a fresh approach to an old problem; the strange solution may be exactly the right one. Keep amethyst near you to stay open to sudden, clever insights.",
      "Friends and like-minded people bring sparks today. Reach out to your community, online or in person. Original thoughts shared now can change something real, so speak up and let your unique view be heard.",
    ],
    challenging: [
      "Restlessness and sudden changes may shake your plans. Don't fight every surprise. Stay flexible, leave space in your schedule, and keep a grounding stone like hematite close when things move too fast for comfort.",
      "You may feel rebellious or easily irritated by rules today. Ask what freedom you are really craving. Then give yourself a safe way to taste it, rather than breaking something you will need tomorrow.",
      "Nerves can feel electric, as if you cannot sit still. Move, stretch, dance, breathe deeply. When the charge settles, you will see clearly which change is truly needed and which was only noise.",
    ],
  },
  Neptune: {
    conjunction: [
      "Dreamy, tender energy washes over the day. Boundaries soften, and intuition is wide open. Keep a journal by your bed tonight, because dreams may carry messages. During the day, keep your plans gentle and simple.",
      "Your sensitivity is heightened, so you may feel other people's moods as your own. Cleanse with a salt bath or a sprinkle of salt at your door. Protect your energy first, then enjoy the magic of imagination.",
      "Music, art and the sea speak loudly to your soul today. Let yourself drift a little. Creative and spiritual work flourishes now; the practical details can wait until your head is clearer tomorrow morning.",
    ],
    harmonious: [
      "Compassion flows easily today, and your intuition is soft but accurate. Trust the quiet feeling about a person or situation. Light a silver or lilac candle and meditate for ten minutes; the answers come gently.",
      "This is a beautiful day for spiritual practice, tarot, or simply daydreaming by water. Imagination is a gift, not an escape. Write a small poem or sketch a vision of what you hope for.",
      "Kindness feels natural, and small acts of care ripple outwards. Help someone without expecting anything back. Moon water sprinkled on your hands before meditation helps you hear the Universe more clearly today.",
    ],
    challenging: [
      "Things may feel foggy or confusing today, and it is easy to see what you wish rather than what is. Don't rush into anything big. Rest, drink water, and wait for clearer skies before you choose.",
      "Your energy is porous, so other people's troubles can drain you. Kindness is good; rescuing everyone is not. Set a gentle boundary, cleanse with salt and smoke, and give your own heart some attention.",
      "Doubt and daydreams might tangle together today. Look for facts before you believe the worst or the best. A clear quartz on your bedside table helps separate true intuition from worry while you sleep.",
    ],
  },
  Pluto: {
    conjunction: [
      "Intensity runs deep today. Emotions you have buried may rise, asking to be seen. Don't push them away. Write them out, then burn the page safely and let the smoke carry the heaviness out of your life.",
      "Your power is strong and quiet now. Use it to transform something: a habit, a fear, a pattern in how you love or work. Light a dark red candle, promise yourself one brave change, then begin.",
      "There is magic in endings today. Something old is ready to go so something truer can grow. Clear out a drawer or a cupboard as a symbol. As you let objects go, let the old feelings go too.",
    ],
    harmonious: [
      "Inner strength comes easily, and you can look at difficult truths without fear. This is a powerful day for releasing old hurts. Hold obsidian in your palm and focus on exactly what you are ready to let go.",
      "Your intuition sees beneath the surface today. Trust what you notice about people and situations, but use the insight kindly. Deep conversations go well now and can bring you much closer to someone.",
      "A quiet transformation is under way. You may feel more determined than usual to change something important. Set your intention firmly, write it down, and keep it hidden — some magic works best in secret.",
    ],
    challenging: [
      "Power struggles or strong emotions may surface today. Don't let anyone control your mood, and don't try to control theirs. Step back, breathe, and protect your energy with salt in the corners of your room.",
      "Obsessive thoughts can loop more than usual today. Break the cycle with movement and fresh air. Then ask what you are really afraid of losing. Facing it gently takes away much of its power over you.",
      "Old fears might feel very real today. Remember they are memories, not prophecies. Light a black candle for protection and say aloud: I release what no longer serves me. Then let the evening be soft.",
    ],
  },
};

export const ENERGY_NOTE: { high: string[]; steady: string[]; low: string[] } = {
  high: [
    "Your energy runs high today, so start the task you have been avoiding and finish it before dusk.",
    "Plenty of fire in the tank today. Spend it on something you care about, not on small arguments.",
    "Energy is bright and quick. Move your body early, and you will think more clearly all day long.",
    "A strong current carries you today. Ride it boldly, but leave a little time to rest before bed.",
    "You feel charged and ready. Say yes to action, and let a red or orange candle mark your intention.",
  ],
  steady: [
    "Your energy is steady today. Keep a calm pace, finish what you start, and trust slow, honest progress.",
    "An even, reliable rhythm suits you now. Small consistent steps will take you further than one big leap.",
    "Energy is balanced today. Divide your time fairly between work and pleasure, and both will feel easier.",
    "Nothing too fast, nothing too slow. A good day to keep promises and tend your routines with care.",
    "Steady energy is a gift. Use it for practical tasks, and save one quiet moment for your own magic.",
  ],
  low: [
    "Energy may dip today. Rest without guilt, sip something warm, and do only what truly matters to you.",
    "A quieter day for body and spirit. Slow down, look after yourself, and let the rest of the world wait.",
    "Low energy is a message, not a failure. Light a white candle, breathe deeply and recharge gently.",
    "Keep plans light today. An early night and a short list will protect the power you still have.",
    "Your batteries need refilling. Spend time near water or plants, and let the Universe hold the rest.",
  ],
};

export const SKY_RETROGRADE_NOTE: Record<RetroPlanet, string> = {
  Mercury:
    "Mercury is retrograde, so double-check messages, dates and travel plans before you rely on them. Old contacts may reappear. Use this time to review, rewrite and repair rather than launch. Keep a notebook close and read everything twice.",
  Venus:
    "While Venus is retrograde, matters of the heart and of value ask for review, not rush. Old feelings may resurface. Reflect before big purchases or dramatic makeovers, and rediscover what you truly find beautiful and worth keeping.",
  Mars:
    "Mars is retrograde, so energy can feel stuck or come out sideways. Don't force new battles or rush into risky starts. Revisit unfinished projects, rebuild your stamina slowly, and let frustration move through your body rather than your words.",
  Jupiter:
    "With Jupiter retrograde, growth turns inwards. This is a time to review your beliefs, hopes and plans rather than chase bigger ones. Ask what abundance really means to you, and nourish the gifts you already hold in your hands.",
  Saturn:
    "Saturn is retrograde, asking you to revisit your responsibilities and boundaries. Old lessons return for a second look. Strengthen foundations quietly, finish what you promised, and let go of rules that no longer protect you. Patience is your magic now.",
  Uranus:
    "While Uranus is retrograde, change happens on the inside first. Notice where you feel restless or trapped, and imagine freedom before acting on it. Small inner shifts now prepare the bigger breakthroughs that come later. Trust the quiet rebellion.",
  Neptune:
    "Neptune is retrograde, and the fog slowly begins to lift. Illusions you held may become clear, sometimes gently, sometimes sharply. Let truth be a gift. Keep up your spiritual practice, journal your dreams, and trust what you finally see.",
  Pluto:
    "With Pluto retrograde, deep transformation works beneath the surface. Old patterns, fears and power struggles may ask to be faced again. I always say shadows lose their grip once you look at them directly. Release what you have outgrown, and stand taller.",
};
