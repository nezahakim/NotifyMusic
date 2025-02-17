import { BotContext } from '../types';
import { searchService } from '../services/search';
import { createSearchResultsMarkup } from '../utils/markup';

export async function searchCommand(ctx: BotContext) {
  const query = ctx.message.text.replace('/search', '').trim();
  
  if (!query) {
    return ctx.reply('Please provide a search term: /search <song name>');
  }

  try {
    const results = await searchService.search(query);
    ctx.session.searchResults = results;

    const markup = createSearchResultsMarkup(results);
    await ctx.reply('Search results:', markup);
  } catch (error) {
    await ctx.reply('Failed to search. Please try again.');
  }
}
