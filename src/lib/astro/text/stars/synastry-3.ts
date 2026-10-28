/**
 * Birth Chart Compatibility (synastry) — outer-planet contacts, house overlays
 * and score summaries. Original Witchy Portal copy in Yulia Moon's voice.
 *
 * {A} = the person whose planet is named first in the key / whose planet falls
 * in the house. {B} = the other person.
 */

type SynastryText = { conjunction: string; harmonious: string; square: string; opposition: string };
type OverlayPlanet = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn";
type OverlayHouse = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
type ScoreArea = "love" | "communication" | "passion" | "stability" | "growth";

export const SYNASTRY_3: Record<string, SynastryText> = {
  "Uranus|Mars": {
    conjunction:
      "{A} switches on {B}'s drive like a lightning strike. Around {A}, {B} wants to move faster, try the daring thing and break a routine that has gone stale. The spark is real and thrilling, though it tends to arrive in bursts rather than as a steady flame. Light a red candle together and name one adventure you will share. Channelled, this becomes courage you both can use.",
    harmonious:
      "Here the rebel and the warrior get along beautifully. {A} gives {B}'s ambition fresh ideas and permission to do things differently, and {B} gives {A}'s brilliant notions legs to run on. Together you start projects, trips and experiments with ease. Don't let it become all novelty and no follow-through. Write your boldest shared plan on paper, keep it under a piece of carnelian, and act on it.",
    square:
      "{A} has a way of jolting {B}'s plans just as they gather speed, and {B} can push back hard. The friction is electric — exciting one day, restless the next. This is not a sign something is wrong; it is two kinds of energy asking for room. Agree on where freedom matters most to each of you. Then spend the voltage on movement: dance, walk the shore, build something.",
    opposition:
      "{A} and {B} pull like two ends of a live wire: {B} wants to act, {A} wants to stay free and unpredictable. That tension keeps attraction alive, and it can also unsettle plans. I always say that space is a kind of respect. Give each other room to be a little wild separately, then come back and choose one shared goal. The spark stays; the sting softens.",
  },
  "Uranus|Ascendant": {
    conjunction:
      "{A} walks into {B}'s life and something wakes up. {B} may start dressing differently, speaking up more, or simply seeing themselves as freer than before. It is exhilarating, and sometimes a little dizzying. Trust the parts of the change that feel like {B}'s own truth and gently release the rest. A clear quartz on the windowsill helps keep that new self steady and bright.",
    harmonious:
      "This is friendship-and-attraction energy with plenty of fresh air. {A} encourages {B} to be more original, and {B} feels easier in their own skin whenever {A} is near. There is room for surprise without pressure. Keep it alive by doing one unplanned thing together each month — a new route, a new café, a spontaneous swim. Freedom shared this lightly is a gift. Treat it like one.",
    square:
      "{A} can unsettle the way {B} presents to the world, sometimes with a comment that lands like a sudden gust of wind. {B} may feel seen in a brand new way, or just ruffled. Both are useful. Ask {A} to offer ideas rather than verdicts, and let {B} decide what to keep. Whenever things feel jangled, wash the doorstep with salt water to mark a fresh start.",
    opposition:
      "{A} stands opposite {B}'s self-image like an unexpected mirror. Through this person, {B} meets the freer, quirkier side of partnership — less script, more discovery. It can feel unstable when one of you craves routine and the other craves change. Name the freedoms each of you needs, out loud. Then the relationship becomes a place where both can grow, instead of a tug of war.",
  },
  "Neptune|Sun": {
    conjunction:
      "{A} sees {B} through a soft, golden haze — inspired, devoted, sometimes a little idealised. {B} may feel more creative and spiritual in {A}'s company, as if life has a hidden music. The risk is losing sight of the real person behind the dream. Keep honesty gentle but present. Light a silver candle, speak one plain truth each, and let the magic rest on solid ground.",
    harmonious:
      "This is a dreamy, kind connection. {A} brings imagination, compassion and a sense of the sacred to {B}'s sense of purpose, and {B} helps {A}'s visions take real shape in the world. Art, music and quiet spiritual practice flourish here. Share a ritual — a full moon bath, a playlist for two, a tarot spread pulled together. Gentle magic like this grows with tending.",
    square:
      "{A} can blur {B}'s sense of direction, not on purpose, but through mixed signals, vague plans or hopes that never quite land. {B} may feel inspired one moment and unsure the next. My advice: say things clearly, even when it feels unromantic, and write agreements down. Clarity is not the enemy of magic here — it is what lets the beautiful part of this bond breathe.",
    opposition:
      "{A} and {B} can fall under a spell of projection, each seeing what they hope to see in the other. The longing is lovely and the compassion is real. Still, the true person is always more interesting than the fantasy. Ask questions, check assumptions, and let each other be ordinary sometimes. Burn a little mugwort, then talk plainly. Love built on clear sight lasts.",
  },
  "Neptune|Moon": {
    conjunction:
      "Here two hearts can feel almost telepathic. {A} senses {B}'s moods before they are spoken, and {B} feels soothed, dreamy and understood. It is tender and deeply intuitive. Boundaries still matter, because feelings can merge until neither knows whose they are. Keep a bowl of moon water by the bed, and each night ask quietly: what is mine, and what is yours?",
    harmonious:
      "A gentle, healing tide runs between {A} and {B}. {A} brings compassion and imagination to {B}'s inner world, and {B} feels safe enough to soften. Shared dreams, quiet evenings, music and water all feed this bond. Trust it. Spend time by the sea, or run a bath with lavender, and let the stillness do its work. Tenderness this natural deserves protecting from busy days.",
    square:
      "{A} can stir {B}'s emotions in ways that are hard to read — longing, confusion, a sense that something has been left unspoken. Neither of you is doing anything wrong; the signals are simply foggy. Don't guess. Ask kindly, answer honestly, and keep your promises small and real. A clear quartz and a cup of chamomile help lift the mist so the deep care can come through.",
    opposition:
      "{A} and {B} reach for each other across a misty sea. The empathy is beautiful, and so is the wish to rescue or be rescued. Watch that pattern gently, because each person needs to stay their own anchor. Share feelings, but keep your own rituals too. When you meet as two whole people, this connection becomes soulful support rather than a fog you both get lost in.",
  },
  "Neptune|Venus": {
    conjunction:
      "This is classic soulmate shimmer. {A} makes {B} feel adored and romanced, seen through rose-tinted glass, and the pull can be enchanting. Creativity and tenderness run high. Enjoy the magic — and keep one foot on the floor. Real love can hold a disappointment and still glow. Scatter rose petals in a bowl of moon water and set the intention: let us love the real one.",
    harmonious:
      "Romance flows easily between {A} and {B}. {A} brings poetry, kindness and imagination to the way {B} loves, and {B} brings grace and warmth to {A}'s dreams. Shared beauty — music, art, candlelit dinners, walks at dusk — feeds the bond. Be generous with small gestures. A pink candle lit on a Friday, beside a written thank you, keeps this sweetness alive for years.",
    square:
      "{A} can stir in {B} a longing for a perfect love, then leave {B} unsure what is real. Gifts, promises and feelings may not always match. This is not a curse; it is a call for honesty. Talk about plans, money and expectations plainly. Once the illusions are named, what remains is tender, creative and surprisingly strong. Trust what you can see with your own eyes.",
    opposition:
      "{A} and {B} may each see an ideal in the other — the muse, the rescuer, the dream come true. The attraction is magnetic and soft. Over time, the real person steps out from behind the veil, and that is where true love begins. Welcome that moment. Light a white candle and speak your honest hopes aloud, so both of you can love what is actually there.",
  },
  "Neptune|Mars": {
    conjunction:
      "{A} softens and inspires {B}'s drive, sometimes beautifully, sometimes confusingly. {B} may feel moved to act from the heart — for art, a cause, a shared dream — yet also feel less sure of their direction. Desire here is romantic and imaginative. Keep plans concrete. Choose one shared project, write it down and give it a date. Inspiration becomes power once it has a path.",
    harmonious:
      "{A} gives {B}'s energy a gentle, inspired current. Together you can create, dance, heal or volunteer, and action feels guided rather than forced. Desire can be tender and imaginative. Use this flow well. Move together by the water, make something with your hands, or plan a small act of kindness for someone else. This is a bond where effort feels like devotion.",
    square:
      "{A} can leave {B} unsure how to act — energy rises, then slips away like water through fingers. Mixed signals around desire or plans are possible. Don't let that turn into blame. Ask directly what each of you wants, and agree on simple next steps you can both see. Sprinkle salt across the doorway to clear the air. Clear intentions turn this fog into something warm and real.",
    opposition:
      "{B} wants to move, {A} wants to drift and dream, and the pull between them can feel romantic or maddening by turns. Both rhythms carry wisdom. Neither should become the rescuer or the one who always waits. Agree on what is truly shared and what each pursues alone. With honest words, this becomes a beautiful balance of action and imagination rather than a slow leak of energy.",
  },
  "Neptune|Ascendant": {
    conjunction:
      "{A} sees {B} in a soft, flattering light, and {B} may feel more graceful, artistic or spiritual around them. There is a sense of being enchanted. It is lovely, and it is also worth checking: does {B} still feel like themselves? Keep your own style, voice and choices. Wear a moonstone, trust your instincts, and let the enchantment add to you rather than replace you.",
    harmonious:
      "This is a gentle, compassionate meeting. {A} brings kindness and quiet inspiration to how {B} meets the world, and {B} feels safe to show their softer, more creative sides. There is little pressure here, just easy understanding. Nurture it with shared quiet: a beach at dawn, a candlelit tarot pull, a slow Sunday morning. The magic is subtle, but it runs deep and true.",
    square:
      "{A} may see {B} not quite as they are, and {B} can feel misread or vaguely unsettled. First impressions blur at the edges. This softens easily with plain, kind conversation. Say who you are and what you need without hinting. Hang a small mirror by the front door as a reminder of clear sight. Over time the haze lifts, and a compassionate bond remains.",
    opposition:
      "Across this axis, {A} becomes {B}'s dream partner — or a puzzle {B} cannot quite solve. There is romance, mystery and deep compassion. The lesson is to see each other clearly as well as tenderly. Don't turn the other person into a saviour. Share real, ordinary days, not only the magical ones. When the veil thins, the love underneath is gentle and true.",
  },
  "Pluto|Sun": {
    conjunction:
      "This is a powerful meeting. {A} sees right to the core of {B}, and {B} may feel both magnetised and changed. Life rarely stays the same after a bond like this. The intensity is a gift when both people keep hold of their own power. Respect each other's choices and speak openly about who decides what. Light a black candle for protection and a gold one for growth.",
    harmonious:
      "{A} helps {B} become stronger, deeper and more certain of their purpose. The influence is steady and transformative, like water slowly reshaping stone. Together you can achieve something serious — a business, a healing, a big change of direction. Trust this alliance. Set a shared intention under a new moon and bury the written wish in a pot of soil. Then watch it grow.",
    square:
      "There can be a quiet tug of war here. {A} may push {B} to change, and {B} may resist being shaped. The energy is intense, and it is also deeply fertile. Name it gently: who decides what, and why? Respect each other's freedom, and choose the growth you both agree on. Salt by the threshold, honest words at the table — this is how strength becomes partnership.",
    opposition:
      "{A} and {B} meet like two strong tides. The attraction is deep, and so is the push and pull of will. Each can learn a great deal about their own power through the other. Keep it fair: equal say, equal space, equal care. When both stand in their own strength rather than trying to win, this bond becomes a profound mirror for growth and self-knowledge.",
  },
  "Pluto|Moon": {
    conjunction:
      "Feelings run very deep here. {A} reaches into {B}'s emotional core, stirring memories, longing and a powerful sense of bonding. It can feel fated. Treat that depth with care, and give each other privacy and time to process. A bowl of water with a pinch of salt beside the bed, refreshed every week, keeps emotions moving and clean. Intimacy this strong needs gentleness.",
    harmonious:
      "{A} helps {B} heal old emotional patterns simply by being present. There is trust, depth and quiet strength in this bond, and both can feel safe going to the hard places together. Treasure that. Share honest stories, cry if you need to, then cleanse together with rosemary smoke or a warm bath. This connection has the power to make both of you braver.",
    square:
      "{A} can stir {B}'s deepest feelings very quickly — jealousy, fear of loss, a strong need to hold on. This does not mean the bond is wrong; it shows where both of you have tender places. Go slowly. Speak feelings before they harden, and each keep your own friends and rituals. With patience, this becomes the bond where old wounds finally soften and heal.",
    opposition:
      "{A} and {B} pull at each other's emotions with real force. The intimacy is intense, and both may swing between wanting to merge and wanting to protect themselves. Find the middle path. Agree on what privacy means for each of you, and honour it. A shared monthly ritual — releasing what you no longer need at the waning moon — keeps this deep bond honest and free.",
  },
  "Pluto|Venus": {
    conjunction:
      "This is one of the most magnetic bonds there is. {A} draws {B} in with a desire that feels total, and love here can transform both people. It is not light romance; it is a deep current. Keep it healthy with trust and freedom on both sides. Wear garnet for passion and rose quartz for kindness, and let devotion always stay a choice, never a cage.",
    harmonious:
      "Love here runs deep and steady. {A} brings passion and loyalty to the way {B} loves, and the bond can grow stronger with every challenge you meet together. Values, closeness and the way you share what you have can all be transformed for the better. Trust the slow burn. Light a red candle on a Friday night and write down one shared value you will always protect.",
    square:
      "Desire is strong here, and so are the feelings that come with it — possessiveness, testing, a fear of being let go. These are human, not failures. Bring them into the light kindly, and agree openly on what loyalty looks like for you both. Cleanse your space with bay leaves and salt. When trust is built on purpose, this passion becomes deeply nourishing for {A} and {B}.",
    opposition:
      "{A} and {B} attract each other strongly, and the bond can swing between devotion and push-pull. Each holds up a mirror to what the other truly values. Don't play games to win. Let love be generous instead. Talk about money, affection and needs plainly. When both stay equal, this pairing becomes a place where love grows deeper and wiser with every passing year.",
  },
  "Pluto|Mars": {
    conjunction:
      "This is raw power meeting raw drive. {A} amplifies {B}'s energy, ambition and desire, sometimes to a thrilling, almost volcanic pitch. Together you can move mountains. The work is to point that force outward, at the world, not at each other. Choose a shared challenge — a project, a sport, a big goal. Burn a red candle with clear intention and let the fire build rather than scorch.",
    harmonious:
      "{A} gives {B}'s courage depth and staying power. Together you can push through obstacles that would stop most people, and the physical chemistry is often strong. Use this as a team. Train together, build together, finish what you start. Write your shared goal on a bay leaf, keep it in your pocket, and trust that your combined will is truly remarkable.",
    square:
      "Two strong wills meet here, and both may want to lead. Arguments can flare fast. Remember that tension is simply energy waiting for a direction. Agree on fair ways to disagree — a pause, a walk, a set time to talk it through. Channel the heat into movement or shared work. Once the force has a direction, few pairs are as capable together as {A} and {B}.",
    opposition:
      "{A} and {B} can feel like rivals as much as allies, the attraction sharpened by challenge. Each pushes the other to be stronger. Keep it a dance, not a battle. Respect each other's limits and never compete to dominate. A shared physical ritual, such as swimming in the sea or dancing barefoot, lets the energy flow and turns friction into a warm, steady fire.",
  },
  "Pluto|Ascendant": {
    conjunction:
      "{A} has a deep effect on how {B} sees themselves. Around this person, {B} may shed an old image and step into something truer and stronger. It is a profound change, sometimes uncomfortable, always growth. {B} should stay the author of that change, choosing its pace. Light a black candle to release the old and a white one to begin, and choose your new self consciously.",
    harmonious:
      "{A} quietly empowers {B}. Over time, {B} feels more confident, magnetic and self-possessed, as if {A} has helped them find their own centre. The influence is steady and positive, never rushed. Honour it with gratitude and with your own growth. Keep a piece of obsidian by the bed as a token of the strength you are discovering together, and trust what it shows you.",
    square:
      "{A} can challenge {B}'s self-image with real force, and {B} may feel pressed to change faster than they would like. Growth is on offer here, but only on {B}'s own terms. Talk openly about pace and respect. Cleanse with salt water before big conversations. When both honour each other's freedom to choose, this becomes the bond that makes both people stronger.",
    opposition:
      "{A} arrives in {B}'s life like a powerful partner who changes the very meaning of partnership. The attraction can be deep, and both may feel tested at times. Keep it balanced: equal power, equal voice. Talk openly about trust and what it means to each of you. When both stand tall rather than trying to steer the other, this becomes a transformative alliance built to last.",
  },
};

