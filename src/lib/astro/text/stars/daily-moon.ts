/**
 * Daily horoscope building blocks driven by the Moon.
 *
 * MOON_HOUSE_DAY / DAY_HEADLINE are keyed by the solar house (counting the
 * reader's Sun sign as the 1st) that today's Moon falls in. PHASE_DAY is keyed
 * by the Moon's phase, MOON_SIGN_RITUAL by the sign the Moon is in today.
 *
 * Original Witchy Portal copy in Yulia Moon's voice. British English.
 */
import type { MoonPhaseName } from "../types";
import type { Sign } from "../../types";

type HouseKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

export const MOON_HOUSE_DAY: Record<HouseKey, string[]> = {
  "1": [
    "Today the Moon visits your own sign, and everything feels closer to the skin. Your moods show quickly, so let them guide you rather than hide them. This is a day for small new starts: a fresh habit, a new look, a first step on something you have been circling. Light a red candle in the morning, say out loud what you are beginning, and trust your own energy to carry it.",
    "You are the main character of the sky today. People notice you before you speak, and your instincts are sharper than usual. Use that. Don't wait for permission or for someone else to set the tone.\n\nMy advice today: dress for the person you are becoming, stand a little taller, and make one decision purely for yourself. The Universe answers clearly when you show up as you are.",
    "A tender, personal kind of day. The Moon in your 1st house asks how you actually feel in your body, not how you think you should feel. Slow down enough to listen. Eat something warm, stretch, take the long way home. If you have been running on other people's needs, take your energy back. A pinch of salt in your palm, rubbed away under running water, makes a simple reset.",
    "Something in you wants a fresh page, and today the Moon gives you the pen. Little beginnings carry real weight now, so choose them with care. Change one thing about how you greet the world: your hair, your morning ritual, the words you use about yourself. Write an intention on a small card, keep it in your pocket and touch it whenever you doubt yourself. Your power starts with you.",
  ],
  "2": [
    "Today the Moon settles into your house of money and self-worth, and you may feel how closely the two are tied. Comfort matters, but so does knowing what you are truly worth. Look honestly at what you spend and why. Put a coin and a bay leaf under a green candle, write one clear money intention, and let the flame burn for a while as you plan something sensible.",
    "Your senses are wide awake today. Textures, tastes and beautiful things pull at you, and that is not frivolous: it tells you what nourishes you. Enjoy it without overspending your energy or your purse. Tidy your purse or wallet, throw out old receipts, and clear one drawer. Witches know that what we keep around us holds energy, so keep only what still feels like yours.",
    "A quiet, practical mood runs through the day. The Moon in your 2nd house asks what you value, and whether your time and money are going there. Don't chase quick fixes. Small, steady choices build security. Make a short list of the three things you would protect first if everything else fell away. Let that list shape one decision today, however small. That is real wealth.",
    "Self-worth is the true theme today, even if it shows up as a bill or a price tag. If you have been undercharging, underselling or apologising for wanting more, notice it. You deserve fair exchange. Hold a piece of citrine or a simple coin while you say out loud what you offer the world. Then ask for what you need with calm confidence. Trust it.",
  ],
  "3": [
    "Today the Moon lights up your house of messages, and your mind moves fast. Calls, texts and little errands fill the hours, and a casual conversation may hold an important clue. Listen for it. Write things down before they slip away. Before you send anything tricky, read it once more and soften the edges. A yellow candle on your desk keeps your words clear and kind.",
    "Curiosity is your friend today. A short walk around your neighbourhood, a new book, a podcast or a chat with a neighbour can open a door you did not expect. Don't overthink; follow what interests you. If there is a sibling or old friend you have been meaning to message, today is right. Carry a small clear quartz to keep your thoughts bright and focused.",
    "Your words carry more weight than usual, so choose them like spells. The Moon in your 3rd house makes you sensitive to tone, and a careless remark can sting, whether you give it or receive it. Speak gently, ask questions and let others finish. Spend ten quiet minutes journaling before bed. You will be surprised how much wisdom is already sitting in your own handwriting.",
    "A busy, chatty sky, perfect for learning something small but useful. Sign up for that class, look up the thing you keep wondering about, or finally reply to the message you have been avoiding. Local places hold good energy for you today: the corner café, the market, the library. Keep your plans light and flexible, and let the day lead you from one bright idea to the next.",
  ],
  "4": [
    "Today the Moon comes home to your 4th house, and you may want nothing more than your own space. Honour that. Family memories, old feelings and the need for comfort rise up, and they deserve gentle attention. Cook something that reminds you of childhood, open the windows and let fresh air move through every room. A bowl of salt water by the door keeps your home's energy clean.",
    "Roots are calling. You might think about where you come from, the people who raised you, or what home really means now. Don't push those feelings away; they carry wisdom. Call someone who knows your history, or look through old photos with a cup of tea. Light a white candle in the kitchen and thank your ancestors, whoever they were, for the strength you carry.",
    "A soft, inward day. The Moon in your 4th house turns your attention to private life, and the outside world can wait a little. Clean one corner of your home properly, as a witch does: sweep from the back to the front door, then sprinkle a little salt and lavender. As you work, decide what your home should feel like. Then make one small change that brings it closer.",
    "Emotions sit close to the surface today, especially around family or the people you live with. If tension arises, don't let it harden. Speak from your heart and keep it simple. This is also a good day to rest at home and recharge. Simmer cinnamon, orange peel and a few cloves on the stove; the scent alone shifts a room's mood towards warmth and safety.",
  ],
  "5": [
    "Today the Moon dances into your house of joy, and play is not a luxury but a necessity. Do something just because it delights you. Paint, sing, dance in the kitchen, flirt a little, laugh too loudly. Romance, whether with a partner, a new crush or life itself, feels sweeter now. Light a pink candle, put on your favourite music and let your heart lead for a few hours.",
    "Your creative fire is burning bright today. Ideas come quickly, and the urge to make something with your hands is strong. Follow it, even if it is only a doodle or a new recipe. Don't judge the result; the magic is in the making. If children are part of your world, play their games. If not, find your own inner child and give them an afternoon.",
    "A warm, expressive mood lifts the day. The Moon in your 5th house wants you to be seen and to shine. Wear the bold colour, share your work, say the sweet thing out loud. Love grows when we let ourselves be a little vulnerable. If you are single, enjoy your own company like a romantic date. If you are partnered, plan something fun together tonight.",
    "Pleasure is the medicine today. You have been serious long enough, and the Moon asks you to remember what lightness feels like. Book a little treat, watch the film that makes you laugh, or try a hobby you abandoned years ago. I always say joy is a form of protection: it raises your energy above whatever was dragging it down. Let it in.",
  ],
  "6": [
    "Today the Moon moves through your house of daily work and habits, and order feels soothing. Write a clear list, tackle the smallest annoying task first and enjoy ticking things off. Your body appreciates routine now too: drink water, eat on time, take a short walk between jobs. Wipe your desk with a cloth dipped in lemon water. A clean workspace makes room for clear thinking.",
    "Small rituals change everything today. The way you make your morning tea, the order in which you do your tasks, the pause before you answer an email: each one either drains or restores your energy. Notice which is which. Choose one new habit that supports you and begin it today. Keep a sprig of rosemary near your workspace to help you stay focused and calm.",
    "You may feel a pull to fix, sort and improve everything around you. That is useful, but don't turn it against yourself. Be as kind to your own body as you would be to a friend's. Rest when you are tired, stretch when you are stiff, and look after yourself without guilt. A warm footbath with salt and a few drops of lavender oil ends the day beautifully.",
    "Work flows best today when you keep things simple. Colleagues, clients or the people you help may need extra patience, and you have plenty of it. Offer practical help rather than advice. Clear out one overflowing inbox, folder or cupboard; you will feel lighter afterwards. Before bed, write tomorrow's three priorities on paper and leave them under a small green aventurine stone.",
  ],
  "7": [
    "Today the Moon moves into your house of partners, and other people mirror you clearly. Pay attention to how you feel around them, because it tells you what you need. A close friend, partner or business ally may want more of your time. Give it, but stay yourself. Light two candles side by side, pink and white, and think about what balance in a relationship truly looks like.",
    "One-to-one conversations matter more than group noise today. Someone may surprise you with honesty, or you may finally say what you have been holding back. Speak calmly, listen fully, and don't rush to fix anything. If you are single, notice the kind of energy you are drawn to now. It is a message from your heart about what you deserve.",
    "Cooperation brings better results than going it alone. The Moon in your 7th house softens your edges and makes compromise feel possible. Use it to mend a small rift or agree on something practical. Don't give away your power to keep the peace, though. Fair is fair. Place a rose quartz between two photos or names, and ask for harmony that respects you both.",
    "Relationships of every kind are in focus, from love to friendship to the people you work alongside. You may feel especially sensitive to how others treat you. Trust that feeling, but check it gently before you react. Plan a proper meeting, a shared meal or a long walk together. Sweet words travel far today. End the evening by writing down one quality you value in someone close to you.",
  ],
  "8": [
    "Today the Moon slips into your 8th house, the deep waters of your chart. Feelings run strong and private. You may want closeness, truth and nothing superficial. Honour that, but choose carefully who you open up to. It is also a good day to look at shared money or joint plans with a clear head. Light a black candle to release fear and invite honest transformation.",
    "Something is ready to change, and you can feel it under the surface. Old jealousies, buried hurts or patterns you are tired of may come up. Don't panic; this is how renewal begins. Write down what you want to let go of, tear the paper into pieces and bury it in soil. As you do, imagine the earth taking it and giving you strength in return.",
    "Intimacy and trust are the themes today, whether in love, friendship or family. The Moon asks you to go a little deeper than usual. Ask the real question. Share the real feeling. If money is shared with someone, talk about it plainly; clarity is protective. My advice today: run a bath with a handful of sea salt and imagine it drawing out what isn't yours to carry.",
    "A powerful, magnetic mood surrounds you. Your intuition is unusually sharp, so trust what you sense about people, even if they say otherwise. Don't use this energy to control or test anyone. Use it to understand. This is a good day for shadow work: sit quietly with a candle and ask yourself what you are really afraid of. The answer will set something free.",
  ],
  "9": [
    "Today the Moon lights up your house of adventure, and your spirit wants room. Plan a trip, even a small one, or simply wander somewhere new. Big questions about meaning, faith and where your life is heading feel exciting rather than heavy. Read something that widens your view. Light a purple candle and ask the Universe to show you the next lesson you are ready for.",
    "Your mind is restless in the best way. Study, research and conversations with people from different backgrounds feed your soul today. Don't settle for the usual opinions. Look further. If you have been dreaming of a course, a retreat or a journey abroad, take one practical step towards it. Pull a single tarot card and treat it as a signpost for the road ahead.",
    "A hopeful, generous mood rises. The Moon in your 9th house reminds you that the small worries of this week are only part of a much bigger story. Step back and see the whole picture. What do you truly believe about luck, love and your own path? Write it down. Your beliefs shape your reality, so make sure they are ones you have chosen yourself.",
    "Wisdom comes from unexpected teachers today: a stranger, a book on a train, an old saying from your grandmother. Stay open and curious. You may also feel the urge to share what you know. Do it gently, without preaching. This is a beautiful day to plan your next adventure or study a magical tradition you love. Burn a little sage and let your horizons widen.",
  ],
  "10": [
    "Today the Moon climbs to the top of your chart, and your public life is in the spotlight. People notice how you work and how you carry yourself. Show up with intention. Finish something visible, update your profile or make that professional call. Feelings may run close to your ambitions, so stay steady. A gold candle on your desk supports confidence and clear, respected leadership.",
    "Your goals feel personal today, and that is a gift. Ask yourself whether the path you are on still matches what your heart wants. If it does, take a bold step forward. If not, quietly start planning a change. Don't let anyone else define success for you. Write your biggest goal on bay leaves, keep them in your purse and look at them often.",
    "A day to be taken seriously. Bosses, clients or anyone with authority may be watching, so let them see your best. You don't need to be perfect, only reliable and kind. Prepare properly for anything important. Tonight, review what you achieved this month and give yourself credit. Recognising your own effort is powerful magic; it attracts more of the same.",
    "Your reputation is being shaped by small choices today. Keep promises, answer messages and be generous with praise for others. The Moon in your 10th house can also stir mixed feelings about duty and freedom. Both are valid. Find the middle path. Carry a piece of tiger's eye for courage and practical success, and remember that you are building something that will outlast this week.",
  ],
  "11": [
    "Today the Moon moves through your house of friendship and hopes, and community matters. Reach out to the people who make you feel understood. A group chat, a class or a local event could bring a lovely connection. Don't isolate yourself, even if you are tired. Light a blue candle and write down a wish for the future, then share one part of it with a friend.",
    "Your dreams for the future feel closer today. The Moon in your 11th house asks you to think bigger than your daily worries. What kind of world do you want to live in, and what part can you play? Join something that matters to you. Offer your skills to a cause. The right people gather around those who give their energy generously.",
    "Friendships may need a little tending. Someone may want your support, or you may realise who truly lifts you up and who only takes. Both are useful lessons. Be honest, but kind. This is a good day to send a thank-you message or arrange a gathering. Place a small amethyst where your friends sit; it keeps conversations warm and true.",
    "A light, social, forward-looking mood colours the day. Ideas shared with others grow faster than ideas kept to yourself. Brainstorm, network or simply have fun with people who get you. Don't worry about fitting in; your uniqueness is exactly what the group needs. Before bed, make a short vision list for the year ahead and keep it somewhere you will see it every morning.",
  ],
  "12": [
    "Today the Moon drifts into your 12th house, the most private part of your chart. Energy may feel lower, and that is fine. You are not meant to push today. Rest, reflect and listen to your inner voice. Turn off unnecessary noise. A warm bath with lavender, a white candle and soft music will help you recharge more than any amount of busy activity.",
    "Dreams and intuition are especially strong. Keep a notebook by your bed and write down whatever you remember on waking. Small signs, coincidences and odd feelings carry meaning now. Don't dismiss them. This is a beautiful day for meditation, prayer or a quiet walk alone. The Universe speaks most clearly when you finally give it a little silence.",
    "Something hidden may come to light, perhaps a feeling you have avoided or a truth you already knew. Treat it gently. Solitude helps you process without pressure. Cancel what you can and give yourself space. Before sleep, place a moonstone under your pillow and ask for a healing dream. Tomorrow you will feel clearer, lighter and ready to begin again.",
    "A soft, spiritual day for endings and quiet preparation. The Moon in your 12th house invites you to tie up loose threads before a new cycle starts. Forgive what you can, including yourself. Write a short letter to your past self, thank them, then burn it safely. Let the smoke carry away old regrets. Rest is not wasted time; it is how witches restore their power.",
  ],
};

