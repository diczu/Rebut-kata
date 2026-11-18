export type RoundMode = 'ALL' | '1' | '2' | '3';
export type RoundNumber = 1 | 2 | 3;

export type ScreenState =
  | 'SETUP'
  | 'PLAYING'
  | 'ROUND_WINNER'
  | 'TIE_BREAKER'
  | 'END';

export type TurnPhase =
  | 'TURN_SPOTLIGHT'
  | 'QUESTION_ACTIVE'
  | 'STEAL_PROMPT'
  | 'STEAL_ACTIVE'
  | 'REVEALED'
  | 'SORTIR_SUMMARY';

export type Round1Category = 'MAJEMUK' | 'IDIOM' | 'FRASA';

export interface Round1Question {
  id: string;
  round: 1;
  phrase: string;
  category: Round1Category;
  oneLineExplanation: string;
}

export type AffixType =
  | 'ber-'
  | 'meng-'
  | 'ter-'
  | 'meng-kan'
  | 'meng-i'
  | 'ke-an'
  | 'peng-an'
  | 'per-an'
  | '-an';

export interface Round2Question {
  id: string;
  round: 2;
  affix: AffixType;
  sentenceBefore: string;
  targetWord: string;
  sentenceAfter: string;
  options: string[];
  correctIndex: 0 | 1 | 2 | 3;
  oneLineExplanation: string;
}

export interface Round3QuestionItem {
  id: string;
  affix: AffixType;
  word: string;
  contextSentence: string;
  baskets: [string, string, string];
  correctBasketIndex: 0 | 1 | 2;
  note: string;
}

export interface SortirMistake {
  word: string;
  affix: AffixType;
  chosenBasket: string;
  correctBasket: string;
  note: string;
}

export interface GroupConfigInput {
  name: string;
  membersText: string;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  currentMemberIndex: number;
  roundScores: [number, number, number];
  totalScore: number;
  streak: number;
  correctCount: number;
  wrongCount: number;
  usedFiftyFifty: boolean;
  usedDoublePoints: boolean;
}

export interface RoundWinnerRecord {
  round: RoundNumber;
  winnerNames: string[];
  topRoundScore: number;
}

export interface FloatingStarEvent {
  id: number;
  groupId: string;
  delta: number;
}

export interface NavSnapshot {
  screen: ScreenState;
  groups: Group[];
  currentRound: RoundNumber;
  questionIndex: number;
  turnGroupIndex: number;
  stealGroupIndex: number | null;
  finalistGroupIds: string[];
  phase: TurnPhase;
  timeLeft: number;
  eliminatedOptionIndices: number[];
  doubleActive: boolean;
  chosenIndex: number | null;
  chosenCategory: Round1Category | null;
  lastOutcome: 'CORRECT' | 'WRONG' | 'TIMEOUT' | 'SKIPPED' | null;
  sortirItemIndex: number;
  sortirMistakes: SortirMistake[];
  sortirRoundDelta: number;
  roundWinners: RoundWinnerRecord[];
}
