import { Botkit, BotkitConversation } from 'botkit';

export default function AccBreachScanner(controller: Botkit) {
  /**
   * Controls conversation for the Account Breach Scanner. Use accbreach to start it!
   * @returns nothing (all conversation displayed to user)
   */

  // Conversation to store main menu
  const AccBreachConvo = new BotkitConversation('AccBreachConvo', controller);
  AccBreachConvo.ask(
    'Welcome to the Account Breach Scanner!\n\n 1. Individual\n 2. Credential File\n\n Please enter a number:',
    [
      {
        // Individual Scan
        pattern: '1',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
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

  // Conversation to allow custom flags
  const VulnCustom = new BotkitConversation('VulnCustom', controller);
  VulnCustom.ask(
    'Enter custom flags',
    async (_VulnFlags, _VulnCustom, bot) => {
      await bot.beginDialog('CredSelect');
    },
    { key: 'Customflags' },
  );
  VulnCustom.addAction('complete');
  controller.addDialog(VulnCustom);

  // Conversation to grab IP & run scan
  const CredSelect = new BotkitConversation('CredSelect', controller);
  CredSelect.ask(
    'Enter Credentials to Scan (for example email.example@test.com)',
    async (Target, _CredSelect, bot) => {
      await bot.say(`Target to scan: ${Target}`);
    },
    { key: 'TargetCred' },
  );
  CredSelect.ask(
    'Are you sure you wish to proceed? [Y/N]',
    [
      {
        pattern: 'Y',
        type: 'string',
        handler: async (_Proceed, _CredSelect, bot) => {
          await bot.say('Starting Scan!');
        },
      },
      {
        pattern: 'N',
        type: 'string',
        handler: async (_CredSelect, _Typo, bot) => {
          await bot.beginDialog('CredSelect');
        },
      },
      {
        default: true,
        handler: async (_CredSelect, FailedValidation, bot) => {
          await bot.say('Please enter Y or N');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'TargetCred' },
  );

  CredSelect.say('Results:');
  CredSelect.say('Credentials were found in 2 Breaches: ');
  CredSelect.say('Adobe: IDs, Passwords, Payment Information');
  CredSelect.say('MySpace: E-mails, Passwords, Usernames');
  CredSelect.ask(
    'Would you like to save the report? [Y/N]',
    [
      {
        pattern: 'Y',
        type: 'string',
        handler: async (_SaveReport, _CredSelect, bot) => {
          await bot.say('Report Saved! Returning you to the main menu.');
          await bot.say('Head to the Archived Report Section to view more detailed scan results!');
        },
      },
      {
        pattern: 'N',
        type: 'string',
        handler: async (_SaveReport, _CredSelect, bot) => {
          await bot.say('Returning you to the main menu');
        },
      },
      {
        default: true,
        handler: async (_CredSelect, FailedValidation, bot) => {
          await bot.say('Please enter Y or N');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'menuOption' },
  );
  CredSelect.addGotoDialog('MainMenu');

  // Keyword 'accbreach', can be used at anytime to start code
  controller.addDialog(CredSelect);
  controller.hears('accbreach', 'message', async (bot, message) => {
    await bot.beginDialog('AccBreachConvo', message);
  });
}