export const DAY_HEADLINE: Record<HouseKey, string[]> = {
  "1": [
    "A fresh start begins with you",
    "Step forward and let yourself be seen",
    "Your body knows what it needs today",
    "Small beginnings carry real power now",
  ],
  "2": [
    "Know your worth, then ask for it",
    "Comfort, value and quiet good sense",
    "Spend your energy where it matters",
    "A steady day for building security",
  ],
  "3": [
    "Listen closely, the clue is in conversation",
    "Follow your curiosity around the corner",
    "Choose your words like little spells",
    "A bright, busy day for learning",
  ],
  "4": [
    "A soft day for home and heart",
    "Your roots hold quiet wisdom today",
    "Make your home a sanctuary again",
    "Gentle feelings close to the hearth",
  ],
  "5": [
    "Play, flirt and let joy lead",
    "Your creative fire burns bright today",
    "Shine a little and be seen",
    "Joy is your protection today",
  ],
  "6": [
    "Small rituals, big difference",
    "Order your day and calm your mind",
    "Be kind to the body that carries you",
    "Keep it simple and get it done",
  ],
  "7": [
    "Others mirror what you need",
    "Honest words between two people",
    "Balance without giving away your power",
    "A day for meeting each other halfway",
  ],
  "8": [
    "Deep waters, honest feelings",
    "Let go and make room to change",
    "Ask the real question today",
    "Your intuition sees beneath the surface",
  ],
  "9": [
    "Your spirit wants a wider horizon",
    "Take one step towards the journey",
    "See the bigger story unfold",
    "Wisdom from an unexpected teacher",
  ],
  "10": [
    "Your work is in the spotlight",
    "Define success on your own terms",
    "Show them your steady best",
    "Small choices shape your reputation",
  ],
  "11": [
    "Find your people and share your wish",
    "Dream bigger than today's worries",
    "Tend the friendships that lift you",
    "Your uniqueness is what the group needs",
  ],
  "12": [
    "Rest is your magic today",
    "Listen to dreams and quiet signs",
    "Gentle truths surface in solitude",
    "Close a chapter softly and kindly",
  ],
};