export const OVERLAY: Record<OverlayPlanet, Record<OverlayHouse, string>> = {
  Sun: {
    "1": "{A}'s Sun lights up {B}'s 1st house, and {B} feels more visible, confident and alive in their company. {A} notices {B} — their style, their presence, their spark — and reflects it back warmly. It is like standing in sunshine. {B} should enjoy it and grow from it, keeping their own identity bright rather than borrowed.",
    "2": "When {A}'s Sun lands in {B}'s 2nd house, {A} shines on what {B} values and how {B} feels about their own worth. {A} may admire {B}'s talents, taste or resourcefulness, and {B} begins to believe in them more. Shared practical plans flow easily. Keep a citrine somewhere you both see it, as a reminder of that warm confidence.",
    "3": "{A}'s Sun in {B}'s 3rd house makes conversation a joy. {B} feels more curious, chatty and quick-witted around {A}, and ideas bounce between them all day long. Short trips, messages, books and local adventures light up this bond. Keep talking. Even a shared notebook of thoughts and overheard lines can become a little piece of everyday magic.",
    "4": "{A}'s Sun warms {B}'s 4th house, the hearth of their life. {B} feels at home with {A} — comfortable, rooted, safe to be private and unpolished. {A} may brighten {B}'s living space or deepen their sense of belonging. Light a candle in the kitchen together. This bond grows strongest from shared, ordinary evenings, not grand occasions.",
    "5": "With {A}'s Sun in {B}'s 5th house, life becomes play. {B} feels more creative, flirtatious and light-hearted when {A} is near, and fun comes without effort. Romance, art, dancing and games all thrive. Don't save joy for special occasions. Make something together, laugh often, and let this be the bond that keeps {B} young at heart.",
    "6": "{A}'s Sun shines into {B}'s 6th house, the realm of daily rhythm. {A} helps {B} build better routines, take pride in their work and look after themselves well. This is a practical, helpful connection, and that is exactly its magic. Share a small morning ritual — tea, a walk, a spoken intention — and watch ordinary days begin to glow.",
    "7": "{A}'s Sun in {B}'s 7th house is a classic partner placement. {B} sees {A} as someone to stand beside, whether in love, friendship or work. There is a feeling of meeting an equal. Honour that with fairness and openness. When both give and receive in balance, this connection can become a true and lasting alliance.",
    "8": "{A}'s Sun lights up {B}'s 8th house, where intimacy and transformation live. {B} may feel drawn to share secrets, fears and desires with {A}, and the bond can run deep very fast. Trust grows slowly but surely. Respect each other's privacy, and treat anything you share or pool with care. This is a connection that changes people.",
    "9": "When {A}'s Sun falls in {B}'s 9th house, {A} widens {B}'s world. Travel, philosophy, faith, study and big conversations all come alive together. {B} feels inspired to explore further and believe in more. Plan a journey, even a small one. Read the same book and argue happily about it. This bond is a doorway to adventure for both.",
    "10": "{A}'s Sun in {B}'s 10th house shines on {B}'s ambitions and public life. {A} may encourage {B}'s path, see their potential clearly, or help raise their profile. {B} feels motivated to aim higher. Celebrate every achievement together. A gold candle lit on a Sunday, with a written goal tucked beneath it, suits this bond perfectly.",
    "11": "{A}'s Sun brightens {B}'s 11th house of friendship and hopes. Whatever else this bond becomes, it has a strong friendship at its heart. {A} encourages {B}'s dreams and brings them into new circles. Share causes, groups and plans for the future. This connection makes {B} feel part of something bigger and more hopeful.",
    "12": "{A}'s Sun shines quietly into {B}'s 12th house, the realm of dreams and the unseen. {B} may feel {A} understands the parts of them they rarely show. The connection can be spiritual, private, even healing. Give it gentle space. Meditate together, share dreams over breakfast, and let this tender bond reveal its gifts in its own time.",
  },
  Moon: {
    "1": "{A}'s Moon in {B}'s 1st house brings instant emotional familiarity. {A} responds to {B}'s presence with feeling, and {B} feels noticed, cared for and perhaps a little exposed. Moods pass quickly between the two of them. Keep kindness at the centre. A moonstone worn by {B} helps them stay soft yet steady in this tender connection.",
    "2": "With {A}'s Moon in {B}'s 2nd house, {A} feels comforted by what {B} offers — their steadiness, their values, the way they care for things. {B} feels valued and secure in return. Shared meals, small gifts and home comforts matter here. Cook together often. Simple pleasures make this bond feel safe and abundant in the best sense.",
    "3": "{A}'s Moon in {B}'s 3rd house makes talk emotional and soothing. {B} finds it easy to chat with {A} about feelings, and {A} hears what lies behind {B}'s words. Daily messages and small check-ins mean a great deal. Leave a little handwritten note now and then. Gentle words are the thread that holds this bond together.",
    "4": "This is one of the most homely placements there is. {A}'s Moon in {B}'s 4th house makes {B} feel they have come home. Family feeling, nest-making, memories and comfort run through the bond. Protect it with shared rituals — Sunday dinners, cleansing the house with rosemary, a candle in the window. Belonging grows here naturally.",
    "5": "{A}'s Moon in {B}'s 5th house brings warm playfulness. {B} feels free to be silly, creative and affectionate with {A}, and {A} delights in {B}'s joy. Romance, where it exists, is tender and sweet. Laugh together, make art, dance in the kitchen. This bond reminds both people that joy itself is a kind of nourishment.",
    "6": "{A}'s Moon falls in {B}'s 6th house, where care becomes daily. {A} may help {B} feel steadier in their routine, and {B} may find themselves looking after {A} in small ways. Kindness here is practical — the tea made, the chore shared. Keep it balanced so neither feels like the only helper. Gratitude keeps it sweet.",
    "7": "With {A}'s Moon in {B}'s 7th house, {B} feels an emotional pull toward partnership with {A}. There is natural tenderness and a wish to share life and feelings openly. Both may sense the other's needs easily. Talk about those needs plainly too. A bowl of moon water shared at the full moon blesses this bond beautifully.",
    "8": "{A}'s Moon in {B}'s 8th house creates deep emotional intimacy. {B} may open up to {A} about things they rarely share, and the bond can feel profound and private. Feelings run strong in both directions. Honour trust above all, and give each other space when it is needed. Cleansing baths with salt and lavender keep this depth gentle.",
    "9": "{A}'s Moon in {B}'s 9th house brings emotional comfort through shared beliefs and adventures. {B} feels safe exploring big questions with {A}, and travelling together can feel like home. Spiritual practice binds this bond. Read tarot together, visit new places, talk about meaning late into the night. This connection grows wider and wiser with time.",
    "10": "With {A}'s Moon in {B}'s 10th house, {A} cares deeply about {B}'s ambitions and public life. {B} may feel supported in their goals, or especially sensitive to {A}'s opinion of their path. Encouragement matters greatly here, so offer it freely. Light a white candle on a Monday for {B}'s next step, and celebrate milestones together.",
    "11": "{A}'s Moon in {B}'s 11th house brings a warm, friendly ease. {B} feels emotionally at home with {A} as a friend first, and the bond is easy to share with others. Gatherings, causes and dreams for the future bring you closer. This connection feels like family you chose for yourselves, and that is precious. Look after it.",
    "12": "{A}'s Moon in {B}'s 12th house touches {B} somewhere quiet and secret. {A} may sense {B}'s hidden feelings, fears or dreams almost without words. The bond can feel psychic and healing. Keep honesty gentle and clear, so nothing festers in silence. Shared meditation or side-by-side dream journals deepen this soulful, tender link.",
  },
  Mercury: {
    "1": "{A}'s Mercury in {B}'s 1st house means {A} has a lot to say about {B} — observations, ideas, compliments, questions. {B} feels mentally switched on and may start thinking about themselves in new ways. Keep feedback kind and curious. This is a bond where conversation shapes identity, so choose words with care and warmth.",
    "2": "With {A}'s Mercury in {B}'s 2nd house, {A} helps {B} think clearly about what they value and how they use their talents. Practical talks come easily — plans, skills, creative side projects, how to spend a free weekend. {B} may feel more resourceful. Write shared goals down. Words here have a way of becoming something solid.",
    "3": "{A}'s Mercury in {B}'s 3rd house is a true meeting of minds. Talk flows endlessly — jokes, messages, debates, plans. {B} feels sharper and more curious around {A}, and learning together is a joy. Take a class, swap books, start a shared notebook. This bond thrives on the simple pleasure of understanding each other.",
    "4": "{A}'s Mercury falls in {B}'s 4th house, bringing conversation into the heart of home. {B} may find it easy to talk with {A} about family, roots and private matters. The home itself may fill with books, chatter and ideas. Keep some quiet there too. This bond turns kitchen-table talks into treasured memories.",
    "5": "With {A}'s Mercury in {B}'s 5th house, talking is play. Flirting, banter, word games and creative ideas sparkle between them. {B} feels clever and delighted. This is a lovely placement for collaborating on art or fun projects. Write each other little notes. Keep the wit warm, and laughter becomes your shared language.",
    "6": "{A}'s Mercury in {B}'s 6th house is wonderfully practical. {A} offers ideas that help {B} organise daily life, work routines and self-care habits. Talk is useful and grounded. Make lists together, plan the week, swap tips. Just keep advice gentle and invited, so it always feels like help rather than correction.",
    "7": "{A}'s Mercury in {B}'s 7th house makes communication central to the partnership. {B} sees {A} as someone to talk things through with, a true sounding board. Agreements, plans and honest dialogue come naturally. Keep talking, especially when it is hard. This bond grows strongest when both feel heard and fairly answered.",
    "8": "With {A}'s Mercury in {B}'s 8th house, conversations go deep fast. {A} asks the questions others avoid, and {B} may find themselves sharing secrets or exploring subjects they usually keep to themselves. It is fascinating and intimate. Respect whatever is shared in confidence. This bond can uncover truths that transform both minds.",
    "9": "{A}'s Mercury in {B}'s 9th house opens {B}'s mind. Philosophy, travel, spirituality and learning fill your conversations. {B} feels inspired to study and think bigger. Plan trips, debate ideas, read each other's charts together. Keep an open mind to each other's beliefs, and this bond becomes a little school of wisdom.",
    "10": "{A}'s Mercury falls in {B}'s 10th house, bringing smart ideas to {B}'s ambitions. {A} may help {B} think through big moves, shape their plans or simply talk them into aiming higher. Practical encouragement flows. Keep it respectful and celebrate {B}'s own judgement. This bond is excellent for shared projects or mentoring.",
    "11": "With {A}'s Mercury in {B}'s 11th house, friendship and ideas go hand in hand. You talk about the future, causes, groups and dreams with ease. {A} may introduce {B} to new people and fresh ideas. Make a vision board together. This connection is mentally stimulating and keeps both minds young and hopeful.",
    "12": "{A}'s Mercury in {B}'s 12th house touches the unspoken. {A} may sense {B}'s hidden thoughts, and conversations drift easily to dreams, intuition and the spiritual. Sometimes things go unsaid. Gently say them anyway. Keep a shared dream journal by the bed. This bond can help {B} find words for feelings long kept quiet.",
  },
  Venus: {
    "1": "{A}'s Venus in {B}'s 1st house means {A} finds {B} truly attractive — their look, their manner, their energy. {B} feels beautiful and admired around {A}, and affection comes easily. Enjoy it. Wear something that makes you feel lovely, light a pink candle, and let this sweet appreciation flow freely in both directions.",
    "2": "With {A}'s Venus in {B}'s 2nd house, {A} appreciates what {B} values and helps {B} feel worthy. Thoughtful gifts, shared pleasures and comforts are part of the bond. {B} feels more secure and abundant in spirit. Treat each other to simple luxuries — flowers, a good meal, an unhurried afternoon. Generosity here grows naturally.",
    "3": "{A}'s Venus in {B}'s 3rd house sweetens everyday talk. Conversations are affectionate, messages warm, and outings easy and pleasant. {B} enjoys {A}'s company on the most ordinary days. Write love notes or kind messages. Take short walks together. This bond turns everyday moments into little gifts of affection.",
    "4": "{A}'s Venus in {B}'s 4th house brings love into the home. {B} feels cosy and cherished with {A}, and shared spaces become beautiful and peaceful. Making a nest together comes naturally. Bring fresh flowers home, cook something lovely, cleanse the rooms with rose water. This is a bond that feels like comfort itself.",
    "5": "With {A}'s Venus in {B}'s 5th house, romance and fun blossom. {B} feels flirty, creative and delighted around {A}. Dates, art, music and dancing all suit this bond. It is one of the sweetest placements for love affairs and joyful friendships alike. Keep courting each other, always. Play is your love language.",
    "6": "{A}'s Venus falls in {B}'s 6th house, bringing affection to daily life. {A} makes {B}'s routines lighter and more pleasant, and small acts of care mean a lot. Working side by side can be harmonious. Love is shown in the doing — tea brought, tasks shared. Say thank you often, and this gentle bond quietly flourishes.",
    "7": "{A}'s Venus in {B}'s 7th house is a beautiful partnership placement. {B} sees {A} as a natural companion, someone to share life with. Harmony, charm and a wish to commit can arrive easily. Honour it with fairness and tenderness. Tie a pink ribbon around two rose quartz stones as a token of your bond.",
    "8": "With {A}'s Venus in {B}'s 8th house, attraction runs deep and private. Intimacy, trust and emotional closeness grow strong, and {B} may feel {A} touches their soul. Whatever you share or pool together deserves care and clear agreements. Cherish the depth. This bond can transform how both people understand love.",
    "9": "{A}'s Venus in {B}'s 9th house makes love an adventure. Travel, culture, learning and shared beliefs bring you closer. {B} feels inspired and expanded by {A}. Plan a trip, explore a new cuisine, talk philosophy over a long dinner. This bond thrives when both keep discovering the world — and each other.",
    "10": "{A}'s Venus in {B}'s 10th house brings grace to {B}'s public life. {A} admires {B}'s ambitions and may support their goals or speak warmly of them to others. {B} feels proud to be seen with {A}. Celebrate achievements together. Light a green candle for {B}'s next success and let mutual admiration keep this bond strong.",
    "11": "With {A}'s Venus in {B}'s 11th house, love and friendship mix sweetly. {B} enjoys {A} in groups, among friends, at gatherings. Shared hopes and dreams bond you. Whatever form the relationship takes, the friendship is golden. Host a dinner, join a cause together. This bond grows through community and shared joy.",
    "12": "{A}'s Venus in {B}'s 12th house brings a hidden, tender love. {B} may feel {A}'s affection in quiet, spiritual or private ways. There can be a sense of soul recognition. Make sure what is felt is also spoken, gently and clearly. Share rituals, dreams and comfortable silence. This bond carries a deep, healing kind of love.",
  },
  Mars: {
    "1": "{A}'s Mars in {B}'s 1st house brings energy straight to {B}'s sense of self. {B} feels more confident, bold and physically alive around {A} — and sometimes provoked. Chemistry can be strong. Use the spark for adventure rather than arguments. Exercise, dance or take on a challenge together. This bond makes {B} braver.",
    "2": "With {A}'s Mars in {B}'s 2nd house, {A} energises {B}'s ambitions around skills, values and the things they want to build. {B} may feel motivated to work hard and protect what matters. There can be friction over priorities or spending. Talk it through calmly. Channelled well, this placement helps {B} act on their own worth.",
    "3": "{A}'s Mars in {B}'s 3rd house makes conversations lively and spirited. Debates, quick ideas and fast messages fly between them. {B} feels mentally fired up, though words can turn sharp in haste. Pause before replying in a heated moment. Used well, this placement makes you brilliant partners for any project that needs talk and action.",
    "4": "{A}'s Mars falls in {B}'s 4th house, stirring energy at home. {A} may motivate {B} to redecorate, move or change their living space. Feelings around family can be stirred too. Keep home a sanctuary by agreeing how shared spaces work. Cleanse with salt and sage after any tension. This placement turns homes into projects.",
    "5": "With {A}'s Mars in {B}'s 5th house, passion and play run high. Romance can be exciting, and fun often involves sport, friendly competition or adventure. {B} feels bold and alive. Keep it playful, with no point-scoring. Dance, play games, create something daring together. This bond brings heat and joy in equal measure.",
    "6": "{A}'s Mars in {B}'s 6th house energises daily routines. {A} motivates {B} to get things done, move their body or tackle work with fresh vigour. Sometimes this can feel like pressure. Agree on a pace that suits {B}. Working side by side can be wonderfully productive here, and shared tasks quickly become shared victories.",
    "7": "{A}'s Mars in {B}'s 7th house brings dynamic energy to the partnership. There is attraction, drive and the occasional clash of wills. {B} feels challenged and energised by {A}. Keep it fair and take turns leading. Disagreements can be healthy when handled with respect. This bond is passionate and anything but dull.",
    "8": "With {A}'s Mars in {B}'s 8th house, desire and intensity run deep. Physical chemistry can be powerful, and {A} stirs {B}'s hidden depths. Strong feelings may also gather around anything you share or own together. Keep trust and consent at the heart of everything. Handled with care, this bond is deeply transformative.",
    "9": "{A}'s Mars in {B}'s 9th house sparks adventure and debate. {A} inspires {B} to travel, study or take a bold leap of faith. Discussions about beliefs can be spirited, so respect each other's differences of opinion. Plan an active trip — hiking, sailing, exploring a new coastline. This bond pushes both to live bigger lives.",
    "10": "{A}'s Mars in {B}'s 10th house drives {B}'s ambitions forward. {A} may push {B} to go for the bigger role, launch a project or claim their place. This is motivating, and occasionally a little intense. Let {B} set their own goals. Burn a red candle for courage before big steps. This bond builds real momentum.",
    "11": "With {A}'s Mars in {B}'s 11th house, energy flows into shared dreams and friendship. {A} motivates {B} to act on their hopes, join causes or meet new people. There may be lively debates among friends. Channel it all into teamwork. Together, you can turn big ideas into real community action that others will remember.",
    "12": "{A}'s Mars in {B}'s 12th house stirs hidden energy. {A} may awaken {B}'s buried desires or unspoken frustrations. Not everything is said openly here, so make space for honesty. Movement helps — yoga, swimming, dance. A cleansing salt bath after strong feelings keeps this bond clear, and over time it can be quietly healing.",
  },
  Jupiter: {
    "1": "{A}'s Jupiter in {B}'s 1st house is a generous blessing. {A} believes in {B}, encourages them and helps them feel bigger, brighter and more optimistic. {B} may grow noticeably in confidence around {A}. Enjoy this lucky connection. Light a purple candle on a Thursday and thank the Universe for bringing you together.",
    "2": "With {A}'s Jupiter in {B}'s 2nd house, {A} encourages {B} to value themselves more and to trust their talents. There can be generosity, shared comforts and a feeling of abundance. Keep it grounded — enjoyment, not excess. Tuck a cinnamon stick into your bag as a little charm for this warm, encouraging bond.",
    "3": "{A}'s Jupiter in {B}'s 3rd house makes conversation inspiring. {A} expands {B}'s thinking, introduces new ideas and encourages learning. Talks are optimistic and wide-ranging. Take a course together, explore your local area, share books. This bond turns everyday chats into lessons in wisdom and humour.",
    "4": "{A}'s Jupiter in {B}'s 4th house blesses home and family life. {B} feels safe, welcomed and expansive with {A}. Living together, or simply visiting, feels generous and warm. Host friends, cook abundantly, fill the rooms with plants. This is a bond that makes any house feel larger and happier than it really is.",
    "5": "With {A}'s Jupiter in {B}'s 5th house, joy multiplies. Romance, creativity and fun flourish, and {B} feels lucky and playful with {A}. Celebrations and adventures suit this bond perfectly. Laugh loudly, play often, create freely. Light a yellow candle and dedicate it to happiness. This placement is pure delight.",
    "6": "{A}'s Jupiter falls in {B}'s 6th house, bringing optimism to daily life. {A} helps {B} enjoy work, build better habits and approach routines with a lighter heart. There is a helpful, kind energy here. Share good meals, walks and humour. Small daily blessings add up to a great deal in this bond.",
    "7": "{A}'s Jupiter in {B}'s 7th house is a wonderful partnership placement. {B} sees {A} as generous, wise and supportive — a partner who helps them grow. There is trust and good faith on both sides. Honour it with gratitude. Set a shared intention at the new moon, and this bond will keep expanding in beautiful ways.",
    "8": "With {A}'s Jupiter in {B}'s 8th house, intimacy feels generous and healing. {A} helps {B} open up, trust and grow through deep experiences. Anything you share or plan together benefits from this wise, hopeful energy. Keep honesty at the centre. This bond can bring profound personal growth and a feeling of being truly held.",
    "9": "{A}'s Jupiter in {B}'s 9th house is a classic placement for adventure and wisdom. Travel, study, spirituality and big ideas flourish between you. {A} inspires {B} to see the world anew. Plan journeys, read old myths and sacred texts, talk until midnight. This bond is a passport to growth and wonder.",
    "10": "{A}'s Jupiter in {B}'s 10th house supports {B}'s ambitions generously. {A} may open doors, offer encouragement or simply believe in {B}'s path when doubts creep in. {B} feels motivated and seen. Celebrate milestones together. Write {B}'s big dream on a bay leaf and keep it somewhere safe. This bond lifts hopes high.",
    "11": "With {A}'s Jupiter in {B}'s 11th house, friendship and hope flourish. {A} broadens {B}'s social world and encourages their dreams. Groups, causes and community bring joy to you both. This is a lucky, uplifting connection. Share your wishes aloud at a new moon gathering, and watch them slowly begin to take shape.",
    "12": "{A}'s Jupiter in {B}'s 12th house is a quiet guardian. {A} may bring spiritual comfort, forgiveness and a sense of protection to {B}'s inner world. {B} feels supported in private ways. Meditate together, share dreams, practise gratitude. This bond can bring a deep, gentle healing that words cannot fully capture.",
  },
  Saturn: {
    "1": "{A}'s Saturn in {B}'s 1st house brings seriousness to how {B} sees themselves. {A} may offer structure, guidance or honest feedback, which can feel supportive or a little heavy. Through it, {B} grows more mature and steady. Keep criticism kind and rare. Wear black tourmaline for grounding. This bond builds lasting confidence over time.",
    "2": "With {A}'s Saturn in {B}'s 2nd house, {A} encourages {B} to be careful with resources and serious about their values. This can feel grounding, or restrictive at times. Talk openly about priorities and keep the conversation kind. Over time, this placement helps {B} build real steadiness and a stronger sense of their own worth.",
    "3": "{A}'s Saturn in {B}'s 3rd house brings depth and discipline to conversation. {A} may help {B} think clearly and speak carefully, though talks can sometimes feel serious or slow. Patience is key. Learn something together — a course, a craft, a language. Words spoken here carry weight, so make them kind and meaningful.",
    "4": "{A}'s Saturn falls in {B}'s 4th house, bringing structure to home and family matters. {A} may help {B} build a stable foundation, or stir feelings around duty and roots. Commitments here run deep. Make home warm as well as orderly. Light a white candle in the kitchen to bless the foundations you are building together.",
    "5": "With {A}'s Saturn in {B}'s 5th house, play meets responsibility. {A} may encourage {B} to take their creative gifts seriously, though fun can feel a little restrained at first. Romance grows slowly and steadily. Make room for silliness on purpose. Plan playful dates, and this bond can become both joyful and lasting.",
    "6": "{A}'s Saturn in {B}'s 6th house brings discipline to daily routines. {A} helps {B} organise, work steadily and build healthy habits. It can sometimes feel strict. Agree on gentle, realistic goals and review them together. Over time, this placement creates calm, productive days and a deep sense of reliability in the bond.",
    "7": "{A}'s Saturn in {B}'s 7th house is a strong commitment placement. {B} sees {A} as serious, dependable, perhaps even fated. There is loyalty and a wish to build something lasting. Responsibilities may feel heavy at times, so share them fairly. Tend a plant together as a living symbol of your slowly growing bond.",
    "8": "With {A}'s Saturn in {B}'s 8th house, intimacy is approached with care and caution. Trust builds slowly, but once it is established it runs very deep. Anything you share needs clear agreements. Be patient with each other's fears. This bond teaches both people how to let go and how to build real, lasting closeness.",
    "9": "{A}'s Saturn in {B}'s 9th house brings structure to beliefs and learning. {A} may question {B}'s ideas or help them study seriously. Travel plans need careful organising. Respect each other's views. Over time, this placement deepens {B}'s wisdom and turns dreams of growth into grounded, practical knowledge they can use.",
    "10": "{A}'s Saturn in {B}'s 10th house supports {B}'s ambitions with discipline and long-term vision. {A} may act as a mentor, a steady presence or a gentle voice of realism. This can feel demanding. Trust that it builds something real. Write a five-year goal together and revisit it each spring. This bond is built for achievement.",
    "11": "With {A}'s Saturn in {B}'s 11th house, friendship becomes loyal and lasting. {A} helps {B} turn hopes into realistic plans. Social life may be quieter but deeper. Choose your circle wisely together. This bond can become a lifelong friendship, the kind that holds steady through every season and every change.",
    "12": "{A}'s Saturn in {B}'s 12th house touches {B}'s private fears and hidden worries. {A} may help {B} face what they usually avoid, gently building inner strength. This can feel heavy at times. Practise rituals of release — write down fears and burn the paper safely in a dish. Over time, this bond brings deep peace.",
  },
};

