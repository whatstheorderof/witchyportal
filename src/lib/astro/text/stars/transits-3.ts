/**
 * Personal transit texts for the outer and slow planets (Saturn, Uranus, Neptune, Pluto)
 * crossing points of the reader's natal chart, in Yulia's voice.
 * Keys are "TransitingPlanet>NatalPoint". These transits last weeks to months,
 * so each text frames a chapter of life rather than a single day.
 * harmonious = trine or sextile; challenging = square or opposition.
 * Original Witchy Portal copy. Paragraphs are separated by a blank line.
 */

export const TRANSIT_3: Record<string, { conjunction: string; harmonious: string; challenging: string }> = {
  // ——— Saturn ———
  "Saturn>Sun": {
    conjunction:
      "Saturn is sitting on your Sun, and this is a season of becoming who you said you would be. Life asks for commitment, structure and proof — not to punish you, but to make you real.\n\nChoose one thing that truly matters and build it slowly, brick by brick. Rest when you need to. Light a black candle on Saturdays and name what you are ready to carry. What you build now will stand for years.",
    harmonious:
      "Saturn sends steady support to your Sun, and this is a season when effort finally shows. Work that once felt invisible starts to earn respect, and you feel more grown-up in the best sense — calm, capable, sure of your footing.\n\nUse it. Set a long-term goal and give it a weekly rhythm. Keep a smoky quartz on your desk as a reminder that patience is a kind of power.",
    challenging:
      "Saturn is pressing on your Sun, and this is a season of testing. Old ways of shining may feel heavy, and some doors want a second knock. Don't take it as a verdict on your worth.\n\nThis chapter strips away what is borrowed and leaves what is yours. Simplify your days, keep your promises small and honest, and rest without guilt. Write your one true aim on paper and keep it under a black candle. Strength grows here.",
  },
  "Saturn>Moon": {
    conjunction:
      "Saturn is resting on your natal Moon, and this is a season of emotional maturity. Feelings may come quieter and deeper, and you may want more solitude than usual. Honour that.\n\nThis chapter asks you to become your own safe place — to mother yourself with routine, warm food, early nights and firm boundaries. Bathe with salt and rosemary once a week. I always say: what you steady inside now will hold you for many years.",
    harmonious:
      "Saturn supports your Moon, and this is a season of emotional steadiness. You feel less blown about by moods and more able to care for others without losing yourself. Home and family matters settle into a calmer shape.\n\nIt is a beautiful time to create rituals that last — a Sunday reset, a candle for the evening, a jar of moon water on the windowsill. Small habits, faithfully kept, become your foundation.",
    challenging:
      "Saturn is leaning on your Moon, and this is a season when old feelings ask to be met properly. You may feel more tired, more serious, or keenly aware of what home needs. Be gentle with yourself.\n\nThis chapter is not cold — it is clarifying. Let yourself say what you need. Simplify your evenings, eat warm food and keep a selenite by your bed. Every boundary you set now is an act of tenderness towards yourself.",
  },
  "Saturn>Mercury": {
    conjunction:
      "Saturn sits on your natal Mercury, and this is a season of serious thinking. Your mind wants depth, not chatter. Ideas you have circled for years ask to be written down, studied and made workable.\n\nCommit to one course, one plan, one piece of writing. Speak more slowly and mean every word. A grey or indigo candle on your desk helps focus. What you learn and decide during this chapter becomes the backbone of your next few years.",
    harmonious:
      "Saturn steadies your Mercury, and this is a season of clear, practical thinking. Plans make sense, contracts read straight and your words carry weight. People listen when you speak, because you sound like someone who has thought it through.\n\nUse this for study, writing or any skill that rewards repetition. Make a list and actually finish it. A piece of fluorite on your desk keeps your mind tidy and your intentions sharp.",
    challenging:
      "Saturn is challenging your Mercury, and this is a season of mental discipline. Thinking may feel slower, and doubt can creep into how you speak. Don't believe every gloomy thought — check it.\n\nThis chapter teaches precision. Write things down, read the fine print, give yourself more time to decide. Breaks matter as much as effort. Burn a little rosemary to clear the air before study. By the end, your mind will be stronger and far more trustworthy.",
  },
  "Saturn>Venus": {
    conjunction:
      "Saturn is meeting your natal Venus, and this is a season of real love — the kind built from loyalty, not fireworks. Whether you are single or partnered, you want relationships that are honest and worth the effort.\n\nLet go of anything that only looks pretty. Invest in the people and pleasures that last. Place a rose quartz beside a black tourmaline on your altar: softness held by strength. What you choose to love now becomes part of you.",
    harmonious:
      "Saturn sends a calm, faithful light to your Venus, and this is a season of grounded affection. Bonds deepen quietly, friendships prove themselves, and your taste becomes more refined and more your own.\n\nThis is a lovely time to commit — to a person, a style, a creative practice, a home that feels like you. Choose quality over quantity. Light a pink candle on Fridays and give thanks for the love that has stayed.",
    challenging:
      "Saturn is testing your Venus, and this is a season of honest questions about love, pleasure and worth. Some connections may feel distant or demanding. Don't panic — this chapter is sorting what is real from what is habit.\n\nAsk for what you need, clearly and kindly. Value yourself before you ask anyone else to. A rose bath with a pinch of salt restores your sweetness. What survives this season will be stronger, and so will your self-respect.",
  },
  "Saturn>Mars": {
    conjunction:
      "Saturn crosses your natal Mars, and this is a season of disciplined courage. Your drive meets resistance, and that resistance is the training. Rushing will frustrate you; steady effort will make you formidable.\n\nPick one goal and pace yourself like a long-distance runner. Move your body regularly and kindly. A red candle placed beside a black one reminds you that fire needs a hearth. By the end of this chapter, your willpower will be quietly unshakeable.",
    harmonious:
      "Saturn steadies your Mars, and this is a season of effective, patient action. You know how to pace yourself now, and your energy goes where it counts. Hard work feels less like struggle and more like craft.\n\nTake on the project that needs stamina. Train a skill, build a routine, finish what you start. Carry a piece of garnet or hematite for grounded strength. Your efforts in this chapter compound beautifully over time.",
    challenging:
      "Saturn is pushing against your Mars, and this is a season when the brakes and the accelerator are pressed together. Frustration is natural. Don't force doors — find the right key.\n\nThis chapter teaches strategy. Slow down, plan each move, and channel tension into steady exercise rather than arguments. Rest is part of strength. Light a red candle, write what you want to achieve and the one step for this week. Patience here becomes real power.",
  },
  "Saturn>Jupiter": {
    conjunction:
      "Saturn is meeting your natal Jupiter, and this is a season of making big dreams practical. Vision and discipline sit at the same table at last. Ask yourself which of your hopes deserves a real plan.\n\nThis chapter rewards wise choices over many choices. Study, teach, travel with purpose, or commit to a belief you have tested. Light a royal blue candle on Thursdays. Growth that is built carefully now will keep growing long after.",
    harmonious:
      "Saturn works sweetly with your Jupiter, and this is a season of measured growth. Opportunities arrive with solid ground beneath them, and you have the judgement to choose well. Luck and effort finally shake hands.\n\nIt is a good chapter for long-term plans — study, a craft, a home, a vocation. Take advice from someone older and wiser. Keep a citrine and a smoky quartz together on your altar: optimism, anchored.",
    challenging:
      "Saturn is challenging your Jupiter, and this is a season of balancing faith with realism. Some hopes may need trimming, and that is not defeat — it is good gardening. Overreaching drains you; focus restores you.\n\nThis chapter asks what you truly believe and what you are only repeating. Choose fewer goals and give them more heart. Burn bay leaves with your written intention. What you keep now will flourish with deeper roots.",
  },
  "Saturn>Saturn": {
    conjunction:
      "This is your Saturn return — the planet has come back to where it stood when you were born. It is a season of growing up on your own terms, and one of the great thresholds of life.\n\nStructures that no longer fit fall away, and what you truly want asks to be built. Don't fear it. Take stock, choose honestly, commit slowly. Light a black candle and write who you are becoming. This chapter makes you real.",
    harmonious:
      "Saturn is making a gentle angle to its own birth place in your chart, and this is a season of quiet consolidation. You can see how far you have come, and the next step feels clear and achievable.\n\nUse this calm to strengthen your foundations — routines, skills, commitments, the roof over your life. Write down the lessons of the past few years. Keep a piece of onyx nearby. Steady progress is your magic now.",
    challenging:
      "Saturn is squaring or opposing its own place in your chart, and this is a season of checkpoint. Life asks whether the structures you built still serve the person you are becoming. Some need repair; some need releasing.\n\nThis chapter is not a failure — it is a review. Be honest, be patient, and adjust rather than abandon. Rest well. Light a black candle with a pinch of salt and name one responsibility you are ready to reshape.",
  },
  "Saturn>Ascendant": {
    conjunction:
      "Saturn is crossing your Ascendant, and this is a season of stepping into a more mature version of yourself. You may feel more serious, more private, more aware of how you present to the world. That is the work.\n\nThis chapter asks you to take yourself seriously — your body, your boundaries, your direction. Simplify your style, keep good routines, rest deeply. Carry black tourmaline for protection. People will see your strength before you do.",
    harmonious:
      "Saturn supports your Ascendant, and this is a season of quiet authority. You appear calm, reliable and self-possessed, and others respond with trust. It is easier to set boundaries without guilt.\n\nUse this chapter to refine how you meet the world — a steadier routine, a cleaner wardrobe, a clearer way of saying no. Take care of your body with simple, faithful habits. Your presence grows stronger the more grounded you become.",
    challenging:
      "Saturn is pressing on your Ascendant, and this is a season when the people and duties around you ask a lot. You may feel watched, tested or simply tired. Don't shrink; steady yourself.\n\nThis chapter teaches self-possession. Decide what you will carry and what you will politely set down. Keep your days simple and your sleep sacred. Sprinkle salt at your front door each new moon. Your quiet strength is being forged right now.",
  },
  "Saturn>Midheaven": {
    conjunction:
      "Saturn has reached your Midheaven, and this is a season of reputation and responsibility. Whatever you have been building in your public life comes into view. It is time to own your path and stand behind it.\n\nTake your vocation seriously — the work you want to be known for. Ask for the role that matches your growth. Light a dark green candle on Saturdays. What you claim during this chapter can shape the next many years.",
    harmonious:
      "Saturn steadily supports your Midheaven, and this is a season when your efforts are seen and respected. Your direction feels clear, and those with influence notice your reliability.\n\nThis chapter favours slow, solid progress in your life's work. Take on responsibility willingly, ask a mentor for honest guidance, and set a five-year intention. Keep a piece of jet or onyx near your workspace. Each patient step now builds your name.",
    challenging:
      "Saturn is challenging your Midheaven, and this is a season of re-evaluating your path. Expectations from the outside world may feel heavy, or home and calling may pull in different directions. Breathe.\n\nThis chapter asks what success truly means for you. Let go of goals that belong to someone else. Make one practical change towards the life you want. Write your vocation in one sentence and keep it under a black candle. Clarity comes through patience.",
  },

  // ——— Uranus ———
  "Uranus>Sun": {
    conjunction:
      "Uranus is electrifying your Sun, and this is a season of awakening. The person you have been is ready to surprise even you. Restlessness is a message, not a problem.\n\nFollow your curiosity, change your look, try the path you once thought was too bold. Leave room for the unexpected. Light a turquoise candle and write one word for the self that wants to break free. This chapter is your liberation — trust it.",
    harmonious:
      "Uranus sends fresh sparks to your Sun, and this is a season of exciting, easy change. New ideas, people and opportunities arrive just when you are ready for them. You feel more original and more alive.\n\nSay yes to something new — a class, a trip, a creative experiment, a different way of working. Carry labradorite for intuition and flashes of insight. This chapter rewards those who dare to be themselves out loud.",
    challenging:
      "Uranus is shaking your Sun, and this is a season of breakthroughs that may first feel like disruption. Plans change, patterns break, and you may crave freedom more than ever. Don't resist everything.\n\nThis chapter is clearing space for a truer self. Stay flexible, keep a few steady rituals and make changes thoughtfully rather than in anger. Ground yourself barefoot on the earth. What feels like chaos is often the Universe rearranging you towards freedom.",
  },
  "Uranus>Moon": {
    conjunction:
      "Uranus is meeting your natal Moon, and this is a season of emotional awakening. Feelings arrive suddenly and with surprising honesty. Home, family or daily rhythms may want a fresh shape.\n\nGive yourself room to change what you need to feel safe. Rearrange your space, try new rituals, listen to your gut. Keep moonstone close for steadiness. My advice: let your heart surprise you. This chapter is teaching you a freer kind of comfort.",
    harmonious:
      "Uranus brightens your Moon, and this is a season when emotional life feels lighter and more spontaneous. New friendships, unusual comforts and fresh routines arrive with ease. You are ready to feel differently.\n\nTry something new at home — a moved altar, a fresh colour, a different evening ritual. Follow intuitive impulses; they are well-tuned now. Charge moon water on the full moon and drink it for clarity. Freedom and safety can share a house.",
    challenging:
      "Uranus is unsettling your Moon, and this is a season when feelings can flip without warning. Home life or moods may feel unpredictable. Be patient with yourself — your inner world is updating.\n\nThis chapter asks for flexible comfort. Keep simple anchors: a warm drink, a familiar candle, early nights. Let go of routines that cage you. Hold a piece of amethyst when emotions rise. What changes now is making space for a truer sense of home.",
  },
  "Uranus>Mercury": {
    conjunction:
      "Uranus is lighting up your Mercury, and this is a season of brilliant, unexpected ideas. Your mind races ahead, picking up new subjects and seeing connections others miss. Write everything down.\n\nThis chapter is perfect for learning something modern or unusual, changing how you communicate, or speaking your mind more freely. Keep a notebook by the bed. Burn a little peppermint for clarity. Your thinking is being rewired — enjoy the brightness.",
    harmonious:
      "Uranus sparks your Mercury, and this is a season of original thinking that flows easily. Inspiration comes in flashes, conversations open new doors, and technology or new learning feels exciting rather than tiring.\n\nUse this chapter to share your ideas — write, teach, pitch, post. Experiment with new ways of thinking and working. Carry a clear quartz to amplify insight. Your quick, inventive mind is one of your greatest tools right now.",
    challenging:
      "Uranus is jolting your Mercury, and this is a season of restless thinking and sudden changes of plan. Your mind may jump faster than your words can follow. Don't decide everything in a flash.\n\nThis chapter teaches you to catch brilliance without being scattered by it. Pause before important messages, write things down, and leave room for revisions. Breathe deeply before replying. Fluorite on your desk helps. Brilliant ideas need steady hands to become real.",
  },
  "Uranus>Venus": {
    conjunction:
      "Uranus is meeting your natal Venus, and this is a season of surprising love and fresh taste. You want more freedom and more truth in connection — whether single or partnered. Old patterns feel suddenly dull.\n\nFollow your attraction to the new: different people, styles, art, pleasures. Let honesty refresh your bonds. Wear something unexpected. Place rose quartz with a turquoise on your altar. This chapter teaches you that love can be free and still be real.",
    harmonious:
      "Uranus delights your Venus, and this is a season of playful, exciting connection. New friends, creative sparks and delicious surprises in love come with ease. You feel freer to enjoy beauty in your own way.\n\nTry a new style, a new form of art, a new kind of date or celebration. Let relationships breathe. Light a pink and a turquoise candle together. This chapter opens your heart to pleasures you never expected to love.",
    challenging:
      "Uranus is stirring your Venus, and this is a season when relationships and desires may change shape suddenly. You might crave space, or find others do. Don't make every decision in the heat of the moment.\n\nThis chapter is asking for honesty in love. Talk about freedom and closeness openly. Let your taste evolve. Bathe with rose petals and a pinch of salt to stay centred. The bonds and pleasures that suit your truer self will remain.",
  },
  "Uranus>Mars": {
    conjunction:
      "Uranus charges your natal Mars, and this is a season of bold, sudden action. Energy surges, and you want to break out of anything that limits you. Courage comes easily — wisdom needs a little more effort.\n\nChannel this fire into something new: a fresh form of movement, a daring project, a brave decision. Slow down where care matters. Carry carnelian for courage and hematite for grounding. This chapter makes you fearless in the best way.",
    harmonious:
      "Uranus sparks your Mars, and this is a season of exciting, inventive drive. You act quickly and well, and new ways of working or moving your body feel energising. Opportunities reward initiative.\n\nTake the leap you have been circling. Try a new sport, start the project, follow the inspired impulse. Light a red candle with a pinch of cinnamon. This chapter favours the brave and the original — and that is you.",
    challenging:
      "Uranus is clashing with your Mars, and this is a season of restless, electric energy. Impatience can spark quickly, and you may want to break free all at once. Take a breath before you act.\n\nThis chapter asks you to direct your fire wisely. Move your body daily, slow down around sharp tools and fast roads, and choose your battles. Ground yourself with black tourmaline. When you channel this current, you become unstoppable in the right way.",
  },
  "Uranus>Jupiter": {
    conjunction:
      "Uranus meets your natal Jupiter, and this is a season of sudden openings and expanding horizons. New beliefs, journeys, teachers or opportunities may arrive out of nowhere. Your world is getting bigger.\n\nSay yes to adventures of the mind and spirit. Study something unconventional, travel somewhere new, follow a hunch about your future. Keep a citrine with a labradorite on your altar. This chapter invites you to believe in bigger, freer possibilities.",
    harmonious:
      "Uranus brightens your Jupiter, and this is a season of lucky surprises and inspired growth. The right idea or person tends to appear at the right moment. You feel optimistic and open to new philosophies.\n\nUse this chapter to explore — courses, travel, spiritual practices, bold dreams. Share your vision with like-minded people. Light a royal blue candle and write three adventures you want. Freedom and faith are working together for you now.",
    challenging:
      "Uranus is pulling at your Jupiter, and this is a season of restless growth. You may want to change everything at once — beliefs, plans, horizons. Excitement is good; overcommitment is not.\n\nThis chapter asks for wise freedom. Test new ideas before you leap, and keep your feet on solid ground. Choose one bold step, not ten. Burn bay leaves with a written intention. Real expansion is coming — let it unfold at a sustainable pace.",
  },
  "Uranus>Saturn": {
    conjunction:
      "Uranus is crossing your natal Saturn, and this is a season of reinventing your foundations. Structures that once felt safe may suddenly feel like cages. You are ready to build something truer.\n\nDon't tear everything down at once. Keep what still serves you and redesign the rest. Change rules you made out of fear. Light a black and a turquoise candle together: tradition and freedom side by side. This chapter rebuilds you stronger.",
    harmonious:
      "Uranus gently refreshes your Saturn, and this is a season of smart, sustainable change. You can modernise routines, work and commitments without losing stability. Old wisdom and new ideas cooperate.\n\nUse this chapter to update your structures — a better system, a fresh approach to responsibility, a new skill that strengthens your path. Carry smoky quartz with clear quartz. Progress feels steady and exciting at once.",
    challenging:
      "Uranus is challenging your Saturn, and this is a season of tension between the old and the new. Part of you wants safety; part wants freedom. Both deserve a voice.\n\nThis chapter teaches you to change wisely. Loosen rules that no longer fit, but don't abandon every structure in one go. Make changes in steps. Sprinkle salt at your threshold for steadiness. What emerges will be both freer and more secure.",
  },
  "Uranus>Ascendant": {
    conjunction:
      "Uranus is crossing your Ascendant, and this is a season of reinvention. You may want to change your look, your surroundings, even the way you introduce yourself. Let it happen.\n\nThis chapter is about showing the world who you truly are, not who you were expected to be. Experiment with style, routine and self-expression. Carry labradorite for magic and protection. People may be surprised by you — and that is the point.",
    harmonious:
      "Uranus brightens your Ascendant, and this is a season of fresh starts that come easily. New people, places and ways of presenting yourself feel exciting rather than frightening. You seem more vibrant.\n\nTry something different — a new hairstyle, a new walk, a new circle. Follow invitations that spark curiosity. Light a turquoise candle when you set intentions. This chapter shows how magnetic you are when you simply let yourself be original.",
    challenging:
      "Uranus is unsettling your Ascendant, and this is a season when the people around you or your daily environment may change without warning. You may feel restless in your own skin.\n\nThis chapter asks you to adapt with grace. Keep simple routines that ground you, and let the rest evolve. Don't react from shock — pause and choose. Carry black tourmaline. What looks like disruption is clearing space for a freer life.",
  },
  "Uranus>Midheaven": {
    conjunction:
      "Uranus has reached your Midheaven, and this is a season of career awakening. Your path may take a sudden turn, or a calling you have ignored grows impossible to resist. Pay attention.\n\nThis chapter favours bold professional moves, new skills and unusual paths. Think about the work that truly lights you up. Write your wildest vocation on paper and keep it under a turquoise candle. The Universe is opening doors you did not know existed.",
    harmonious:
      "Uranus sparks your Midheaven, and this is a season of exciting opportunities in your public life. Innovation, independence and originality are rewarded. Someone may see your potential in a fresh light.\n\nUse this chapter to update how you work — new tools, new collaborations, a braver public voice. Follow inspired career ideas. Keep labradorite at your workspace. Change in your direction feels like a gift right now.",
    challenging:
      "Uranus is stirring your Midheaven, and this is a season of unexpected shifts in direction. Work or home may change suddenly, and you may feel torn between stability and freedom.\n\nThis chapter asks you to stay flexible without losing your centre. Don't quit anything in a fit of frustration — plan your freedom. Keep a few anchoring rituals. Light a black candle beside a turquoise one. Your path is being rerouted towards something truer.",
  },

  // ——— Neptune ———
  "Neptune>Sun": {
    conjunction:
      "Neptune is washing over your Sun, and this is a season of softening and spiritual opening. Old ambitions may blur while dreams, art and intuition grow stronger. You may feel less sure who you are — in a beautiful way.\n\nLet yourself be guided rather than driven. Rest more, create more, meditate by water. Keep amethyst close and a journal for dreams. This chapter dissolves what is false and reveals your truest light.",
    harmonious:
      "Neptune sends a gentle tide to your Sun, and this is a season of inspiration and compassion. Creativity flows, intuition is clear and you feel more connected to something greater than yourself.\n\nUse this chapter for art, music, healing work, prayer, the sea. Let your imagination lead. Charge moon water on the full moon and drink it with an intention. Your spirit is glowing — share that light generously and wisely.",
    challenging:
      "Neptune is clouding your Sun, and this is a season when direction may feel misty and energy lower than usual. Don't force clarity — let it come. Things are not lost; they are transforming.\n\nThis chapter asks for gentle discipline: good rest, simple routines and honest boundaries. Be careful what you believe without checking. Bathe with salt and lavender to cleanse confusion. In this softness, a deeper sense of purpose quietly takes shape.",
  },
  "Neptune>Moon": {
    conjunction:
      "Neptune is meeting your natal Moon, and this is a season of deep sensitivity. Your heart feels everything — beauty, sorrow, other people's moods. Your dreams become vivid messengers.\n\nProtect your energy with gentle boundaries and plenty of rest. Keep a dream journal, spend time near water, and create a soft sanctuary at home. Place moonstone under your pillow. This chapter opens your intuition wider than ever before — trust it.",
    harmonious:
      "Neptune softly blesses your Moon, and this is a season of emotional healing and intuitive grace. You understand others easily, and your inner life feels rich and peaceful. Dreams carry guidance.\n\nUse this chapter for gentle self-care, creative play and spiritual practice. Take moonlit walks, listen to music that moves you, and bathe in rose and lavender. Your compassion is a gift — just remember to include yourself.",
    challenging:
      "Neptune is blurring your Moon, and this is a season when emotions may feel foggy or overwhelming. You might absorb other people's feelings without noticing. Be gentle and protective with yourself.\n\nThis chapter asks for clear boundaries and simple comforts. Rest, hydrate, and cleanse your space with salt and smoke. Don't make big emotional decisions in the haze — wait for the tide to settle. Your sensitivity is a gift, and you are learning to guard it.",
  },
  "Neptune>Mercury": {
    conjunction:
      "Neptune is dissolving into your Mercury, and this is a season of poetic, intuitive thinking. Logic softens while imagination grows. You may find yourself drawn to writing, music, symbols or tarot.\n\nLet your mind wander in creative places. Keep a notebook for dreams and flashes of insight. Double-check details and agreements, as clarity can drift. Burn a little mugwort before reading cards. This chapter turns your thoughts into magic.",
    harmonious:
      "Neptune inspires your Mercury, and this is a season of imaginative words and intuitive understanding. You speak to people's hearts, and creative writing, storytelling or spiritual study flow easily.\n\nUse this chapter to write, read tarot, learn a sacred practice or share your visions. Listen to your inner voice — it is clear right now. Keep an amethyst on your desk. Your words can comfort and inspire many people.",
    challenging:
      "Neptune is fogging your Mercury, and this is a season when details slip and messages can be misunderstood. Don't worry — your mind is simply tuned to a different frequency.\n\nThis chapter asks for care with facts. Write things down, ask questions, read agreements twice. Let your imagination play, but check before you trust. Burn rosemary to clear your thinking. Through this mist, your intuition is learning a new language.",
  },
  "Neptune>Venus": {
    conjunction:
      "Neptune is merging with your Venus, and this is a season of romantic, dreamy love. Beauty touches you deeply and your heart wants something soulful. Art, music and the sea call to you.\n\nEnjoy the magic, but keep your eyes open — see people as they are, not only as you wish. Love yourself as tenderly as you love others. Bathe with rose petals under the full moon. This chapter makes your heart wiser and softer.",
    harmonious:
      "Neptune blesses your Venus, and this is a season of tender connection and artistic inspiration. Love feels more compassionate, creativity flows, and beauty seems to find you everywhere.\n\nUse this chapter to create, to romance — yourself or another — and to soften old hurts. Spend time near water, light a pink candle and listen to music that opens your heart. This is a beautiful time for soul-deep love.",
    challenging:
      "Neptune is veiling your Venus, and this is a season when love and pleasure may feel confusing. Romance can be idealised, and disappointment comes from expectations rather than truth. Gently clear your vision.\n\nThis chapter asks you to love with open eyes. Speak honestly, check your assumptions, and honour your worth. Bathe in salt and rose before big decisions. Underneath the haze, your heart is learning a more genuine kind of devotion.",
  },
  "Neptune>Mars": {
    conjunction:
      "Neptune is softening your natal Mars, and this is a season when drive becomes inspired rather than forceful. Pushing may feel exhausting, but flowing towards a dream feels effortless.\n\nChannel your energy into creativity, healing, dance or service. Rest when your body asks. Move near water — swim, walk the shore. Carry aquamarine for gentle courage. This chapter shows you that the most powerful action can be graceful.",
    harmonious:
      "Neptune gently inspires your Mars, and this is a season of compassionate, imaginative action. You work best for causes you believe in, and creative or spiritual projects move forward easily.\n\nUse this chapter to put energy into art, dance, healing or helping others. Follow intuitive impulses. Light a red and a sea-blue candle together. When your heart guides your fire, you achieve beautiful things without strain.",
    challenging:
      "Neptune is dissolving your Mars, and this is a season when energy and motivation may feel slippery. Goals can seem foggy, or effort doesn't land where you expect. Don't blame yourself.\n\nThis chapter asks you to act from your heart, not from pressure. Rest well, move gently, and be clear about your intentions before you push. Avoid acting on confusion. Carry hematite for grounding. Quiet persistence will carry you through the mist.",
  },
  "Neptune>Jupiter": {
    conjunction:
      "Neptune is meeting your natal Jupiter, and this is a season of spiritual expansion. Faith deepens, compassion grows and you feel drawn to mystical paths, sacred places or teachers.\n\nLet yourself explore — meditation, ritual, pilgrimage, art. Keep your discernment as your heart opens. Charge a piece of amethyst under the full moon. This chapter invites you to believe in the magic you have always sensed was real.",
    harmonious:
      "Neptune flows with your Jupiter, and this is a season of grace and generous faith. Intuition guides you towards meaningful growth, and kindness seems to return to you multiplied.\n\nUse this chapter for spiritual study, creative visions or helping others. Spend time by the sea. Write a gratitude list and keep it under a blue candle. Your trust in the Universe is being quietly and beautifully rewarded.",
    challenging:
      "Neptune is stretching your Jupiter, and this is a season when hopes may grow bigger than plans. Optimism is wonderful, but promises — yours or others' — deserve a second look.\n\nThis chapter asks for grounded faith. Dream boldly, but check details and keep a practical step in every vision. Avoid overcommitting. Burn bay leaves with an honest intention. Your spirit is expanding; let your wisdom grow alongside it.",
  },
  "Neptune>Saturn": {
    conjunction:
      "Neptune is dissolving into your natal Saturn, and this is a season when old structures soften. Rules, plans and fears you held tightly may lose their grip. That can feel strange — and freeing.\n\nLet go of what was built from anxiety. Keep the walls that truly protect you. Bring imagination into your discipline. Light a black candle beside a silver one. This chapter teaches you that structure and spirit belong together.",
    harmonious:
      "Neptune gently supports your Saturn, and this is a season of making dreams real. Discipline and imagination cooperate, and spiritual practice becomes a steady part of daily life.\n\nUse this chapter to give a vision a sensible form — a creative project with a schedule, a healing practice with a routine. Keep onyx and amethyst together. Your patience is now in service of something beautiful.",
    challenging:
      "Neptune is challenging your Saturn, and this is a season when structures may feel uncertain or responsibilities blurred. You may question old plans or feel unsure where the ground is.\n\nThis chapter asks for gentle, honest maintenance. Keep simple routines, check commitments, and release rules made from fear. Don't let worry write your story. Sprinkle salt in the corners of your home. A wiser, more compassionate foundation is forming.",
  },
  "Neptune>Ascendant": {
    conjunction:
      "Neptune is crossing your Ascendant, and this is a season of becoming more magical and more mysterious. People may see you differently — softer, dreamier, harder to define. You may feel more sensitive to your surroundings.\n\nProtect your energy with cleansing rituals and good rest. Let your style become more intuitive. Carry moonstone and black tourmaline together. This chapter makes you a living spell — gentle, glowing and wise.",
    harmonious:
      "Neptune softly brightens your Ascendant, and this is a season of grace and gentle magnetism. People find you calming and compassionate, and your intuition about others is spot on.\n\nUse this chapter to bring more beauty and spirit into how you show up — flowing colours, soft rituals, time by the water. Trust first impressions. Wear a little rose oil. Your quiet magic is clearly seen.",
    challenging:
      "Neptune is veiling your Ascendant, and this is a season when boundaries can blur and other people's energy may cling to you. You may feel unsure how others see you.\n\nThis chapter asks for clear protection. Cleanse with salt baths, keep your space tidy and say no when you need to. Don't take on everyone's needs. Carry black tourmaline. In this mist, you are discovering a gentler, truer way of being seen.",
  },
  "Neptune>Midheaven": {
    conjunction:
      "Neptune has reached your Midheaven, and this is a season when your calling may shift towards something more soulful. Ambitions blur while creative, healing or spiritual paths beckon.\n\nLet yourself dream about the work that would feel like prayer. Make practical notes alongside your visions. Light a sea-blue candle when you plan. This chapter is quietly steering your life's work towards meaning.",
    harmonious:
      "Neptune flows with your Midheaven, and this is a season of inspired direction. Creative or compassionate work feels deeply rewarding, and your intuition guides your next professional step.\n\nUse this chapter to bring imagination into your path — art, healing, teaching, beauty. Follow subtle signs. Keep an amethyst at your workspace. Your vocation is becoming more aligned with your soul.",
    challenging:
      "Neptune is clouding your Midheaven, and this is a season when direction may feel uncertain and goals less clear. Don't panic. Some paths dissolve so truer ones can surface.\n\nThis chapter asks you to keep simple practical habits while your vision changes. Check agreements and avoid big leaps made in confusion. Write your truest hope for your work and keep it under a silver candle. Clarity will rise as the tide turns.",
  },

  // ——— Pluto ———
  "Pluto>Sun": {
    conjunction:
      "Pluto is meeting your Sun, and this is a season of profound transformation. You are shedding an old skin and growing into your true power. It can feel intense, but it is a rebirth.\n\nLet go of roles that no longer fit. Face what you have avoided. Choose depth over surface. Light a deep red candle on the dark moon and write what you are releasing. This chapter makes you more magnetic, honest and strong.",
    harmonious:
      "Pluto sends deep power to your Sun, and this is a season of quiet empowerment. You understand yourself better and act with real conviction. Changes you make now go all the way to the root.\n\nUse this chapter to transform something important — a habit, a goal, a way of leading. Trust your inner strength. Carry obsidian for depth and clarity. Your influence grows when you act from your centre.",
    challenging:
      "Pluto is pressing on your Sun, and this is a season of deep tests of will. Power struggles or intense situations may push you to discover what you truly stand for.\n\nThis chapter is not here to break you, but to reveal your strength. Release control where you can, stand firm where you must. Rest well. Burn sage and write what you are ready to let die. From these depths, a more powerful version of you rises.",
  },
  "Pluto>Moon": {
    conjunction:
      "Pluto is meeting your natal Moon, and this is a season of deep emotional rebirth. Old feelings, family patterns and buried needs rise to be seen and healed. It can feel raw — and very real.\n\nGive yourself time, privacy and tender care. Journal honestly, cry when you need to, and seek support where it helps. Place obsidian beside moonstone on your altar. This chapter transforms your heart into a stronger, wiser home.",
    harmonious:
      "Pluto deepens your Moon, and this is a season of healing at the root. You can face old feelings with courage, and emotional bonds become more honest and intimate.\n\nUse this chapter for shadow work, family healing or deep self-care. Your intuition is powerful — trust it. Bathe with salt and black pepper to clear stagnant energy. What you heal now brings lasting emotional freedom.",
    challenging:
      "Pluto is stirring your Moon, and this is a season when strong emotions and old patterns may surface. Home or family dynamics may feel intense. Don't hide from what you feel.\n\nThis chapter asks for honest, compassionate inner work. Name your needs, let go of control and protect your peace. Seek gentle support if it helps. Light a black candle and write what you release. These depths are preparing a lighter heart.",
  },
  "Pluto>Mercury": {
    conjunction:
      "Pluto is meeting your Mercury, and this is a season of penetrating thought. You want the truth beneath the surface — in research, conversations, your own mind. Small talk no longer satisfies.\n\nUse this chapter to study deeply, write powerfully and speak with conviction. Choose words carefully; they carry weight now. Keep obsidian on your desk. Your mind is being transformed into a sharper, more powerful instrument.",
    harmonious:
      "Pluto deepens your Mercury, and this is a season of insight and persuasive words. You read between the lines, uncover hidden information and speak in ways that move people.\n\nUse this chapter for research, writing, investigation, or honest conversations that heal. Trust your instincts about what is true. Burn a little mugwort before deep study. Your thoughts can change minds — including your own.",
    challenging:
      "Pluto is pressing on your Mercury, and this is a season of intense thoughts and powerful conversations. Obsession or mental pressure may rise. Don't let worry spiral.\n\nThis chapter asks you to speak with honesty and listen with care. Pause before hard words. Write your thoughts down to see them clearly. Burn rosemary to clear the mind. Through these deep conversations, you learn the true power of your voice.",
  },
  "Pluto>Venus": {
    conjunction:
      "Pluto is meeting your natal Venus, and this is a season of passionate transformation in love and values. Your heart wants depth, intimacy and truth. Shallow pleasures lose their pull.\n\nWhether single or partnered, let love change you. Release attachments that diminish you. Honour your desires. Bathe with red rose petals and a pinch of salt. This chapter teaches you how powerful, magnetic and worthy you really are.",
    harmonious:
      "Pluto deepens your Venus, and this is a season of soulful, magnetic connection. Bonds grow more intimate, and your sense of self-worth becomes stronger and more grounded.\n\nUse this chapter to heal old heartbreak, deepen trust, or explore creative passions. Choose what you love with intention. Light a deep pink candle and speak your desire aloud. Love feels transformative in the best way.",
    challenging:
      "Pluto is stirring your Venus, and this is a season when love, desire or self-worth may feel intense. Jealousy, control or old wounds can surface — yours or others'. Look gently but honestly.\n\nThis chapter asks you to love freely and with self-respect. Release what does not honour you. Speak openly about needs. Cleanse with a salt and rose bath. On the other side of this, love is more authentic and powerful.",
  },
  "Pluto>Mars": {
    conjunction:
      "Pluto is fuelling your natal Mars, and this is a season of tremendous drive and willpower. You can achieve far more than usual — if you direct it wisely. Intensity is your gift now.\n\nChoose one worthy goal and pour yourself into it. Avoid power struggles; you don't need them. Move your body to release tension. Carry garnet and obsidian. This chapter transforms your courage into something unstoppable.",
    harmonious:
      "Pluto empowers your Mars, and this is a season of focused, transformative action. You have the stamina for deep change and the will to finish what you start.\n\nUse this chapter to tackle something difficult — a long project, a powerful habit, a brave goal. Trust your inner force. Light a deep red candle with a bay leaf. Your effort now reshapes your life from the ground up.",
    challenging:
      "Pluto is clashing with your Mars, and this is a season of intense energy and potential conflict. Frustration or control issues may test your patience. Breathe before you act.\n\nThis chapter teaches you to use power wisely. Channel anger into exercise, creativity or honest boundaries. Walk away from battles not worth fighting. Ground with black tourmaline. Your strength grows when you master it rather than unleash it.",
  },
  "Pluto>Jupiter": {
    conjunction:
      "Pluto is meeting your natal Jupiter, and this is a season of powerful growth and deep faith. Your beliefs may transform, and ambitions grow larger and more meaningful.\n\nUse this chapter to pursue the vision that truly moves you. Study, teach or explore spiritual paths with depth. Choose integrity over appearance. Keep citrine and obsidian together. Growth now goes beyond surface — it reshapes your purpose.",
    harmonious:
      "Pluto deepens your Jupiter, and this is a season of empowered optimism. Opportunities for meaningful growth appear, and your influence expands through wisdom and integrity.\n\nUse this chapter for big, purposeful plans — teaching, leading, studying, sharing your knowledge. Trust your vision. Light a royal blue candle and write your boldest hope. What grows now has deep roots and lasting strength.",
    challenging:
      "Pluto is stretching your Jupiter, and this is a season of testing your beliefs and ambitions. Big plans may meet resistance, or you may question what you once took as truth.\n\nThis chapter asks for honest faith. Let go of beliefs that keep you small. Avoid excess, and choose growth that aligns with your values. Burn bay leaves with your intention. A deeper, wiser optimism is taking shape.",
  },
  "Pluto>Saturn": {
    conjunction:
      "Pluto is meeting your natal Saturn, and this is a season of rebuilding at the deepest level. Old structures, fears and responsibilities transform. What is false falls away; what is true becomes unshakeable.\n\nTake this chapter seriously and patiently. Rebuild your foundations with honesty. Release rules made from fear. Light a black candle with a pinch of salt. You are becoming the architect of a stronger life.",
    harmonious:
      "Pluto strengthens your Saturn, and this is a season of deep, lasting achievement. Discipline and power work together, and long-term efforts gain real momentum.\n\nUse this chapter to commit to something important — a career goal, a home, a skill, a responsibility. Trust your endurance. Keep onyx and obsidian near your workspace. What you build now can stand for decades.",
    challenging:
      "Pluto is pressing on your Saturn, and this is a season when old structures are under pressure. Responsibilities may feel heavy, or authority figures challenging. Don't despair — this is renovation.\n\nThis chapter asks you to rebuild wisely. Release what is crumbling, reinforce what is strong, and rest when needed. Sprinkle salt at your threshold. From this pressure, an enduring foundation is born.",
  },
  "Pluto>Ascendant": {
    conjunction:
      "Pluto is crossing your Ascendant, and this is a season of profound personal transformation. Your presence becomes more powerful and magnetic. You may feel reborn in body, style and identity.\n\nLet the old self fall away gracefully. Choose how you want to be seen. Protect your energy fiercely. Carry obsidian and black tourmaline. This chapter makes you unmistakably yourself — deep, strong and impossible to ignore.",
    harmonious:
      "Pluto empowers your Ascendant, and this is a season of quiet magnetism and personal strength. You make an impression without trying, and others sense your depth.\n\nUse this chapter to step more fully into your power — in how you dress, speak and set boundaries. Trust your instincts about people. Light a deep red candle on the dark moon. Your presence is transforming in beautiful ways.",
    challenging:
      "Pluto is pressing on your Ascendant, and this is a season of intense encounters and personal tests. Relationships or environments may challenge your sense of control. Stand firm in yourself.\n\nThis chapter asks you to protect your energy and claim your power without force. Set boundaries clearly. Cleanse with salt and smoke. Don't give your power away. Through these tests, you discover how strong you truly are.",
  },
  "Pluto>Midheaven": {
    conjunction:
      "Pluto has reached your Midheaven, and this is a season of transforming your life's direction. Your ambitions deepen, and you may feel called to work with real impact. Your public role is changing.\n\nStep into power with integrity. Let go of paths that no longer fit. Write your truest calling and keep it under a deep red candle. This chapter can reshape your reputation and your legacy.",
    harmonious:
      "Pluto empowers your Midheaven, and this is a season of influential progress. You have the determination to make real changes in your path, and others recognise your strength.\n\nUse this chapter to pursue the work that matters most. Take on responsibility with courage. Keep obsidian at your workspace. Your vocation is deepening, and your influence is growing with it.",
    challenging:
      "Pluto is stirring your Midheaven, and this is a season of pressure in your public life or tension between career and home. Power dynamics may test you.\n\nThis chapter asks you to reclaim your direction from others' expectations. Release what no longer fits, and pursue your path with integrity. Burn sage and write your intention. From this pressure, a more authentic calling emerges.",
  },
};
