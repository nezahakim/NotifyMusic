import { Markup } from 'telegraf';
import { Track } from './types';

export function createSearchResultsMarkup(results: Track[]) {
  return Markup.inlineKeyboard(
    results.map((track, index) => [
      Markup.button.callback(
        `${index + 1}. ${track.title} - ${track.artist}`,
        `play:${track.videoId}`
      )
    ])
  );
}
