import { Botkit, BotkitConversation } from 'botkit';

export default function archiveNew(controller: Botkit) {
  /**
   * Controls conversation for the report section. Use vuln to start it!
   * @returns nothing (all conversation displayed to user)
   */
  const ArchiveMenu = new BotkitConversation('ArchiveMenu', controller);
  ArchiveMenu.ask(
    {
      text: ['Welcome to the Report Menu!\n\nPlease select which reports you would like to view:'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Account Breach Reports',
          payload: 'AccountBreach',
        },
        {
          content_type: 'text',
          title: 'Network Enumeration Reports',
          payload: 'NetworkScan',
        },
        {
          content_type: 'text',
          title: 'Network Vulnerability Reports',
          payload: 'Vuln',
        },
        {
          content_type: 'text',
          title: 'Return to Main Menu',
          payload: 'menu',
        },
      ],
    },
    [
      {
        pattern: 'AccountBreach',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('AccountReport');
        },
      },
      {
        pattern: 'NetworkScan',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('ScanReport');
        },
      },
      {
        pattern: 'Vuln',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('VulnReport');
        },
      },
      {
        pattern: 'menu',
        type: 'string',
        handler: async (_ArchiveMenuOption, _ArchiveMenu, bot) => {
          await bot.beginDialog('MainMenu');
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
  controller.addDialog(ArchiveMenu);

  const AccountReport = new BotkitConversation('AccountReport', controller);
  AccountReport.ask(
    {
      text: ['Please select which reports you would like to view:'],
      quick_replies: [
        {
          content_type: 'text',
          title: '2020-10-11 At 10:23 By Luke Wallis',
          payload: 'DemoReport',
        },
        {
          content_type: 'text',
          title: 'Go Back',
          payload: 'ReportMenu',
        },
      ],
    },
    [
      {
        pattern: 'DemoReport',
        type: 'string',
        handler: async (_AccountReportOption, _AccountReport, bot) => {
          await bot.say(
            'Please visit https://duckduckgroup.github.io/reports/AccountBreach.pdf to view the report',
          );
        },
      },
      {
        pattern: 'ReportMenu',
        type: 'string',
        handler: async (_AccountReportOption, _AccountReport, bot) => {
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
  AccountReport.addGotoDialog('ArchiveMenu');
  controller.addDialog(AccountReport);

  const ScanReport = new BotkitConversation('ScanReport', controller);
  ScanReport.ask(
    {
      text: ['Please select which reports you would like to view:'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Full 2020-10-11 At 14:34 By Luke Wallis',
          payload: 'DemoReportAdvanced',
        },
        {
          content_type: 'text',
          title: 'Basic 2020-10-11 At 14:02 By Luke Wallis',
          payload: 'DemoReportBasic',
        },
        {
          content_type: 'text',
          title: 'Go Back',
          payload: 'ReportMenu',
        },
      ],
    },
    [
      {
        pattern: 'DemoReportAdvanced',
        type: 'string',
        handler: async (_ScanReportOption, _ScanReport, bot) => {
          await bot.say(
            'Please visit https://duckduckgroup.github.io/reports/EnumerationAdvanced.pdf to view the report',
          );
        },
      },
      {
        pattern: 'DemoReportBasic',
        type: 'string',
        handler: async (_ScanReportOption, _ScanReport, bot) => {
          await bot.say(
            'Please visit https://duckduckgroup.github.io/reports/EnumerationBasic.pdf to view the report',
          );
        },
      },
      {
        pattern: 'ReportMenu',
        type: 'string',
        handler: async (_ScanReportOption, _ScanReport, bot) => {
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
  ScanReport.addGotoDialog('ArchiveMenu');
  controller.addDialog(ScanReport);

  const VulnReport = new BotkitConversation('VulnReport', controller);
  VulnReport.ask(
    {
      text: ['Please select which reports you would like to view:'],
      quick_replies: [
        {
          content_type: 'text',
          title: '2020-10-11 At 10:23 By Luke Wallis',
          payload: 'DemoReport',
        },
        {
          content_type: 'text',
          title: 'Go Back',
          payload: 'ReportMenu',
        },
      ],
    },
    [
      {
        pattern: 'DemoReport',
        type: 'string',
        handler: async (_VulnReportOption, _VulnReport, bot) => {
          await bot.say(
            'Please visit https://duckduckgroup.github.io/reports/Vulnerability.pdf to view the report',
          );
        },
      },
      {
        pattern: 'ReportMenu',
        type: 'string',
        handler: async (_VulnReportOption, _VulnReport, bot) => {
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
  VulnReport.addGotoDialog('ArchiveMenu');
  controller.addDialog(VulnReport);

  controller.hears(
    ['archive', 'report', 'view', 'old', 'past'],
    'message',
    async (bot, message) => {
      await bot.beginDialog('ArchiveMenu', message);
    },
  );
}
