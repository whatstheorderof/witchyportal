import { msg } from "@/i18n/config";
import type { Sign } from "@/lib/astro/types";

/**
 * Magic correspondences (/correspondences): crystals, herbs and candle colours,
 * what they are traditionally used for and how Yulia works with them.
 * Original Witchy Portal copy in Yulia's voice. Traditional associations, not
 * health advice; herb and crystal safety notes are kept plain and practical.
 */

export type CorrKind = "crystal" | "herb" | "candle";
export type Intention = "love" | "protection" | "abundance" | "calm" | "clarity" | "courage" | "cleansing" | "intuition";

export const INTENTIONS: { key: Intention; label: string }[] = [
  { key: "love", label: msg("Love") },
  { key: "protection", label: msg("Protection") },
  { key: "abundance", label: msg("Abundance") },
  { key: "calm", label: msg("Calm") },
  { key: "clarity", label: msg("Clarity") },
  { key: "courage", label: msg("Courage") },
  { key: "cleansing", label: msg("Cleansing") },
  { key: "intuition", label: msg("Intuition") },
];

export const KIND_LABEL: Record<CorrKind, { one: string; many: string }> = {
  crystal: { one: msg("Crystal"), many: msg("Crystals") },
  herb: { one: msg("Herb"), many: msg("Herbs") },
  candle: { one: msg("Candle colour"), many: msg("Candle colours") },
};

export interface Correspondence {
  kind: CorrKind;
  /** Display name — an interface string (translated with t()). */
  name: string;
  intentions: Intention[];
  /** Signs it is often paired with (traditions vary). Empty = every sign. */
  signs: Sign[];
  keywords: string[];
  summary: string;
  uses: string;
  how: string;
  care?: string;
}

export const CORR_INTRO = `Correspondences are the witch's shorthand: the crystals, herbs and colours that have been linked with certain energies for generations. When you choose a green candle for money or rosemary for protection, you are speaking a language that many hands have spoken before you, and that adds weight to your intention.

Nothing here is a rule. If a colour or a stone speaks to you for a different reason, trust that. The most powerful ingredient in any spell is your own focus. Start with what you already have in your kitchen or your jewellery box, and let your collection grow slowly.`;

export const CORR_NOTE = `Correspondences are traditional associations for ritual and reflection. They are not medical advice and never replace care from a doctor. Some herbs and oils are unsafe for pets, during pregnancy or for people with allergies, so check before you burn, steep or apply anything.`;