export const SCORE_NOTE: Record<ScoreArea, { high: string; mid: string; low: string }> = {
  love: {
    high: "Love flows easily between you two. Affection, kindness and appreciation come naturally, and both of you feel cherished. Keep tending it with small daily gestures — a word, a touch, a candle lit for no reason at all. This sweetness is a gift. Protect it.",
    mid: "There is real warmth here, with a few places where your ways of showing love differ. That is normal and workable. Learn how the other likes to be cared for, and offer it on purpose. Affection grows quickly when it is chosen, day after day.",
    low: "Love here may not arrive in the easy, obvious ways, and that is not a verdict. It asks for patience and clear words about what each of you needs. Choose kindness daily and notice small efforts. Many deep, lasting bonds start exactly like this.",
  },
  communication: {
    high: "Talking is a joy for you two. Ideas, jokes and honest feelings move freely, and you understand each other quickly. Use that gift for the hard conversations too, not only the easy ones. A bond that can speak this freely can solve almost anything.",
    mid: "You understand each other well most of the time, with the occasional crossed wire. Slow down when it matters, ask instead of assuming, and repeat back what you heard. Small habits like these make your conversations flow beautifully over time.",
    low: "Your minds work differently, so misunderstandings can happen. That difference is also a source of fresh perspective. Speak plainly, listen fully and write important things down. With patience, the two of you can build a language that is entirely your own.",
  },
  passion: {
    high: "The spark between you is strong and alive. Attraction, excitement and shared energy come easily. Keep it playful and respectful, and point some of that fire toward adventures together. Passion like this is a powerful kind of magic, so use it well.",
    mid: "There is genuine chemistry here, sometimes glowing, sometimes quieter. That rhythm is natural. Feed the flame with novelty — a new place, a dance in the kitchen, an evening without screens. Desire grows when you give it attention and room to breathe.",
    low: "The spark may be gentle rather than fiery, and that can be lovely. Passion often grows from trust, laughter and shared adventure. Try new experiences together and speak openly about what you each desire. A slow flame can burn the longest.",
  },
  stability: {
    high: "This bond has deep roots. You feel safe, loyal and dependable to each other, and commitment comes naturally. Treasure that steadiness, and let it hold space for fun and change too. Solid ground is where the best magic grows.",
    mid: "You have a good foundation, with a few areas that need care. Agree on routines, plans and what reliability means for each of you. Small promises kept, again and again, turn this bond into something truly steady and safe for both of you.",
    low: "Security may not come automatically here, but it can absolutely be built. Be clear about expectations, keep your word in little things, and talk about the future honestly. Steadiness is a practice, and the two of you can practise it together.",
  },
  growth: {
    high: "You bring out the best in each other. This bond encourages learning, courage and spiritual expansion, and both of you change for the better. Dream big together. Set a shared intention at the new moon, write it down, and follow where it leads.",
    mid: "There is real potential for growth here, especially when you both stay curious. Share your goals, support each other's learning and celebrate progress, however small. This bond rewards steady effort with wisdom, bit by bit and season by season.",
    low: "Growth may come through challenge rather than ease, and that is still growth. Each of you can learn a great deal from your differences. Approach them with curiosity, not judgement. The lessons this bond offers can make you both wiser and kinder.",
  },
};
