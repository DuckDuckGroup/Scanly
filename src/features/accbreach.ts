import { Botkit, BotkitConversation } from 'botkit';

export default function AccBreachScanner(controller: Botkit) {
  /**
   * Controls conversation for the Account Breach Scanner. Use accbreach to start it!
   * @returns nothing (all conversation displayed to user)
   */

  // Conversation to store main menu
  const AccBreachConvo = new BotkitConversation('AccBreachConvo', controller);
  AccBreachConvo.ask(
    'Welcome to the Account Breach Scanner!\n\n 1. Individual\n2. Credential File\n\nPlease enter a number:',
    [
      {
        // Individual Scan
        pattern: '1',
        type: 'string',
        handler: async (_ScanType, _AccBreachMenu, bot) => {
          await bot.say('You selected Individual Scan');
        },
      },
      {
        // Credential File Scan
        pattern: '2',
        type: 'string',
        handler: async (_ScanType, _AccBreachMenu, bot) => {
          await bot.say('You selected Credential File Scan');
        },
      },
      {
        default: true,
        handler: async (_AccBreachMenu, FailedValidation, bot) => {
          await bot.say('Please enter a number; 1 or 2');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'AccBreachScanType' },
  );
  AccBreachConvo.addGotoDialog('CredSelect');
  AccBreachConvo.addAction('complete');
  controller.addDialog(AccBreachConvo);

  // Conversation to run scan of the input credentials
  const CredSelect = new BotkitConversation('CredSelect', controller);
  CredSelect.ask(
    'Enter Credentials to Scan (e.g. test@example.com)',
    async (Target, _CredSelect, bot) => {
      await bot.say(`Target to scan: ${Target}`);
    },
    { key: 'TargetCred' },
  );

  // Output for Credential Scan Demo
  CredSelect.say('Results: \nCredentials were found in 2 Breaches');
  CredSelect.say('Adobe: \n - IDs\n - Passwords\n - Payment Information');
  CredSelect.say('MySpace: \n - Passwords\n - Usernames');

  // Conversation to establish a Report
  CredSelect.ask(
    'Would you like to save the report? [Y/N]',
    [
      {
        pattern: 'Y',
        type: 'string',
        handler: async (_SaveReport, _AccBreachSelect, bot) => {
          await bot.say('Report Saved! Returning you to the main menu.\nHead to the Archived Report Section to view more detailed scan results!');
        },
      },
      {
        pattern: 'N',
        type: 'string',
        handler: async (_SaveReport, _AccBreachSelect, bot) => {
          await bot.say('Returning you to the main menu');
        },
      },
      {
        default: true,
        handler: async (_AccBreachSelect, FailedValidation, bot) => {
          await bot.say('Please enter Y or N');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'menuOption' },
  );
  CredSelect.addGotoDialog('MainMenu');

  // Keyword 'breach', can be used at anytime to start code
  controller.addDialog(CredSelect);
  controller.hears('breach', 'message', async (bot, message) => {
    await bot.beginDialog('AccBreachConvo', message);
  });
}
