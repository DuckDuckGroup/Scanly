import { Botkit, BotkitConversation } from 'botkit';

export default function welcome(controller: Botkit) {
  // Welcome shows greeting, legal & collects user info
  const WelcomeMessage = new BotkitConversation('WelcomeMessage', controller);
  WelcomeMessage.say(
    "Hi I'm Scanly and I am here to simplify your security. By continuing to use Scanley, you consent to our terms of use. These can be found on our website: https://duckduckgroup.github.io/",
  );
  WelcomeMessage.ask(
    'For auditing purposes, what is your full name?',
    async (response, _WelcomeMessage, bot) => {
      await bot.say(`Thanks ${response}`);
    },
    { key: 'name' },
  );
  WelcomeMessage.ask(
    'And your email address?',
    async (response, _WelcomeMessage, bot) => {
      await bot.say(`Ok, saving ${response}`);
    },
    { key: 'email' },
  );
  WelcomeMessage.addGotoDialog('MainMenu');
  WelcomeMessage.addAction('complete');
  controller.addDialog(WelcomeMessage);

  // Display main menu - will loop until a valid choice is chosen
  const MainMenu = new BotkitConversation('MainMenu', controller);
  MainMenu.ask(
    'Welcome to the main menu!\n\n 1. Account Breach Dectection\n 2. Network Enummeration\n 3. Network Vulnerability Scan\n4. View Archived Reports\n\nPlease enter a number:',
    [
      {
        pattern: '1',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // Change to new conversation (waiting to be built)
          // return await mainMenu.gotoThread('yes_taco');
          await bot.say('Go to Account Breach');
        },
      },
      {
        pattern: '2',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.say('Go to Network Enumeration');
        },
      },
      {
        pattern: '3',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.beginDialog('VulnScanConvo');
        },
      },
      {
        pattern: '4',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.say('View Archived Reports');
        },
      },
      {
        default: true,
        handler: async (_MainMenu, FailedValidation, bot) => {
          await bot.say('Please enter a number between 1 and 4');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'menuOption' },
  );
  controller.addDialog(MainMenu);

  controller.hears(
    ['hi', 'hello', 'hey', 'howdy', 'start', 'restart'],
    'message',
    async (bot, message) => {
      await bot.beginDialog('WelcomeMessage', message);
    },
  );

  // Can write menu at anytime to view it
  controller.hears(['menu', 'options', 'option'], 'message', async (bot, message) => {
    await bot.beginDialog('MainMenu', message);
  });
}
