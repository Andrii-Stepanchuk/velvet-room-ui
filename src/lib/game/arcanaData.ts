import type { StatKey } from './stats';

export type ArcanaId =
  | 'fool'
  | 'magician'
  | 'priestess'
  | 'empress'
  | 'emperor'
  | 'hierophant'
  | 'lovers'
  | 'chariot'
  | 'justice'
  | 'hermit'
  | 'fortune'
  | 'strength'
  | 'hanged'
  | 'death'
  | 'temperance'
  | 'devil'
  | 'tower'
  | 'star'
  | 'moon'
  | 'sun'
  | 'judgement'
  | 'world';

export interface Arcana {
  id: ArcanaId;
  numeral: string;
  name: string;
  epithet: string;
  description: string;
  stats: readonly [StatKey, StatKey] | null;
  blessing: string;
}

export const ARCANA: readonly Arcana[] = [
  {
    id: 'fool',
    numeral: '0',
    name: 'The Fool',
    epithet: 'The Open Road',
    stats: null,
    description:
      'No single path claims you yet. Your growth is even and your future unwritten: every direction is still possible.',
    blessing: '+10% XP on quests for your lowest stat.',
  },
  {
    id: 'magician',
    numeral: 'I',
    name: 'The Magician',
    epithet: 'Will Made Real',
    stats: ['knowledge', 'proficiency'],
    description: 'You learn so you can build. Knowledge flows straight into your hands, and ideas rarely stay ideas for long.',
    blessing: '+10% XP on Proficiency quests after a Knowledge quest today.',
  },
  {
    id: 'priestess',
    numeral: 'II',
    name: 'The High Priestess',
    epithet: 'Quiet Insight',
    stats: ['knowledge', 'charm'],
    description:
      'You see beneath the surface and speak only when it matters. People lean in, sensing you know more than you say.',
    blessing: '+10% XP on Knowledge quests in the Dark Hour.',
  },
  {
    id: 'empress',
    numeral: 'III',
    name: 'The Empress',
    epithet: 'Abundant Hands',
    stats: ['kindness', 'proficiency'],
    description: 'Your care takes shape as things you make and tend. What you nurture grows: people, projects, places.',
    blessing: '+10% XP on Kindness quests.',
  },
  {
    id: 'emperor',
    numeral: 'IV',
    name: 'The Emperor',
    epithet: 'Steady Command',
    stats: ['guts', 'charm'],
    description: 'You step forward and others follow. Courage gives your presence weight, and your word sets the course.',
    blessing: '+10% XP on Charm quests.',
  },
  {
    id: 'hierophant',
    numeral: 'V',
    name: 'The Hierophant',
    epithet: 'The Patient Teacher',
    stats: ['knowledge', 'kindness'],
    description: 'You gather wisdom to pass it on. Your knowledge is a gift you keep giving away.',
    blessing: '+10% XP on Kindness quests after a Knowledge quest today.',
  },
  {
    id: 'lovers',
    numeral: 'VI',
    name: 'The Lovers',
    epithet: 'Bound Hearts',
    stats: ['kindness', 'charm'],
    description: 'Warmth is your language. You draw people together and make every bond feel chosen.',
    blessing: '+5% XP on Kindness and Charm quests.',
  },
  {
    id: 'chariot',
    numeral: 'VII',
    name: 'The Chariot',
    epithet: 'Unstoppable Drive',
    stats: ['guts', 'proficiency'],
    description:
      'Discipline and nerve pull in the same direction. You push through the reps others skip and win by momentum.',
    blessing: '+10% XP on every quest while your streak is 3 or more.',
  },
  {
    id: 'justice',
    numeral: 'VIII',
    name: 'Justice',
    epithet: 'Reasoned Resolve',
    stats: ['guts', 'knowledge'],
    description: 'Your courage is guided by thought. You stand for what is right because you understand why it is right.',
    blessing: '+10% XP on Knowledge quests.',
  },
  {
    id: 'hermit',
    numeral: 'IX',
    name: 'The Hermit',
    epithet: 'Lantern of Craft',
    stats: ['proficiency', 'knowledge'],
    description: 'You perfect your craft in quiet hours, lighting your own way with study and practice.',
    blessing: '+10% XP on Proficiency quests in the Dark Hour.',
  },
  {
    id: 'fortune',
    numeral: 'X',
    name: 'Wheel of Fortune',
    epithet: 'The Turning Wheel',
    stats: ['charm', 'proficiency'],
    description: 'Luck seems to follow you, but it is skill wearing a smile. You make the right moment, then meet it.',
    blessing: 'Double XP on the quests Fortune turns, about one in eight, rerolled each day.',
  },
  {
    id: 'strength',
    numeral: 'XI',
    name: 'Strength',
    epithet: 'Gentle Might',
    stats: ['guts', 'kindness'],
    description: "True strength, softly held. You face hard things so others don't have to face them alone.",
    blessing: '+10% XP on HARD quests.',
  },
  {
    id: 'hanged',
    numeral: 'XII',
    name: 'The Hanged Man',
    epithet: 'Willing Sacrifice',
    stats: ['kindness', 'guts'],
    description:
      "You'll give up your own comfort for someone else. Seeing the world from another's side is your quiet bravery.",
    blessing: '+10% XP on Kindness quests in the Dark Hour.',
  },
  {
    id: 'death',
    numeral: 'XIII',
    name: 'Death',
    epithet: 'Forged Anew',
    stats: ['proficiency', 'guts'],
    description:
      "You grind until the old self falls away. Every hard repetition is an ending that makes room for who you're becoming.",
    blessing: '+10% XP on DEEP and EPIC quests.',
  },
  {
    id: 'temperance',
    numeral: 'XIV',
    name: 'Temperance',
    epithet: 'Measured Balance',
    stats: ['proficiency', 'kindness'],
    description: 'Patient, steady and generous with your skill. You blend effort and care until the mix is just right.',
    blessing: '+5% XP on every quest while no stat is more than 2 ranks behind your best.',
  },
  {
    id: 'devil',
    numeral: 'XV',
    name: 'The Devil',
    epithet: 'Bold Allure',
    stats: ['charm', 'guts'],
    description: "Magnetic and unafraid. You take the risks others only daydream about, and people can't look away.",
    blessing: '+10% XP on Charm quests in the Dark Hour.',
  },
  {
    id: 'tower',
    numeral: 'XVI',
    name: 'The Tower',
    epithet: 'The Shattering Truth',
    stats: ['knowledge', 'guts'],
    description:
      'You chase ideas that break what you thought you knew, and you have the nerve to rebuild from the rubble.',
    blessing: '+10% XP on Guts quests.',
  },
  {
    id: 'star',
    numeral: 'XVII',
    name: 'The Star',
    epithet: 'Guiding Light',
    stats: ['kindness', 'knowledge'],
    description: 'Hope with a plan. You understand what people need and light the way toward it.',
    blessing: '+10% XP on Kindness and Knowledge quests on the Full Moon.',
  },
  {
    id: 'moon',
    numeral: 'XVIII',
    name: 'The Moon',
    epithet: 'Veiled Mystery',
    stats: ['charm', 'knowledge'],
    description: 'Charm with depths. You intrigue people with what you know and how little you reveal.',
    blessing: 'The Dark Hour opens at 20:00 instead of 21:00.',
  },
  {
    id: 'sun',
    numeral: 'XIX',
    name: 'The Sun',
    epithet: 'Radiant Mastery',
    stats: ['proficiency', 'charm'],
    description: 'Your skill shines and you share it freely. Confidence built on real ability warms every room.',
    blessing: '+10% XP on every quest cleared before noon.',
  },
  {
    id: 'judgement',
    numeral: 'XX',
    name: 'Judgement',
    epithet: 'The Calling',
    stats: ['charm', 'kindness'],
    description: 'You rally people toward their better selves. Your warmth is a summons others answer.',
    blessing: '+10% XP on the quest that clears your day.',
  },
  {
    id: 'world',
    numeral: 'XXI',
    name: 'The World',
    epithet: 'Complete Circle',
    stats: null,
    description:
      "Every path walked, every stat high. You've become whole, and the journey begins again at a higher turn.",
    blessing: '+10% XP on every quest.',
  },
];
