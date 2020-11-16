import { Botkit, BotkitConversation } from 'botkit';

export default function ViewArchivefun(controller: Botkit) {
  /**
   * Hopefully a convisation to show archive of past scans with link to reports
   * @returns nothing (all conversation displayed to user)
   */

  //VeiwArchiveMessage shows feed back for selection
  const VeiwArchiveMessage = new BotkitConversation('VeiwArchiveMessage', controller);
  VeiwArchiveMessage.say (
    "Selected View Archived Reports",
  );

    VeiwArchiveMessage.addGotoDialog('ArchiveMenu');

  controller.addDialog(VeiwArchiveMessage);



  //shows Archive Menu - will loop until a valid choice is chosen
  const ArchiveMenu = new BotkitConversation('ArchiveMenu', controller);
  ArchiveMenu.ask(
    'Please select which reports you would like to view.\n\n 1. Account Breach Reports\n 2. Network Enummeration Reports \n 3. Network Vulnerability Reports\n 4. All Reports\n\nPlease enter the number for the reports to view:',
    [
      {
        pattern: '1',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.say('Account Breach Reports:');
          await bot.say('1. 2020-10-11 At 1023 By Luke Wallis');
        },
      },
      {
        pattern: '2',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.say('Network Enummeration Reports:');
          await bot.say('1. Full 2020-10-11 At 1434 By Luke Wallis\n 2. Basic 2020-10-11 At 1402 By Luke Wallis');
          
        },
      },
      {
        // Vulnerability Scanner
        pattern: '3',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.say('Network Vulnerability Reports:');
          await bot.say('1. 2020-10-11 At 1656 By Luke Wallis');
        },
      },
      {
        pattern: '4',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.say('All reports:');
          await bot.say('1. Account Breach 2020-10-11 At 1023 By Luke Wallis\n');
        },
      },
      {
        default: true,
        handler: async (_ArchiveMenuOption, FailedValidation, bot) => {
          await bot.say('Please enter a number between 1 and 4 to show reports');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'ArchiveMenuOption' },
    )

    controller.addDialog(ArchiveMenu);


  
//shows Archive Menu - will loop until a valid choice is chosen
  const ArchiveMenuEndPoint = new BotkitConversation('ArchiveMenuEndPoint', controller);
  ArchiveMenuEndPoint.ask(
    'Would you like to return to the Archive menu? (yes/no)',
    [
      {
        pattern: 'yes',
        type: 'string',
        handler: async (_ArchiveMenuOptionEnd, _ArchiveMenu, bot) => {
          await bot.say('yes');
          await bot.beginDialog('ArchiveMenu');
        },
      },
      {
        pattern: 'no',
        type: 'string',
        handler: async (_ArchiveMenuOptionEnd, _ArchiveMenu, bot) => {
          await bot.say('no');
          await bot.beginDialog('Menu');
        },
      },
      {
        default: true,
        handler: async (_ArchiveMenuOptionEnd, FailedValidation, bot) => {
          await bot.say('Would you like to return to the Archive menu? Please enter yes or no');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'ArchiveMenuOptionEnd' },
    )

    controller.addDialog(ArchiveMenuEndPoint);

  // Display Archive menu, when 'archive' is heard
  controller.hears(['archive'], 'message', async (bot, message) => {
    await bot.beginDialog('ArchiveMenu', message);
  });
}
