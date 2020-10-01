/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Botkit } from 'botkit';

export default function SHears(controller: Botkit) {
  controller.hears(async (message): Promise<boolean> => !!(message.text && message.text.toLowerCase() === 'foo'), ['message'], async (bot, message) => {
    await bot.reply(message, 'I heard "foo" via a function test');
  });

  // use a regular expression to match the text of the message
  controller.hears(new RegExp(/^\d+$/), ['message', 'direct_message'], async (bot, message) => {
    await bot.reply(message, { text: 'I heard a number using a regular expression.' });
  });

  // match any one of set of mixed patterns like a string, a regular expression
  controller.hears(['allcaps', new RegExp(/^[A-Z\s]+$/)], ['message', 'direct_message'], async (bot, message) => {
    await bot.reply(message, { text: 'I HEARD ALL CAPS!' });
  });
}
