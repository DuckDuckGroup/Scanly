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
    {
      text: ['Welcome to the Main Menu!\n\nPlease select an option:'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Account Breach',
          payload: 'AccountBreach',
        },
        {
          content_type: 'text',
          title: 'Network Enumeration',
          payload: 'NetworkScan',
        },
        {
          content_type: 'text',
          title: 'Network Vulnerability',
          payload: 'Vulnerability',
        },
        {
          content_type: 'text',
          title: 'View Reports',
          payload: 'Reports',
        },
      ],
    },
    [
      {
        pattern: 'AccountBreach',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('AccBreachConvo');
        },
      },
      {
        pattern: 'NetworkScan',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('NetScanConvo');
        },
      },
      {
        pattern: 'Vulnerability',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('VulnScanConvo');
        },
      },
      {
        pattern: 'Reports',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('ArchiveMenu');
        },
      },
      {
        default: true,
        handler: async (_, FailedValidation, bot) => {
          await bot.say('Please select one of the presented options');
          return FailedValidation.repeat();
        },
      },
    ],
    null,
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
