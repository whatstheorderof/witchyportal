// "This week in astrology" — readings for exact aspects between planets in the sky.
// Keys are "Earlier|Later" in the order Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.
// harmonious = trine/sextile, challenging = square/opposition.

export const SKY_ASPECT: Record<string, { conjunction: string; harmonious: string; challenging: string }> = {
  "Sun|Mercury": {
    conjunction:
      "The Sun and Mercury meet this week, and the collective mind switches on. Ideas want to be spoken and plans want names. Use it: write one clear intention on paper, light a yellow candle beside it and read it aloud. Words carry real power now, so choose them as carefully as a spell.",
    harmonious:
      "Heart and head agree this week. The Sun and Mercury flow together, and conversations land more gently than usual. Say the thing you have been rehearsing in your mind. Clarity offered kindly opens doors that force never could, and people are ready to hear you. Trust your timing and speak.",
    challenging:
      "What we feel and what we say fall a little out of step this week, as the Sun and Mercury pull against each other. The lesson is simple: pause before replying. Sip some water, breathe, and then speak. A delayed answer is often the truer one, and nothing important is lost by waiting.",
  },
  "Sun|Venus": {
    conjunction:
      "The Sun embraces Venus, and the whole world softens a little. People are drawn to beauty, pleasure and simple kindness. Wear something that makes you feel radiant, put fresh flowers on your altar or table, and let yourself be admired. Love in every form is easier to give and to receive.",
    harmonious:
      "Warmth moves freely through the sky as the Sun and Venus work together. This is a lovely week to make something beautiful, mend a friendship or simply enjoy your own company. Pay one sincere compliment a day. Generosity of spirit is magnetic, and it always finds its way back to you.",
    challenging:
      "The Sun and Venus tug in different directions, and many of us feel the pull between being liked and being real. Don't trade your truth for approval this week. Carry rose quartz in your pocket as a reminder that real love, including the love you give yourself, never asks you to shrink.",
  },
  "Sun|Mars": {
    conjunction:
      "Fire meets fire as the Sun joins Mars. The collective mood is bold, restless and ready to act. Channel it instead of scattering it: choose one task you have been avoiding and finish it. Light a red candle as you begin. Courage is strongest when it has a single clear target.",
    harmonious:
      "There is a clean, confident energy in the air while the Sun and Mars cooperate. Effort brings results and people respond well to directness. Move your body, start the project, ask for what you want. I always say momentum is a kind of magic, and this week it is generous with it.",
    challenging:
      "Tempers run warmer than usual with the Sun and Mars at odds. Impatience is everywhere, so expect a few sharp words and don't take them home with you. Put that heat into physical effort instead: walk fast, scrub the floor, dance. Spent wisely, this fire becomes strength rather than conflict.",
  },
  "Sun|Jupiter": {
    conjunction:
      "The Sun and Jupiter unite, and optimism rises like a tide. People feel bigger, braver and more hopeful. This is a beautiful moment to set a long-range intention. Write it on a bay leaf, keep it under a citrine stone, and act on it in one small way before the week is out.",
    harmonious:
      "Doors open more easily this week. The Sun and Jupiter in harmony bring goodwill, helpful people and a sense that things can work out. Say yes to the invitation, share your idea, offer your help. Gratitude multiplies this energy, so name three blessings each evening before you sleep.",
    challenging:
      "With the Sun and Jupiter in tension, the collective mood leans towards excess: too many promises, too much on the plate. Enthusiasm is wonderful, but choose where it goes. Before saying yes, ask whether you truly have room. Generosity that includes your own limits is the wisest kind.",
  },
  "Sun|Saturn": {
    conjunction:
      "The Sun meets Saturn, and the world turns serious for a moment. Responsibilities feel heavier and shortcuts stop working. Don't fight it. This is the week to build something that lasts: a routine, a boundary, a promise to yourself. A black candle and a written commitment make a fine start.",
    harmonious:
      "Steady effort is rewarded while the Sun and Saturn work hand in hand. The collective mood is sensible and focused, perfect for planning, organising and finishing what you started. Treat discipline as devotion rather than punishment. Clear one shelf, one inbox, one corner of your life, and feel how lighter you become.",
    challenging:
      "The Sun and Saturn clash, and many people feel blocked, tired or judged. Remember that pressure is not punishment, it is a test of what is real. Rest when you need to, keep your promises small and achievable, and protect your energy with salt by the door. Endurance is quiet power.",
  },
  "Sun|Uranus": {
    conjunction:
      "The Sun meets Uranus, and the unexpected walks right in. Plans shift, ideas spark, people surprise us. Rather than gripping tighter, stay curious. Change one small habit on purpose this week: a new route, a new ritual, a new song while you cook. Freedom grows from tiny brave choices.",
    harmonious:
      "Fresh air blows through the collective as the Sun and Uranus cooperate. Inventive solutions appear from nowhere and old problems suddenly look simple. Follow the odd idea that will not leave you alone. Write it down the moment it arrives. Sparks like these are messages, and they fade if ignored.",
    challenging:
      "Restlessness runs high with the Sun and Uranus at odds. People rebel, plans wobble, nerves fray. Don't make sweeping decisions in a rush of frustration. Ground yourself first: bare feet on the earth, a slow breath, a piece of smoky quartz in hand. Then change only what truly needs changing.",
  },
  "Sun|Neptune": {
    conjunction:
      "The Sun dissolves into Neptune, and the veil grows thin. Dreams are vivid, intuition is loud and the world feels softer at the edges. Keep a notebook by your bed. Take a salt bath with a few drops of lavender. Inspiration is near, though practical details may blur, so double-check them.",
    harmonious:
      "Imagination and compassion flow beautifully while the Sun and Neptune harmonise. This is a wonderful week for art, music, prayer, meditation and gentle acts of care. Listen to your intuition and let it guide small choices. The Universe speaks in symbols now, so notice the ones that repeat.",
    challenging:
      "Fog settles over the collective as the Sun and Neptune pull apart. Things may not be quite what they seem, and energy can dip. Don't sign or promise anything you have not fully read. Rest more, drink plenty of water, and cleanse your space with smoke or sound. Clarity returns.",
  },
  "Sun|Pluto": {
    conjunction:
      "The Sun descends to meet Pluto, and something deep stirs in everyone. Old truths surface, power dynamics become obvious, and pretending gets harder. Let it be a cleansing. Write down one pattern you are ready to release, burn the paper safely, and scatter the ashes. Transformation starts with honesty.",
    harmonious:
      "A quiet, focused strength runs through the sky while the Sun and Pluto cooperate. People are capable of deep change without drama. Use this energy to commit to something meaningful, or to finally let go of what drains you. Obsidian on your desk will help you stay rooted in your power.",
    challenging:
      "The Sun and Pluto collide, and control becomes the theme of the week. Some people push, others resist, and emotions run intense. Don't get pulled into power games. Hold your ground calmly and choose where your energy goes. What you refuse to carry any longer is the real victory here.",
  },
  "Mercury|Venus": {
    conjunction:
      "Mercury and Venus meet, and words turn sweet. It is an easy week for kind conversations, love letters, creative writing and diplomacy. Say what you appreciate about the people around you, out loud or on paper. A pink candle lit while you write will add a little charm to every line.",
    harmonious:
      "Charm and clarity walk together this week. With Mercury and Venus in harmony, negotiations go smoothly, apologies are accepted and good taste is everywhere. Rearrange a room, refresh your wardrobe, write the message you have been putting off. Gracious words now leave a lasting and lovely impression.",
    challenging:
      "Mercury and Venus in tension can make us say what pleases instead of what is true. Small misunderstandings in love and friendship are likely. Be gentle but honest, and don't assume you know what someone meant. Ask. A simple question can save a week of quiet hurt.",
  },
  "Mercury|Mars": {
    conjunction:
      "Mercury joins Mars, and minds move fast and sharp. Debates heat up and decisions are made quickly. Use the edge: write, pitch, study, solve the stubborn problem. Just watch your tone, because words cut more easily now. A sprig of rosemary on your desk keeps thinking clear and grounded.",
    harmonious:
      "Thought and action line up neatly this week. Mercury and Mars in harmony make it easy to speak up, defend an idea and follow it through. Make the call, send the proposal, have the honest talk. Confidence in your words is contagious, and people are listening more than usual.",
    challenging:
      "Arguments flare easily with Mercury and Mars at odds. People interrupt, rush and misread each other. My advice this week: count to ten before you hit send. Put the fire into exercise or into a journal you never show anyone. Sharp minds win more when they stay calm.",
  },
  "Mercury|Jupiter": {
    conjunction:
      "Mercury meets Jupiter, and big ideas fill the air. People talk about travel, learning, philosophy and the future. It is a perfect week to start a course, read something that expands you or share your vision. Just remember to write the details down, because grand plans need small, practical steps.",
    harmonious:
      "Good news travels well while Mercury and Jupiter cooperate. Conversations are hopeful, teachers appear and the right book seems to fall open at the right page. Ask questions, seek advice, share your knowledge generously. A sprinkle of cinnamon on your windowsill invites wisdom and opportunity into your home.",
    challenging:
      "Mercury and Jupiter in tension make everyone promise a little too much and listen a little too little. Big talk is cheap this week. Check the facts before you share them and read the small print twice. Optimism is beautiful when it is grounded in what is actually true.",
  },
  "Mercury|Saturn": {
    conjunction:
      "Mercury sits with Saturn, and thinking becomes careful and serious. This is a fine week for contracts, study, planning and any work that needs patience. Words may come slowly, but they will be solid. Write a structured plan for something you care about, and keep it somewhere you will see it.",
    harmonious:
      "Clear, practical thinking is easy to find this week. Mercury and Saturn in harmony reward focus, preparation and honest conversations about responsibility. Organise your papers, set realistic deadlines, finish the dull but necessary task. A tidy mind makes room for magic, and order is its own quiet spell.",
    challenging:
      "Communication feels heavy with Mercury and Saturn at odds. Delays, doubts and critical voices are common, including the one inside your own head. Don't let it silence you. Speak slowly, keep it simple, and be kind to yourself. A black tourmaline near your workspace helps keep negativity at bay.",
  },
  "Mercury|Uranus": {
    conjunction:
      "Mercury meets Uranus, and the mind lights up like a storm. Sudden insights, surprising news and brilliant ideas arrive at odd moments. Keep a notebook close at all times. Not every flash needs acting on immediately, but some of these thoughts are genuine breakthroughs. Trust the ones that make you feel free.",
    harmonious:
      "Original thinking is rewarded this week, as Mercury and Uranus work in harmony. Technology, new methods and unusual conversations all flow well. Try a different approach to an old problem. Talk to someone outside your usual circle. Genius often hides in the idea everyone else has politely ignored.",
    challenging:
      "Nerves are jangled with Mercury and Uranus clashing. Plans change at the last minute, devices misbehave and people blurt things out. Leave extra time for everything and save important documents twice. Calm the mind with slow breathing and a cup of chamomile. Flexibility is your best protection now.",
  },
  "Mercury|Neptune": {
    conjunction:
      "Mercury merges with Neptune, and logic gives way to poetry. Dreams, intuition and imagination speak loudly while facts grow hazy. Write, paint, pray or meditate. Pull a tarot card each morning and simply notice what it stirs. Just be careful with promises and details, which slip away easily.",
    harmonious:
      "The intuitive mind is wide open this week. Mercury and Neptune in harmony bring inspired words, gentle understanding and psychic flashes worth trusting. Read poetry, write down your dreams, listen to music that moves you. The right words for something hard to say will arrive softly, if you let them.",
    challenging:
      "Confusion and mixed messages drift through the collective with Mercury and Neptune at odds. Gossip spreads and good intentions get muddled. Don't believe everything you hear, and say exactly what you mean. Clear the fog with a bowl of salt water by the door. Truth settles once the mist lifts.",
  },
  "Mercury|Pluto": {
    conjunction:
      "Mercury descends to meet Pluto, and conversations go deep. Secrets surface, research uncovers hidden layers and people speak with intensity. It is a powerful week for investigation, therapy, honest talks and shadow work. Write down what you have never said aloud. Naming a fear is the first step to dissolving it.",
    harmonious:
      "Focused, penetrating thinking is available to everyone this week. Mercury and Pluto in harmony help us see beneath the surface and speak with quiet authority. Study, research, solve a mystery, or have the talk that changes things. Words chosen with intention now carry lasting transformative power.",
    challenging:
      "Mercury and Pluto clash, and words become weapons for some. Expect pressure, manipulation or obsessive thinking in the air. Don't feed it. Speak your truth calmly and refuse to argue in circles. Protect your mind with a ring of salt around a white candle. Silence can be strength, too.",
  },
  "Venus|Mars": {
    conjunction:
      "Venus and Mars meet, and desire is in the air. Attraction sparks, creativity surges and passion feels close to the surface for everyone. Single or partnered, let yourself enjoy it. Dance, flirt with life, make something with your hands. A red and a pink candle lit together honour this union.",
    harmonious:
      "Love and action move in rhythm this week. Venus and Mars in harmony make it easy to ask for what you want and receive it gracefully. Plan a date, with someone special or with yourself. Start a creative project. The balance of softness and courage you feel now is precious.",
    challenging:
      "Venus and Mars pull apart, and what we want and what we value do not quite match. Tension in relationships is common, and so is impatience. Don't force anyone's hand, including your own. Express desire honestly but gently. Friction like this, handled with care, often reignites a spark.",
  },
  "Venus|Jupiter": {
    conjunction:
      "Venus meets Jupiter, and the sky is generous with sweetness. Kindness, pleasure, beauty and celebration flow easily. Share a meal, give a gift, say yes to joy. Place a green aventurine near your front door to welcome good fortune. Just enjoy it without overindulging, because abundance loves gratitude more than excess.",
    harmonious:
      "This is one of the loveliest weeks the sky offers. Venus and Jupiter in harmony bring warmth, goodwill and open hearts. Reconnect with friends, celebrate small wins and let affection be generous. I always say joy is a form of magic, and right now it is easy to cast.",
    challenging:
      "Venus and Jupiter in tension tempt everyone to overdo it: one more treat, one more purchase, one more promise. Pleasure is sacred, but so is balance. Before you indulge, ask what you are truly hungry for. Often the answer is rest, beauty or connection, and those cost nothing.",
  },
  "Venus|Saturn": {
    conjunction:
      "Venus sits with Saturn, and love turns serious. It is a week for commitment, loyalty and honest talks about what relationships really need. Some may feel lonely or tested. Treat that feeling kindly. Write down the values you want in love and friendship, and keep the list under a rose quartz.",
    harmonious:
      "Steady affection is favoured while Venus and Saturn work together. Loyalty, patience and quiet devotion feel more valuable than grand gestures. Show up for someone consistently. Tend a long-term creative project. Love that is built slowly, brick by brick, is love that stays standing.",
    challenging:
      "Venus and Saturn clash, and love may feel distant, cool or demanding. Many people notice where they feel unappreciated. Don't punish yourself or others for it. Instead, name what you need clearly. Take a warm bath with rose petals and honey. Tenderness towards yourself softens every hard edge.",
  },
  "Venus|Uranus": {
    conjunction:
      "Venus meets Uranus, and love goes electric. Sudden attractions, unusual friendships and surprising tastes appear from nowhere. Stay open, but don't overturn your whole life for a spark. Try something new in your style or your home. Freedom and affection can share the same space when both are honoured.",
    harmonious:
      "Exciting, playful energy moves through relationships this week. Venus and Uranus in harmony bring delightful surprises, fresh connections and creative breakthroughs. Do something spontaneous with someone you love, or simply on your own. Wear the bold colour. Beauty is most magnetic when it is unexpected.",
    challenging:
      "Venus and Uranus pull against each other, and many people crave space in their relationships. Restlessness can lead to impulsive choices. Don't end what only needs breathing room. Speak openly about the freedom you need. A little honest air in a relationship often renews it rather than breaking it.",
  },
  "Venus|Neptune": {
    conjunction:
      "Venus dissolves into Neptune, and the world turns romantic and dreamy. Music, art, compassion and spiritual love flow beautifully. Make a moon water and rose petal spray for your pillow. Do keep one foot on the ground, though, because idealism blurs the line between what is real and what is wished.",
    harmonious:
      "Soft, enchanting energy fills the sky as Venus and Neptune harmonise. This is a beautiful week for creativity, gentle romance and acts of compassion. Light a pale blue candle, play music you love and let your imagination roam. Kindness given quietly now ripples outward further than you know.",
    challenging:
      "Venus and Neptune in tension cast a pretty fog over love and money matters alike. We may see people as we wish they were. Admire, but don't idealise. Look carefully before you give too much of yourself away. Clear quartz helps clarify the heart and keep illusions at arm's length.",
  },
  "Venus|Pluto": {
    conjunction:
      "Venus meets Pluto in the depths, and feelings become intense. Attraction, jealousy and longing all grow louder. This is powerful energy for healing old wounds in love. Write a letter to your heart, honest and unedited, then keep or burn it. Real intimacy begins where pretending ends.",
    harmonious:
      "Deep, transformative love is available this week. Venus and Pluto in harmony help relationships grow stronger through honesty and devotion. Have the heart-to-heart. Commit to beauty that has meaning. Garnet worn close to the skin supports passion that is loyal, grounded and true.",
    challenging:
      "Venus and Pluto clash, and power struggles show up in love and friendship. Possessiveness and jealousy may surface in others or in you. Don't act from fear. Breathe, name the feeling, and ask what it is protecting. Hold a black obsidian. Love without control is the strongest kind there is.",
  },
  "Mars|Jupiter": {
    conjunction:
      "Mars meets Jupiter, and the collective feels bold and ambitious. Big moves, brave starts and adventurous plans are favoured. Aim high, but aim. Choose one goal and pour your energy into it. Carry a piece of carnelian for courage. Confidence is beautiful when it is matched with steady effort.",
    harmonious:
      "Action and luck line up this week. Mars and Jupiter in harmony bring enthusiasm, good timing and the energy to follow through. Start the venture, join the team, take the trip. Generous effort now is rewarded with growth. Remember to share your wins, because shared joy multiplies.",
    challenging:
      "Mars and Jupiter in tension tempt everyone to push too far, too fast. Overconfidence and restless energy are in the air. Take on what you can handle and no more. Pace yourself and look after your body. Ambition becomes wisdom when it knows when to pause.",
  },
  "Mars|Saturn": {
    conjunction:
      "Mars meets Saturn, and energy feels like a car with the handbrake on. Frustration is common. Yet this is excellent for disciplined, steady work. Choose the slow, sure route. Break big tasks into small ones and finish each. Patience is not weakness; it is strength holding its shape.",
    harmonious:
      "Controlled, determined energy is available to everyone this week. Mars and Saturn in harmony reward stamina, structure and hard work. This is the time to build, train, commit and endure. Set a routine and keep it for seven days. You will be surprised at what steady effort creates.",
    challenging:
      "Mars and Saturn clash, and many people feel blocked, tired or angry at obstacles. Don't force your way through walls. Rest, regroup, and find the door. Protect your energy with a bowl of salt and a black candle. Delays now often save you from a bigger mistake later.",
  },
  "Mars|Uranus": {
    conjunction:
      "Mars meets Uranus, and sudden energy crackles through the air. Impulses are strong, plans change in an instant and people act before thinking. Use the spark wisely. Break a habit that holds you back, or try something daring but safe. Take extra care with sharp tools and fast movements.",
    harmonious:
      "Inventive, courageous energy flows this week. Mars and Uranus in harmony support bold experiments, quick decisions and fresh starts. Try the new workout, the new method, the brave idea. Liberation is the theme. I always say that freedom begins with one small act of daring.",
    challenging:
      "Mars and Uranus at odds bring jumpy, rebellious energy. Tempers flash and surprises are not always welcome. Slow down, drive carefully and don't make drastic decisions while upset. Ground yourself with hematite or simply your bare feet on the earth. Calm action beats reckless action every time.",
  },
  "Mars|Neptune": {
    conjunction:
      "Mars merges with Neptune, and energy turns soft and dreamy. Motivation may wander, but compassion and inspiration rise. Put action behind a vision: create, volunteer, dance. Don't push yourself too hard; listen to your body instead. A lavender candle at night helps you rest and restore.",
    harmonious:
      "Inspired action is possible this week. Mars and Neptune in harmony help us move with grace, intuition and compassion. Dance, swim, paint, or offer help where it is needed. Let your intuition guide your steps rather than plans. Gentle effort now achieves more than force.",
    challenging:
      "Mars and Neptune clash, and energy can feel scattered, tired or confused. It is easy to feel deceived or to deceive yourself. Don't chase what is unclear. Rest, hydrate and clean your space with incense. When the fog lifts, you will see which battles were never yours.",
  },
  "Mars|Pluto": {
    conjunction:
      "Mars meets Pluto, and raw power surges through the collective. Determination is fierce, and so are tempers. Put this energy into something worthy: a deep clean, a fearless goal, a long-overdue change. Avoid confrontations. Write your intention on black paper, and act on it with focus.",
    harmonious:
      "Concentrated strength is available to everyone this week. Mars and Pluto in harmony grant the stamina to transform what has stalled. Tackle the hardest task first. Clear out what no longer serves you. Quiet, determined action now changes things more than noise ever could.",
    challenging:
      "Mars and Pluto in tension bring pressure, power struggles and intense emotions. Some people try to dominate; others explode. Don't take the bait. Move your body to release the charge. Protect your energy with a circle of salt. True power is calm, controlled and chosen.",
  },
  "Jupiter|Saturn": {
    conjunction:
      "Jupiter meets Saturn, a meeting that marks a new chapter for the world. Hope and responsibility join hands. Think long-term: what do you want to build over the next twenty years? Write it down, place it beneath a stone from the sea, and take one practical step towards it.",
    harmonious:
      "Growth and stability work together this week. Jupiter and Saturn in harmony support wise planning, sensible expansion and lasting progress. This is the time to commit to a vision with structure behind it. Ask for advice from someone experienced. Balanced ambition builds foundations that hold.",
    challenging:
      "Jupiter and Saturn clash, and the collective feels torn between hope and caution. Should we expand or hold back? The answer is both, in the right places. Review your plans honestly. Let go of what is unrealistic, and protect what is truly worth building. Patience becomes wisdom.",
  },
  "Jupiter|Uranus": {
    conjunction:
      "Jupiter meets Uranus, and the world buzzes with breakthroughs. New ideas, sudden opportunities and liberating changes arrive unexpectedly. Stay open-minded. Try something you have never done. Wear something bright. Fortune favours those willing to leave the familiar path, even for a single step.",
    harmonious:
      "Exciting possibilities appear this week. Jupiter and Uranus in harmony bring lucky surprises, inventive solutions and open doors. Say yes to the unusual invitation. Explore a new subject. Trust the hunch that makes you smile. The Universe loves a curious heart.",
    challenging:
      "Jupiter and Uranus in tension stir up restless, risky energy. People want change, now. Don't jump without looking. Explore freedom wisely, and test new ideas in small ways first. Carry labradorite for intuition. Excitement is a wonderful guide when you keep your feet on the ground.",
  },
  "Jupiter|Neptune": {
    conjunction:
      "Jupiter dissolves into Neptune, and the collective dreams big. Spirituality, compassion, art and faith grow strong. This is a beautiful time for meditation, charity and creative vision. Just keep one eye on reality, because hope can blur the facts. Make a sea salt bath your weekly ritual.",
    harmonious:
      "Spiritual growth flows easily this week. Jupiter and Neptune in harmony bring inspiration, compassion and faith in something greater. Meditate, pray, create, give. Your intuition is a trustworthy guide right now. Small acts of kindness ripple outward like waves on the shore.",
    challenging:
      "Jupiter and Neptune clash, and the world risks believing in illusions. Overpromising, wishful thinking and confusion are common. Don't give your trust too easily. Check details, and keep your feet on solid ground. Cleanse your space with smoke and fresh air. Truth always surfaces in time.",
  },
  "Jupiter|Pluto": {
    conjunction:
      "Jupiter meets Pluto, and power and ambition grow strong in the collective. Big changes are possible, and so are power struggles. Use this energy for deep growth. Ask yourself what you truly want to transform. Write it on paper, bury it in soil, and let your intention take root.",
    harmonious:
      "Transformative growth is available this week. Jupiter and Pluto in harmony help us rebuild with strength and vision. Clear old obstacles, commit to deep goals and trust your inner authority. Obsidian and citrine together balance power and optimism. Change made now can last a lifetime.",
    challenging:
      "Jupiter and Pluto in tension magnify the desire for control. Some people overreach; others feel overpowered. Don't play power games. Stand firmly in your own values and let the rest go. Cleanse your space with salt. Real strength never needs to dominate anyone.",
  },
  "Saturn|Uranus": {
    conjunction:
      "Saturn meets Uranus, and old structures meet new ideas head-on. The world feels torn between tradition and change. You can honour both. Keep what works, renew what does not. Write two lists, to keep and to release, and burn the second. Progress needs roots as well as wings.",
    harmonious:
      "Change and stability cooperate this week. Saturn and Uranus in harmony allow us to innovate wisely and build something new on solid ground. Update a routine. Modernise an old habit. Experiment, but with care. Lasting progress happens when freedom and discipline work side by side.",
    challenging:
      "Saturn and Uranus clash, and the collective feels the tension between control and freedom. Rules feel tight and rebellion tempting. Don't break everything at once. Choose the one change that matters most and make it calmly. Smoky quartz grounds restless energy into steady progress.",
  },
  "Saturn|Neptune": {
    conjunction:
      "Saturn meets Neptune, and dreams meet reality. Some illusions dissolve, and others find form. This is a powerful time to make a spiritual practice real. Choose one ritual and keep it daily: a candle, a prayer, a moment of silence. Faith grows strongest when it has a shape.",
    harmonious:
      "Vision and structure support each other this week. Saturn and Neptune in harmony help us bring dreams into the world in practical ways. Turn an idea into a plan. Give your spiritual life a routine. Imagination is magic, and discipline is how it becomes real.",
    challenging:
      "Saturn and Neptune clash, and the collective may feel disillusioned or uncertain. Old hopes look different now. Don't despair. Let go gently of what was never solid, and keep what still feels true. Light a white candle and write your new intention. Clarity comes after release.",
  },
  "Saturn|Pluto": {
    conjunction:
      "Saturn meets Pluto, and the world is reshaped at its foundations. Old power structures are tested and change runs deep. On a personal level, ask what you must rebuild. Choose resilience. Write your commitment on paper and keep it beneath a heavy stone. Strength comes from what endures.",
    harmonious:
      "Steady, profound transformation is possible this week. Saturn and Pluto in harmony support long-term change, discipline and quiet power. Commit to a goal that will take years. Clear what blocks you methodically. Black tourmaline helps you hold your ground while you grow.",
    challenging:
      "Saturn and Pluto clash, and the collective feels heavy pressure. Control, fear and resistance are common themes. Don't let fear make your choices. Rest when you need to and protect your boundaries. Every crisis carries a seed of rebuilding, and you are stronger than this moment.",
  },
  "Uranus|Neptune": {
    conjunction:
      "Uranus meets Neptune, a meeting that shapes generations. Inspiration and innovation merge, and the collective imagination expands. Ask yourself what dream for the future feels true. Meditate on it beneath the night sky. Write it down. Visions born in moments like this can guide a lifetime.",
    harmonious:
      "Inspired change flows through the collective this week. Uranus and Neptune in harmony bring spiritual awakening and creative breakthroughs. Follow your intuition into new territory. Try a new form of meditation or art. The future feels open, and your imagination is the key that unlocks it.",
    challenging:
      "Uranus and Neptune in tension bring confusion about the future. Ideals clash with change, and certainty is hard to find. Don't panic. Return to simple rituals: water, salt, candlelight. When the bigger picture feels blurry, small daily magic keeps you grounded and guided.",
  },
  "Uranus|Pluto": {
    conjunction:
      "Uranus meets Pluto, and the world feels a revolution beneath the surface. Deep change arrives suddenly and touches everyone. On a personal level, ask what you are ready to transform for good. Write your answer, burn it, and plant a seed with the ashes. From endings, new life grows.",
    harmonious:
      "Liberating transformation moves through the sky this week. Uranus and Pluto in harmony make change feel exciting rather than frightening. Release an old fear. Break free of a pattern that has held you. Labradorite supports change and protects your energy as you step into something new.",
    challenging:
      "Uranus and Pluto clash, and the collective feels pressure to change, whether it wants to or not. Upheaval can feel unsettling. Don't resist everything. Ask what is truly ending, and let it go with dignity. Ground yourself daily. You are being shaped into something stronger.",
  },
  "Neptune|Pluto": {
    conjunction:
      "Neptune meets Pluto, a rare meeting that shapes centuries. Collective dreams and deep transformation merge into one. Reflect on the spiritual legacy you want to leave behind. Light a candle for your ancestors and one for your descendants. Every soul plays a part in the great unfolding.",
    harmonious:
      "A quiet, deep current of spiritual renewal flows through the world. Neptune and Pluto in harmony support healing on a soul level. Meditate. Forgive. Let old wounds dissolve into the sea of compassion. Moon water and a quiet prayer help you connect to this timeless energy.",
    challenging:
      "Neptune and Pluto in tension stir the collective unconscious. Fears and illusions rise to the surface for healing. Don't be swept away. Hold to your own truth, gently and firmly. Cleanse your space with smoke and sound. What is revealed now can finally be released.",
  },
};
