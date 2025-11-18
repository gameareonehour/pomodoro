import { SyntheticEvent } from "react";

export const selectAll = (event: SyntheticEvent<HTMLInputElement>) => {
  event.currentTarget.select();
};

const timerInput = {
  maxMinutes: 60,
  maxDigits: 2,
} as const;

export const validateTimerInput = (nextValue: string): false | string => {
  const numericNextValue = Number(nextValue);
  const numericDigits = String(numericNextValue).length;

  // 3桁以上の数値は不正な値.
  if (numericDigits > timerInput.maxDigits) {
    return false
  }

  // 値が0の場合は値を1に修正する.
  if (numericNextValue === 0) {
    return "01"
  }

  // 値が1桁の場合は頭を0埋めする.
  if (!(numericDigits >= timerInput.maxDigits)) {
    return nextValue.padStart(2, "0");
  }

  // 既に頭に"0"がついているケースを考慮し、整数の値を返す.
  return numericNextValue.toString()
}