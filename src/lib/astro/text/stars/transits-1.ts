/**
 * Personal transit readings, in Yulia's voice: transiting Moon, Sun and Mercury
 * to the reader's natal planets and angles. Keys are "TransitingPlanet>NatalPoint".
 * harmonious = trine/sextile; challenging = square/opposition.
 * Original Witchy Portal copy. Time-neutral, because a Moon transit lasts hours
 * and a Sun or Mercury transit lasts days.
 */

export const TRANSIT_1: Record<string, { conjunction: string; harmonious: string; challenging: string }> = {
  "Moon>Sun": {
    conjunction:
      "The Moon rests on your natal Sun, and for a little while your feelings and your will speak with one voice. You know what you want and why it matters. Use this clear moment: light a gold candle, write one sentence about what you are building, and take the first small step before the mood moves on. Trust it.",
    harmonious:
      "A soft, easy current runs between today's Moon and your Sun. Heart and head agree, so small decisions feel natural and people warm to you without effort. While this lasts, do the thing you usually talk yourself out of — the call, the invitation, the first page. Energy that flows this easily is meant to be spent, not saved.",
    challenging:
      "Your moods and your goals pull in different directions while the Moon presses on your natal Sun. You may feel tired of your own plans, or snap at someone over nothing. Don't decide anything big from this place. Drink water, step outside, sprinkle a pinch of salt at your door. By tomorrow the tension becomes useful honesty.",
  },
  "Moon>Moon": {
    conjunction:
      "The Moon returns to the place it held when you were born — your monthly emotional new beginning. Feelings sit close to the surface and your instincts are sharp. My advice today: listen to what your body wants, eat something that comforts you, and fill a glass of moon water. Ask it quietly for the feeling you want this month to carry.",
    harmonious:
      "Today's Moon greets your natal Moon kindly, and you feel at home in your own skin. Rest comes easily, and so does care for others. Use this gentle window to tend your nest: change the sheets, cook something slow, call someone who knows the real you. Small comforts now refill a well you will draw from later.",
    challenging:
      "Old feelings may stir while the Moon squares or opposes your natal Moon, and small things touch tender places. You might crave comfort and resent needing it at the same time. Be gentle with yourself. Take a salt bath or simply wash your hands slowly, imagining the water carrying the restlessness away. Feelings that move are feelings that heal.",
  },
  "Moon>Mercury": {
    conjunction:
      "Thoughts and feelings travel together today and in the hours around it, as the Moon crosses your natal Mercury. Words come straight from the heart, which makes this a good moment for a letter, a journal page or a conversation you have been circling. Write freely without editing. What you put on paper now tells you what you truly think.",
    harmonious:
      "Your mind and your instincts cooperate while the Moon flows towards your natal Mercury. You find the right words for delicate things, and others find it easy to talk to you. Use it: clear your messages, ask the question, say thank you properly. A pale blue candle on your desk keeps the conversation honest and kind.",
    challenging:
      "The Moon rubs against your natal Mercury, and it is easy to read a message the wrong way or say more than you meant. Feelings cloud the facts for a while. Pause before you reply, and read it twice. If something must be said, say it simply. Clarity returns quickly once you stop arguing with your own nerves.",
  },
  "Moon>Venus": {
    conjunction:
      "Sweetness gathers around you as the Moon meets your natal Venus. You want beauty, affection and a little pleasure, and you deserve all three. Wear something you love, put fresh flowers by the bed, share a treat with someone dear or with yourself. A pink candle and a few rose petals in a dish invite more of this softness to stay.",
    harmonious:
      "A tender, sociable mood surrounds you while the Moon smiles at your natal Venus. People are drawn to your warmth, and small kindnesses come back to you quickly. Use the moment to mend a little rift, to say how much someone means to you, or to make your space prettier. Love grows where it is noticed.",
    challenging:
      "What you need and what you want may not match today, as the Moon strains against your natal Venus. You could feel overlooked, or reach for comfort that does not truly comfort. Don't spend your feelings on proving your worth. Hold a piece of rose quartz, name what you need, and give a little of it to yourself first.",
  },
  "Moon>Mars": {
    conjunction:
      "The Moon lights the fuse of your natal Mars, and feelings turn quickly into action. You are braver than usual, and also quicker to flare. Put the heat somewhere useful: a brisk walk, a hard task, a red candle lit for courage before a difficult step. Act on what matters to you, but let small irritations pass without a fight.",
    harmonious:
      "Emotion and drive work as a team while the Moon supports your natal Mars. You know what you want and you have the energy to go after it. This is a fine window to start a task you have been dreading or to stand up for yourself calmly. Move your body, say yes to the challenge, and enjoy your own strength.",
    challenging:
      "Tempers run close to the surface as the Moon presses on your natal Mars. Little frustrations feel personal, and patience is thin, yours and everyone else's. Don't push. Channel the fire instead: clean something thoroughly, dance it out, write the angry letter and burn it safely. Spent wisely, this restless energy clears the air rather than scorching it.",
  },
  "Moon>Jupiter": {
    conjunction:
      "Generosity and hope swell as the Moon crosses your natal Jupiter. You feel lucky in the small ways that count — a kind word, a good table, a door left open. Share it. Invite someone, give freely, and write down one wish in green ink. Just watch the urge to promise more than you can comfortably give while this lasts.",
    harmonious:
      "The Moon blesses your natal Jupiter with an easy, optimistic glow. Faith in yourself comes more naturally, and people respond to your good humour. Use it to plan something that excites you, to study, or to reach out to someone who could open a new road. A citrine or a sprig of sage on your table keeps the luck flowing.",
    challenging:
      "Feelings swell larger than the situation today, as the Moon squares or opposes your natal Jupiter. You may want too much of everything — food, plans, reassurance. Enjoy, but measure. Ask yourself whether you truly need it or simply want to feel full. Gratitude for what is already here is the quickest way to feel abundant again.",
  },
  "Moon>Saturn": {
    conjunction:
      "A quieter, more serious mood settles in as the Moon meets your natal Saturn. You may feel the weight of your responsibilities, or a little alone with them. Don't fight it. Use this sober energy to sort one practical matter properly. A black candle for protection and a written list beside it turn heaviness into a steady foundation.",
    harmonious:
      "Your feelings steady themselves while the Moon supports your natal Saturn. You can be calm, patient and sensible without losing your warmth. This is a good moment for routines, careful conversations and keeping promises. Tidy one corner of your life — a drawer, a budget, a calendar. Order created now gives your spirit room to breathe tomorrow.",
    challenging:
      "You may feel heavy, criticised or held back while the Moon strains against your natal Saturn. Old doubts whisper that you are not enough. Don't believe them. Do one small, solid thing you can finish, then rest. Hold a smooth black stone and breathe slowly. Discipline is not punishment — it is how you build something that lasts.",
  },
  "Moon>Ascendant": {
    conjunction:
      "The Moon rises over your Ascendant, and your feelings show on your face more than usual. People sense your mood before you speak, so let it be a kind one. This is a good time to check in with yourself, refresh your look and notice how you meet the world. A splash of moon water on your wrists softens everything.",
    harmonious:
      "Others find you easy to approach today and in the hours around it, as the Moon flows to your Ascendant. Your instincts about people are sharp, and first impressions go well. Use this for meeting someone new, a gentle chat with a neighbour or simply walking with your head high. Warmth that you show now comes straight back.",
    challenging:
      "Other people's moods may reach you more than usual while the Moon squares or opposes your Ascendant. You might feel exposed, or pulled between your own needs and someone else's. Set a soft boundary. Before you go out, imagine a circle of white light around you. You can be caring without carrying everything that comes your way.",
  },
  "Moon>Midheaven": {
    conjunction:
      "Your public life and your private feelings meet as the Moon crosses your Midheaven. You may feel noticed, or emotional about your work and your direction. Let your heart show in what you do — it makes you trusted. Light a gold candle at your desk, name one goal aloud, and act on it before the feeling fades.",
    harmonious:
      "The Moon supports your Midheaven, and work feels more personal in a good way. You know instinctively what people need from you, and your care shows. This is a lovely window to help a colleague, to share an idea or to remember why you chose your path. Small, heartfelt effort now is seen and remembered.",
    challenging:
      "Home and ambition tug at each other while the Moon squares or opposes your Midheaven. You may feel torn between what is expected of you and what you need. Don't try to please everyone. Choose the priority that feels truest today, and say it clearly. Balance is not a perfect split — it is honest choosing.",
  },
  "Sun>Sun": {
    conjunction:
      "The Sun returns to the place it held at your birth — your solar return, your personal new year. Your energy is renewed, and the Universe asks what you want to grow next. Celebrate yourself without apology. Light a gold candle, write three intentions for the year ahead, and keep the paper somewhere you will see it every day.",
    harmonious:
      "The Sun flows easily towards your natal Sun, and you feel more like yourself. Confidence rises quietly, and others respond well to your natural style. While this lasts, take a step that shows who you are — share your work, wear the bold colour, speak your mind kindly. Your own light is the best charm you own.",
    challenging:
      "The Sun pushes against your natal Sun, and you may feel tested, a little drained or questioned by others. This is a checkpoint, not a setback. Ask yourself honestly which efforts still feel true. Adjust one plan, rest well, and stand by what matters. Pressure like this shows you where you are strong and where to grow.",
  },
  "Sun>Moon": {
    conjunction:
      "Today and in the days around it, the Sun shines directly on your natal Moon, bringing your feelings into the light. What you need becomes obvious, both to you and to others. It is a beautiful time for honest talks at home and for caring for your inner world. Place a bowl of water in the sun, then drink it with intention.",
    harmonious:
      "The Sun warms your natal Moon gently, and you feel at peace with yourself. What you want and what you need line up, so choices are simpler and relationships feel easier. Use this harmony to strengthen your bonds at home, to cook for someone, or simply to rest without guilt. A contented heart is real magic.",
    challenging:
      "Your inner needs and your outer life pull apart while the Sun squares or opposes your natal Moon. You might feel busy yet unfulfilled, or misunderstood by someone close. Don't hide what you feel. Name it plainly, then do one thing that nourishes you. A white candle by the bed helps settle what the day stirred up.",
  },
  "Sun>Mercury": {
    conjunction:
      "The Sun meets your natal Mercury, and your mind is bright and clear. Ideas come fast and people want to hear them. This is a fine time to write, to present, to sign up for a short course or to say what you have been rehearsing. Keep a notebook close. One idea you catch now could steer the season.",
    harmonious:
      "Thinking flows easily while the Sun supports your natal Mercury. You express yourself well, solve small problems quickly and find people more willing to listen. Use it: send the pitch, have the useful conversation, plan the trip. A yellow candle on your desk helps your words carry warmth as well as sense. Speak up — you are heard.",
    challenging:
      "Your ego and your words may trip over each other while the Sun squares or opposes your natal Mercury. It is easy to defend an opinion too hard or to take feedback personally. Listen first, then reply. Read everything twice before you send it. A little humility now turns a stubborn debate into a clever solution.",
  },
  "Sun>Venus": {
    conjunction:
      "The Sun lights up your natal Venus, and you feel attractive, sociable and open to pleasure. Love, friendship and beauty all come more easily in the days around it. Accept the invitation. Dress in something you adore, share a meal, buy flowers for your table. A pink candle and a dab of rose oil on your wrists amplify your charm.",
    harmonious:
      "A sweet, harmonious glow surrounds you as the Sun flows to your natal Venus. People enjoy your company, and you find pleasure in simple things. This is a lovely time for dates, creative play, reconnecting with friends or making your home prettier. Let yourself receive compliments and kindness. You do not have to earn every good thing.",
    challenging:
      "The Sun strains against your natal Venus, and you may feel your needs in love or pleasure going unnoticed. Don't seek approval by giving away too much. Ask instead what would make you feel valued, and offer it to yourself first. A bath with rose petals and a pinch of salt restores your sense of worth.",
  },
  "Sun>Mars": {
    conjunction:
      "Energy surges as the Sun meets your natal Mars. You are bold, driven and ready to act, and you get more done than usual. Start the project, take the lead, move your body hard. Just keep the fire friendly — impatience burns bridges. Light a red candle for courage and direct the heat towards one goal, not every person.",
    harmonious:
      "Your drive and your sense of self work together while the Sun supports your natal Mars. You feel capable, and effort pays off. This is a good window to tackle something physical, to compete, or to ask for what you want directly. Act with confidence, not force. The Universe backs courage that is clear and kind.",
    challenging:
      "Friction rises as the Sun squares or opposes your natal Mars. You may feel provoked, rushed or blocked, and it is easy to push too hard. Don't charge into arguments. Pour the energy into something that can take it — exercise, a big clean, a hard task. Courage is strongest when you choose your battles wisely.",
  },
  "Sun>Jupiter": {
    conjunction:
      "Optimism and generosity glow as the Sun meets your natal Jupiter. You feel bigger, braver and more hopeful, and doors open more easily in the days around it. Dream generously, then take one real step towards the dream. Write your wish on a bay leaf and keep it in your purse. Just don't overpromise in the excitement.",
    harmonious:
      "The Sun supports your natal Jupiter, and faith comes naturally — in yourself, in others and in the Universe. This is a fine time to learn, travel, teach or reach out to someone who can help you grow. Say yes to what expands you. A green candle and a few cinnamon sticks on the table keep the good fortune warm.",
    challenging:
      "Excess is the trap while the Sun squares or opposes your natal Jupiter. You may say yes to too much, expect too much or spend energy you don't have. Enthusiasm is wonderful, but measure it. Choose the one opportunity that truly fits, and let the rest go gracefully. Wisdom is knowing when enough is enough.",
  },
  "Sun>Saturn": {
    conjunction:
      "The Sun meets your natal Saturn, and life asks you to be serious for a while. Responsibilities feel heavier, and you may notice where you need more structure. Don't resent it. Choose one area to strengthen properly — a routine, a promise, a plan. A black candle and a written list give that steady energy a home.",
    harmonious:
      "Discipline feels easy while the Sun supports your natal Saturn. You can work patiently, make sensible plans and earn the respect of people who matter. This is a good time for long-term commitments and practical choices. Do the dull but important task first. What you build now with care holds firm for a long time.",
    challenging:
      "You may feel tested, restricted or doubted while the Sun squares or opposes your natal Saturn. Obstacles seem to appear just as you gain momentum. Don't give up. Slow down, check your foundations and fix what needs fixing. Hold a piece of smoky quartz. Resistance today is shaping a stronger, wiser version of your plans.",
  },
  "Sun>Ascendant": {
    conjunction:
      "The Sun rises over your Ascendant, and you step into the light. People notice you, your energy is renewed and it is a natural moment to begin again. Refresh your look, start a new habit, introduce yourself to something new. Light a gold candle in the morning and walk out as though the day belongs to you.",
    harmonious:
      "You shine easily while the Sun flows to your Ascendant. Confidence is natural, first impressions are good and people find you warm and open. Use this window to meet someone new, to apply, to show your face. Stand tall and smile first. The way you carry yourself now opens more doors than you might expect.",
    challenging:
      "Other people take centre stage while the Sun squares or opposes your Ascendant, and you may feel overshadowed or pulled in many directions. Relationships ask for attention. Don't lose yourself trying to please. Listen generously, then state your own view calmly. A circle of salt around a white candle reminds you where you end and others begin.",
  },
  "Sun>Midheaven": {
    conjunction:
      "The Sun reaches your Midheaven, the highest point of your chart, and your work and reputation step into the spotlight. Effort becomes visible. Take credit for what you have achieved, ask for the opportunity, show your best work. Light a gold candle at your desk and say your ambition out loud. The Universe hears a clear request.",
    harmonious:
      "The Sun supports your Midheaven, and your ambitions move forward with less resistance. Colleagues, clients and teachers respond well to you. This is a good time to plan your next step, to network gently or to ask a mentor for advice. Small professional moves made now have a lasting, steady glow.",
    challenging:
      "Work and home, ambition and rest, seem to compete while the Sun squares or opposes your Midheaven. You may feel stretched or unsure of your direction. Don't panic. Ask which goal still feels truly yours, and drop the ones you only carry for others. A clear priority is the strongest protection against burnout.",
  },
  "Mercury>Sun": {
    conjunction:
      "Mercury meets your natal Sun, and your mind is busy with ideas about who you are and where you are going. Conversations feel important and your words carry weight. Write down your plans, share them with someone you trust and pay attention to what others say about you. Messages arriving now often hold a useful clue.",
    harmonious:
      "Thought and identity line up nicely while Mercury supports your natal Sun. You speak with confidence, learn quickly and explain yourself well. Use this window for interviews, pitches, writing or simply saying what you mean. Light a yellow candle as you work. Clear words spoken now help others see the real you.",
    challenging:
      "Mercury squares or opposes your natal Sun, and words may come out sharper than you intend. Misunderstandings are likely if you rush. Slow down, listen fully and check the facts before you defend a position. Don't take every comment personally. A little patience turns a clash of opinions into a conversation that teaches you something.",
  },
  "Mercury>Moon": {
    conjunction:
      "Mercury crosses your natal Moon, and your feelings want words. It is a good moment for honest talks with family, for journaling or for reaching out to someone you miss. You may think about the past more than usual. Write a letter you do not have to send. Naming a feeling softens its grip.",
    harmonious:
      "Head and heart communicate kindly while Mercury supports your natal Moon. You can talk about delicate things without drama, and you understand others' moods instinctively. Use it to mend a misunderstanding, plan something cosy at home or simply share how you feel. A cup of chamomile and an open conversation work wonders.",
    challenging:
      "Logic and emotion argue while Mercury squares or opposes your natal Moon. You may overthink your feelings or feel brushed off when you try to explain them. Don't force the conversation. Write first, speak later. A bowl of salt water on the windowsill draws off the mental noise so you can hear your own heart again.",
  },
  "Mercury>Mercury": {
    conjunction:
      "Mercury returns to its birth place in your chart, and your mind feels fresh. This is your mental new start for the year: a time to learn, plan and decide how you want to think and speak. Begin a notebook, a course or a reading list. What you set your mind to now develops quickly.",
    harmonious:
      "Your mind works smoothly while Mercury supports your natal Mercury. Ideas connect, conversations flow and practical tasks get done. Use the window for paperwork, planning, short trips or learning something useful. Keep a little citrine near your desk. A sharp, curious mind is one of the witch's oldest tools — sharpen yours now.",
    challenging:
      "Your thinking feels scattered or stubborn while Mercury squares or opposes your natal Mercury. Plans shift, messages cross and decisions feel harder than they should. Don't force answers. Make lists, double-check details and leave room for delays. A clear desk and a short walk do more for your mind than another hour of worry.",
  },
  "Mercury>Venus": {
    conjunction:
      "Mercury meets your natal Venus, and sweet words come easily. It is a lovely time for compliments, love notes, creative writing and gentle negotiations. Say what you appreciate about someone, out loud or on paper. Share a playlist, write a poem, plan a pretty outing. Words spoken with love now leave a lasting warmth.",
    harmonious:
      "Charm flows into your words while Mercury supports your natal Venus. Social plans go smoothly and people respond well to your tact. This is a good window to smooth over a disagreement, to arrange something pleasurable or to put creative ideas into words. A pink candle on your table keeps the conversation tender.",
    challenging:
      "Mercury squares or opposes your natal Venus, and it may be hard to say what you feel without sounding too much or too little. Small comments land tenderly. Don't chase reassurance through endless messages. Speak simply, then let the words settle. A rose quartz in your pocket reminds you that kindness includes kindness to yourself.",
  },
  "Mercury>Mars": {
    conjunction:
      "Mercury meets your natal Mars, and your mind becomes quick, bold and direct. You can argue your case brilliantly, and you may also speak before thinking. Use this energy for decisions, debates and getting things moving. Write the plan and act on it. Just keep your tone friendly — sharp words fly faster than you expect.",
    harmonious:
      "Thought turns smoothly into action while Mercury supports your natal Mars. You are decisive, clear and persuasive. This is a good window for negotiations, problem-solving and tasks that need courage and brains together. Say what you want directly and follow through. Your words have real power now, so aim them well.",
    challenging:
      "Words become weapons easily while Mercury squares or opposes your natal Mars. Irritation sharpens your tongue and conversations can turn into contests. Don't fire off the first reply. Take a breath, take a walk, then respond. Light a blue candle to cool the heat. Calm words now win more than clever ones.",
  },
  "Mercury>Jupiter": {
    conjunction:
      "Mercury meets your natal Jupiter, and your mind opens wide. Big ideas, good news and inspiring conversations are all around you today and in the days around it. Read, study, plan a journey, talk to someone wise. Just check the details before you commit. Write your biggest idea on paper and keep it under a green candle.",
    harmonious:
      "Optimism shapes your thinking while Mercury supports your natal Jupiter. You see possibilities clearly, and people are receptive to your plans. Use this window to teach, learn, publish or reach out to new connections. Speak generously and listen widely. A good idea shared now can travel further than you imagine.",
    challenging:
      "Your mind leaps ahead of the facts while Mercury squares or opposes your natal Jupiter. You may promise too much, exaggerate or overlook the small print. Enthusiasm is lovely, but slow down. Read twice, ask questions, sleep on big decisions. A simple, honest plan beats a grand one built on wishful thinking.",
  },
  "Mercury>Saturn": {
    conjunction:
      "Mercury meets your natal Saturn, and your thinking turns careful and serious. This is a good time for planning, contracts, structure and hard truths spoken kindly. Don't rush. Write a clear list, double-check figures and commit only to what you can honour. Thoughts may feel heavy, but they lead you to solid ground.",
    harmonious:
      "Clear, disciplined thinking is yours while Mercury supports your natal Saturn. You concentrate well, make practical plans and speak with authority. Use this window for study, detailed work and conversations that need patience. Finish what you started. A black candle on your desk anchors your focus and helps your words carry weight.",
    challenging:
      "Doubt and pessimism may creep into your thinking while Mercury squares or opposes your natal Saturn. Conversations feel blocked, and your own inner critic grows loud. Don't believe every gloomy thought. Break problems into small steps and tackle one at a time. Patience now turns frustration into a sensible plan you can trust.",
  },
  "Mercury>Ascendant": {
    conjunction:
      "Mercury crosses your Ascendant, and you feel talkative, curious and quick on your feet. People notice your words and your wit. This is a good time to introduce yourself, to post, to pitch or to start a conversation you have been putting off. Speak with confidence. Your voice is part of your magic.",
    harmonious:
      "Communication flows easily while Mercury supports your Ascendant. You come across as clear and friendly, and others find it easy to talk to you. Use it for meetings, interviews, messages and short trips. Say what you mean with a smile. A yellow candle near the door invites good conversations into your home.",
    challenging:
      "Mercury squares or opposes your Ascendant, and other people's opinions may press on you more than usual. Conversations can feel like debates, and you may feel misread. Don't over-explain yourself. Listen, consider, then state your view once, calmly. A ring of salt by the door keeps unhelpful chatter from following you home.",
  },
  "Mercury>Midheaven": {
    conjunction:
      "Mercury meets your Midheaven, and work-related news, conversations and ideas take centre stage. Your words carry professional weight now. Pitch the idea, write the proposal, speak up in meetings. Prepare well and speak plainly. Keep a notebook for work ideas beside your bed — the clearest ones may arrive just before sleep.",
    harmonious:
      "Your thinking supports your ambitions while Mercury flows to your Midheaven. You communicate well with colleagues and can explain your goals clearly. This is a good window for applications, planning your next step or asking for feedback. Words spoken with purpose now help others see your direction.",
    challenging:
      "Mercury squares or opposes your Midheaven, and mixed messages about work or direction may unsettle you. Plans shift and instructions change. Don't panic or overreact. Ask clear questions, write things down and keep your goals simple. A calm, organised mind is your best protection while the noise settles.",
  },
};
