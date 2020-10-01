/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Botkit } from 'botkit';

export default function SWebSockets(controller: Botkit) {
  if (controller.adapter.name === 'Web Adapter') {
    console.log('Loading sample web features...');

    controller.hears(new RegExp('quick'), 'message', async (bot, message) => {
      await bot.reply(message, {
        text: 'Here are some quick replies',
        quick_replies: [
          {
            title: 'Foo',
            payload: 'foo',
          },
          {
            title: 'Bar',
            payload: 'bar',
          },
        ],
      });
    });
  }
}
