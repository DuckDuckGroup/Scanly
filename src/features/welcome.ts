import { Botkit, BotkitConversation } from 'botkit';

export default function welcome(controller: Botkit) {
  /**
   * Main conversation greets user & displays main menu
   * @returns nothing (all conversation displayed to user)
   */

  // Welcome shows greeting, legal & collects user info
  const WelcomeMessage = new BotkitConversation('WelcomeMessage', controller);
  WelcomeMessage.say(
    "Hi I'm Scanly and I am here to simplify your security. By continuing to use Scanley, you consent to our terms of use. These can be found on our website: https://duckduckgroup.github.io/",
  );
  WelcomeMessage.ask(
    'For auditing purposes, what is your full name?',
    async (FullName, _WelcomeMessage, bot) => {
      await bot.say(`Thanks ${FullName}`);
    },
    { key: 'name' },
  );
  WelcomeMessage.ask(
    'And what is your email address?',
    async (Email, _WelcomeMessage, bot) => {
      await bot.say(`Ok, saving ${Email}`);
    },
    { key: 'email' },
  );
  WelcomeMessage.addGotoDialog('MainMenu');
  WelcomeMessage.addAction('complete');
  controller.addDialog(WelcomeMessage);

  // Display main menu - will loop until a valid choice is chosen
  const MainMenu = new BotkitConversation('MainMenu', controller);
  MainMenu.ask(
    'Welcome to the main menu!\n\n 1. Account Breach Detection\n 2. Network Enumeration\n 3. Network Vulnerability Scan\n4. View Archived Reports\n\nPlease enter a number:',
    [
      {
        pattern: '1',
        type: 'string',
        handler: async (_MenuOption, _MainMenu, bot) => {
          await bot.say('Go to Account Breach');
        },
      },
      {
        pattern: '2',
        type: 'string',
        handler: async (_MenuOption, _MainMenu, bot) => {
          await bot.beginDialog('NetScanConvo');
        },
      },
      {
        // Vulnerability Scanner
        pattern: '3',
        type: 'string',
        handler: async (_MenuOption, _MainMenu, bot) => {
          await bot.beginDialog('VulnScanConvo');
        },
      },
      {
        pattern: '4',
        type: 'string',
        handler: async (_MenuOption, _MainMenu, bot) => {
          await bot.say('View Archived Reports');
        },
      },
      {
        default: true,
        handler: async (_MenuOption, FailedValidation, bot) => {
          await bot.say('Please enter a number between 1 and 4');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'MenuOption' },
  );
  controller.addDialog(MainMenu);

  // Display greeting when 'hi' is heard
  controller.hears(
    ['hi', 'hello', 'hey', 'howdy', 'start', 'restart'],
    'message',
    async (bot, message) => {
      await bot.beginDialog('WelcomeMessage', message);
    },
  );

  // Display main menu, when 'menu' is heard
  controller.hears(['menu', 'options', 'option'], 'message', async (bot, message) => {
    await bot.beginDialog('MainMenu', message);
  });
}
