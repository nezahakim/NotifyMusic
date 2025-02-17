import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { Redis } from '@upstash/redis';
import { searchCommand } from './commands/search';
import { playlistCommands } from './commands/playlist';
import { playerCommands } from './commands/player';
import { BotContext } from './types';

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!
});

// Session middleware
bot.use(session());

// Initialize user session
bot.use(async (ctx, next) => {
  if (!ctx.session) {
    ctx.session = {
      currentTrack: null,
      playlist: [],
      searchResults: []
    };
  }
  return next();
});

// Search command
bot.command('search', searchCommand);

// Playlist commands
bot.command('create', playlistCommands.create);
bot.command('add', playlistCommands.add);
bot.command('remove', playlistCommands.remove);
bot.command('list', playlistCommands.list);

// Player commands
bot.command('play', playerCommands.play);
bot.command('pause', playerCommands.pause);
bot.command('next', playerCommands.next);
bot.command('prev', playerCommands.prev);

export { bot, redis };
