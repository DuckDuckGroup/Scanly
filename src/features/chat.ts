/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Botkit } from 'botkit';
import path from 'path';
import log, { Levels } from '../logger';

export default function chats(controller: Botkit) {
  // make public/index.html available as localhost/index.html
  // by making the /public folder a static/public asset
  controller.publicFolder('/', path.join(__dirname, '..', 'public'));

  log(Levels.info, `Chat with me: http://localhost:${process.env.PORT || 3000}`);
}
