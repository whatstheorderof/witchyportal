/**
 * "This week in astrology" — collective sky events (not per sign).
 * Original Witchy Portal copy in Yulia Moon's voice.
 */
import type { SignText } from "../types";

/** A planet entering a new sign: the shift in the collective mood and how to work with it. */
export const INGRESS: Record<"Sun" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn", SignText> = {
  Sun: {
    Aries:
      "The Sun crosses into Aries and the astrological year begins again. After the dreamy drift of Pisces season, the collective mood wakes up — impatient, bold, ready to start.\n\nUse this fire while it is fresh. Choose one thing you have postponed and take the first step this week, however small. Light a red candle, say your intention aloud, and act before doubt has time to speak. Courage grows by using it.",
    Taurus:
      "Taurus season arrives and the pace softens. The Sun now asks everyone to slow down, return to the body and enjoy what is real — good bread, warm sunlight, a garden after rain. Patience becomes a strength again.\n\nThis is the season to tend whatever you want to last, from a friendship to a daily practice to a creative skill. Place a piece of green aventurine by your bed and let the Universe remind you that steady things grow.",
    Gemini:
      "With the Sun in Gemini, the air fills with conversation. Curiosity wakes up in all of us — new books, new people, messages flying back and forth. Minds move quickly now, and that is a gift as long as you don't scatter yourself across twenty things at once.\n\nSay yes to learning. Write down every idea that sparks this month in one small notebook, and by the end of the season you will see which ones truly deserve your energy.",
    Cancer:
      "The Sun enters Cancer at the solstice and the collective turns towards home. People want comfort, family of every kind, the safety of familiar walls. Feelings run closer to the surface, so be gentle with others and with yourself.\n\nThis is a beautiful season for kitchen magic. Cook a dish someone once made for you with love, sweep your doorstep with salt water and bless your home. Protect your peace without hiding from the world.",
    Leo:
      "Leo season brings the Sun home to its own sign, and the world remembers how to shine. Confidence rises, celebrations multiply and everyone wants to be seen a little more. Let yourself be.\n\nWear the colour you love, share the work you are proud of, laugh loudly. Generosity is the secret of this season — praise others freely and your own light grows. Light a gold candle for joy, and don't apologise for taking up space.",
    Virgo:
      "As the Sun moves into Virgo, summer's glow turns practical. The collective mood wants order — clean drawers, clear plans, routines that actually work. This is harvest energy: sort what is ripe from what is spoiled.\n\nChoose one area of life to simplify and do it properly. A sprig of rosemary on your desk keeps the mind clear. Just don't let the urge to improve become harsh criticism. Small, kind adjustments are the real magic now.",
    Libra:
      "The Sun enters Libra at the equinox, when day and night stand briefly equal, and balance becomes the theme for all of us. Relationships, fairness and beauty move to the front of the mind.\n\nIt is a lovely season to mend a disagreement, refresh your home or simply make life more graceful. Notice where you give too much and where you hold back. Place two candles side by side, one pink and one white, and ask for harmony.",
    Scorpio:
      "Scorpio season pulls us beneath the surface. The Sun now turns everyone's attention to what is hidden — real feelings, old secrets, the deep truth under polite conversation. Intensity rises, and so does intuition.\n\nThis is the witch's season, when the veil feels thin and divination comes easily. Pull a tarot card each night and keep a dream journal by your bed. Let go of what has ended in your life, and make room for your own rebirth.",
    Sagittarius:
      "With the Sun in Sagittarius, the mood lifts and the horizon widens. People want adventure, meaning and a good laugh. Plan a journey, sign up for that course, ask big questions about what you believe.\n\nOptimism is contagious now, so share it. Just keep your promises realistic — enthusiasm can write cheques that time can't cash. Burn a dried bay leaf in a fireproof dish with a wish for the year ahead, and aim your arrow high.",
    Capricorn:
      "The Sun enters Capricorn at the winter solstice in the north, the longest night, and from here the light begins its slow return. The collective mood turns serious and ambitious. People want structure, results and goals they can build on.\n\nThis is the season to plan your year with honesty. Write down one goal and the first three practical steps towards it. Light a dark green candle for discipline, and remember that slow progress is still progress.",
    Aquarius:
      "Aquarius season blows fresh, cool air into the year. The Sun now asks all of us to think differently, to question old rules and to look towards the future. Friendship, community and originality matter more than tradition.\n\nThis is a wonderful time to join a group, support a cause you believe in or try a strange new idea. Let your quirks out. Charge a jar of water under the stars and sprinkle it at your threshold to invite inspiration in.",
    Pisces:
      "The Sun slips into Pisces, the last sign of the zodiac, and the world grows softer and more dreamy. Boundaries blur, compassion deepens and intuition speaks loudly to anyone who listens.\n\nThis is the closing chapter before the astrological year begins again — a time to rest, forgive and let things dissolve. Take a salt bath with a few drops of lavender oil. Pay attention to your dreams. Art, music and quiet prayer feed the soul now.",
  },
  Mercury: {
    Aries:
      "Mercury races into Aries and conversations speed up. People speak first and think later, so expect quick decisions, bold opinions and the odd sharp word. Use this for honesty and for starting things: pitch the idea, send the message you have been drafting for weeks. Just pause for one breath before replying in anger. Courageous words open doors; careless ones close them.",
    Taurus:
      "When Mercury enters Taurus, thinking slows to a steady walk. Minds become practical and a little stubborn — people want facts, not theories, and they take their time to decide. This is excellent for careful planning, budgeting and learning a hands-on skill. Don't rush anyone into an answer now. Write your plans on paper with a green pen and let them settle like seeds.",
    Gemini:
      "Mercury is at home in Gemini, and the collective mind sparkles. Ideas multiply, messages arrive from every direction and curiosity is everywhere. It is a brilliant time to write, study, network and talk things through. The only danger is overload. Keep a list, finish one thought before starting the next, and switch your phone off at night so your mind can rest.",
    Cancer:
      "With Mercury in Cancer, words carry feelings. People remember how you said something long after they forget what you said. Conversations turn to family, home and the past, and memory is strong. Speak gently and listen for what sits beneath the words. This is a beautiful time to write letters, record family stories or simply call someone who has been on your mind.",
    Leo:
      "Mercury steps into Leo and everyone wants to tell their story. Speech becomes dramatic, warm and confident, and creative ideas come with real flair. Present your work, perform, write with heart. People respond to sincerity now more than cleverness. Just remember to let others have the stage too. A conversation where everyone feels heard is the most magical kind.",
    Virgo:
      "In Virgo, Mercury is sharp, precise and wonderfully useful. The collective mind wants details, lists and solutions. This is the moment to edit, organise, fix the small things that have been bothering you and tidy the paperwork. Analysis comes easily. Be careful, though, that the inner critic doesn't take over. Correct with kindness, and remember that good enough is often perfect.",
    Libra:
      "Mercury moves into Libra and conversation becomes diplomatic. People weigh both sides, look for compromise and choose their words with care. It is a lovely time for negotiation, partnership talks and making peace. Indecision is the shadow side, so set yourself a gentle deadline for any choice you keep circling. Fairness matters now, and so does saying what you actually think.",
    Scorpio:
      "With Mercury in Scorpio, thought dives deep. Small talk feels empty and people want the truth, even the uncomfortable kind. Research, investigation and private conversations go well, and secrets may come to light. Use this sharp perception wisely and don't let it turn into suspicion. Write down what your intuition is telling you, then look calmly for the evidence before you act.",
    Sagittarius:
      "Mercury enters Sagittarius and the mind wants to roam. Big ideas, philosophy, travel plans and honest opinions fill the air. People speak frankly, sometimes too frankly, so add a little tact to your truth. This is a wonderful time to study something that expands your world. Keep the bigger picture in sight, but read the small print before you agree to anything.",
    Capricorn:
      "In Capricorn, Mercury thinks like an architect. Conversations become serious, structured and focused on results. It is an excellent time for long-term planning, difficult professional talks and decisions that need maturity. People value reliability over charm now. Say what you mean and do what you say. Light a brown candle while you write out your plan, and keep it realistic.",
    Aquarius:
      "Mercury moves into Aquarius and the collective mind becomes inventive. Unusual ideas, sudden insights and conversations about the future are everywhere. Technology, groups and friendships buzz with activity. This is the moment to brainstorm, to question how things have always been done and to share your original view. Stay open to others too — genius loves good company.",
    Pisces:
      "With Mercury in Pisces, logic softens and imagination takes over. Thoughts drift, words become poetic and intuition often knows the answer before the mind does. This is a gorgeous time for creative writing, meditation and listening to your dreams. Practical details slip easily, so double-check times and addresses. Keep a notebook by your bed — the best messages come at night.",
  },
  Venus: {
    Aries:
      "Venus enters Aries and affection turns bold. Attraction is sudden, flirting is playful and people go after what they want without waiting to be asked. Whether you are single or partnered, bring some spark back: make the first move, plan something spontaneous. Patience is in short supply, so don't mistake excitement for depth. Wear something red and enjoy the chase.",
    Taurus:
      "Venus is at home in Taurus, and life becomes sensual and slow. Comfort, beauty and loyalty matter most now. Good food, soft fabrics, flowers and touch all feel like medicine for the soul. Relationships grow through small, steady gestures. Treat yourself well, but don't try to buy happiness. Fill a bowl with rose petals and a piece of rose quartz, and let love settle in.",
    Gemini:
      "With Venus in Gemini, love starts with conversation. Wit, curiosity and lightness make people attractive now, and new connections often begin with a message or a funny exchange. Couples can refresh things by talking, playing and trying something new together. Commitment may feel less urgent than fun for a while. Enjoy the variety, and stay honest about your intentions.",
    Cancer:
      "Venus moves into Cancer and the heart longs for safety. People want to nurture and be nurtured, and love shows itself in care rather than grand gestures. Home, cooking and family of every kind become sources of tenderness. Feelings bruise easily, so handle them softly. Make your home a little sanctuary this month, and let someone take care of you for once.",
    Leo:
      "Venus enters Leo and romance gets theatrical. Love wants to be celebrated, admired and shown off. Flirting is warm, generosity flows and creative pleasures shine. Whether you are dating, committed or happily on your own, let life feel like a party sometimes. Compliment freely. If you feel unappreciated, don't sulk — ask for the attention you want, plainly and with grace.",
    Virgo:
      "In Virgo, Venus loves through service. Affection is shown in practical help — the fixed shelf, the remembered appointment, the cup of tea made just right. People grow more discerning about who and what they let into their lives. This is a good time to refine your style and simplify your pleasures. Be careful not to criticise love away. Appreciate what is already good.",
    Libra:
      "Venus returns home to Libra, and grace fills the air. Relationships, harmony and beauty become a shared priority. It is a lovely time to make peace, dress up, refresh your home and enjoy art. Partnerships of every kind can deepen through fairness and courtesy. Just don't sacrifice your own needs to keep the peace. True balance includes you, too.",
    Scorpio:
      "Venus enters Scorpio and desire grows deep and serious. Surface charm isn't enough now; people want intimacy, loyalty and real emotional truth. Attractions can feel magnetic and a little fated. Jealousy and possessiveness are the shadow, so name your feelings instead of hiding them. Light a deep red candle and ask yourself honestly what your heart is hungry for.",
    Sagittarius:
      "With Venus in Sagittarius, love wants freedom and adventure. People are drawn to laughter, honesty and anyone who widens their world. Holiday romances, friendships across cultures and spontaneous plans all fit this energy. Couples do well to try something completely new together. Restlessness is the risk, so tell the truth about what you need instead of running away.",
    Capricorn:
      "Venus moves into Capricorn and love becomes serious. People value loyalty, effort and long-term promises over fleeting passion. Affection is shown through reliability and quiet dedication. It is a good time to commit to what truly matters, in love and in your values. Classic, well-made things appeal. Don't let caution freeze your heart — warmth is a strength, not a weakness.",
    Aquarius:
      "In Aquarius, Venus loves freely and unconventionally. Friendship becomes the root of attraction, and people want space as much as closeness. Unusual connections, group gatherings and online meetings can spark something special. This is a time to respect individuality in every relationship. Detachment is the shadow, so remember to say the warm thing out loud, not just think it.",
    Pisces:
      "Venus enters Pisces, the sign where it is happiest, and love becomes dreamy and compassionate. Romance, art and music touch the soul more than usual. Forgiveness comes easily, and kindness is everywhere for those who look. Keep one foot on the ground, though, and see people as they truly are, not as you wish them to be. A bath with rose petals feeds the heart.",
  },
  Mars: {
    Aries:
      "Mars charges home into Aries and collective energy surges. People feel braver, faster and far less patient. This is perfect for starting projects, moving your body, competing and defending what you believe in. Tempers flare quickly too, so give that fire a healthy outlet before it becomes an argument. Light a red candle in the morning and act on your courage.",
    Taurus:
      "In Taurus, Mars slows down but becomes unstoppable. Energy turns steady, stubborn and practical. Progress comes through persistence rather than speed, and physical work — gardening, building, cooking — feels deeply satisfying. Don't try to force anyone to change their mind now; it simply won't work. Pick one solid goal, plant your feet and keep going, step by patient step.",
    Gemini:
      "Mars enters Gemini and energy scatters in a hundred directions. Minds are restless, debates heat up and everyone is busy with messages, errands and short trips. Use this to tackle many small tasks quickly. Arguments can be won with wit, but not every one needs fighting. Choose your words with care, and channel the restlessness into learning something new.",
    Cancer:
      "With Mars in Cancer, drive is led by feelings. People fight hardest for home, family and those they love. Energy can feel moody or indirect, and passive aggression is common, so say plainly what is bothering you. This is a strong time for home projects and protecting your space. Hang a little bundle of protective herbs by your door and guard your peace.",
    Leo:
      "Mars moves into Leo and courage becomes creative. People want to lead, perform and be recognised for their efforts. Energy is warm and generous, perfect for bold self-expression, sport and play. Pride can cause clashes, so let others shine alongside you. Put your fire into something you love, and let your heart be braver than your fear.",
    Virgo:
      "In Virgo, Mars works hard and precisely. Energy goes into improving systems, finishing tasks and solving practical problems. This is the season to clean, organise and get your routines in order. Productivity is high, but so is irritation over small mistakes. Be patient with yourself and others. Burn rosemary as you clear a space, and enjoy the quiet satisfaction of a job done well.",
    Libra:
      "Mars enters Libra and action becomes a matter of partnership. People prefer to move together, negotiate and find a fair way forward. Direct confrontation feels uncomfortable, which can lead to frustrated silences. Speak up kindly but clearly. This is a good time to stand up for fairness, collaborate on a project and make decisions with others instead of alone.",
    Scorpio:
      "With Mars in Scorpio, energy runs deep and strong. Determination is intense, focus is sharp and nobody gives up easily. This is powerful for research, transformation and finishing anything that requires real commitment. Power struggles can simmer beneath the surface, so be honest about your motives. Channel the intensity into rituals of release and a goal that truly matters.",
    Sagittarius:
      "Mars moves into Sagittarius and enthusiasm takes off. People want freedom, movement, adventure and a cause to believe in. Energy is optimistic, restless and full of big plans. Travel, sport and study all benefit. Be careful not to overcommit or to preach. Aim high, act with good humour, and leave room for spontaneous detours along the way.",
    Capricorn:
      "In Capricorn, Mars is at its most disciplined. Collective energy turns towards ambition, structure and serious effort. It is an excellent time to work towards long-term goals, build something solid and take responsibility. Results come to those who are patient and consistent. Don't let work swallow everything, though. Rest is part of the plan too, and a wise witch schedules it.",
    Aquarius:
      "Mars enters Aquarius and energy turns towards change. People fight for ideas, causes and the freedom to be themselves. Group projects, activism and innovation gain momentum. Rebellion is in the air, which is wonderful when it frees you and less wonderful when it is simply stubbornness. Ask what you are really fighting for, then join forces with like-minded people.",
    Pisces:
      "With Mars in Pisces, drive becomes fluid and intuitive. Energy comes in waves rather than a straight line, and motivation follows inspiration. This is a beautiful time for creative work, spiritual practice, swimming and helping others. Avoid forcing things or running yourself into the ground. Follow the current, rest when you need to and trust your quiet strength.",
  },
  Jupiter: {
    Aries:
      "Jupiter enters Aries for roughly a year, and the collective mood fills with fresh courage. New beginnings, bold ventures and pioneering ideas are blessed. Many people feel ready to take a chance on themselves. Growth comes through action, not waiting. Ask what you would start if you weren't afraid, then begin. Overconfidence is the only trap — stay brave and sensible.",
    Taurus:
      "With Jupiter in Taurus for about a year, growth becomes slow, sensual and solid. The collective turns towards stability, nature, comfort and the value of things that last. It is a good season for learning a craft, building steady habits and enjoying simple pleasures. Excess is the shadow, so enjoy without overdoing it. Plant something this year, and tend it faithfully.",
    Gemini:
      "Jupiter moves into Gemini, beginning about a year of curiosity and connection. Learning, writing, teaching, short journeys and conversation all expand. Ideas spread quickly and people hunger for new information. This is the time to take a course, start writing, or meet people outside your usual circle. Just be careful to go deep enough. Wisdom needs more than facts — it needs reflection.",
    Cancer:
      "Jupiter enters Cancer, where it is strongest, and for about a year the collective heart opens. Home, family, belonging and care become sources of real growth. Many people feel called to nurture, to put down roots or to make peace with old family patterns. Bless your home with a bowl of salt and a sprig of rosemary, and let it be your temple.",
    Leo:
      "With Jupiter in Leo for about a year, creativity and joy expand. People feel called to express themselves, play, celebrate and lead with heart. Romance, art, performance and big-hearted generosity are all blessed, and the collective wants more delight in daily life. Say yes to the creative project that scares you a little. Keep your ego in check — the brightest light warms everyone.",
    Virgo:
      "Jupiter enters Virgo for about a year, and growth comes through refinement. Work, daily routines, skills and service all expand. The collective becomes more interested in doing things well and being genuinely useful. It is a good year to master a craft, improve your habits and help others in practical ways. Don't get lost in the details. Remember the bigger meaning behind the work.",
    Libra:
      "With Jupiter in Libra for about a year, relationships and fairness become paths to growth. Partnerships of every kind, collaboration, art and diplomacy are favoured. Many people seek more balance and beauty in their lives. It is a wonderful year to connect, negotiate and create alongside others. Keep your independence, though — the best partnerships let both people grow.",
    Scorpio:
      "Jupiter moves into Scorpio, and for about a year growth happens in the depths. Transformation, intimacy, trust and psychological insight expand. The collective becomes braver about facing taboos and hidden truths. This is a powerful year for shadow work, honest inner reflection and deep magic. Let go of what you have outgrown. What you release creates space for something richer.",
    Sagittarius:
      "Jupiter returns home to Sagittarius, and for about a year optimism, adventure and the search for meaning expand. Travel, study, philosophy and spiritual exploration are especially blessed. The collective longs for a bigger vision and greater freedom. Follow the call to learn, wander and believe again. Just don't promise more than you can deliver. Faith works best with a plan.",
    Capricorn:
      "With Jupiter in Capricorn for about a year, growth becomes slow and serious. Ambition, structure and responsibility are rewarded, but only for those who put in the work. The collective reassesses institutions, authority and long-term goals. This is a year for realistic planning and quiet achievement. Big dreams still matter — you simply build them brick by brick.",
    Aquarius:
      "Jupiter enters Aquarius for about a year, and the future feels exciting again. Innovation, community, technology and humanitarian ideals expand. People seek like-minded groups and a sense of shared purpose. It is a wonderful year to join a circle, support a cause and embrace your originality. Progress comes through cooperation. Dream about the world you want, then help build it.",
    Pisces:
      "With Jupiter in Pisces for about a year, compassion and spirituality grow. Imagination, intuition, art and kindness flow more freely. Many people feel drawn to meditation, spiritual study, creative expression and helping others. Boundaries can blur, so stay grounded. Keep a dream journal and a regular spiritual practice — this year the Universe speaks softly, and often.",
  },
  Saturn: {
    Aries:
      "Saturn enters Aries for around two and a half years, and the collective learns the discipline of courage. Impulsive action is tested; leadership must now be earned. People are asked to stand on their own feet and take responsibility for their choices. Patience with yourself is essential. Begin slowly, build your strength and let your independence grow from solid ground.",
    Taurus:
      "With Saturn in Taurus for around two and a half years, the collective rethinks security. What do we truly value? Which habits, resources and comforts can we really rely on? This is a time for careful planning, patience and building foundations that will last. Change comes slowly but surely. Respect the earth, simplify and put your energy into what is real.",
    Gemini:
      "Saturn moves into Gemini for around two and a half years, bringing structure to the restless mind. Communication, education and information are tested and refined. People become more careful about what they say, read and believe. It is a good time to study seriously, develop real expertise and choose your words with care. Focus is the lesson. Depth beats distraction.",
    Cancer:
      "With Saturn in Cancer for around two and a half years, home and family ask for maturity. Emotional responsibility, boundaries and the structures that keep us safe all come under review. Some will rebuild their idea of home or belonging. It can feel heavy at times, but it teaches real strength. Care for yourself as seriously as you care for others.",
    Leo:
      "Saturn enters Leo for around two and a half years, and the collective learns to shine with integrity. Creativity, self-expression and recognition must now be earned through dedication rather than show. A fear of being seen can surface — face it gently. This is a time to commit to your talent and practise it seriously. True confidence is built, not borrowed.",
    Virgo:
      "With Saturn in Virgo for around two and a half years, work and daily life need structure. The collective becomes more serious about routines, wellbeing, skills and service. It is a time to fix what doesn't work and commit to habits that support you. Perfectionism is the trap. Progress, not perfection, is the lesson, and simple, consistent effort will carry you far.",
    Libra:
      "Saturn enters Libra, where it is strongest, and for around two and a half years relationships are tested for fairness and commitment. Agreements, partnerships and justice come into focus. People take their bonds more seriously and look for a balance that lasts. Some relationships deepen; others are honestly renegotiated. Choose loyalty with open eyes, and honour your own needs too.",
    Scorpio:
      "With Saturn in Scorpio for around two and a half years, the collective faces its depths. Power, trust, intimacy and shared responsibility are examined. Old fears and secrets ask to be acknowledged. This time can feel intense, but it brings resilience and wisdom. Do your shadow work steadily, set firm boundaries and let real transformation take the time it needs.",
    Sagittarius:
      "Saturn moves into Sagittarius for around two and a half years, bringing structure to belief. The collective is asked to test its ideals, faith and philosophies against real life. Study, travel and teaching become more serious and purposeful. Easy answers lose their appeal. Commit to a path of learning, and let your wisdom be earned through experience.",
    Capricorn:
      "Saturn returns home to Capricorn, and for around two and a half years the collective rebuilds its structures. Authority, institutions, careers and long-term ambitions face honest review. What is solid survives; what is hollow falls away. This is a time for hard work, maturity and quiet resilience. Build carefully, because what you create now can last for many years.",
    Aquarius:
      "With Saturn in Aquarius for around two and a half years, the future needs a plan. Communities, technology and social ideals are tested for their real strength. People are asked to balance individuality with responsibility to the group. Innovation must now become practical. Find your circle, commit to shared goals, and build the change you wish to see.",
    Pisces:
      "Saturn enters Pisces for around two and a half years, and dreams must find a form. Spirituality, compassion and creativity ask for discipline and boundaries. The collective learns where to help and where to protect itself. It can be a confusing time, so ground your intuition in daily practice. Meditate regularly, keep your boundaries kind and give your visions a structure.",
  },
};