export const CORRESPONDENCES: Record<string, Correspondence> = {
  /* ---------------- Crystals ---------------- */
  amethyst: {
    kind: "crystal", name: msg("Amethyst"), intentions: ["calm", "intuition", "protection"], signs: ["Pisces", "Aquarius"],
    keywords: ["Calm", "Intuition", "Dreams"],
    summary: "The calming purple stone of intuition, peaceful sleep and spiritual protection.",
    uses: `Amethyst is the stone I reach for when the mind will not switch off. It is traditionally used to soothe anxious thoughts, deepen meditation and open the third eye. Many witches keep it by the bed for calmer sleep and clearer dreams.`,
    how: `Hold a piece while you meditate, or place one under your pillow and ask for a peaceful night. A cluster on your desk can help keep a busy space calm.`,
    care: `Strong sunlight can fade its colour, so cleanse it by moonlight rather than sunlight.`,
  },
  "rose-quartz": {
    kind: "crystal", name: msg("Rose quartz"), intentions: ["love", "calm"], signs: ["Taurus", "Libra"],
    keywords: ["Love", "Self-love", "Healing"],
    summary: "The gentle pink stone of love in every form, starting with love for yourself.",
    uses: `Rose quartz is used to open the heart: to attract love, to soften after heartbreak and, above all, to grow kinder towards yourself. It is a beautiful stone for friendships and family harmony too.`,
    how: `Carry a small piece in your pocket, or place one in the corner of your bedroom furthest from the door. On a Friday, the day of Venus, hold it and say one kind thing about yourself.`,
  },
  "clear-quartz": {
    kind: "crystal", name: msg("Clear quartz"), intentions: ["clarity", "cleansing"], signs: [],
    keywords: ["Amplifying", "Clarity", "Focus"],
    summary: "The master healer and amplifier, which strengthens any intention you give it.",
    uses: `Clear quartz is known as an amplifier. It is used to boost the energy of other crystals, sharpen focus and bring clarity to a muddled situation. If you can only have one crystal, many witches choose this one.`,
    how: `Hold it, speak your intention clearly, then keep it on your altar or desk. Place it beside another crystal to strengthen that crystal's work.`,
  },
  "black-tourmaline": {
    kind: "crystal", name: msg("Black tourmaline"), intentions: ["protection", "cleansing"], signs: ["Capricorn"],
    keywords: ["Protection", "Grounding", "Boundaries"],
    summary: "The great protector, used to ground your energy and keep out what doesn't belong.",
    uses: `Black tourmaline is one of the most popular protection stones. It is traditionally used to absorb negative energy, ground scattered nerves and strengthen boundaries with draining people or places.`,
    how: `Place a piece by your front door, or carry one when you know a day will be difficult. After a heavy day, hold it and imagine everything that is not yours draining into the stone.`,
  },
  citrine: {
    kind: "crystal", name: msg("Citrine"), intentions: ["abundance", "courage"], signs: ["Gemini", "Leo"],
    keywords: ["Abundance", "Joy", "Confidence"],
    summary: "The sunny stone of abundance, joy and confidence, often called the merchant's stone.",
    uses: `Citrine carries the energy of the Sun. It is used to attract prosperity, lift low moods and give you the confidence to go after what you want. Many people keep it near their purse or wherever they work.`,
    how: `Put a piece in the money corner of your home, traditionally the far left corner from the front door, or in your purse. Hold it before a meeting and picture things going your way.`,
    care: `Like amethyst, it can fade in strong sunlight over time.`,
  },
  moonstone: {
    kind: "crystal", name: msg("Moonstone"), intentions: ["intuition", "calm"], signs: ["Cancer"],
    keywords: ["Intuition", "New beginnings", "Cycles"],
    summary: "The stone of the Moon: intuition, emotional balance and new beginnings.",
    uses: `Moonstone is linked with the Moon's cycles. It is used to strengthen intuition, ease emotional ups and downs and support new beginnings. Its soft shimmer makes it a favourite for Moon rituals and dream work.`,
    how: `Charge it on your windowsill on the Full Moon, then wear or carry it through the following month. Keep it beside your dream journal.`,
  },
  obsidian: {
    kind: "crystal", name: msg("Obsidian"), intentions: ["protection", "clarity"], signs: ["Scorpio"],
    keywords: ["Truth", "Shadow work", "Protection"],
    summary: "Volcanic glass for protection, honesty and facing your shadow.",
    uses: `Obsidian is formed when lava cools quickly, and it carries that intensity. It is used for shadow work, cutting through illusions and shielding against negativity. It shows you the truth, so it is best used when you are ready to look.`,
    how: `Hold it during journaling about something you have been avoiding. Many witches use an obsidian mirror for scrying, gazing softly into its surface to receive images and impressions.`,
    care: `Its edges can be sharp, so choose a tumbled or polished piece to carry.`,
  },
  "tigers-eye": {
    kind: "crystal", name: msg("Tiger's eye"), intentions: ["courage", "protection", "abundance"], signs: ["Leo", "Capricorn"],
    keywords: ["Courage", "Focus", "Willpower"],
    summary: "The golden-brown stone of courage, focus and steady willpower.",
    uses: `Tiger's eye is used for confidence and grounded courage. It helps you stay focused on your goals, act decisively and protect yourself from other people's doubts. It is a lovely stone for exams, interviews and new ventures.`,
    how: `Carry it in your pocket or wear it as a bracelet when you need to feel brave. Hold it at dawn and say what you will stand up for today.`,
  },
  carnelian: {
    kind: "crystal", name: msg("Carnelian"), intentions: ["courage", "abundance"], signs: ["Aries", "Leo", "Virgo"],
    keywords: ["Motivation", "Creativity", "Vitality"],
    summary: "The fiery orange stone of motivation, creativity and joyful energy.",
    uses: `Carnelian is used to spark motivation, creativity and passion. When you feel stuck or flat, it is said to bring warmth and get energy moving again. Performers and artists often keep one close.`,
    how: `Keep it on your desk when you need to start a project, or hold it before you go on stage. Pair it with an orange candle for a creativity ritual.`,
  },
  selenite: {
    kind: "crystal", name: msg("Selenite"), intentions: ["cleansing", "calm", "clarity"], signs: ["Cancer", "Taurus"],
    keywords: ["Cleansing", "Peace", "Light"],
    summary: "The luminous white stone used to cleanse other crystals and bring peace to a room.",
    uses: `Selenite is used for cleansing: of spaces, of your energy and of other crystals. Its soft, pearly light brings a sense of calm and clarity. Many witches use a selenite wand instead of smoke.`,
    how: `Sweep a selenite wand around your body, a few centimetres from the skin, to clear your energy. Rest other crystals on a selenite plate overnight to cleanse them.`,
    care: `Selenite is soft and dissolves in water, so never wash it or leave it in the rain.`,
  },
  labradorite: {
    kind: "crystal", name: msg("Labradorite"), intentions: ["intuition", "protection"], signs: ["Scorpio", "Sagittarius"],
    keywords: ["Magic", "Transformation", "Intuition"],
    summary: "The stone of magic, with flashes of blue and gold that awaken intuition and transformation.",
    uses: `Labradorite is known as the stone of magic. Its hidden flashes of colour are a reminder that there is more to you than meets the eye. It is used to strengthen intuition, support change and shield your aura.`,
    how: `Wear it during readings or spellwork, or hold it when you are facing a big transition. Turn it in the light and notice which colour appears first.`,
  },
  "green-aventurine": {
    kind: "crystal", name: msg("Green aventurine"), intentions: ["abundance", "love"], signs: ["Taurus", "Virgo"],
    keywords: ["Luck", "Growth", "Opportunity"],
    summary: "The stone of luck and opportunity, often called the gambler's stone.",
    uses: `Green aventurine is used to attract luck, new opportunities and steady growth. Its gentle green links it with the heart and with nature, so it is lovely for new relationships and new projects alike.`,
    how: `Carry it to interviews or when you sign something important. Bury a small piece in the soil of a plant you are growing for an intention.`,
  },

  /* ---------------- Herbs ---------------- */
  rosemary: {
    kind: "herb", name: msg("Rosemary"), intentions: ["protection", "cleansing", "clarity"], signs: ["Aries", "Leo"],
    keywords: ["Protection", "Memory", "Cleansing"],
    summary: "The witch's all-purpose herb for protection, cleansing and remembering.",
    uses: `If you only grow one magical herb, make it rosemary. It is traditionally used for protection, cleansing and memory, and it can stand in for almost any other herb in a spell. A sprig over the door is an old protective charm.`,
    how: `Hang a bundle by your front door, add a sprig to your bath, or burn a little dried rosemary to cleanse a room. Keep it near your books when you study.`,
  },
  lavender: {
    kind: "herb", name: msg("Lavender"), intentions: ["calm", "love", "cleansing"], signs: ["Gemini", "Virgo"],
    keywords: ["Peace", "Sleep", "Love"],
    summary: "The soothing purple herb of peace, restful sleep and gentle love.",
    uses: `Lavender is used to calm the mind, invite restful sleep and bring peace to a home. It is also a herb of gentle love and happiness, and it smells beautiful in sachets and baths.`,
    how: `Put a small sachet of dried lavender under your pillow, or add a few buds to your bath with a handful of salt. Scatter it across a doorstep before guests arrive.`,
    care: `Lavender essential oil is toxic to cats and harmful to some other pets, so don't diffuse it near them.`,
  },
  sage: {
    kind: "herb", name: msg("Garden sage"), intentions: ["cleansing", "clarity", "protection"], signs: ["Sagittarius"],
    keywords: ["Cleansing", "Wisdom", "Protection"],
    summary: "Ordinary garden sage, a wise herb for cleansing spaces and clearing the mind.",
    uses: `Common garden sage, the one in your kitchen, has long been used for wisdom, cleansing and protection. It is a lovely way to refresh a room after an argument, an illness or a long winter.`,
    how: `Burn a small dried bundle with a window open and walk it slowly through each room, then thank the smoke and let it go. You can also simmer sage leaves in water on the stove.`,
    care: `Some practices, such as burning white sage, are sacred to particular Indigenous cultures, so I use garden sage, rosemary or bay instead. Always keep smoke away from pets and anyone with asthma.`,
  },
  basil: {
    kind: "herb", name: msg("Basil"), intentions: ["abundance", "love", "protection"], signs: ["Aries", "Scorpio"],
    keywords: ["Money", "Love", "Harmony"],
    summary: "A kitchen herb of money, love and a harmonious home.",
    uses: `Basil is used to attract money, bring harmony between people and protect a home. A pot on the windowsill is said to keep the household peaceful and prosperous.`,
    how: `Grow basil in your kitchen and touch its leaves as you set an intention for your money. Add a fresh leaf to your purse, replacing it when it dries.`,
  },
  cinnamon: {
    kind: "herb", name: msg("Cinnamon"), intentions: ["abundance", "love", "courage"], signs: ["Leo", "Aries"],
    keywords: ["Prosperity", "Speed", "Warmth"],
    summary: "The warming spice for prosperity, passion and making magic work faster.",
    uses: `Cinnamon is a spice of fire and the Sun. It is used to attract money and success, warm up love and add speed to any spell. A pinch is often added to money and love workings to help them move.`,
    how: `On the first day of the month, blow a pinch of ground cinnamon through your front door from the outside in, saying: "Abundance, come in." Add a stick to a money jar.`,
    care: `Cinnamon can irritate skin and eyes, so take care when blowing it, and don't do it near pets.`,
  },
  "bay-leaf": {
    kind: "herb", name: msg("Bay leaf"), intentions: ["abundance", "protection", "clarity"], signs: ["Leo"],
    keywords: ["Wishes", "Success", "Protection"],
    summary: "The leaf of wishes and success, easy to find in any kitchen.",
    uses: `Bay is the herb of victory and success. Its best-known use is wish magic: you write a wish on a dried bay leaf and burn it so the smoke carries it out into the world. It is also used for protection and clear dreams.`,
    how: `On the New Moon, write a short wish on a dried bay leaf and burn it safely in a fireproof dish. Keep a bay leaf in your wallet for prosperity.`,
  },
  mint: {
    kind: "herb", name: msg("Mint"), intentions: ["abundance", "cleansing", "clarity"], signs: ["Gemini", "Virgo"],
    keywords: ["Money", "Freshness", "Travel"],
    summary: "A fresh, fast-growing herb for money, clear thinking and safe travel.",
    uses: `Mint grows quickly and spreads easily, which is why it is linked with growing money. It is also used for mental clarity, fresh starts and protection while travelling.`,
    how: `Rub a fresh leaf on your purse or wallet, or keep a pot by your front door. Drink a cup of mint tea before you study or make a decision.`,
  },
  chamomile: {
    kind: "herb", name: msg("Chamomile"), intentions: ["calm", "abundance", "love"], signs: ["Leo", "Cancer"],
    keywords: ["Calm", "Luck", "Gentleness"],
    summary: "The gentle flower of calm, rest and quiet good luck.",
    uses: `Chamomile is used to soothe, rest and bring gentle luck. Some gamblers once washed their hands in chamomile tea for good fortune. It is a lovely herb for children's rooms and for any spell that needs softness.`,
    how: `Brew a cup of chamomile tea and drink it slowly with an intention for peace. Add the cooled tea to a bath, or sprinkle dried flowers around a candle for calm.`,
    care: `Chamomile can cause reactions in people allergic to ragweed, daisies or marigolds.`,
  },
  rose: {
    kind: "herb", name: msg("Rose"), intentions: ["love", "calm"], signs: ["Taurus", "Libra"],
    keywords: ["Love", "Beauty", "Self-love"],
    summary: "The flower of love, beauty and tenderness, sacred to Venus.",
    uses: `Roses are used in love magic of every kind, from attracting a partner to healing a broken heart and deepening self-love. Red roses carry passion; pink roses carry tenderness; white roses carry peace.`,
    how: `Scatter petals in a warm bath on a Friday, or dry petals from a bouquet you were given and keep them in a jar with rose quartz. Add a few petals to a pink candle ritual.`,
  },
  thyme: {
    kind: "herb", name: msg("Thyme"), intentions: ["courage", "cleansing", "protection"], signs: ["Taurus", "Libra"],
    keywords: ["Courage", "Purification", "Healing"],
    summary: "The little herb of courage, purification and fresh energy.",
    uses: `In old Europe, thyme was given to people going into battle for courage. Today it is used to boost bravery, cleanse a space and bring fresh energy after a difficult time.`,
    how: `Keep a sprig of thyme in your pocket when you need courage. Simmer a handful in water to scent and cleanse your home.`,
  },
  mugwort: {
    kind: "herb", name: msg("Mugwort"), intentions: ["intuition", "protection"], signs: ["Cancer", "Pisces"],
    keywords: ["Dreams", "Intuition", "Divination"],
    summary: "The dreaming herb, used for vivid dreams, intuition and divination.",
    uses: `Mugwort is the herb most closely linked with dreams and psychic work. It is traditionally used to bring vivid, memorable dreams, deepen intuition and protect travellers between worlds.`,
    how: `Tuck a small sachet of dried mugwort into your pillowcase, and keep your dream journal close. Some witches wipe their tarot cards or mirrors with a mugwort infusion before a reading.`,
    care: `Do not drink or use mugwort if you are pregnant or breastfeeding, and avoid it if you are allergic to ragweed or daisies.`,
  },

  /* ---------------- Candle colours ---------------- */
  white: {
    kind: "candle", name: msg("White"), intentions: ["cleansing", "calm", "clarity"], signs: [],
    keywords: ["Purity", "Peace", "Any intention"],
    summary: "The all-purpose candle: peace, cleansing and any intention you give it.",
    uses: `White holds every colour of light, so a white candle can stand in for any other colour. It is used for purification, peace, new beginnings and connecting with your guides.`,
    how: `Light a white candle at the start of any ritual to cleanse the space. If you only buy one colour, buy white.`,
  },
  black: {
    kind: "candle", name: msg("Black"), intentions: ["protection", "cleansing"], signs: ["Capricorn", "Scorpio"],
    keywords: ["Protection", "Banishing", "Endings"],
    summary: "Not evil: the colour of protection, banishing and releasing what has ended.",
    uses: `Black candles are often misunderstood. They absorb, so they are used to absorb negativity, banish what you do not want and close a chapter. They are perfect for protection spells and the waning Moon.`,
    how: `Light a black candle on a waning Moon and write down what you want to release. Let it burn while you breathe out each worry.`,
  },
  red: {
    kind: "candle", name: msg("Red"), intentions: ["love", "courage"], signs: ["Aries", "Scorpio"],
    keywords: ["Passion", "Courage", "Strength"],
    summary: "The colour of passion, courage and life force.",
    uses: `Red is fire and blood. It is used for passion, desire, physical energy and courage. A red candle is a good choice when you need to act boldly or rekindle a spark.`,
    how: `Light a red candle on a Tuesday, the day of Mars, before you do something brave. For love, carve your intention into the wax with a pin.`,
  },
  pink: {
    kind: "candle", name: msg("Pink"), intentions: ["love", "calm"], signs: ["Taurus", "Libra"],
    keywords: ["Self-love", "Tenderness", "Friendship"],
    summary: "Gentle love: self-love, friendship and emotional healing.",
    uses: `Pink is the softer side of red. It is used for self-love, friendship, romance that grows slowly and healing after heartbreak.`,
    how: `Light a pink candle on a Friday beside a piece of rose quartz, and write a short love letter to yourself.`,
  },
  orange: {
    kind: "candle", name: msg("Orange"), intentions: ["courage", "abundance"], signs: ["Leo", "Sagittarius"],
    keywords: ["Creativity", "Joy", "Success"],
    summary: "The colour of creativity, joy and opening new doors.",
    uses: `Orange blends the passion of red with the joy of yellow. It is used for creativity, celebration, career success and attracting new opportunities.`,
    how: `Light an orange candle before you start a creative project or apply for something new. Place a carnelian beside it.`,
  },
  yellow: {
    kind: "candle", name: msg("Yellow"), intentions: ["clarity", "courage"], signs: ["Gemini", "Leo"],
    keywords: ["Clarity", "Communication", "Study"],
    summary: "The colour of the mind: clarity, communication and learning.",
    uses: `Yellow is linked with the Sun and the air. It is used for clear thinking, studying, communication and confidence when you speak.`,
    how: `Light a yellow candle on a Wednesday, the day of Mercury, before you study, write or have an important conversation.`,
  },
  green: {
    kind: "candle", name: msg("Green"), intentions: ["abundance", "love"], signs: ["Taurus", "Virgo"],
    keywords: ["Money", "Growth", "Healing"],
    summary: "The colour of money, growth, nature and good luck.",
    uses: `Green is the colour of growing things. It is the classic choice for money spells, but it is also used for luck, fertility of ideas and healing the heart.`,
    how: `Light a green candle on a Thursday, the day of Jupiter, with a coin and a bay leaf beside it, and speak your money intention.`,
  },
  blue: {
    kind: "candle", name: msg("Blue"), intentions: ["calm", "clarity"], signs: ["Aquarius", "Pisces"],
    keywords: ["Peace", "Truth", "Healing"],
    summary: "The colour of peace, truth and calm communication.",
    uses: `Blue is linked with water and the sky. It is used for peace, emotional healing, honesty and calm, clear communication.`,
    how: `Light a blue candle before a difficult conversation and ask for the right words, spoken kindly.`,
  },
  purple: {
    kind: "candle", name: msg("Purple"), intentions: ["intuition", "protection"], signs: ["Pisces", "Sagittarius"],
    keywords: ["Intuition", "Wisdom", "Spirit"],
    summary: "The colour of intuition, spiritual power and wisdom.",
    uses: `Purple is the colour of the third eye. It is used for psychic work, meditation, divination and spiritual protection.`,
    how: `Light a purple candle with an amethyst before you read tarot or meditate, and ask your intuition to speak clearly.`,
  },
  silver: {
    kind: "candle", name: msg("Silver"), intentions: ["intuition", "calm"], signs: ["Cancer"],
    keywords: ["The Moon", "Dreams", "Reflection"],
    summary: "The colour of the Moon: intuition, dreams and reflection.",
    uses: `Silver belongs to the Moon. It is used for Moon rituals, dream work, intuition and receiving messages.`,
    how: `Light a silver candle on the New or Full Moon and write in your journal by its light.`,
  },
};
