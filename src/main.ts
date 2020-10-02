import { Botkit } from 'botkit';
import { BotkitCMSHelper } from 'botkit-plugin-cms';
import { WebAdapter } from 'botbuilder-adapter-web';
import { MongoDbStorage } from 'botbuilder-storage-mongodb';
import { MongoClient } from 'mongodb';

require('dotenv').config();

const storage = process.env.MONGO_URI
  ? new MongoDbStorage(
      MongoDbStorage.getCollection(
        new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true }),
        'Scanly',
        'BotState',
      ),
    )
  : undefined;

const adapter = new WebAdapter({});

const controller = new Botkit({
  webhook_uri: '/api/messages',
  adapter,
  storage,
});

if (process.env.CMS_URI) {
  controller.usePlugin(
    new BotkitCMSHelper({
      uri: process.env.CMS_URI,
      token: process.env.CMS_TOKEN!.toString() || 'DefinitelyAToken',
    }),
  );
}

controller.ready(() => {
  controller.loadModules(`${__dirname}/features`, ['.ts', '.js']);

  if (controller.plugins.cms) {
    controller.on('message,direct_message', async (bot, message) =>
      controller.plugins.cms.testTrigger(bot, message),
    );
  }
});
