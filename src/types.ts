/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AppStage {
  GIFT = 'GIFT',
  BURST = 'BURST',
  COUNTDOWN = 'COUNTDOWN',
  GREETING = 'GREETING',
  PIN = 'PIN',
  LETTER = 'LETTER',
  BOOK_COVER = 'BOOK_COVER',
  BOOK = 'BOOK',
  FINAL_LETTER_COVER = 'FINAL_LETTER_COVER',
  FINAL_LETTER = 'FINAL_LETTER',
  CAKE = 'CAKE'
}

export interface LetterSlide {
  id: number;
  text: string;
  isClosing?: boolean;
}
