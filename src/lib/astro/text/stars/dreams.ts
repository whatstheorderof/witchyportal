/**
 * Dream dictionary (/dream-dictionary): what common dream symbols can mean.
 * Original Witchy Portal copy in Yulia's voice (see VOICE.md). Readings for
 * reflection, not predictions. Gender-neutral throughout.
 */

export type DreamCategory = "Body" | "Animals" | "People" | "Places & things" | "Nature" | "Situations";

export interface Dream {
  title: string;
  category: DreamCategory;
  keywords: string[];
  summary: string;
  meaning: string;
  shadow: string;
  ask: string;
  ritual: string;
}

export const DREAM_INTRO = `Dreams are the soul's private language. Every night your mind sorts through the day, and your intuition slips messages in between the pictures. I have interpreted dreams for years, and the first thing I always say is this: the dreamer holds the key. A snake means something different to someone who loves animals than to someone who is terrified of them.

Use this dictionary as a starting point, not a verdict. Read the meaning, then ask yourself how the dream felt. The emotion is often more important than the symbol. Write your dreams down as soon as you wake, before they fade, and look for the symbols that keep returning. Those are the messages that matter most.`;

export const DREAM_NOTE = `Dream meanings are offered for reflection, not prediction. If your dreams are distressing, keep coming back after something painful has happened, or are stopping you from sleeping, please talk to your doctor or a counsellor as well.`;

