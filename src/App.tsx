import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EndScreen } from './components/EndScreen';
import { GamePlayScreen } from './components/GamePlayScreen';
import { RoundWinnerScreen } from './components/RoundWinnerScreen';
import { SetupScreen } from './components/SetupScreen';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { TieBreakerScreen } from './components/TieBreakerScreen';
import {
  buildRound1Deck,
  buildRound2Deck,
  buildRound3FinalDecks,
  shuffleArray,
  TIE_BREAKER_BANK,
} from './data/questionBank';
import {
  FloatingStarEvent,
  Group,
  GroupConfigInput,
  NavSnapshot,
  Round1Category,
  Round1Question,
  Round2Question,
  Round3QuestionItem,
  RoundMode,
  RoundNumber,
  RoundWinnerRecord,
  ScreenState,
  SortirMistake,
  TurnPhase,
} from './types/game';
import { soundEngine } from './utils/sound';

const DEFAULT_GROUP_CONFIGS: GroupConfigInput[] = [
  { name: 'Kelompok 1', membersText: '' },
  { name: 'Kelompok 2', membersText: '' },
  { name: 'Kelompok 3', membersText: '' },
  { name: 'Kelompok 4', membersText: '' },
  { name: 'Kelompok 5', membersText: '' },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('SETUP');
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const [savedGroupCount, setSavedGroupCount] = useState<3 | 4 | 5>(4);
  const [savedGroupConfigs, setSavedGroupConfigs] =
    useState<GroupConfigInput[]>(DEFAULT_GROUP_CONFIGS);
  const [roundMode, setRoundMode] = useState<RoundMode>('ALL');

  const [groups, setGroups] = useState<Group[]>([]);
  const [currentRound, setCurrentRound] = useState<RoundNumber>(1);
  const [round1Deck, setRound1Deck] = useState<Round1Question[]>([]);
  const [round2Deck, setRound2Deck] = useState<Round2Question[]>([]);
  const [round3Decks, setRound3Decks] = useState<
    [Round3QuestionItem[], Round3QuestionItem[]]
  >([[], []]);
  const [finalistGroupIds, setFinalistGroupIds] = useState<string[]>([]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [turnGroupIndex, setTurnGroupIndex] = useState(0);
  const [stealGroupIndex, setStealGroupIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<TurnPhase>('TURN_SPOTLIGHT');
  const [timeLeft, setTimeLeft] = useState(10);

  const [eliminatedOptionIndices, setEliminatedOptionIndices] = useState<number[]>([]);
  const [doubleActive, setDoubleActive] = useState(false);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [chosenCategory, setChosenCategory] = useState<Round1Category | null>(null);
  const [lastOutcome, setLastOutcome] = useState<
    'CORRECT' | 'WRONG' | 'TIMEOUT' | 'SKIPPED' | null
  >(null);

  // Ronde 3 state
  const [sortirItemIndex, setSortirItemIndex] = useState(0);
  const [sortirMistakes, setSortirMistakes] = useState<SortirMistake[]>([]);
  const [sortirRoundDelta, setSortirRoundDelta] = useState(0);

  // Round winners & tie-breaker state
  const [roundWinners, setRoundWinners] = useState<RoundWinnerRecord[]>([]);
  const [tieContext, setTieContext] = useState<{
    kind: 'ROUND' | 'TOP2_CUTOFF' | 'OVERALL';
    round: RoundNumber;
    tiedGroups: Group[];
    question: Round2Question;
    pendingWinnerScore?: number;
  } | null>(null);

  // Navigation history for "Kembali" + teacher undo
  const [navHistory, setNavHistory] = useState<NavSnapshot[]>([]);
  const [undoStack, setUndoStack] = useState<NavSnapshot[]>([]);
  const [lastActiveScreen, setLastActiveScreen] = useState<ScreenState>('PLAYING');

  // Effects & teacher controls
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [wrongFlashKey, setWrongFlashKey] = useState(0);
  const [starBurstKey, setStarBurstKey] = useState(0);
  const [floatingStars, setFloatingStars] = useState<FloatingStarEvent[]>([]);
  const starIdRef = useRef(1);

  const currentRound1Q = currentRound === 1 ? round1Deck[questionIndex] : undefined;
  const currentRound2Q = currentRound === 2 ? round2Deck[questionIndex] : undefined;

  const finalistIndexInRound3 = useMemo(() => {
    if (currentRound !== 3) return 0;
    const activeGroup = groups[turnGroupIndex];
    if (!activeGroup) return 0;
    const idx = finalistGroupIds.indexOf(activeGroup.id);
    return idx >= 0 ? idx : 0;
  }, [currentRound, groups, turnGroupIndex, finalistGroupIds]);

  const currentRound3Items =
    currentRound === 3 ? round3Decks[finalistIndexInRound3] : undefined;

  const maxTime = useMemo(() => {
    if (currentRound === 1) return 10;
    if (currentRound === 2) return 15;
    return 60;
  }, [currentRound]);

  const emitFloatingStar = useCallback((groupId: string, delta: number) => {
    const id = starIdRef.current++;
    setFloatingStars((prev) => [...prev, { id, groupId, delta }]);
    window.setTimeout(() => {
      setFloatingStars((prev) => prev.filter((item) => item.id !== id));
    }, 1250);
  }, []);

  const captureSnapshot = useCallback((): NavSnapshot => {
    return {
      screen,
      groups: groups.map((g) => ({
        ...g,
        roundScores: [...g.roundScores] as [number, number, number],
      })),
      currentRound,
      questionIndex,
      turnGroupIndex,
      stealGroupIndex,
      finalistGroupIds: [...finalistGroupIds],
      phase,
      timeLeft,
      eliminatedOptionIndices: [...eliminatedOptionIndices],
      doubleActive,
      chosenIndex,
      chosenCategory,
      lastOutcome,
      sortirItemIndex,
      sortirMistakes: [...sortirMistakes],
      sortirRoundDelta,
      roundWinners: roundWinners.map((rw) => ({
        ...rw,
        winnerNames: [...rw.winnerNames],
      })),
    };
  }, [
    screen,
    groups,
    currentRound,
    questionIndex,
    turnGroupIndex,
    stealGroupIndex,
    finalistGroupIds,
    phase,
    timeLeft,
    eliminatedOptionIndices,
    doubleActive,
    chosenIndex,
    chosenCategory,
    lastOutcome,
    sortirItemIndex,
    sortirMistakes,
    sortirRoundDelta,
    roundWinners,
  ]);

  const restoreSnapshot = useCallback((snap: NavSnapshot) => {
    setScreen(snap.screen);
    setGroups(snap.groups);
    setCurrentRound(snap.currentRound);
    setQuestionIndex(snap.questionIndex);
    setTurnGroupIndex(snap.turnGroupIndex);
    setStealGroupIndex(snap.stealGroupIndex);
    setFinalistGroupIds(snap.finalistGroupIds);
    setPhase(snap.phase);
    setTimeLeft(snap.timeLeft);
    setEliminatedOptionIndices(snap.eliminatedOptionIndices);
    setDoubleActive(snap.doubleActive);
    setChosenIndex(snap.chosenIndex);
    setChosenCategory(snap.chosenCategory);
    setLastOutcome(snap.lastOutcome);
    setSortirItemIndex(snap.sortirItemIndex);
    setSortirMistakes(snap.sortirMistakes);
    setSortirRoundDelta(snap.sortirRoundDelta);
    setRoundWinners(snap.roundWinners);
    setTieContext(null);
    setIsPaused(false);
  }, []);

  const pushNavHistory = useCallback(() => {
    const snap = captureSnapshot();
    setNavHistory((prev) => [...prev.slice(-39), snap]);
  }, [captureSnapshot]);

  const pushUndo = useCallback(() => {
    const snap = captureSnapshot();
    setUndoStack((prev) => [...prev.slice(-19), snap]);
  }, [captureSnapshot]);

  const handleGoBack = useCallback(() => {
    if (navHistory.length === 0) {
      setLastActiveScreen(screen);
      setScreen('SETUP');
      return;
    }
    const prev = navHistory[navHistory.length - 1];
    setNavHistory((h) => h.slice(0, -1));
    restoreSnapshot(prev);
  }, [navHistory, screen, restoreSnapshot]);

  const handleGoMainMenu = useCallback(() => {
    setIsPaused(false);
    setShowTeacherPanel(false);
    setLastActiveScreen(screen);
    setScreen('SETUP');
  }, [screen]);

  const handleResumeSession = useCallback(() => {
    if (!hasActiveSession) return;
    setScreen(lastActiveScreen === 'SETUP' ? 'PLAYING' : lastActiveScreen);
  }, [hasActiveSession, lastActiveScreen]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const startSession = useCallback(
    (groupCount: 3 | 4 | 5, configs: GroupConfigInput[], mode: RoundMode) => {
      setSavedGroupCount(groupCount);
      setSavedGroupConfigs(configs);
      setRoundMode(mode);

      const initialGroups: Group[] = configs.slice(0, groupCount).map((cfg, idx) => {
        const members = cfg.membersText
          .split(/[\n,]+/)
          .map((m) => m.trim())
          .filter(Boolean);
        return {
          id: `grp-${idx + 1}`,
          name: cfg.name.trim() || `Kelompok ${idx + 1}`,
          members,
          currentMemberIndex: 0,
          roundScores: [0, 0, 0],
          totalScore: 0,
          streak: 0,
          correctCount: 0,
          wrongCount: 0,
          usedFiftyFifty: false,
          usedDoublePoints: false,
        };
      });

      setGroups(initialGroups);
      setRound1Deck(buildRound1Deck(groupCount));
      setRound2Deck(buildRound2Deck(groupCount));
      setRound3Decks(buildRound3FinalDecks());
      setFinalistGroupIds(initialGroups.slice(0, 2).map((g) => g.id));

      const startRound: RoundNumber = mode === '2' ? 2 : mode === '3' ? 3 : 1;
      setCurrentRound(startRound);
      setQuestionIndex(0);
      setTurnGroupIndex(0);
      setStealGroupIndex(null);
      setPhase('TURN_SPOTLIGHT');
      setTimeLeft(startRound === 1 ? 10 : startRound === 2 ? 15 : 60);
      setEliminatedOptionIndices([]);
      setDoubleActive(false);
      setChosenIndex(null);
      setChosenCategory(null);
      setLastOutcome(null);
      setSortirItemIndex(0);
      setSortirMistakes([]);
      setSortirRoundDelta(0);
      setRoundWinners([]);
      setTieContext(null);
      setNavHistory([]);
      setUndoStack([]);
      setIsPaused(false);
      setShowTeacherPanel(false);
      setHasActiveSession(true);
      setLastActiveScreen('PLAYING');
      setScreen('PLAYING');
    },
    []
  );

  // Tentukan pemenang ronde, dan khusus akhir Ronde 2 (mode ALL) tentukan tepat 2 finalis ke Ronde 3
  const finalizeRoundOrTie = useCallback(
    (round: RoundNumber, updatedGroups: Group[]) => {
      const rIdx = round - 1;
      const topRoundScore = Math.max(...updatedGroups.map((g) => g.roundScores[rIdx]));
      const roundTied = updatedGroups.filter((g) => g.roundScores[rIdx] === topRoundScore);

      if (roundTied.length > 1) {
        const tieQ = shuffleArray(TIE_BREAKER_BANK)[0];
        setTieContext({
          kind: 'ROUND',
          round,
          tiedGroups: roundTied,
          question: tieQ,
        });
        setScreen('TIE_BREAKER');
        return;
      }

      let nextFinalistIds = finalistGroupIds;
      if (round === 2 && roundMode === 'ALL') {
        const sortedByTotal = [...updatedGroups].sort((a, b) => b.totalScore - a.totalScore);
        if (sortedByTotal.length > 2 && sortedByTotal[1].totalScore === sortedByTotal[2].totalScore) {
          const cutoffScore = sortedByTotal[1].totalScore;
          const cutoffTied = sortedByTotal.filter((g) => g.totalScore === cutoffScore);
          const tieQ = shuffleArray(TIE_BREAKER_BANK)[0];
          // Record round 2 winner first, then resolve 2nd finalist cutoff tie
          setRoundWinners((prev) => [
            ...prev.filter((w) => w.round !== round),
            {
              round,
              winnerNames: roundTied.map((g) => g.name),
              topRoundScore,
            },
          ]);
          setTieContext({
            kind: 'TOP2_CUTOFF',
            round: 2,
            tiedGroups: cutoffTied,
            question: tieQ,
            pendingWinnerScore: topRoundScore,
          });
          setScreen('TIE_BREAKER');
          return;
        }
        nextFinalistIds = sortedByTotal.slice(0, 2).map((g) => g.id);
        setFinalistGroupIds(nextFinalistIds);
      }

      soundEngine.playRoundWin();
      setRoundWinners((prev) => [
        ...prev.filter((w) => w.round !== round),
        {
          round,
          winnerNames: roundTied.map((g) => g.name),
          topRoundScore,
        },
      ]);
      setScreen('ROUND_WINNER');
    },
    [finalistGroupIds, roundMode]
  );

  const proceedAfterRoundWinner = useCallback(() => {
    const isLastRound = roundMode !== 'ALL' || currentRound === 3;

    if (!isLastRound) {
      pushNavHistory();
      const nextRound = (currentRound + 1) as RoundNumber;

      if (nextRound === 3) {
        const sortedByTotal = [...groups].sort((a, b) => b.totalScore - a.totalScore);
        const top2Ids =
          finalistGroupIds.length === 2
            ? finalistGroupIds
            : sortedByTotal.slice(0, 2).map((g) => g.id);
        setFinalistGroupIds(top2Ids);
        const firstFinalistIdx = groups.findIndex((g) => g.id === top2Ids[0]);
        setTurnGroupIndex(firstFinalistIdx >= 0 ? firstFinalistIdx : 0);
      } else {
        setTurnGroupIndex(0);
      }

      setCurrentRound(nextRound);
      setQuestionIndex(0);
      setStealGroupIndex(null);
      setPhase('TURN_SPOTLIGHT');
      setTimeLeft(nextRound === 2 ? 15 : 60);
      setEliminatedOptionIndices([]);
      setDoubleActive(false);
      setChosenIndex(null);
      setChosenCategory(null);
      setLastOutcome(null);
      setSortirItemIndex(0);
      setSortirMistakes([]);
      setSortirRoundDelta(0);
      setScreen('PLAYING');
      return;
    }

    // Check overall tie before EndScreen
    const topTotal = Math.max(...groups.map((g) => g.totalScore));
    const overallTied = groups.filter((g) => g.totalScore === topTotal);
    if (overallTied.length > 1) {
      pushNavHistory();
      const tieQ = shuffleArray(TIE_BREAKER_BANK)[0];
      setTieContext({
        kind: 'OVERALL',
        round: currentRound,
        tiedGroups: overallTied,
        question: tieQ,
      });
      setScreen('TIE_BREAKER');
      return;
    }

    pushNavHistory();
    setScreen('END');
  }, [roundMode, currentRound, groups, finalistGroupIds, pushNavHistory]);

  const handleStartTurn = useCallback(() => {
    if (phase !== 'TURN_SPOTLIGHT') return;
    pushNavHistory();
    soundEngine.playTurnStart();
    setPhase('QUESTION_ACTIVE');
    setTimeLeft(currentRound === 1 ? 10 : currentRound === 2 ? 15 : 60);
    setEliminatedOptionIndices([]);
    setChosenIndex(null);
    setChosenCategory(null);
    setLastOutcome(null);
    setSortirItemIndex(0);
    setSortirMistakes([]);
    setSortirRoundDelta(0);
  }, [phase, currentRound, pushNavHistory]);

  const applyScoreChange = useCallback(
    (groupId: string, round: RoundNumber, delta: number, isCorrect: boolean): Group[] => {
      let updated: Group[] = [];
      setGroups((prev) => {
        updated = prev.map((g) => {
          if (g.id !== groupId) return g;
          const nextStreak = isCorrect ? g.streak + 1 : 0;
          const streakBonus =
            round === 2 && isCorrect && nextStreak > 0 && nextStreak % 3 === 0 ? 5 : 0;
          const totalDelta = delta + streakBonus;
          const nextRounds = [...g.roundScores] as [number, number, number];
          nextRounds[round - 1] += totalDelta;
          return {
            ...g,
            roundScores: nextRounds,
            totalScore: g.totalScore + totalDelta,
            streak: round === 2 ? nextStreak : g.streak,
            correctCount: g.correctCount + (isCorrect ? 1 : 0),
            wrongCount: g.wrongCount + (isCorrect ? 0 : 1),
          };
        });
        return updated;
      });
      return updated;
    },
    []
  );

  const handleUseFiftyFifty = useCallback(() => {
    if (currentRound !== 2 || phase !== 'QUESTION_ACTIVE' || !currentRound2Q) return;
    const activeGroup = groups[turnGroupIndex];
    if (!activeGroup || activeGroup.usedFiftyFifty) return;

    pushUndo();
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentRound2Q.correctIndex);
    const toEliminate = shuffleArray(wrongIndices).slice(0, 2);
    setEliminatedOptionIndices(toEliminate);
    setGroups((prev) =>
      prev.map((g, idx) => (idx === turnGroupIndex ? { ...g, usedFiftyFifty: true } : g))
    );
  }, [currentRound, phase, currentRound2Q, groups, turnGroupIndex, pushUndo]);

  const handleUseDoublePoints = useCallback(() => {
    if (currentRound === 3 || phase !== 'QUESTION_ACTIVE') return;
    const activeGroup = groups[turnGroupIndex];
    if (!activeGroup || activeGroup.usedDoublePoints || doubleActive) return;

    pushUndo();
    setDoubleActive(true);
    setGroups((prev) =>
      prev.map((g, idx) => (idx === turnGroupIndex ? { ...g, usedDoublePoints: true } : g))
    );
  }, [currentRound, phase, groups, turnGroupIndex, doubleActive, pushUndo]);

  const handleSubmitRound1 = useCallback(
    (category: Round1Category) => {
      if (phase !== 'QUESTION_ACTIVE' || !currentRound1Q || isPaused) return;
      pushUndo();
      pushNavHistory();
      setChosenCategory(category);

      const activeGroup = groups[turnGroupIndex];
      const isCorrect = category === currentRound1Q.category;

      if (isCorrect) {
        const pts = doubleActive ? 20 : 10;
        soundEngine.playCorrect();
        setStarBurstKey((k) => k + 1);
        emitFloatingStar(activeGroup.id, pts);
        applyScoreChange(activeGroup.id, 1, pts, true);
        setLastOutcome('CORRECT');
      } else {
        soundEngine.playWrong();
        setShakeKey((k) => k + 1);
        setWrongFlashKey((k) => k + 1);
        applyScoreChange(activeGroup.id, 1, 0, false);
        setLastOutcome('WRONG');
      }

      setPhase('REVEALED');
    },
    [
      phase,
      currentRound1Q,
      isPaused,
      pushUndo,
      pushNavHistory,
      groups,
      turnGroupIndex,
      doubleActive,
      emitFloatingStar,
      applyScoreChange,
    ]
  );

  const triggerStealPrompt = useCallback(
    (wrongOptionIdx: number | null) => {
      if (!currentRound2Q) return;
      let eliminateIdx = wrongOptionIdx;
      if (eliminateIdx === null) {
        const availableWrong = [0, 1, 2, 3].filter(
          (i) => i !== currentRound2Q.correctIndex && !eliminatedOptionIndices.includes(i)
        );
        eliminateIdx =
          availableWrong.length > 0
            ? availableWrong[Math.floor(Math.random() * availableWrong.length)]
            : null;
      }
      if (eliminateIdx !== null && !eliminatedOptionIndices.includes(eliminateIdx)) {
        setEliminatedOptionIndices((prev) => [...prev, eliminateIdx!]);
      }
      setStealGroupIndex(null);
      setDoubleActive(false);
      setPhase('STEAL_PROMPT');
    },
    [currentRound2Q, eliminatedOptionIndices]
  );

  const handleSubmitRound2 = useCallback(
    (index: number) => {
      if (
        (phase !== 'QUESTION_ACTIVE' && phase !== 'STEAL_ACTIVE') ||
        !currentRound2Q ||
        isPaused ||
        eliminatedOptionIndices.includes(index)
      ) {
        return;
      }

      pushUndo();
      pushNavHistory();
      setChosenIndex(index);

      const isStealing = phase === 'STEAL_ACTIVE';
      const targetIdx = isStealing ? stealGroupIndex ?? turnGroupIndex : turnGroupIndex;
      const targetGroup = groups[targetIdx];
      const isCorrect = index === currentRound2Q.correctIndex;

      if (isCorrect) {
        const base = isStealing ? 15 : 10;
        const pts = !isStealing && doubleActive ? base * 2 : base;
        const nextStreak = targetGroup.streak + 1;
        const bonus = nextStreak > 0 && nextStreak % 3 === 0 ? 5 : 0;

        if (bonus > 0) {
          soundEngine.playStreak();
        } else {
          soundEngine.playCorrect();
        }

        setStarBurstKey((k) => k + 1);
        emitFloatingStar(targetGroup.id, pts + bonus);
        applyScoreChange(targetGroup.id, 2, pts, true);
        setLastOutcome('CORRECT');
        setPhase('REVEALED');
      } else {
        soundEngine.playWrong();
        setShakeKey((k) => k + 1);
        setWrongFlashKey((k) => k + 1);
        setLastOutcome('WRONG');

        if (!isStealing) {
          // Kelompok utama kehilangan kesempatan poin pada soal ini, tanpa pengurangan poin
          applyScoreChange(targetGroup.id, 2, 0, false);
          triggerStealPrompt(index);
        } else {
          emitFloatingStar(targetGroup.id, -5);
          applyScoreChange(targetGroup.id, 2, -5, false);
          setPhase('REVEALED');
        }
      }
    },
    [
      phase,
      currentRound2Q,
      isPaused,
      eliminatedOptionIndices,
      pushUndo,
      pushNavHistory,
      stealGroupIndex,
      turnGroupIndex,
      groups,
      doubleActive,
      emitFloatingStar,
      applyScoreChange,
      triggerStealPrompt,
    ]
  );

  const handleSubmitRound3Basket = useCallback(
    (basketIndex: number) => {
      if (currentRound !== 3 || phase !== 'QUESTION_ACTIVE' || !currentRound3Items || isPaused) {
        return;
      }
      const item = currentRound3Items[sortirItemIndex];
      if (!item) return;

      pushUndo();
      const activeGroup = groups[turnGroupIndex];
      const isCorrect = basketIndex === item.correctBasketIndex;

      if (isCorrect) {
        soundEngine.playCorrect();
        setStarBurstKey((k) => k + 1);
        emitFloatingStar(activeGroup.id, 20);
        applyScoreChange(activeGroup.id, 3, 20, true);
        setSortirRoundDelta((d) => d + 20);
      } else {
        soundEngine.playWrong();
        setShakeKey((k) => k + 1);
        setWrongFlashKey((k) => k + 1);
        emitFloatingStar(activeGroup.id, -10);
        applyScoreChange(activeGroup.id, 3, -10, false);
        setSortirRoundDelta((d) => d - 10);
        setSortirMistakes((prev) => [
          ...prev,
          {
            word: item.word,
            affix: item.affix,
            chosenBasket: item.baskets[basketIndex],
            correctBasket: item.baskets[item.correctBasketIndex],
            note: item.note,
          },
        ]);
      }

      if (sortirItemIndex + 1 >= currentRound3Items.length) {
        setPhase('SORTIR_SUMMARY');
      } else {
        setSortirItemIndex((idx) => idx + 1);
      }
    },
    [
      currentRound,
      phase,
      currentRound3Items,
      isPaused,
      sortirItemIndex,
      pushUndo,
      groups,
      turnGroupIndex,
      emitFloatingStar,
      applyScoreChange,
    ]
  );

  const handleNextTurn = useCallback(() => {
    pushNavHistory();

    // Rotate member inside the group that just answered
    const updatedGroups = groups.map((g, idx) =>
      idx === turnGroupIndex
        ? { ...g, currentMemberIndex: g.currentMemberIndex + 1 }
        : g
    );
    setGroups(updatedGroups);

    if (currentRound === 1) {
      const nextQ = questionIndex + 1;
      if (nextQ >= round1Deck.length) {
        finalizeRoundOrTie(1, updatedGroups);
        return;
      }
      const nextGroupIdx = Math.floor(nextQ / 5);
      const isGroupChanged = nextGroupIdx !== turnGroupIndex;
      setQuestionIndex(nextQ);
      setTurnGroupIndex(nextGroupIdx);
      setStealGroupIndex(null);
      setPhase(isGroupChanged ? 'TURN_SPOTLIGHT' : 'QUESTION_ACTIVE');
      setTimeLeft(10);
      setEliminatedOptionIndices([]);
      setDoubleActive(false);
      setChosenIndex(null);
      setChosenCategory(null);
      setLastOutcome(null);
      if (!isGroupChanged) {
        soundEngine.playTurnStart();
      }
      return;
    }

    if (currentRound === 2) {
      const nextQ = questionIndex + 1;
      if (nextQ >= round2Deck.length) {
        finalizeRoundOrTie(2, updatedGroups);
        return;
      }
      const nextGroupIdx = Math.floor(nextQ / 5);
      const isGroupChanged = nextGroupIdx !== turnGroupIndex;
      setQuestionIndex(nextQ);
      setTurnGroupIndex(nextGroupIdx);
      setStealGroupIndex(null);
      setPhase(isGroupChanged ? 'TURN_SPOTLIGHT' : 'QUESTION_ACTIVE');
      setTimeLeft(15);
      setEliminatedOptionIndices([]);
      setDoubleActive(false);
      setChosenIndex(null);
      setChosenCategory(null);
      setLastOutcome(null);
      if (!isGroupChanged) {
        soundEngine.playTurnStart();
      }
      return;
    }

    // Ronde 3: hanya 2 kelompok finalis
    const activeGroup = updatedGroups[turnGroupIndex];
    const currentPos = activeGroup ? finalistGroupIds.indexOf(activeGroup.id) : 0;
    if (currentPos === 0 && finalistGroupIds.length > 1) {
      const secondFinalistIdx = updatedGroups.findIndex(
        (g) => g.id === finalistGroupIds[1]
      );
      setTurnGroupIndex(secondFinalistIdx >= 0 ? secondFinalistIdx : 1);
      setPhase('TURN_SPOTLIGHT');
      setTimeLeft(60);
      setSortirItemIndex(0);
      setSortirMistakes([]);
      setSortirRoundDelta(0);
    } else {
      finalizeRoundOrTie(3, updatedGroups);
    }
  }, [
    pushNavHistory,
    groups,
    turnGroupIndex,
    currentRound,
    questionIndex,
    round1Deck.length,
    round2Deck.length,
    finalistGroupIds,
    finalizeRoundOrTie,
  ]);

  // Countdown timer effect
  useEffect(() => {
    if (
      screen !== 'PLAYING' ||
      (phase !== 'QUESTION_ACTIVE' && phase !== 'STEAL_ACTIVE') ||
      isPaused ||
      showTeacherPanel
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        const nextVal = prev - 1;
        if (nextVal <= 3) {
          soundEngine.playCountdownTick(true);
        }
        return nextVal;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen, phase, isPaused, showTeacherPanel]);

  // Handle timeout when timer reaches 0
  useEffect(() => {
    if (
      screen !== 'PLAYING' ||
      timeLeft !== 0 ||
      isPaused ||
      (phase !== 'QUESTION_ACTIVE' && phase !== 'STEAL_ACTIVE')
    ) {
      return;
    }

    if (currentRound === 3) {
      setPhase('SORTIR_SUMMARY');
      return;
    }

    const isStealing = phase === 'STEAL_ACTIVE';
    const targetIdx = isStealing ? stealGroupIndex ?? turnGroupIndex : turnGroupIndex;
    const targetGroup = groups[targetIdx];

    soundEngine.playWrong();
    setShakeKey((k) => k + 1);
    setWrongFlashKey((k) => k + 1);
    setLastOutcome('TIMEOUT');

    if (currentRound === 1) {
      applyScoreChange(targetGroup.id, 1, 0, false);
      setPhase('REVEALED');
    } else if (currentRound === 2) {
      if (!isStealing) {
        // Waktu habis pada giliran utama: tanpa pengurangan poin, buka kesempatan rebutan
        applyScoreChange(targetGroup.id, 2, 0, false);
        triggerStealPrompt(null);
      } else {
        emitFloatingStar(targetGroup.id, -5);
        applyScoreChange(targetGroup.id, 2, -5, false);
        setPhase('REVEALED');
      }
    }
  }, [
    screen,
    timeLeft,
    isPaused,
    phase,
    currentRound,
    stealGroupIndex,
    turnGroupIndex,
    groups,
    applyScoreChange,
    emitFloatingStar,
    triggerStealPrompt,
  ]);

  // Keyboard shortcuts: 1-4 / A-D, Space, H
  useEffect(() => {
    if (screen !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowTeacherPanel((prev) => !prev);
        return;
      }

      if (showTeacherPanel || isPaused) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'TURN_SPOTLIGHT') {
          handleStartTurn();
        } else if (phase === 'REVEALED' || phase === 'SORTIR_SUMMARY') {
          handleNextTurn();
        }
        return;
      }

      const key = e.key.toUpperCase();
      let idx = -1;
      if (key === '1' || key === 'A') idx = 0;
      else if (key === '2' || key === 'B') idx = 1;
      else if (key === '3' || key === 'C') idx = 2;
      else if (key === '4' || key === 'D') idx = 3;

      if (idx === -1) return;

      if (currentRound === 1 && phase === 'QUESTION_ACTIVE' && idx < 3) {
        const cats: Round1Category[] = ['MAJEMUK', 'IDIOM', 'FRASA'];
        handleSubmitRound1(cats[idx]);
      } else if (
        currentRound === 2 &&
        (phase === 'QUESTION_ACTIVE' || phase === 'STEAL_ACTIVE')
      ) {
        handleSubmitRound2(idx);
      } else if (currentRound === 3 && phase === 'QUESTION_ACTIVE' && idx < 3) {
        handleSubmitRound3Basket(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    showTeacherPanel,
    isPaused,
    phase,
    currentRound,
    handleStartTurn,
    handleNextTurn,
    handleSubmitRound1,
    handleSubmitRound2,
    handleSubmitRound3Basket,
  ]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    restoreSnapshot(last);
  }, [undoStack, restoreSnapshot]);

  const handleAdjustScore = useCallback(
    (groupId: string, delta: number) => {
      setGroups((prev) =>
        prev.map((g) => {
          if (g.id !== groupId) return g;
          const nextRounds = [...g.roundScores] as [number, number, number];
          nextRounds[currentRound - 1] += delta;
          return {
            ...g,
            roundScores: nextRounds,
            totalScore: g.totalScore + delta,
          };
        })
      );
    },
    [currentRound]
  );

  const turnLabel = useMemo(() => {
    if (currentRound === 1 || currentRound === 2) {
      const qInGroup = (questionIndex % 5) + 1;
      return `Kelompok ${turnGroupIndex + 1} · Soal ${qInGroup}/5`;
    }
    return `Finalis ${finalistIndexInRound3 + 1}/2 · 5 Soal`;
  }, [
    currentRound,
    questionIndex,
    turnGroupIndex,
    finalistIndexInRound3,
  ]);

  if (screen === 'SETUP') {
    return (
      <SetupScreen
        initialGroupCount={savedGroupCount}
        initialGroupConfigs={savedGroupConfigs}
        initialRoundMode={roundMode}
        isMuted={isMuted}
        hasActiveSession={hasActiveSession}
        onResumeSession={handleResumeSession}
        onToggleMute={toggleMute}
        onStartGame={startSession}
      />
    );
  }

  if (screen === 'TIE_BREAKER' && tieContext) {
    return (
      <TieBreakerScreen
        title={
          tieContext.kind === 'ROUND'
            ? `Penentu Juara Ronde ${tieContext.round}`
            : tieContext.kind === 'TOP2_CUTOFF'
            ? 'Penentu 2 Besar ke Babak Final'
            : 'Penentu Juara Umum'
        }
        subtitle={
          tieContext.kind === 'TOP2_CUTOFF'
            ? 'Skor imbang untuk tiket terakhir menuju Ronde 3 (Babak Final). Kelompok yang menang langsung lolos!'
            : undefined
        }
        tiedGroups={tieContext.tiedGroups}
        question={tieContext.question}
        canGoBack={navHistory.length > 0}
        onGoBack={handleGoBack}
        onGoMainMenu={handleGoMainMenu}
        onResolve={(winnerGroupId) => {
          soundEngine.playRoundWin();
          const updated = groups.map((g) => {
            if (g.id !== winnerGroupId) return g;
            const nextRounds = [...g.roundScores] as [number, number, number];
            nextRounds[tieContext.round - 1] += 5;
            return {
              ...g,
              roundScores: nextRounds,
              totalScore: g.totalScore + 5,
            };
          });
          setGroups(updated);

          const winnerGroup = updated.find((g) => g.id === winnerGroupId);
          if (tieContext.kind === 'ROUND') {
            setRoundWinners((prev) => [
              ...prev.filter((w) => w.round !== tieContext.round),
              {
                round: tieContext.round,
                winnerNames: winnerGroup ? [winnerGroup.name] : [],
                topRoundScore: winnerGroup ? winnerGroup.roundScores[tieContext.round - 1] : 0,
              },
            ]);

            if (tieContext.round === 2 && roundMode === 'ALL') {
              const sortedByTotal = [...updated].sort((a, b) => b.totalScore - a.totalScore);
              if (
                sortedByTotal.length > 2 &&
                sortedByTotal[1].totalScore === sortedByTotal[2].totalScore
              ) {
                const cutoffScore = sortedByTotal[1].totalScore;
                const cutoffTied = sortedByTotal.filter((g) => g.totalScore === cutoffScore);
                setTieContext({
                  kind: 'TOP2_CUTOFF',
                  round: 2,
                  tiedGroups: cutoffTied,
                  question: shuffleArray(TIE_BREAKER_BANK)[0],
                });
                return;
              }
              setFinalistGroupIds(sortedByTotal.slice(0, 2).map((g) => g.id));
            }

            setTieContext(null);
            setScreen('ROUND_WINNER');
          } else if (tieContext.kind === 'TOP2_CUTOFF') {
            const sortedByTotal = [...updated].sort((a, b) => b.totalScore - a.totalScore);
            setFinalistGroupIds(sortedByTotal.slice(0, 2).map((g) => g.id));
            setTieContext(null);
            setScreen('ROUND_WINNER');
          } else {
            setTieContext(null);
            setScreen('END');
          }
        }}
      />
    );
  }

  if (screen === 'ROUND_WINNER') {
    const isLastRound = roundMode !== 'ALL' || currentRound === 3;
    return (
      <RoundWinnerScreen
        round={currentRound}
        groups={groups}
        finalistGroupIds={finalistGroupIds}
        isLastRound={isLastRound}
        canGoBack={navHistory.length > 0}
        onGoBack={handleGoBack}
        onGoMainMenu={handleGoMainMenu}
        onContinue={proceedAfterRoundWinner}
      />
    );
  }

  if (screen === 'END') {
    return (
      <EndScreen
        groups={groups}
        roundWinners={roundWinners}
        canGoBack={navHistory.length > 0}
        onGoBack={handleGoBack}
        onPlayAgain={() => startSession(savedGroupCount, savedGroupConfigs, roundMode)}
        onBackToSetup={() => {
          setHasActiveSession(false);
          setScreen('SETUP');
        }}
      />
    );
  }

  return (
    <>
      <GamePlayScreen
        currentRound={currentRound}
        turnLabel={turnLabel}
        phase={phase}
        groups={groups}
        finalistGroupIds={finalistGroupIds}
        turnGroupIndex={turnGroupIndex}
        stealGroupIndex={stealGroupIndex}
        timeLeft={timeLeft}
        maxTime={maxTime}
        isPaused={isPaused}
        isMuted={isMuted}
        canGoBack={navHistory.length > 0}
        shakeKey={shakeKey}
        wrongFlashKey={wrongFlashKey}
        starBurstKey={starBurstKey}
        floatingStars={floatingStars}
        eliminatedOptionIndices={eliminatedOptionIndices}
        doubleActive={doubleActive}
        chosenIndex={chosenIndex}
        chosenCategory={chosenCategory}
        lastOutcome={lastOutcome}
        round1Question={currentRound1Q}
        round2Question={currentRound2Q}
        round3Items={currentRound3Items}
        sortirItemIndex={sortirItemIndex}
        sortirMistakes={sortirMistakes}
        sortirRoundDelta={sortirRoundDelta}
        onGoBack={handleGoBack}
        onGoMainMenu={handleGoMainMenu}
        onStartTurn={handleStartTurn}
        onUseFiftyFifty={handleUseFiftyFifty}
        onUseDoublePoints={handleUseDoublePoints}
        onSubmitRound1={handleSubmitRound1}
        onSubmitRound2={handleSubmitRound2}
        onSelectStealGroup={(idx) => {
          pushNavHistory();
          soundEngine.playTurnStart();
          setStealGroupIndex(idx);
          setPhase('STEAL_ACTIVE');
          setTimeLeft(15);
        }}
        onSkipSteal={() => {
          pushNavHistory();
          setPhase('REVEALED');
        }}
        onSubmitRound3Basket={handleSubmitRound3Basket}
        onNextTurn={handleNextTurn}
        onTogglePause={() => setIsPaused((p) => !p)}
        onToggleMute={toggleMute}
        onOpenTeacherPanel={() => setShowTeacherPanel(true)}
      />

      <TeacherPanelModal
        open={showTeacherPanel}
        isPaused={isPaused}
        isMuted={isMuted}
        canUndo={undoStack.length > 0}
        groups={groups}
        onClose={() => setShowTeacherPanel(false)}
        onSkip={handleNextTurn}
        onTogglePause={() => setIsPaused((p) => !p)}
        onToggleMute={toggleMute}
        onUndo={handleUndo}
        onAdjustScore={handleAdjustScore}
      />
    </>
  );
}
