import { Botkit, BotkitConversation } from 'botkit';

export default function archive(controller: Botkit) {
  /**
   * Controls conversation for the report section. Use vuln to start it!
   * @returns nothing (all conversation displayed to user)
   */
  const ArchiveMenu = new BotkitConversation('ArchiveMenu', controller);
  ArchiveMenu.ask(
    'Welcome to the Report Menu!\n\nPlease select which reports you would like to view.\n\n 1. Account Breach Reports\n 2. Network Enumeration Reports \n 3. Network Vulnerability Reports\n 4. Return to Main Menu\n\nPlease enter the number for the reports to view:',
    [
      {
        pattern: '1',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
            await bot.beginDialog('AccountReport');
        },
      },
      {
        pattern: '2',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
            await bot.beginDialog('ScanReport');
        },
      },
      {
        pattern: '3',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
            await bot.beginDialog('VulnReport');
        },
      },
      {
        pattern: '4',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
            await bot.beginDialog('MainMenu');
        },
      },
      {
        default: true,
        handler: async (_ArchiveMenuOption, FailedValidation, bot) => {
          await bot.say('Please enter a number between 1 and 3 to show reports');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'ArchiveMenuOption' },
    )
    controller.addDialog(ArchiveMenu);

    const AccountReport = new BotkitConversation('AccountReport', controller);
    AccountReport.ask(
        'Please select which reports you would like to view.\n\n 1. 2020-10-11 At 10:23 By Luke Wallis\n 2. Go Back \n\nPlease enter an option:',
        [
          {
            pattern: '1',
            type: 'string',
            handler: async (_AccountReportOption, _AccountReport, bot) => {
              await bot.say('Please visit https://duckduckgroup.github.io/reports/AccountBreach.pdf to view the report');
            },
          },
          {
            pattern: '2',
            type: 'string',
            handler: async (_AccountReportOption, _AccountReport, bot) => {
                await bot.beginDialog('ArchiveMenu');
            },
          },
          {
            default: true,
            handler: async (_AccountReportOption, FailedValidation, bot) => {
              await bot.say('Please enter a number between 1 and 2 to show reports');
              return FailedValidation.repeat();
            },
          },
        ],
        { key: 'AccountReportOption' },
    )
    AccountReport.addGotoDialog('ArchiveMenu');
    controller.addDialog(AccountReport);

    const ScanReport = new BotkitConversation('ScanReport', controller);
    ScanReport.ask(
        'Please select which reports you would like to view.\n\n 1. Full 2020-10-11 At 14:34 By Luke Wallis\n 2. Basic 2020-10-11 At 14:02 By Luke Wallis\n 3. Go Back \n\nPlease enter an option:',
        [
          {
            pattern: '1',
            type: 'string',
            handler: async (_ScanReportOption, _ScanReport, bot) => {
              await bot.say('Please visit https://duckduckgroup.github.io/reports/EnumerationAdvanced.pdf to view the report');
            },
          },
          {
            pattern: '2',
            type: 'string',
            handler: async (_ScanReportOption, _ScanReport, bot) => {
                await bot.say('Please visit https://duckduckgroup.github.io/reports/EnumerationBasic.pdf to view the report');
            },
          },
          {
            pattern: '3',
            type: 'string',
            handler: async (_ScanReportOption, _ScanReport, bot) => {
                await bot.beginDialog('ArchiveMenu');
            },
          },
          {
            default: true,
            handler: async (_ScanReportOption, FailedValidation, bot) => {
              await bot.say('Please enter a number between 1 and 3 to show reports');
              return FailedValidation.repeat();
            },
          },
        ],
        { key: 'ScanReportOption' },
    )
    ScanReport.addGotoDialog('ArchiveMenu');
    controller.addDialog(ScanReport);

    const VulnReport = new BotkitConversation('VulnReport', controller);
    VulnReport.ask(
        'Please select which reports you would like to view.\n\n 1. 2020-10-11 At 10:23 By Luke Wallis\n 2. Go Back \n\nPlease enter an option:',
        [
          {
            pattern: '1',
            type: 'string',
            handler: async (_VulnReportOption, _VulnReport, bot) => {
              await bot.say('Please visit https://duckduckgroup.github.io/reports/Vulnerability.pdf to view the report');
            },
          },
          {
            pattern: '2',
            type: 'string',
            handler: async (_VulnReportOption, _VulnReport, bot) => {
                await bot.beginDialog('ArchiveMenu');
            },
          },
          {
            default: true,
            handler: async (_VulnReportOption, FailedValidation, bot) => {
              await bot.say('Please enter a number between 1 and 2 to show reports');
              return FailedValidation.repeat();
            },
          },
        ],
        { key: 'VulnReportOption' },
    )
    VulnReport.addGotoDialog('ArchiveMenu');
    controller.addDialog(VulnReport);

    controller.hears(['archive','report','view','old','past'], 'message', async (bot, message) => {
        await bot.beginDialog('ArchiveMenu', message);
    });
}