/** New Moon in each sign: the lunation's themes and an intention-setting ritual. */
export const NEW_MOON_IN_SIGN: SignText = {
  Aries:
    "The New Moon in Aries is the boldest beginning of the lunar year. Its themes are courage, independence and the simple act of starting. Whatever you have been hesitating over, this is the moment to plant the seed and trust that the energy will carry you.\n\nMy favourite ritual for this Moon: light a red candle, write one brave intention in the present tense — “I begin”, not “I hope” — and read it aloud three times. Then take one small action within a day. The Universe answers movement.",
  Taurus:
    "The New Moon in Taurus plants seeds in rich, steady soil. Its themes are security, self-worth, the body and the simple pleasures that make life feel good. Intentions set now grow slowly, but they grow strong.\n\nFor your ritual, hold a piece of green aventurine in your hand and write down what you want to build, in practical terms. Plant a real seed in a pot, tuck your folded intention beneath it and water it each day. As the seedling grows, so does your wish.",
  Gemini:
    "The New Moon in Gemini opens the door to new ideas, conversations and connections. Its themes are curiosity, learning, communication and the stories we tell ourselves. This is a wonderful Moon for starting a course, a piece of writing or a fresh way of thinking.\n\nLight a yellow candle and take a clean sheet of paper. Write your intention as a short letter to the Universe, as if you were writing to a dear friend. Fold it twice, keep it inside a book you love, and read it again at the Full Moon.",
  Cancer:
    "The New Moon in Cancer is a Moon of home and heart. Its themes are belonging, emotional safety, family of every kind and the way we nurture ourselves. The Moon rules this sign, so feelings run strong and intuition is unusually clear.\n\nFor your ritual, fill a bowl with water, add a pinch of salt and a white flower, and place it in the room where you feel safest. Speak your intention softly over the water, then use a little of it to bless your doorway. Let your home hold your wish.",
  Leo:
    "The New Moon in Leo lights a spark in the heart. Its themes are creativity, joy, romance, play and the courage to be seen. This is the moment to begin something that makes you feel alive, whether it is a creative project, a hobby or simply a braver way of showing up.\n\nLight a gold or orange candle, stand in front of a mirror and say your intention out loud, looking into your own eyes. Don't whisper it. Then write it down and sign it with a flourish, like an artist signing a masterpiece.",
  Virgo:
    "The New Moon in Virgo is a fresh start for daily life. Its themes are routine, work, wellbeing, service and the small habits that shape everything else. Big transformations begin with tiny, practical steps, and this Moon knows it.\n\nClear one corner of your home first, then sit there with a sprig of rosemary or lavender. Write one intention and three simple actions that will support it. Keep the list where you will see it every morning. Magic, done daily, becomes a life.",
  Libra:
    "The New Moon in Libra brings fresh beginnings in relationships and in the search for balance. Its themes are partnership, harmony, beauty, fairness and the agreements we make with others and with ourselves.\n\nFor your ritual, place two candles side by side — one pink, one white — with a piece of rose quartz between them. Write an intention for the kind of connection you want to create, or the balance you want to find in your own life. Light both candles together and sit quietly with them for a while.",
  Scorpio:
    "The New Moon in Scorpio is a dark, potent seed. Its themes are transformation, intimacy, power, rebirth and the courage to face what lies beneath. This is the witch's New Moon — deep magic, honest intention and the shedding of old skins to make room for something new.\n\nLight a black candle for protection and a deep red one for passion. Write down what you are ready to transform and who you are becoming. Keep the paper under your pillow for three nights, and pay close attention to your dreams.",
  Sagittarius:
    "The New Moon in Sagittarius aims an arrow at the horizon. Its themes are adventure, faith, learning, travel, truth and the meaning we find in life. Set intentions that stretch you a little — the bigger vision is the gift of this Moon.\n\nLight a purple or deep blue candle. Write one word for your dream on a dried bay leaf and burn it in a fireproof dish. As the smoke rises, imagine it travelling far ahead of you, preparing the path. Then plan the very first step of your journey.",
  Capricorn:
    "The New Moon in Capricorn is the most practical beginning of the year. Its themes are ambition, structure, responsibility, vocation and the long climb towards meaningful goals. Intentions set now are like foundation stones — solid, lasting and worth placing carefully.\n\nLight a dark green or brown candle and hold a small stone in your hand. Write down one goal and the first three steps to reach it, with dates. Keep the stone on your desk as a reminder that mountains are climbed one step at a time.",
  Aquarius:
    "The New Moon in Aquarius invites fresh ideas and a new vision for the future. Its themes are friendship, community, originality, freedom and hope for a better world. This is a Moon for breaking old patterns and trying something unexpected.\n\nFor your ritual, write your intention on a strip of paper, then add one wild idea you would normally dismiss. Place both under a jar of water left out overnight. In the morning, sprinkle the water across your doorstep and invite the new in.",
  Pisces:
    "The New Moon in Pisces is a soft, dreamy seed at the very end of the zodiac. Its themes are intuition, compassion, imagination, spirituality and the quiet magic of surrender. Intentions set now are best felt rather than forced.\n\nRun a warm bath with a handful of sea salt and a few drops of lavender oil, or simply sit with a bowl of water by candlelight. Close your eyes and imagine your wish already true. Write down what you saw, and trust that the Universe heard you.",
};