export const PHASE_DAY: Record<MoonPhaseName, string[]> = {
  "New Moon": [
    "The New Moon is a dark, quiet doorway. It is the best time to plant intentions, not to rush into action. Write down three wishes in the present tense, fold the paper towards you and keep it somewhere safe until the Full Moon.",
    "Beginnings love a dark sky. Today, start something small and private: a new habit, a savings jar, a secret project. Light a single white candle, say your intention once, clearly, and let the Universe hold it while you rest.",
    "This is a seed moment, so don't judge what you cannot yet see. Clean your altar or a small shelf, place a fresh bowl of water there and whisper what you want to grow. The real magic begins when you trust it.",
  ],
  "Waxing Crescent": [
    "The first silver curve of the Moon brings courage. Your intentions need small, brave actions now. Send the email, buy the notebook, make the first call. Carry a green aventurine for luck and keep moving gently forward.",
    "Momentum is building quietly. This phase rewards consistency over drama, so repeat your intention each morning and take one practical step towards it. Water a plant as you speak your wish, and watch both grow together.",
    "Hope returns with the crescent Moon. If doubts creep in, answer them with action rather than worry. Light a yellow candle for confidence, write one thing you will do this week, and do it before the Moon grows full.",
  ],
  "First Quarter": [
    "The First Quarter Moon brings a test. Obstacles now are not signs to stop; they show you where to push or adjust. Be decisive. Light a red candle for strength and tackle the one task you have been avoiding.",
    "Half light, half shadow: a moment for choices. Look at your plans honestly and drop anything that no longer fits. Then commit fully to what remains. A pinch of black pepper in a candle dish adds protective, determined energy.",
    "Tension today is fuel, not failure. Use it to make a firm decision or set a boundary. Write your challenge on paper, put a heavy stone on top, and say out loud that you are stronger than whatever stands in your way.",
  ],
  "Waxing Gibbous": [
    "The Moon is almost full, and so are your efforts. This is the time to refine and polish, not to start again. Review your plans, fix small details and be patient. A glass of moon water on the windowsill gathers strength tonight.",
    "Anticipation hums under the surface. Keep going with care, adding the finishing touches to anything you began at the New Moon. Pull one tarot card and ask what still needs attention. Then trust that the harvest is coming.",
    "Patience is powerful magic in this phase. Don't give up just before the reward arrives. Tidy your space, prepare for completion and spend a few minutes each evening visualising your goal as already achieved.",
  ],
  "Full Moon": [
    "The Full Moon lights everything, including feelings you have been avoiding. Celebrate what has grown, release what has not, and charge your crystals and moon water on the windowsill tonight. Emotions may run high; let them move through you.",
    "This is the peak of the lunar cycle, a time of clarity and power. Write down what you are grateful for and what you are ready to release. Burn the release list safely and keep the gratitude list by your bed.",
    "Bright light reveals the truth. Something may come to completion or become clear today. Don't fight it. Wash your face in cool water by moonlight and feel the old cycle rinse away, leaving you clear, bright and ready.",
  ],
  "Waning Gibbous": [
    "After the Full Moon comes reflection and sharing. Teach what you have learned, thank those who helped you and give something back. Gratitude multiplies energy. Light a gold candle and list three gifts this cycle brought you.",
    "The light is slowly leaving, and this is a good moment to digest what happened. Journal about the past two weeks: what worked, what didn't. Share your wisdom with someone who needs it. Generosity now brings blessings later.",
    "This phase favours gentle letting go. Clear out one drawer, return what you borrowed and close conversations that feel unfinished. Burn a little rosemary to cleanse your space and make room for the next cycle.",
  ],
  "Last Quarter": [
    "The Last Quarter Moon asks for honest release. Break the habit, end the commitment that drains you, or forgive what still stings. Cut a piece of string between your hands as a simple symbol of setting yourself free.",
    "Turning points appear in this phase. You may see clearly what needs to change. Don't cling. Sweep your home from the back to the front door, imagining you are clearing out old energy along with the dust.",
    "Half the Moon is dark now, and so is the season for clearing. Delete, donate, decline. Space creates opportunity. A black tourmaline near your door helps protect your energy while you make those firm decisions.",
  ],
  "Balsamic Moon": [
    "The last thin sliver before darkness is a time to rest and surrender. Don't start anything new. Sleep longer, meditate, keep your plans light. Your intuition is very strong, so listen to dreams and quiet inner messages.",
    "This is the witch's pause between cycles. Reflect on everything that ended this month and bless it. Light a dark blue candle, sit in silence and ask your inner voice what it wants for the next chapter.",
    "Endings are holy too. Give yourself permission to do less today. Take a warm bath, drink herbal tea and write a short goodbye to whatever you are leaving behind. Soon the New Moon will bring a fresh page.",
  ],
};

