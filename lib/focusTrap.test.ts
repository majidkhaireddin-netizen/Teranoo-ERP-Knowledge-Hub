import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextFocusIndex } from '@/lib/focusTrap';

test('getNextFocusIndex cycles forward with Tab and wraps from last to first', () => {
  assert.equal(getNextFocusIndex(0, 4, false), 1);
  assert.equal(getNextFocusIndex(2, 4, false), 3);
  assert.equal(getNextFocusIndex(3, 4, false), 0);
});

test('getNextFocusIndex cycles backward with Shift+Tab and wraps from first to last', () => {
  assert.equal(getNextFocusIndex(3, 4, true), 2);
  assert.equal(getNextFocusIndex(1, 4, true), 0);
  assert.equal(getNextFocusIndex(0, 4, true), 3);
});

test('getNextFocusIndex handles out-of-bounds focus and edge container sizes cleanly', () => {
  assert.equal(getNextFocusIndex(-1, 3, false), 0);
  assert.equal(getNextFocusIndex(-1, 3, true), 2);
  assert.equal(getNextFocusIndex(99, 3, false), 0);
  assert.equal(getNextFocusIndex(99, 3, true), 2);
  assert.equal(getNextFocusIndex(0, 1, false), 0);
  assert.equal(getNextFocusIndex(0, 1, true), 0);
  assert.equal(getNextFocusIndex(0, 0, false), -1);
  assert.equal(getNextFocusIndex(0, 0, true), -1);
});