/** Full Moon in each sign: the lunation's themes and a release or gratitude ritual. */
export const FULL_MOON_IN_SIGN: SignText = {
  Aries:
    "The Full Moon in Aries shines a light on independence, courage and anger. Across from the Sun in Libra, it asks how you balance your own needs with those of others. Feelings can flare quickly, but the heat reveals what you truly want.\n\nFor your ritual, write down the frustrations you have been carrying. Read them once, then burn the paper in a fireproof dish and say: “I release what burns me, I keep what fuels me.” Finish by naming three things you are proud of.",
  Taurus:
    "The Full Moon in Taurus illuminates comfort, security, self-worth and the body. With the Sun opposite in Scorpio, it asks what you truly own and what owns you. Stubborn attachments may come to light now, gently asking to be loosened.\n\nTake a bowl of salt and hold your hands above it. Name what you are ready to let go of — a habit, a possession, an old fear about never having enough. Then name three things you are grateful for, and bury a written note of thanks in the garden or a plant pot.",
  Gemini:
    "The Full Moon in Gemini brings conversations, ideas and information to a peak. Opposite the Sun in Sagittarius, it balances facts with faith, the small details with the big picture. Messages may arrive, and truths may finally be spoken.\n\nFor your ritual, write down every worrying thought in your head, quickly, without editing. Tear the paper into small pieces and throw them away with a firm “Enough.” Then write one sentence of thanks for something kind that someone said to you recently, and keep it.",
  Cancer:
    "The Full Moon in Cancer is the most emotional Full Moon of the year, shining in the Moon's own sign. Opposite the Sun in Capricorn, it balances home and career, feelings and duty. Tears can come easily, and that is perfectly fine.\n\nMake yourself a cup of chamomile tea and sit with a white candle. Write down the old hurts you are ready to let go of, especially those from the past. Soak the paper in salt water until the ink blurs. Then thank the people who have truly cared for you.",
  Leo:
    "The Full Moon in Leo puts creativity, love and self-expression in the spotlight. Opposite the Sun in Aquarius, it balances the needs of the heart with the needs of the group. Pride and joy both reach a peak now.\n\nLight a gold candle and write down the ways you have been hiding your light, or seeking approval you don't need. Burn the paper in a fireproof dish and watch it turn to ash. Then celebrate: dance, laugh, or write a list of everything you love about yourself.",
  Virgo:
    "The Full Moon in Virgo brings work, wellbeing and daily routines to a peak of clarity. Opposite the Sun in Pisces, it balances order with surrender, the to-do list with faith. You may suddenly see exactly what needs fixing.\n\nFor your ritual, clean one room thoroughly with a little salt in the water, and as you work, name the habits you are releasing. Afterwards, light a white candle and write down five small things that went well this month. Gratitude is precise magic.",
  Libra:
    "The Full Moon in Libra illuminates relationships, fairness and harmony. Opposite the Sun in Aries, it balances “me” and “we”. Agreements and imbalances become obvious now, and some conversations simply can't wait any longer.\n\nPlace a pink candle and a white candle side by side. Write down any resentments you hold in a relationship, including the one with yourself, and burn the paper in a fireproof dish. Then write a thank-you note to someone who brings balance to your life, and send it.",
  Scorpio:
    "The Full Moon in Scorpio is a powerful moment of release. Opposite the Sun in Taurus, it balances deep transformation with simple security. Hidden feelings rise to the surface, and secrets can come to light.\n\nThis is the Moon for cutting cords. Take a length of black thread, tie one end around a pen that represents whatever binds you, and cut it with scissors while saying: “I release you with love.” Throw the thread away. Then thank yourself for your own resilience — you have come so far.",
  Sagittarius:
    "The Full Moon in Sagittarius lights up truth, freedom and the beliefs that guide you. Opposite the Sun in Gemini, it balances big ideas with daily details. Restlessness can peak, along with a hunger for adventure and honesty.\n\nFor your ritual, write down the beliefs that limit you — about yourself, about love, about what is possible. Burn them in a fireproof dish with a dried bay leaf. Then step outside, look up at the Moon and say thank you for three lessons that life has taught you.",
  Capricorn:
    "The Full Moon in Capricorn brings ambitions, responsibilities and results into full view. Opposite the Sun in Cancer, it balances career and home, duty and feeling. You may see clearly what you have achieved, and what you are carrying that isn't yours.\n\nWrite down the burdens you are ready to put down. Place a heavy stone on the paper overnight, then lift it in the morning and feel the weight leave you. Write a list of everything you have accomplished this year, and honour it.",
  Aquarius:
    "The Full Moon in Aquarius illuminates friendship, community, freedom and the future. Opposite the Sun in Leo, it balances personal pride with the needs of the group. Sudden insights and surprising news are common now.\n\nFor your ritual, write down the old rules and expectations you no longer want to follow. Tear the paper up and throw it away with a laugh — liberation should feel light. Then send a message of thanks to a friend who has stood by you, just because they did.",
  Pisces:
    "The Full Moon in Pisces is gentle, dreamy and deeply intuitive. Opposite the Sun in Virgo, it balances spirit and service, imagination and practical life. Emotions blur, and old sadness can surface to be released.\n\nRun a warm bath with a handful of sea salt, or simply soak your feet in salted water by candlelight. Imagine the water drawing out whatever weighs on your heart. As it drains away, say thank you for everything that has carried you through. Then rest — you have earned it.",
};