export const DREAMS: Record<string, Dream> = {
  "teeth-falling-out": {
    title: "Teeth falling out",
    category: "Body",
    keywords: ["Change", "Confidence", "Words"],
    summary: "One of the most common dreams of all, usually about confidence, change and the things we say or leave unsaid.",
    meaning: `Teeth help us bite, speak and smile, so when they crumble or fall out in a dream, the message is often about how you present yourself to the world. Many people dream this during big transitions: a new job, a break-up, a move, or any season when you feel you are losing your grip on something familiar.

Teeth also hold our words. This dream can appear when there is something you are not saying, or something you said that you wish you could take back.`,
    shadow: `If the dream felt frightening, it may be pointing at a fear of being judged or of getting older. It is a nudge to look after yourself kindly, not a sign that something bad will happen.`,
    ask: "Where in my life do I feel I'm losing control, or holding back words?",
    ritual: `On waking, drink a glass of water slowly and say one honest sentence out loud that you have been keeping inside. Then write it down.`,
  },
  "snakes": {
    title: "Dreams about snakes",
    category: "Animals",
    keywords: ["Transformation", "Healing", "Hidden fears"],
    summary: "Snakes shed their skin, so they usually speak of transformation, healing and energy waking up.",
    meaning: `In witchcraft and in many old traditions the snake is a powerful symbol of renewal. When one appears in your dreams, something in you is ready to shed an old skin: a habit, a belief or a version of yourself you have outgrown. Snakes are also linked with healing, sensuality and kundalini, the life force that rises through the body.

A calm snake, or one that you hold without fear, is a beautiful sign that you are making peace with change.`,
    shadow: `A snake that bites or chases you can point to a fear you have not faced, or to someone in your life you do not fully trust. Notice where you felt the danger and who it reminded you of.`,
    ask: "What am I ready to shed, and what am I afraid will happen if I do?",
    ritual: `Write the old habit or belief on a slip of paper, burn it safely, and scatter the ashes outside. Say: "I release the old skin."`,
  },
  "falling": {
    title: "Dreams about falling",
    category: "Situations",
    keywords: ["Letting go", "Insecurity", "Trust"],
    summary: "Falling dreams often come when life feels out of balance, or when you are being asked to let go and trust.",
    meaning: `That sudden drop, often with a jolt as you wake, usually reflects a feeling of insecurity: something you relied on feels less solid than before. It can be a relationship, your finances or simply your sense of who you are.

Yet falling is not only frightening. It is also surrender. Some falling dreams arrive just before a leap of faith, inviting you to stop clinging and trust that something will catch you.`,
    shadow: `If you fall endlessly or land hard, look at where you feel unsupported. It may be time to ask for help instead of holding everything up on your own.`,
    ask: "What am I holding on to so tightly that I'm afraid to let it go?",
    ritual: `Stand barefoot on the ground for a few minutes, feel your weight sink into the earth, and repeat: "I am held."`,
  },
  "being-chased": {
    title: "Being chased",
    category: "Situations",
    keywords: ["Avoidance", "Fear", "Facing things"],
    summary: "Being chased in a dream usually means there is something in waking life you are running away from.",
    meaning: `The chaser is rarely a stranger. Very often it represents a feeling, a responsibility or a part of yourself that you have been avoiding: an unpaid bill, a difficult conversation, grief or anger you have not let yourself feel.

Notice who or what is chasing you, how close it gets, and where you are trying to go. These details say a lot about what you are avoiding and what you long for instead.`,
    shadow: `Recurring chase dreams tend to stop once you turn around. If you can, imagine facing the chaser before you sleep and asking it what it wants. The answer may surprise you.`,
    ask: "What conversation, task or feeling have I been putting off?",
    ritual: `Before bed, light a candle and write: "Tonight I turn around." Choose one small step to face the thing you have been avoiding tomorrow.`,
  },
  "flying": {
    title: "Dreams about flying",
    category: "Situations",
    keywords: ["Freedom", "Perspective", "Power"],
    summary: "Flying dreams are usually joyful and point to freedom, confidence and a new way of seeing your life.",
    meaning: `When you fly in a dream, you rise above the problems that weigh you down on the ground. It often happens when you are gaining confidence, breaking free from something or seeing a situation from a wider perspective.

Some people learn to fly on purpose in their dreams. If you notice you are dreaming and choose to lift off, you are touching lucid dreaming, a wonderful practice for intuition and creativity.`,
    shadow: `If you struggle to stay in the air, fly too low or are afraid of falling, something may be holding you back from your full potential, often self-doubt or other people's expectations.`,
    ask: "Where in my life am I ready to rise higher?",
    ritual: `Write down three things you would do if you knew you could not fail. Keep the list under your pillow for seven nights.`,
  },
  "water-and-the-sea": {
    title: "Water and the sea",
    category: "Nature",
    keywords: ["Emotions", "Intuition", "Cleansing"],
    summary: "Water is the language of feeling. Its state in your dream shows the state of your emotions.",
    meaning: `Calm, clear water usually reflects emotional peace and a strong intuition. Swimming easily can mean you are moving through your feelings with grace. Rain, rivers and the sea often appear when something needs to be washed away so you can begin again.

As a witch who loves the sea, I see ocean dreams as a call to rest, cleanse and listen to your inner tides.`,
    shadow: `Rough waves, floods or murky water can show overwhelming feelings or a situation where you feel out of your depth. Drowning dreams often come when you are carrying more than you can manage.`,
    ask: "What emotion is asking to be felt, and what needs washing away?",
    ritual: `Take a bath or shower with a handful of salt. As the water drains, imagine it carrying away what you no longer need.`,
  },
  "being-pregnant": {
    title: "Being pregnant",
    category: "Body",
    keywords: ["Creation", "Growth", "New beginnings"],
    summary: "Dreaming of pregnancy, whoever you are, is usually about something new growing inside your life.",
    meaning: `Pregnancy dreams are rarely literal. They tend to appear when an idea, project, relationship or part of yourself is quietly developing and getting ready to be born. Anyone can have this dream, and it is often a sign of creative energy and potential.

Pay attention to how far along you were. Early pregnancy can mean a new beginning; late pregnancy can mean that something is nearly ready to share with the world.`,
    shadow: `If the dream brought anxiety, it may reflect worry about a new responsibility, or fear of whether you are ready for what is coming. Be gentle with yourself: growth takes time.`,
    ask: "What am I growing, and how can I nurture it?",
    ritual: `Plant a seed in a small pot, name it after your project or intention, and water it each morning.`,
  },
  "death": {
    title: "Dreams about death",
    category: "Situations",
    keywords: ["Endings", "Transformation", "Rebirth"],
    summary: "Dreaming of death almost never predicts a death. It speaks of endings that make room for something new.",
    meaning: `Just like the Death card in tarot, death in a dream is about transformation. A chapter of your life is closing: a job, a relationship, a belief or an old identity. Dreaming of your own death can even be a positive sign that you are becoming someone new.

When someone else dies in your dream, think about what that person represents to you. The dream may be about a quality or a part of your relationship that is changing.`,
    shadow: `These dreams can feel very upsetting. If you are frightened, remember that the dream mind uses dramatic pictures for ordinary changes. Notice what in your life is ending, and let yourself grieve it.`,
    ask: "What chapter of my life is ending, and what might begin in its place?",
    ritual: `Light a black or white candle and thank the old chapter for what it taught you. Let it burn for a while, then blow it out with a breath of release.`,
  },
  "a-loved-one-who-has-passed": {
    title: "A loved one who has passed",
    category: "People",
    keywords: ["Grief", "Comfort", "Messages"],
    summary: "Dreams of someone who has died are among the most precious dreams there are, and they are often deeply comforting.",
    meaning: `Many people tell me they dream of a parent, grandparent, friend or pet who has passed, often looking healthy and at peace. These visitation dreams can feel incredibly real, and many people wake with a sense of comfort or a message they needed to hear.

Whether you see it as a visit from the other side or as your heart processing grief, the dream is a gift. Write down every word that was said.`,
    shadow: `If the dream reopened your grief, that is natural too. Grief does not follow a straight line. Be kind to yourself, and talk to someone you trust if the sadness feels heavy.`,
    ask: "What did they want me to know, and what would I like to tell them?",
    ritual: `Set a place for them at your altar or table with a candle, a photo and something they loved. Talk to them, or write them a letter.`,
  },
  "an-ex": {
    title: "Dreams about an ex",
    category: "People",
    keywords: ["Unfinished business", "Patterns", "Healing"],
    summary: "Dreaming of an ex rarely means you want them back. It usually points to feelings or patterns that still need healing.",
    meaning: `An ex often appears when something in your current life echoes the old relationship: a similar feeling, a familiar argument or a fear of being hurt again. The dream is asking you to notice the pattern so you do not repeat it.

Sometimes the ex represents a part of yourself you lost or found during that time. Ask what you were like then, and whether you miss that version of you.`,
    shadow: `If the dream stirred up longing or pain, there may still be something unspoken. You do not need to contact them. Writing a letter you never send can bring the closure the dream is asking for.`,
    ask: "What part of that relationship is still asking for my attention?",
    ritual: `Write a letter to your ex that you will never send. Say everything. Then tear it up and bury the pieces under a plant.`,
  },
  "a-house": {
    title: "Dreams about a house",
    category: "Places & things",
    keywords: ["The self", "Inner life", "Hidden potential"],
    summary: "A house in a dream usually represents you: your mind, your body and the different parts of your life.",
    meaning: `Each room can stand for a different part of yourself. The attic often holds memories and spiritual life, the basement your hidden fears and instincts, the kitchen nourishment, and the bedroom intimacy and rest.

Finding a new room you never knew existed is one of my favourite dreams. It suggests a talent, a desire or an opportunity is waiting to be discovered.`,
    shadow: `A crumbling, flooded or messy house can reflect stress, exhaustion or a part of your life that needs care. An intruder can point to boundaries that feel threatened.`,
    ask: "Which room in my inner house needs my attention right now?",
    ritual: `Clean one small corner of your real home with intention, then light incense or a candle there and say: "This space is mine and it is peaceful."`,
  },
  "spiders": {
    title: "Dreams about spiders",
    category: "Animals",
    keywords: ["Creativity", "Patience", "Feeling trapped"],
    summary: "Spiders are weavers, so they often speak about creativity, patience and the webs we build in our lives.",
    meaning: `In many traditions the spider is a symbol of creative power and fate, weaving its web with patience and skill. A spider in your dream can be inviting you to create, to plan carefully, or to notice the connections you are weaving between people and projects.

Watching a spider spin calmly is often a sign that your efforts will pay off if you keep going.`,
    shadow: `Being trapped in a web or afraid of spiders can point to feeling caught in a situation, a relationship or your own overthinking. Ask whose web you are in, and whether it is time to step out.`,
    ask: "What am I weaving, and where do I feel caught?",
    ritual: `Take a ball of thread and wind it slowly while you speak your plans out loud. Keep it on your altar as a symbol of the life you are weaving.`,
  },
  "dogs": {
    title: "Dreams about dogs",
    category: "Animals",
    keywords: ["Loyalty", "Friendship", "Protection"],
    summary: "Dogs usually represent loyalty, friendship and protection, both the people you trust and your own faithful heart.",
    meaning: `A friendly dog in your dream is often a sign of support. It can stand for a loyal friend, a protective energy around you, or your own instinct to care for others. Playing with a dog can mean you are ready for more joy and companionship.

If you have a dog, your dream may simply reflect your love for them, or offer a message about your bond.`,
    shadow: `An aggressive or barking dog can point to a betrayal, a conflict with a friend, or a part of you that feels defensive. A lost dog may show a worry about losing someone close.`,
    ask: "Who has been loyal to me lately, and who am I protecting?",
    ritual: `Send a message of thanks to a friend who has stood by you. Loyalty grows when it is noticed.`,
  },
  "cats": {
    title: "Dreams about cats",
    category: "Animals",
    keywords: ["Intuition", "Independence", "Mystery"],
    summary: "Cats are the witch's companion: they speak of intuition, independence and quiet magic.",
    meaning: `Cats move between worlds, comfortable in the dark and trusting their instincts. When a cat appears in your dream, your own intuition is often asking for more space. It can also be a sign to value your independence and set boundaries without apology.

A black cat, so often misunderstood, is a symbol of protection and magic in my practice.`,
    shadow: `A hissing or scratching cat can point to someone who is not being honest with you, or to your own hidden irritation. A cat that runs away may show you are ignoring your intuition.`,
    ask: "What is my intuition trying to tell me that I keep brushing aside?",
    ritual: `Sit quietly for five minutes at dusk and ask your intuition one question. Write down the first answer that comes, without judging it.`,
  },
  "a-baby": {
    title: "Dreams about a baby",
    category: "People",
    keywords: ["New beginnings", "Vulnerability", "Potential"],
    summary: "A baby in a dream usually represents something new and precious in your life that needs gentle care.",
    meaning: `Babies are pure potential. Dreaming of one often appears when a new chapter, project or way of being is just beginning. It can also represent your inner child, the playful and tender part of you that needs attention.

Holding a happy baby is a lovely sign that something new is going well. Hearing a baby cry can be a call to look after a need you have been neglecting.`,
    shadow: `Forgetting or losing a baby in a dream is surprisingly common. It usually reflects fear of dropping a responsibility or forgetting your own needs while you look after everyone else.`,
    ask: "What new thing in my life needs gentle care right now?",
    ritual: `Do one thing today that your younger self would have loved: draw, dance, eat something sweet or play outside.`,
  },
  "a-wedding": {
    title: "Dreams about a wedding",
    category: "Situations",
    keywords: ["Commitment", "Union", "New chapter"],
    summary: "Weddings in dreams are often about commitment and union, not only romance but bringing parts of your life together.",
    meaning: `A wedding can represent a commitment you are making: to a person, a path, a project or yourself. It may also show two parts of your personality coming together, such as your heart and your ambition.

A joyful wedding often signals harmony and a positive new chapter.`,
    shadow: `If something went wrong at the wedding, or you did not want to be there, look at a commitment in waking life that does not feel right. Ask whether you are saying yes out of love or out of pressure.`,
    ask: "What am I committing to, and does it truly feel right?",
    ritual: `Write a short vow to yourself, something you promise to honour this year. Read it aloud by candlelight.`,
  },
  "being-naked-in-public": {
    title: "Being naked in public",
    category: "Situations",
    keywords: ["Vulnerability", "Authenticity", "Exposure"],
    summary: "This classic dream is about feeling exposed, and sometimes about the freedom of being completely yourself.",
    meaning: `Finding yourself without clothes in a public place usually reflects a fear of being seen: of people noticing your flaws, your mistakes or your true feelings. It often appears before a presentation, a new job, a first date or any moment where you feel on show.

Interestingly, if nobody in the dream noticed or cared, the message is reassuring. Others are far less focused on your imperfections than you are.`,
    shadow: `If you felt deep shame, ask where you are hiding parts of yourself. The dream may be inviting you to be more honest about who you are.`,
    ask: "Where am I afraid of being seen as I really am?",
    ritual: `Stand in front of a mirror and name three things you love about yourself, out loud. Do it until you can say them without laughing.`,
  },
  "being-late": {
    title: "Being late or missing a train",
    category: "Situations",
    keywords: ["Missed chances", "Pressure", "Timing"],
    summary: "Running late or missing transport in a dream often reflects pressure, overwhelm or a fear of missing your chance.",
    meaning: `These dreams usually arrive when life is busy and you are juggling too much. The missed train, plane or appointment mirrors a worry that you are falling behind, or that an opportunity is slipping away.

They can also be a reminder that your timing does not have to match anyone else's. The right train will come.`,
    shadow: `If you keep missing your connection in every dream, ask whether you are sabotaging yourself, or whether you actually want to go where you think you should be going.`,
    ask: "Where do I feel I'm falling behind, and by whose clock?",
    ritual: `Clear one thing from your to-do list today without doing it: delegate it, postpone it or let it go. Notice how much lighter you feel.`,
  },
  "an-exam": {
    title: "Taking an exam",
    category: "Situations",
    keywords: ["Self-judgement", "Preparation", "Testing"],
    summary: "Exam dreams can follow you for years after school. They usually reflect a feeling of being tested or judged.",
    meaning: `Many people dream of sitting an exam they have not studied for, long after they have left school. The dream is usually about a situation in waking life where you feel tested: a new role, a relationship, or a challenge where you fear you are not good enough.

Passing the exam in your dream is a lovely sign of growing confidence.`,
    shadow: `If you cannot find the exam room or your pen will not write, look at where you feel unprepared or are judging yourself too harshly. Usually you know more than you think.`,
    ask: "Who am I trying to prove myself to, and do I need to?",
    ritual: `Write down three things you have learned this year that no exam could measure. Keep the list somewhere you will see it.`,
  },
  "fire": {
    title: "Dreams about fire",
    category: "Nature",
    keywords: ["Passion", "Transformation", "Anger"],
    summary: "Fire is passion and transformation. It can warm, cleanse or destroy, so notice how the flames behaved.",
    meaning: `A steady fire, like a hearth or a candle, often represents passion, creativity and inner warmth. A fire that burns away something old can be a powerful sign of cleansing and change, clearing the ground for new growth.

Fire is the element of will, so this dream may also be telling you to act on a desire you have been holding back.`,
    shadow: `A fire out of control can reflect anger, burnout or a situation that is getting too intense. Ask where you need to cool down, rest or set a firmer boundary.`,
    ask: "What am I burning for, and what is burning me out?",
    ritual: `Light a red or orange candle and say what you are passionate about. When you feel ready, write one thing that drains you on paper and burn it safely in the flame.`,
  },
  "driving-a-car": {
    title: "Driving a car",
    category: "Places & things",
    keywords: ["Direction", "Control", "Life path"],
    summary: "A car in a dream often represents how you are moving through life and who is in control of the direction.",
    meaning: `If you are driving smoothly, you probably feel in charge of your path. Being a passenger can mean you are letting someone else make the decisions, which may or may not be what you want.

Notice the road too. An open road speaks of freedom and possibility, while a winding one can show a journey that needs patience.`,
    shadow: `Brakes that do not work, losing control or crashing can reflect a situation moving too fast. It is often a sign to slow down before you make a big decision.`,
    ask: "Who is really steering my life right now?",
    ritual: `Write the destination you want to reach this year at the top of a page, and three small turns that will take you there.`,
  },
  "money": {
    title: "Dreams about money",
    category: "Places & things",
    keywords: ["Self-worth", "Abundance", "Energy"],
    summary: "Money in dreams is about value: what you feel you are worth and how energy flows in and out of your life.",
    meaning: `Finding money is often a sign of opportunity, self-worth and abundance coming your way. It can reflect a talent you are starting to value, or energy returning after a difficult time.

As I explain in my financial readings, money is energy. A dream about receiving it can be a sign to open yourself to receive in every sense.`,
    shadow: `Losing money or being robbed can point to feeling drained, undervalued or worried about security. Ask where your energy is leaking, and whether you are giving more than you receive.`,
    ask: "Do I believe I deserve to receive?",
    ritual: `Place a coin in a small bowl with a bay leaf and a cinnamon stick. Each day this week, add one thing you are grateful for to a list beside it.`,
  },
  "hair": {
    title: "Dreams about hair",
    category: "Body",
    keywords: ["Identity", "Strength", "Change"],
    summary: "Hair is tied to identity and personal power. Cutting, losing or changing it often reflects a shift in how you see yourself.",
    meaning: `Many cultures see hair as a store of strength and energy. Cutting your hair in a dream can mean you are ready for a fresh start or to let go of the past. Long, shining hair can reflect confidence and vitality.

A new colour or style usually points to a change in identity, or a wish to be seen differently.`,
    shadow: `Losing hair can reflect anxiety about ageing, attractiveness or losing your power. Remember that your strength lives far deeper than your appearance.`,
    ask: "How do I want to be seen, and does it match who I feel I am?",
    ritual: `Brush your hair slowly for one hundred strokes before bed, and with each stroke name something that makes you strong.`,
  },
  "birds": {
    title: "Dreams about birds",
    category: "Animals",
    keywords: ["Messages", "Freedom", "Hope"],
    summary: "Birds are messengers between heaven and earth, and often bring news, hope or a call to freedom.",
    meaning: `A bird flying freely can reflect your own wish for freedom, or a sign that you are rising above a problem. Birds singing are often a beautiful omen of good news. The type of bird matters too: an owl brings wisdom, a crow brings magic and change, and a dove brings peace.

Many people dream of a bird soon after losing someone they love, and feel it as a message.`,
    shadow: `A trapped or injured bird can point to feeling restricted or unheard. Ask where in your life you feel caged, and what would help you sing again.`,
    ask: "What message am I waiting for, and what would set me free?",
    ritual: `Put out seeds or crumbs for the birds and make a wish as you scatter them. Notice which birds come.`,
  },
  "horses": {
    title: "Dreams about horses",
    category: "Animals",
    keywords: ["Power", "Drive", "Freedom"],
    summary: "Horses carry raw power and drive. A horse in your dream often shows how you relate to your own strength and passion.",
    meaning: `Riding a horse with ease can mean you are in harmony with your energy and moving confidently towards your goals. Wild horses running free often speak of a longing for freedom, adventure or a less restricted life.

A white horse is a lovely symbol of purity and spiritual progress, while a black horse can represent mystery and untamed power.`,
    shadow: `A horse that throws you off or runs out of control can show that your passions or ambitions are pulling you too fast. It may be time to take the reins again.`,
    ask: "Am I riding my energy, or is it riding me?",
    ritual: `Go for a brisk walk or run, or dance freely to one song with your eyes closed. Let your body feel its own power.`,
  },
  "the-moon": {
    title: "Dreams about the Moon",
    category: "Nature",
    keywords: ["Intuition", "Cycles", "Emotions"],
    summary: "The Moon in a dream speaks of intuition, cycles and the mysteries of the night, and it is a special dream for witches.",
    meaning: `The Moon rules dreams, emotions and intuition, so seeing it clearly in a dream is often a sign that your psychic senses are open. Notice the phase. A New Moon can mean a beginning, a Full Moon a culmination or revelation, and a crescent a time of growth or release.

A huge, bright Moon is one of the most magical dreams there is. It often comes when you are stepping into your power.`,
    shadow: `A Moon hidden by clouds or turning red can reflect confusion, or feelings you are not ready to look at. Be patient, and the light will return.`,
    ask: "Which phase of my own cycle am I in right now?",
    ritual: `Check the Moon calendar and, on the next New or Full Moon, make moon water and write in your journal by its light.`,
  },
  "mirrors": {
    title: "Dreams about mirrors",
    category: "Places & things",
    keywords: ["Self-image", "Truth", "Reflection"],
    summary: "Mirrors show us ourselves. In dreams they reveal how you see yourself, and sometimes a truth you have avoided.",
    meaning: `Looking into a mirror and liking what you see is a lovely sign of self-acceptance. Seeing a different face can show that you are changing, or that you are seeing a part of yourself you did not know.

In folk magic mirrors are gateways, so a mirror dream can also be a sign of strong intuition and spiritual insight.`,
    shadow: `A broken, cloudy or frightening mirror can reflect harsh self-judgement or a distorted self-image. Remember that you are often far kinder to others than you are to yourself.`,
    ask: "What would I see if I looked at myself with love?",
    ritual: `Write a kind message to yourself on a mirror with a bar of soap or a dry-wipe pen. Leave it there for a week.`,
  },
  "a-partner-cheating": {
    title: "A partner cheating",
    category: "People",
    keywords: ["Insecurity", "Trust", "Neglected needs"],
    summary: "Dreaming that a partner is unfaithful is upsetting, but it is usually about your own fears and needs, not a prediction.",
    meaning: `These dreams often come when you feel insecure, unseen or worried about losing someone. They can also appear when the relationship is changing, or when you feel your partner's time and energy are going elsewhere, to work, family or a hobby.

Sometimes the dream is not about the relationship at all, but about a part of yourself you feel you have betrayed or neglected.`,
    shadow: `If you wake up angry or hurt, try not to treat the dream as evidence. Use it as an invitation to talk honestly about what you need to feel close and secure.`,
    ask: "What do I need to feel safe and valued in love?",
    ritual: `Write down three needs you have in your relationship. Choose a calm moment to share one of them, kindly and clearly.`,
  },
  "a-stranger": {
    title: "Dreams about a stranger",
    category: "People",
    keywords: ["Hidden self", "New people", "Unknown potential"],
    summary: "A stranger in your dream is often a hidden part of yourself, or a sign that new people and energies are coming.",
    meaning: `When you meet someone you do not recognise, notice how they behave and how they make you feel. A kind, wise or attractive stranger may represent qualities you are developing in yourself: confidence, creativity or tenderness.

A stranger can also be a sign that a new person is about to enter your life and change something for the better.`,
    shadow: `A threatening stranger can point to a part of yourself you fear or reject, or to uncertainty about a new situation. Ask what they wanted, and what they might be trying to show you.`,
    ask: "What quality did this stranger have that I might be growing into?",
    ritual: `Write a short description of the stranger, then underline every quality you would like more of in your own life.`,
  },
  "being-lost": {
    title: "Being lost",
    category: "Situations",
    keywords: ["Uncertainty", "Searching", "Direction"],
    summary: "Being lost in a dream usually reflects uncertainty about your direction, and an invitation to trust your inner compass.",
    meaning: `Wandering through unfamiliar streets, buildings or forests often happens when you are at a crossroads in life, unsure which path to take or who you are becoming. The dream reflects the searching, not a failure.

Pay attention to anyone who helps you or any landmarks you notice. They can be clues about where your heart wants to go.`,
    shadow: `If you feel panic, you may be pushing yourself to have all the answers too soon. It is all right not to know yet.`,
    ask: "If I trusted my intuition, which way would I turn?",
    ritual: `Hold a pendulum, a crystal or a simple ring on a thread and ask a yes-or-no question about your next step. Notice how you feel about the answer.`,
  },
};

/** Display order of categories on the dictionary page. */
export const DREAM_CATEGORIES: DreamCategory[] = ["Situations", "Body", "Animals", "People", "Nature", "Places & things"];
