import { computed, ref, shallowReactive, watch } from 'vue';

type HistoryStep<State> = {
  undo: (state: State) => void;
  redo: (state: State) => void;
};

export const useUndoRedo = <State extends object>(
  initialState: State,
  stackLength = 50,
) => {
  const current = ref(initialState);
  type Step = HistoryStep<typeof current.value>;

  const undoStack = shallowReactive<Step[]>([]);
  const redoStack = shallowReactive<Step[]>([]);

  const record = (step: Step) => {
    undoStack.push(step);
    redoStack.length = 0;

    if (undoStack.length > stackLength) {
      undoStack.shift();
    }
  };

  const change = (step: Step) => {
    step.redo(current.value);
    record(step);
  };

  const undo = () => {
    const step = undoStack.at(-1);
    if (step === undefined) return;

    step.undo(current.value);
    undoStack.pop();
    redoStack.push(step);
  };

  const redo = () => {
    const step = redoStack.at(-1);
    if (step === undefined) return;

    step.redo(current.value);
    redoStack.pop();
    undoStack.push(step);
  };

  return {
    undo,
    redo,
    change,
    record,
    current,
    disabledUndo: computed(() => undoStack.length === 0),
    disabledRedo: computed(() => redoStack.length === 0),
  };
};
