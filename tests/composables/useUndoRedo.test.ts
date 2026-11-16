import { describe, expect, it } from 'vitest';
import { useUndoRedo } from '~/composables/useUndoRedo';

type Counter = { count: number };

const incrementStep = (amount: number) => ({
  undo(state: Counter) {
    state.count -= amount;
  },
  redo(state: Counter) {
    state.count += amount;
  },
});

describe('useUndoRedo', () => {
  it('оставляет состояние прежним, когда история пуста', () => {
    const history = useUndoRedo({ count: 0 });

    history.undo();
    history.redo();

    expect(history.current.value.count).toBe(0);
    expect(history.disabledUndo.value).toBe(true);
    expect(history.disabledRedo.value).toBe(true);
  });

  it('отменяет и повторяет изменения в правильном порядке', () => {
    const history = useUndoRedo({ count: 0 });

    history.change(incrementStep(2));
    history.change(incrementStep(5));
    expect(history.current.value.count).toBe(7);
    expect(history.disabledUndo.value).toBe(false);

    history.undo();
    expect(history.current.value.count).toBe(2);
    history.undo();
    expect(history.current.value.count).toBe(0);
    expect(history.disabledUndo.value).toBe(true);
    expect(history.disabledRedo.value).toBe(false);

    history.redo();
    expect(history.current.value.count).toBe(2);
    history.redo();
    expect(history.current.value.count).toBe(7);
    expect(history.disabledRedo.value).toBe(true);
  });

  it('запоминает уже применённое изменение без повторного применения', () => {
    const history = useUndoRedo({ count: 0 });
    history.current.value.count = 3;

    history.record(incrementStep(3));
    expect(history.current.value.count).toBe(3);

    history.undo();
    expect(history.current.value.count).toBe(0);
    history.redo();
    expect(history.current.value.count).toBe(3);
  });

  it('очищает redo после нового изменения', () => {
    const history = useUndoRedo({ count: 0 });
    history.change(incrementStep(2));
    history.undo();
    expect(history.disabledRedo.value).toBe(false);

    history.change(incrementStep(4));
    expect(history.disabledRedo.value).toBe(true);
    history.redo();
    expect(history.current.value.count).toBe(4);
  });

  it('сохраняет только последние 50 шагов', () => {
    const history = useUndoRedo({ count: 0 });

    for (let step = 0; step < 51; step++) {
      history.change(incrementStep(1));
    }
    expect(history.current.value.count).toBe(51);

    for (let step = 0; step < 50; step++) {
      history.undo();
    }
    expect(history.current.value.count).toBe(1);
    expect(history.disabledUndo.value).toBe(true);

    history.undo();
    expect(history.current.value.count).toBe(1);
  });
});
