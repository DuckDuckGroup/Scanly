import { Botkit } from 'botkit';

export default function start(controller: Botkit) {
    controller.hears('hello', 'message', async (bot, message) => {
        await bot.reply(message, 'Hello my name is Scanley!')
        await bot.reply(message, 'I am here to simplify your security')
        await bot.reply(message, {
            text: 'Before using Scanley, you must agree to our terms of use. These can be found on our website: https://duckduckgroup.github.io/',
            quick_replies: [
              {
                title: 'I Agree',
                payload: 'agree',
              },
              {
                title: 'I Disagree',
                payload: 'disagree',
              },
            ],
        });
    });

    controller.hears('menu', 'message', async (bot, message) => {
        await bot.reply(message, {
            text: 'Welcome to the main menu, please chose an option!',
            quick_replies: [
              {
                title: 'Network Scan',
                payload: 'network',
              },
              {
                title: 'Network Vulnerability Detection',
                payload: 'vuln',
              },
              {
                  title: 'Account Breach Detection',
                  payload: 'account',
              },
            ],
        });
    });
}