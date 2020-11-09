import { Botkit } from 'botkit';
import { WebAdapter } from 'botbuilder-adapter-web';

require('dotenv').config();

const adapter = new WebAdapter({});

const controller = new Botkit({
  webhook_uri: '/api/messages',
  adapter,
});

controller.ready(() => {
  controller.loadModules(`${__dirname}/features`, ['.ts', '.js']);
});

controller.on('connected', async (bot, message) => {
  await bot.beginDialog('WelcomeMessage', message);
});