/** A planet stationing retrograde, and turning direct again. */
export const STATION: Record<
  "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto",
  { retrograde: string; direct: string }
> = {
  Mercury: {
    retrograde:
      "Mercury stations retrograde, and for about three weeks the collective mind turns back on itself. Messages go astray, plans need revising and old contacts reappear. I always say: don't panic — this is a time for review, not a curse. Re-read, re-check and reconnect. Back up your files, leave room for delays and let the past teach you something.",
    direct:
      "Mercury turns direct, and slowly the fog lifts. Communication starts to flow again, delayed plans move forward and decisions become clearer. Give it a few more days before you launch anything major, as the energy is still finding its feet. Then act on what you learned during the review. Clarity is your reward for patience.",
  },
  Venus: {
    retrograde:
      "Venus stations retrograde, a rarer event that comes about every eighteen months and lasts around six weeks. Love, values and beauty turn inwards for review. Old flames may return, and relationships ask to be looked at honestly. It is not the moment for dramatic makeovers or rash promises. Reflect instead on what you truly love, and why.",
    direct:
      "Venus turns direct, and the heart starts to move forward again. Whatever you learned about love, pleasure and self-worth in recent weeks can now be put into practice. Relationship decisions feel clearer. Treat yourself to something beautiful, refresh your style if you wish and open your heart to what comes next. Love has done its homework.",
  },
  Mars: {
    retrograde:
      "Mars stations retrograde, which happens roughly every two years, and for around ten weeks energy turns inwards. Plans may stall and old frustrations can resurface. This is not weakness — it is a pause to rethink how you use your strength. Revisit unfinished projects, release stale anger and conserve your fire. Push less, plan more.",
    direct:
      "Mars turns direct, and the brakes come off. Energy returns, motivation rises and stalled projects begin to move again. Allow a few days for momentum to build, then act on the plans you refined during the pause. You are stronger and wiser now. Light a red candle, name your goal and step forward with confidence.",
  },
  Jupiter: {
    retrograde:
      "Jupiter stations retrograde for about four months, as it does every year. Growth turns inward. Instead of chasing outer expansion, the collective is invited to reflect on beliefs, faith and personal meaning. Opportunities may seem slower, but inner wisdom deepens. Study, meditate and ask what abundance truly means to you. The harvest is internal for now.",
    direct:
      "Jupiter turns direct, and growth begins to flow outward again. Plans that waited can move forward, and optimism returns to the collective. What you discovered inwardly during the retrograde now wants to be lived. Say yes to the opportunities that feel aligned with your values. Generosity and faith will carry you further than you expect.",
  },
  Saturn: {
    retrograde:
      "Saturn stations retrograde for about four and a half months, as it does each year. Responsibilities and structures come up for inner review, and old lessons may return to be learned more fully. This is a good time to revisit commitments, strengthen foundations and check that your goals are truly yours. Patience is the key. Slow down and build wisely.",
    direct:
      "Saturn turns direct, and steady progress resumes. The structures you reviewed can now be strengthened, and commitments feel firmer. Hard work begins to show clearer results. Take responsibility for your path with renewed confidence — you know more about your limits and your strengths now. Lay the next brick, and then the next.",
  },
  Uranus: {
    retrograde:
      "Uranus stations retrograde for about five months each year. The urge for sudden change turns inwards, and the collective reflects on what freedom really means. Revolutions happen quietly inside before they show outside. This is a time to notice where you feel restricted and to dream up original solutions. Let new ideas brew before you act on them.",
    direct:
      "Uranus turns direct, and change picks up speed again. Insights from the retrograde begin to break through into the world. Surprises, breakthroughs and fresh starts feel more likely. Stay flexible and open-minded. If something unexpected arrives, ask what it frees you from rather than what it takes. Innovation and courage go hand in hand now.",
  },
  Neptune: {
    retrograde:
      "Neptune stations retrograde for around five months, as it does every year. Illusions begin to fade, and the collective sees more clearly through the mist. Dreams and spiritual longings turn inward for honest review. This is a beautiful time for meditation, creative work and gentle truth-telling. Let go of fantasies that no longer serve you, and keep the dreams that do.",
    direct:
      "Neptune turns direct, and imagination flows outward again. Spiritual insights from recent months can now inspire creativity and compassion in the world. Dreams feel more vivid, and the veil seems softer. Be mindful of blurred boundaries. Keep a dream journal, trust your intuition and let art, music and kindness flow freely through you.",
  },
  Pluto: {
    retrograde:
      "Pluto stations retrograde for around five months each year. Deep transformation turns inward, and the collective is invited to examine power, control and hidden fears. Old patterns rise to the surface to be released. This is a profound time for shadow work and honest reflection. Let go of whatever has run its course, and allow yourself to be reborn.",
    direct:
      "Pluto turns direct, and transformation moves outward. The inner changes of recent months begin to reshape your outer life. Power returns to those who have done the inner work. Step into your strength with honesty and compassion. Release control where you can, and trust that what is rebuilt now is stronger than before.",
  },
};

/** Solar and lunar eclipses: gentle, grounded guidance. */
export const ECLIPSE: { solar: string; lunar: string } = {
  solar:
    "A Solar Eclipse is a New Moon with extra power, when the Moon passes in front of the Sun and the light dims for a moment. In astrology it marks a fresh chapter — doors can open suddenly, often where you least expected.\n\nThere is nothing to fear. Eclipses simply speed things up. Many witches prefer not to cast big spells on the day itself; instead, rest, observe and write down what comes to you. Set your intentions in the days that follow, once the energy settles.",
  lunar:
    "A Lunar Eclipse is a Full Moon with extra intensity, when the Earth's shadow falls across the Moon and it can glow a deep coppery red. In astrology it brings things to completion and reveals what has been hidden, often in the emotional world.\n\nBe gentle with yourself and with others. Feelings may run high, but they show you what is ready to end. Release what you have outgrown with gratitude rather than force. Rest, journal and trust that every ending clears space for something truer.",
};
