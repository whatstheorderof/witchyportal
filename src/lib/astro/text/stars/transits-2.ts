/**
 * Personal transit readings, part 2: transiting Venus, Mars and Jupiter
 * to the reader's natal planets and angles. Keys are "TransitingPlanet>NatalPoint".
 * harmonious = trine/sextile; challenging = square/opposition.
 * Second person, time-neutral ("while this lasts"). Original Witchy Portal copy.
 */

export const TRANSIT_2: Record<string, { conjunction: string; harmonious: string; challenging: string }> = {
  "Venus>Sun": {
    conjunction:
      "Venus sits right on your natal Sun, and you glow. People find you easier to like, and you find yourself easier to like too. While this lasts, let yourself be seen: wear the colour you love, say yes to the invitation, accept the compliment without arguing. Light a pink candle and write one thing you adore about yourself. Keep it close.",
    harmonious:
      "A soft, friendly current runs between transiting Venus and your Sun. Charm comes without effort, and small pleasures land at exactly the right moment. Use this sweetness well. Mend a cooled friendship, make something beautiful, ask kindly for what you want. A bath with rose petals and a pinch of salt will help you soak up the gentleness while it is here.",
    challenging:
      "What you want and what you need are not quite speaking to each other. With Venus pulling against your Sun, you might over-please, overspend or hide your real opinion to keep the peace. Don't. Pleasant is not the same as true. Choose one honest preference and state it calmly, a rose quartz in your hand. Real harmony begins with being yourself.",
  },
  "Venus>Moon": {
    conjunction:
      "Transiting Venus rests on your natal Moon, and your heart wants comfort, softness and closeness. It is a lovely time to nest, to cook something tender, to spend an evening with the people who feel like home. Let yourself be cared for. Place a bowl of moon water beside your bed with a rose petal floating in it, and sleep beside that peace.",
    harmonious:
      "Your feelings and your sense of beauty are speaking the same language now. Venus flatters your natal Moon, so emotional conversations go gently and affection flows both ways. Reach out to someone you miss while the current is this kind. Bring flowers into your home, even a single stem. I always say the heart settles fastest in a beautiful room.",
    challenging:
      "Sweets, shopping, a little more reassurance than usual — this Venus aspect to your natal Moon makes you crave comfort. Notice the hunger beneath it. What do you truly feel? For as long as this pull lasts, nourish yourself in ways that outlive the moment. Write your feelings down by a white candle, then do one kind thing for your body. Soft, not indulgent.",
  },
  "Venus>Mercury": {
    conjunction:
      "Your words carry honey while Venus meets your natal Mercury. Letters, messages and awkward requests all sound kinder coming from you. Use it. This is the moment to write the thank-you note, smooth a misunderstanding or pitch an idea with charm. Before you speak, hold a piece of blue lace agate and picture your words arriving warm and clear.",
    harmonious:
      "Graceful words come naturally when Venus flows with your natal Mercury. Conversations feel pleasant, negotiations soften and creative writing finds a lovely rhythm. Say what you appreciate out loud — people need to hear it, and you need to say it. Write a few lines of poetry or a sweet message to someone today. Kind words are a spell of their own.",
    challenging:
      "Careful: you may soften the truth until it disappears. Venus is at odds with your Mercury, and saying what people want to hear feels easier than saying what you mean. Aim for kind and clear together, not one instead of the other. Write the honest version first, then polish the edges. Truth spoken gently still keeps all of its power.",
  },
  "Venus>Venus": {
    conjunction:
      "Venus returns to her own place in your chart — your Venus return. A new chapter begins in how you love, value and adorn yourself. Take stock: what brings you real pleasure now, and what only used to? Light a green or pink candle, write your desires for the coming year and keep the paper folded inside your jewellery box.",
    harmonious:
      "Life tastes a little sweeter while transiting Venus harmonises with your natal Venus. Your eye is sharp, your heart is open and small joys find you easily. Treat yourself with intention: one lovely thing, chosen carefully, rather than many. Make your space pretty. Spend time with people who make you laugh. Pleasure is not frivolous — it restores your energy.",
    challenging:
      "Old patterns in love and self-worth rise up for a look as Venus squares or opposes her natal place. You may feel undervalued, or notice that you give far more than you receive. Don't sulk over it. Use it. Write down what you truly deserve in affection and respect, read it aloud by a pink candle, then act on one line.",
  },
  "Venus>Mars": {
    conjunction:
      "Desire wakes up. Transiting Venus touches your natal Mars, and attraction, creativity and confidence run warm through you. Whether you are single or partnered, this is a time to feel alive in your body and go after what draws you. Dance in your kitchen. Light a red candle beside a pink one and let passion and tenderness meet.",
    harmonious:
      "Charm and drive blend beautifully now. With Venus flowing to your natal Mars, you can ask without pushing and win people over without force. Use that magnetism for something you genuinely want — a creative project, a bold proposal, an evening that makes your heart race. A drop of rose oil on each wrist makes a fine little ritual for it.",
    challenging:
      "Frustration in love or friendship can flare quickly when Venus grates against your Mars. What you want may clash with what pleases others. Breathe before you react. This tension is pure energy, so move it — walk, dance, clean the house hard. Then talk. Choose honesty over sulking and play over power games, and you will be glad you did.",
  },
  "Venus>Jupiter": {
    conjunction:
      "Generosity is in the air. Venus meets your natal Jupiter, and your heart feels large, warm and open-handed. Celebrations, kind gestures and joyful company come naturally while this lasts. Enjoy them fully, with one eye on excess. Share a meal with people you love. Place a citrine near your front door and invite happiness to stay a while.",
    harmonious:
      "Here is a lovely blessing: transiting Venus in easy aspect to your natal Jupiter. Optimism comes easily, and people respond warmly to your ideas and your company. Say yes to beauty, learning and connection. Plan a small trip, sign up for a class or gather friends around your table. Write a gratitude list by a gold candle and let it grow.",
    challenging:
      "Too much sugar, too many promises, too many plans — everything looks lovely under this Venus square or opposition to your Jupiter, so you want all of it. Pause. Pick one indulgence and enjoy it slowly rather than ten in a rush. Abundance feels best when it is chosen. Keep a bay leaf in your purse as a quiet reminder.",
  },
  "Venus>Saturn": {
    conjunction:
      "Love feels serious, steady and perhaps a little reserved while Venus meets your natal Saturn. You may value loyalty over sparkle now. That is wise. Invest in what lasts: a long friendship, a careful plan, a commitment to yourself. Light a black candle for protection and a pink one for tenderness, and let them burn side by side.",
    harmonious:
      "Affection and responsibility work well together while transiting Venus supports your natal Saturn. Promises made now tend to hold. Give structure to something you love — a regular date with yourself, a jar for a dream, a schedule for your creative work. Steady devotion is its own kind of romance, and the Universe rewards it.",
    challenging:
      "You may feel unloved, lonely or held back from pleasure as Venus pulls against your natal Saturn. Old fears about your worth can whisper loudly. Don't believe all of them. Be patient and kind with yourself until this passes. Do one small, disciplined thing that shows self-respect. Rub a little rose oil into your hands at night, and rest.",
  },
  "Venus>Ascendant": {
    conjunction:
      "Venus crosses your Ascendant, and you look and feel lovely. Your presence is softer and more inviting, and people warm to you quickly. It is a perfect moment to refresh your style, cut your hair or step into a social space you have been avoiding. Walk tall. Carry a small rose quartz in your pocket for extra grace.",
    harmonious:
      "First impressions go your way while transiting Venus smiles on your Ascendant. Meetings, interviews and gatherings feel easy, and the right words arrive without trying. So show up. Wear something that makes you happy, smile at strangers and let new people in. A spritz of rose water before you leave home is a sweet little charm.",
    challenging:
      "Notice where you give yourself away. Venus squares or opposes your Ascendant, and you may worry too much about how you appear or lean on others for approval. Partnerships can feel unbalanced. Dress for yourself, not for an audience. Stand before a mirror by candlelight and say three things you like about yourself. Mean every word.",
  },
  "Venus>Midheaven": {
    conjunction:
      "Venus shines on your Midheaven, the very top of your chart, and your public image glows. Colleagues and clients notice your grace, your taste and your diplomacy. Put your best work forward and let it look beautiful. Polish your profile, refresh a portfolio, make the warm call. Place a green aventurine on your desk for gentle success.",
    harmonious:
      "Work feels friendlier while Venus flows with your Midheaven. Collaborations go smoothly, and charm opens doors that effort alone could not. Combine pleasure with purpose: lunch with a mentor, a creative pitch, a kind word to the people you work with. Write your career wish on a small paper and tuck it beneath a pot of basil.",
    challenging:
      "Home and career may compete for your affection, or you may feel underappreciated for all your hard work. With Venus at odds with your Midheaven, don't push harder in resentment. Find balance. Rest when you need to, then ask clearly for recognition. A cup of rose tea before a tricky conversation softens your energy beautifully.",
  },
  "Mars>Sun": {
    conjunction:
      "Mars charges straight into your natal Sun, and your energy surges. You want to act, lead and win. Courage comes easily — so does impatience. Aim this fire at one goal and push it forward hard: start the project, have the brave conversation, train your body. Each morning while it lasts, light a red candle and name your target aloud.",
    harmonious:
      "Drive without aggression, confidence without arrogance — transiting Mars fuels your Sun in the most helpful way. This is the time to tackle the task you keep postponing. Move: exercise, clean, build, make the call. Carry a piece of carnelian for courage. Anything you begin under this aspect has real momentum behind it, so begin something worth finishing.",
    challenging:
      "Other people's will collides with yours. Mars squares or opposes your natal Sun, and you may feel provoked, pushed or simply restless. This is energy, not doom. Channel it into sport, hard physical work or a bold creative push rather than quarrels. Before reacting, take three slow breaths. Your power is greatest when you choose the battle.",
  },
  "Mars>Moon": {
    conjunction:
      "Feelings run hot and fast while Mars sits on your natal Moon. You may snap more easily, or feel fiercely protective of what is yours. Don't bottle it up. Give your emotions a physical outlet — run, dance, scrub the floors — and then rest properly. A bath with salt and a few drops of lavender oil will cool your heart.",
    harmonious:
      "Your feelings find their courage. Mars works kindly with your natal Moon, so you know what you need and can ask for it plainly. Act on an emotional truth you have held back: set the boundary, make the move, begin the home project. Cook something warming and spiced. Trust your gut — it is speaking very clearly in these days.",
    challenging:
      "Small irritations at home or with loved ones can feel enormous right now. Mars is pressing on your Moon, and moods flare easily. Give yourself space to cool off before any big talk. Sweep your home from back to front and imagine anger leaving with the dust. Then speak calmly, and you will be heard.",
  },
  "Mars>Mercury": {
    conjunction:
      "Your mind is sharp as a blade while Mars meets your natal Mercury. Ideas come fast, and you speak with force. That is wonderful for debates, deadlines and decisive writing, less so for tender talks. Use your edge for work, not wounds. Write everything down. Read difficult messages twice before sending. Clear, quick and kind wins.",
    harmonious:
      "Thoughts move with purpose when transiting Mars energises your Mercury. Studying, negotiating and solving problems all feel easier than usual. Take on the mental task you have been dreading — paperwork, a hard email, a new skill — and burn a yellow candle while you work. Your words carry conviction, so speak up for what you believe in.",
    challenging:
      "Words can become weapons under this square or opposition from Mars to your Mercury. Arguments start quickly, and you may say more than you mean. Slow down. Don't type in anger, and pause before replying to anything that stings. Put that sharp mind to a puzzle or a project instead. Hold a piece of amethyst to calm your thoughts.",
  },
  "Mars>Venus": {
    conjunction:
      "Passion arrives as Mars meets your natal Venus — in love, in art, in anything you desire. Attraction runs strong and you feel bolder about chasing what you want. Follow that spark honestly. Flirt, create, wear something daring. Light red and pink candles together, write one desire you are ready to pursue, and then go and pursue it.",
    harmonious:
      "You can make the first move without feeling awkward. Transiting Mars flatters your natal Venus, mixing warmth with initiative in romance, friendship and creative work alike. Act on what you love: book the class, send the message, finish the painting. Wear a little rose oil, and trust that your desire is worth acting upon.",
    challenging:
      "Desire meets friction. With Mars pressing against your natal Venus, romantic tension, jealousy or frustrated wants may surface. My advice: don't force anything. Be honest about what you want, and let others have their say too. Pour the extra passion into dance or creative work. A rose quartz under your pillow helps soften the sharp edges.",
  },
  "Mars>Mars": {
    conjunction:
      "This is your Mars return — the start of a new two-year cycle of drive and ambition. What are you fighting for now? Choose carefully, because what you start here has real staying power. Set one brave goal. Write it on red paper, fold it towards you and keep it beneath a red candle while the cycle opens.",
    harmonious:
      "Your body feels strong and your will feels clear while transiting Mars harmonises with its natal place. Effort pays off. Push forward on a goal that needs stamina: a new routine, a demanding project, a long-postponed repair. Carry a garnet or carnelian. Strength used well becomes the kind of confidence that stays with you.",
    challenging:
      "Blocked, irritable, pulled into conflict — your usual way of getting things done meets resistance as Mars challenges its natal place. Don't waste your fire fighting everyone. Pick one battle that truly matters and put your strength there. Move your body every day until this passes. Cleanse your space with salt to release the tension.",
  },
  "Mars>Jupiter": {
    conjunction:
      "Enthusiasm takes off when Mars meets your natal Jupiter. You feel bold and ready to expand. Take a sensible risk — apply, travel, launch, learn — but don't overcommit or overpromise. Light an orange candle and write your boldest plan. Then cut it down to the first real step, and take that step the same day.",
    harmonious:
      "Big plans feel achievable now, and people back your vision. Transiting Mars sends confident energy to your natal Jupiter, so act on an opportunity rather than only dreaming about it. Sport, travel and study are all favoured. Keep a cinnamon stick in your pocket for courage and growth. Your faith in yourself is magnetic.",
    challenging:
      "Too many plans, too much speed, too much certainty. Mars squares or opposes your natal Jupiter, and excitement can tip into recklessness. Slow down long enough to check the details, and don't argue about beliefs just to win. Ground yourself barefoot on the earth. Big energy needs a sturdy container before it can become something real.",
  },
  "Mars>Saturn": {
    conjunction:
      "Drive collides with limits as Mars meets your natal Saturn. Progress feels slow, effort feels heavy and frustration builds. Yet this is excellent ground for patient, disciplined work. Choose slow and steady over fast and furious. Pick one hard task and return to it daily. Burn a black candle to clear obstacles. Endurance builds lasting strength.",
    harmonious:
      "Effort and patience work as one. With Mars supporting your natal Saturn, you can grind through difficult tasks and even enjoy it. Take on something that needs stamina: a long project, a practical repair, a goal you have postponed for years. Plan carefully, then follow through. Keep smoky quartz close. Work done now truly lasts.",
    challenging:
      "It may feel like driving with the brakes on. Mars squares or opposes your natal Saturn, and authority figures or old rules can stand in your way. Don't smash into the wall — find the smarter route. Rest more than usual and move gently. Write your frustrations on paper, then burn it safely. Patience is power.",
  },
  "Mars>Ascendant": {
    conjunction:
      "You come on strong while Mars rises over your Ascendant. People sense your energy before you say a word. It is a great time to start something new, stand up for yourself and get physically active. Watch for rushing or bumping into other people's feelings. Wear red for courage, and channel your fire into bold, clean action.",
    harmonious:
      "Confidence shows on you. Transiting Mars supports your Ascendant, and others respond to your directness and follow your lead. Take the initiative: introduce yourself, try a new sport, present your ideas first. Your body has extra energy, so use it well. A piece of carnelian worn near your skin makes this glow even stronger.",
    challenging:
      "Others may push your buttons, or you theirs. Mars squares or opposes your Ascendant, and conflicts in partnerships can flare quickly. Breathe before reacting, and don't start fights you don't need. Burn off excess energy with physical activity. Before meetings, touch a little salt water to your wrists. Strength includes knowing when to pause.",
  },
  "Mars>Midheaven": {
    conjunction:
      "Ambition burns bright as Mars crosses your Midheaven. You want to achieve, compete and be seen for your work. Go for it — apply, pitch, lead — but watch your temper with those above you. Place a red jasper on your desk with your career goal written on a slip of paper beneath it, and act on it daily.",
    harmonious:
      "Work moves forward with real energy. Transiting Mars flows with your Midheaven, so your initiatives are noticed and your efforts bring results. Take on a stretching task or launch something under your own name. Speak with confidence in meetings. Keep a small piece of tiger's eye nearby. Your drive is quietly building a reputation.",
    challenging:
      "Pressure builds between home and career, or you clash with someone in charge. Mars squares or opposes your Midheaven and tempers run short. Don't walk out in a rage. Choose your moment carefully, and put extra energy into a physical outlet so it doesn't leak into work. Clear your desk and place a pinch of salt at each corner.",
  },
  "Jupiter>Sun": {
    conjunction:
      "Jupiter crosses your natal Sun — a season of growth, confidence and generous light. You feel bigger, braver and more hopeful, and doors open more easily. Aim higher than usual while keeping your feet on the ground. On a Thursday, Jupiter's day, light a gold candle and write a description of the life you want to grow into.",
    harmonious:
      "Life feels supportive. Transiting Jupiter blesses your Sun, and helpful people and good timing find you more often. Say yes to growth: study, travel, begin something meaningful. Trust the current, and still do the work. Keep a citrine where you see it every day. Optimism is magnetic, so use yours with wisdom.",
    challenging:
      "Everything seems possible, so you are tempted to try everything. Jupiter squares or opposes your Sun, and overconfidence can creep in along with promises you cannot keep. Pick your best opportunity and let the rest go. Moderation is your secret power for as long as this lasts. Write your one goal on a bay leaf and keep it close.",
  },
  "Jupiter>Moon": {
    conjunction:
      "Your heart expands as Jupiter meets your natal Moon. You feel more generous, emotionally open and hopeful. Home and family matters may want more room — a gathering, a move, simply more space. Nurture your inner world. Fill your rooms with plants and light, and leave a bowl of moon water on the windowsill to welcome good energy.",
    harmonious:
      "Emotional well-being blossoms while transiting Jupiter supports your natal Moon. You feel safe, cared for and generous with your care. Invest in home and in the people who feel like family. Host a dinner. Plant herbs on your windowsill. Trust your intuition — in these weeks it is unusually clear and kind.",
    challenging:
      "Big feelings need big containers. Jupiter squares or opposes your Moon, and you might overeat, overgive or overreact. Notice when comfort becomes excess. Journal what you feel, then rest. A salt bath with lavender helps you return to balance. Your heart is generous — just remember to keep some of that care for yourself.",
  },
  "Jupiter>Mercury": {
    conjunction:
      "Your mind opens wide as Jupiter meets your natal Mercury. New ideas, studies and conversations broaden your world. Learn something big — a course, a language, a book that changes how you think — while watching for the small details you might skip. Light a yellow candle as you study, and keep a notebook handy for the inspiration that arrives fast.",
    harmonious:
      "Words carry weight and wisdom while Jupiter supports your Mercury. Writing, teaching, agreements and sharing ideas all go well. Speak up and share what you know: publish, pitch, teach, read widely. A sprig of rosemary on your desk sharpens memory and invites clever thoughts. Your ideas can travel far right now, so send them out.",
    challenging:
      "Grand ideas can lack practical steps. With Jupiter at odds with your Mercury, you may overpromise or overlook the fine print. Slow down and double-check. Don't commit to everything that sounds exciting. Write your plans out fully before you agree to anything, and burn a little rosemary for clarity. Wisdom is knowing which ideas to keep.",
  },
  "Jupiter>Venus": {
    conjunction:
      "Love, pleasure and beauty expand as Jupiter meets your natal Venus. Relationships deepen, creativity flows and your sense of worth grows. Open your heart and let joy in. Celebrate, create, adorn yourself. Place rose petals and a citrine together on a little altar, and write a wish for love — in whatever form you need it.",
    harmonious:
      "Happiness comes more easily. Transiting Jupiter supports your natal Venus, and social life, creativity and affection all feel abundant. Share your gifts generously and enjoy life's pleasures. Gather friends, buy flowers, start the creative project. Speak kindly to yourself. A pink candle burned on a Friday invites even more sweetness. Accept the good that comes.",
    challenging:
      "Everything glitters, but not all of it is gold. Jupiter squares or opposes your Venus, and pleasure can tip into excess — overspending, overindulging, saying yes to everyone. Choose quality over quantity. Enjoy yourself, but stop before regret. Carry a rose quartz in your purse to remind you that self-worth is never something you need to buy.",
  },
  "Jupiter>Mars": {
    conjunction:
      "Courage, ambition and physical energy all rise as Jupiter meets your natal Mars. Take bold action on what matters to you: write the plan, train for the event, chase the dream. Just don't take on everything at once. Burn an orange candle and write your boldest goal on fresh paper, then begin.",
    harmonious:
      "Your efforts land well. Transiting Jupiter supports your natal Mars, giving you energy, confidence and good timing together. Push forward on goals that need courage — competition, sport and new ventures are all favoured. Carry a piece of carnelian or garnet. When you act with faith in yourself, others feel inspired to follow.",
    challenging:
      "Too much effort, too much risk, too much speed. Jupiter squares or opposes your natal Mars, and you may simply overdo it and run yourself down. Pace yourself. Choose one goal and pursue it fully rather than scattering your energy everywhere. Rest as seriously as you work. A salt bath at night will help you recharge.",
  },
  "Jupiter>Jupiter": {
    conjunction:
      "This is your Jupiter return, the start of a new twelve-year cycle of growth. What do you want to grow into? Few moments are as powerful for new beginnings. Set intentions for the years ahead. Write them on good paper, place it under a gold candle as it burns, then keep it somewhere safe and private.",
    harmonious:
      "Faith in life returns. Transiting Jupiter harmonises with its natal place, and chances to learn, travel and grow arrive gently. Say yes to expansion — take the course, plan the trip, explore new ideas about the world. Keep a journal of the good things that happen. Gratitude invites more blessings, and your path is unfolding.",
    challenging:
      "You may question what you believe, or feel your growth is stuck. Or you may push too hard for more. Jupiter squaring or opposing its natal place asks for reflection: what truly matters to you now? Let go of what no longer fits. A small bowl of salt by your bed helps cleanse old patterns. Wisdom grows from honest questions.",
  },
  "Jupiter>Saturn": {
    conjunction:
      "Hope meets structure. Jupiter meets your natal Saturn, and long-term plans can finally take shape. Build something solid: a foundation for your work, a careful plan, a lasting commitment. Balance optimism with realism. Light a black candle and a gold candle together, and write down the long-term goal that matters most to you.",
    harmonious:
      "Steady effort begins to show. Transiting Jupiter supports your natal Saturn, and patience is rewarded with real progress. Take practical steps towards your long-term dreams. Plan carefully and act steadily, one brick at a time. Keep a piece of smoky quartz nearby for grounding. Your discipline has become a genuine source of strength.",
    challenging:
      "Should you leap or wait? Jupiter squares or opposes your Saturn, and you may feel torn between growth and caution. Find the middle path. Take careful, measured risks. Don't let fear stop you, but don't ignore real limits either. Burn a little sage to clear doubt from your space. The wisest growth happens step by step.",
  },
  "Jupiter>Ascendant": {
    conjunction:
      "You shine as Jupiter crosses your Ascendant. You feel more confident, generous and open to life, and people notice your warmth. Step forward boldly. Try new things, meet new people, travel if you can. Just watch for overdoing it. Wear gold or yellow, and light a gold candle as you welcome this blessing in.",
    harmonious:
      "You make a wonderful impression. Transiting Jupiter supports your Ascendant, and others find you warm, wise and approachable. Put yourself out there: meet new people, say hello first, apply for the opportunity. Smile often. A citrine worn close to your skin amplifies your natural charm. Your presence opens doors, so walk through them.",
    challenging:
      "Partnerships may feel unbalanced, or you may promise too much to others just to look generous. Jupiter squares or opposes your Ascendant, so be honest about your limits. Don't carry other people's burdens as well as your own. Cleanse your energy with a little salt water on your hands. True generosity starts with honesty about what you can give.",
  },
  "Jupiter>Midheaven": {
    conjunction:
      "Your working life can expand as Jupiter crosses your Midheaven. Recognition and new opportunities become easier to reach. Aim high and step into the light. Apply, pitch, lead. Your reputation grows when you share your gifts. Place a citrine on your desk and write your career wish on green paper beneath it.",
    harmonious:
      "Work feels meaningful. Transiting Jupiter supports your Midheaven, and chances for growth and recognition come naturally. Take initiative: share your vision, seek a mentor, widen your skills. A bay leaf with your goal written on it, tucked into your wallet, makes a lovely charm. Your efforts are being noticed, so keep going.",
    challenging:
      "Home and career may compete for your time, or you may overcommit at work. Jupiter squares or opposes your Midheaven, asking you to find balance between ambition and rest. Don't promise more than you can deliver. Clear your workspace and burn a little sage. Real success means growth without losing yourself along the way.",
  },
};