export const MOON_SIGN_RITUAL: Record<Sign, string[]> = {
  Aries: [
    "Light a red candle and say one brave intention out loud three times. Aries Moon energy loves boldness, so act on your words within the hour, before doubt has time to catch up with you.",
    "Carry a piece of carnelian for courage today. Before an important moment, hold it in your fist, breathe deeply and feel its fire move through you. Then step forward like you already belong there.",
    "Sprinkle a little cinnamon on your doorstep this morning to invite action and fresh energy. As you do, name one thing you will begin today, however small, and don't stop until it has started.",
  ],
  Taurus: [
    "Run a slow bath with milk, honey and rose petals. Taurus Moon loves the senses, so take your time, enjoy every texture and scent, and let your body remember that comfort is a kind of magic too.",
    "Place a coin, a green aventurine and a sprig of fresh mint in a small dish on your kitchen table. Ask for steady abundance, not sudden luck, and refresh the mint when it fades.",
    "Bake or cook something simple with your own hands today. Stir clockwise while you think about what you want to grow in your life. Share it with someone you love, or savour it slowly yourself.",
  ],
  Gemini: [
    "Write a question on a small piece of paper, fold it twice and pull one tarot card for the answer. Gemini Moon favours messages, so notice which words or signs repeat for you over the day.",
    "Light a yellow candle beside your notebook and write freely for ten minutes without stopping. Don't edit. Gemini energy clears the mind through words, and you may find a clever idea hiding in the mess.",
    "Burn a little lavender or carry a sprig of it in your pocket. It calms busy thoughts and sweetens your words, which is useful when conversations feel fast and slightly scattered under a Gemini Moon.",
  ],
  Cancer: [
    "Fill a glass bowl with water, add a pinch of salt and a moonstone, and leave it by your window. Cancer Moon energy is protective and tender; use the water later to cleanse your hands and home.",
    "Light a silver or white candle in your kitchen and thank the people, living or past, who made you feel safe. Write their names on a card and keep it near the hearth of your home.",
    "Make a cup of chamomile tea, hold it close to your heart and breathe in its warmth. Name one feeling you have been carrying alone, then let the steam carry part of it away from you.",
  ],
  Leo: [
    "Light a gold or orange candle and look into a mirror while you say three things you love about yourself. Leo Moon wants you to shine, so say them proudly, without apologising or adding a but.",
    "Wear something bright today and carry a sunstone or tiger's eye in your pocket. Leo energy multiplies when you are seen, so let your confidence glow and notice how warmly the world responds to it.",
    "Create something just for joy today: a drawing, a dance, a little song. Leo Moon rewards play and self-expression. Dedicate it to your inner child and keep it somewhere that makes you smile.",
  ],
  Virgo: [
    "Clean one small area thoroughly, then wipe it with water infused with lemon and rosemary. Virgo Moon energy loves order and purity, and a cleansed space quickly clears your mind and your energy too.",
    "Make a herbal sachet with dried lavender, rosemary and a little salt. Keep it in your bag for clarity and calm. As you tie it, name one habit you want to strengthen this week.",
    "Write a careful list of everything on your mind, then circle only three things to do today. Light a green candle as you start. Virgo Moon rewards focus, practical steps and kindness towards yourself.",
  ],
  Libra: [
    "Place a rose quartz and a fresh flower on your bedside table. Libra Moon brings harmony and beauty, so ask for balance in your relationships and take a moment to appreciate the loveliness around you.",
    "Light a pink candle and write down two sides of a decision you are weighing. Read both aloud, then hold the paper over your heart. The answer that feels lighter is usually the right one.",
    "Make your space beautiful today: arrange flowers, tidy a shelf, light incense with a sweet scent. Libra energy responds to beauty, and a harmonious room invites calmer conversations and kinder words.",
  ],
  Scorpio: [
    "Light a black candle and write down a fear on a small piece of paper. Burn it safely in the flame. Scorpio Moon energy supports deep transformation, so let something old turn to ash and release.",
    "Hold a piece of obsidian and sit in silence for five minutes, asking what truth you have been avoiding. Scorpio Moon gives you courage to look deeper. Write down whatever comes, without judging it.",
    "Run a bath with sea salt and a few drops of patchouli or myrrh oil. Scorpio energy loves intensity and renewal. Soak, breathe deeply and imagine the water drawing out jealousy, fear and old hurts.",
  ],
  Sagittarius: [
    "Pull one tarot card this morning and treat it as your guide for an adventure. Sagittarius Moon loves expansion and meaning, so follow where the card points, even if it only leads somewhere a little new.",
    "Light a purple candle and write a big wish on a bay leaf. Burn it safely and imagine the smoke carrying your hopes far. Sagittarius energy favours optimism and generous, wide-open dreams.",
    "Carry a turquoise stone or simply wear something blue for protection on journeys, large or small. Under a Sagittarius Moon, stay open to strangers, new ideas and wise words from unexpected places.",
  ],
  Capricorn: [
    "Write your biggest goal on a piece of paper and place it under a heavy stone or a piece of smoky quartz. Capricorn Moon energy rewards patience, structure and slow, steady effort towards lasting results.",
    "Light a dark green candle at your workspace and list three practical steps towards something important. Capricorn energy favours discipline, so complete at least one step before the candle burns down.",
    "Make a simple prosperity jar with rice, a coin, a bay leaf and a pinch of cinnamon. Seal it while saying what you are building. Keep it somewhere stable, out of sight but never forgotten.",
  ],
  Aquarius: [
    "Write a wish for your community or the wider world on blue paper. Aquarius Moon energy connects us, so share your wish with a friend or a group and let it gather strength through many hearts.",
    "Try something unusual in your practice today: a new crystal, a different tarot spread, a ritual of your own design. Aquarius Moon rewards originality, so trust your instinct and break a few old rules.",
    "Light a turquoise or electric blue candle and imagine your energy connecting with like-minded people. Aquarius favours friendship and future vision, so send a message to someone who shares your hopes.",
  ],
  Pisces: [
    "Place a moonstone or amethyst under your pillow tonight and ask for a meaningful dream. Pisces Moon energy opens intuition, so keep a notebook nearby and write down whatever you remember on waking.",
    "Run a bath with sea salt and a few drops of jasmine oil, then light a soft blue candle. Pisces energy dissolves stress and boundaries; float, breathe and let the water hold what you cannot.",
    "Sit by water, if you can, or simply listen to the sound of rain or the sea. Pisces Moon invites surrender and dreaming. Whisper your wish into a glass of water, then pour it onto a plant.",
  ],
};
