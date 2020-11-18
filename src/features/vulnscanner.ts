import { Botkit, BotkitConversation } from 'botkit';

export default function VulnScanner(controller: Botkit) {
  /**
   * Controls conversation for the vulnerability scanner. Use vuln to start it!
   * @returns nothing (all conversation displayed to user)
   */

  // Convosation to store main menu
  const VulnScanConvo = new BotkitConversation('VulnScanConvo', controller);
  VulnScanConvo.ask(
    {
      text: ['Welcome to the Vulnerability Scanner!\n\nPlease select an option:'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Quick Scan',
          payload: 'quick',
        },
        {
          content_type: 'text',
          title: 'Normal Scan',
          payload: 'normal',
        },
        {
          content_type: 'text',
          title: 'In-depth Scan',
          payload: 'idepth',
        },
        {
          content_type: 'text',
          title: 'Custom Scan',
          payload: 'custom',
        },
      ],
    },
    [
      {
        pattern: 'quick',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          await bot.say('You selected Quick Scan');
        },
      },
      {
        pattern: 'normal',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected Normal Scan');
        },
      },
      {
        pattern: 'idepth',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected In-depth Scan');
          await bot.beginDialog('VulnCustom');
        },
      },
      {
        pattern: 'custom',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected Custom Scan');
          await bot.beginDialog('VulnCustom');
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
  VulnScanConvo.addGotoDialog('VulnIPSelect');
  VulnScanConvo.addAction('complete');
  controller.addDialog(VulnScanConvo);

  // Conversation to allow custom flags
  const VulnCustom = new BotkitConversation('VulnCustom', controller);
  VulnCustom.ask(
    'Enter custom flags',
    async (_VulnFlags, _VulnCustom, bot) => {
      await bot.beginDialog('VulnIPSelect');
    },
    { key: 'Customflags' },
  );
  VulnCustom.addAction('complete');
  controller.addDialog(VulnCustom);

  // Conversation to grab IP & run scan
  const VulnIPSelect = new BotkitConversation('VulnIPSelect', controller);
  VulnIPSelect.ask(
    'Enter IP or IP Range (for example 192.168.0.1-10)',
    async (Target, _VulnIPSelect, bot) => {
      await bot.say(`Target to scan: ${Target}`);
    },
    { key: 'TargetIP' },
  );
  VulnIPSelect.ask(
    {
      text: ['Are you sure you wish to proceed?'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Yes',
          payload: 'continue_yes',
        },
        {
          content_type: 'text',
          title: 'No',
          payload: 'continue_no',
        },
      ],
    },
    [
      {
        pattern: 'continue_yes',
        type: 'string',
        handler: async (_Proceed, _VulnIPSelect, bot) => {
          await bot.say('Starting Scan!');
        },
      },
      {
        pattern: 'continue_no',
        type: 'string',
        handler: async (_VulnIPSelect, _Typo, bot) => {
          await bot.beginDialog('VulnIPSelect');
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
    { key: 'TargetIP' },
  );
  VulnIPSelect.say('Results:\n\nHigh Severity - 23\n\nMedium Severity - 45\n\nLow Severity - 87');
  VulnIPSelect.ask(
    {
      text: ['Would you like to save the report?'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Yes',
          payload: 'save_yes',
        },
        {
          content_type: 'text',
          title: 'No',
          payload: 'save_no',
        },
      ],
    },
    [
      {
        pattern: 'save_yes',
        type: 'string',
        handler: async (_SaveReport, _VulnIPSelect, bot) => {
          await bot.say('Report Saved! Returning you to the main menu.');
          await bot.say('Head to the Archived Report Section to view more detailed scan results!');
        },
      },
      {
        pattern: 'save_no',
        type: 'string',
        handler: async (_SaveReport, _VulnIPSelect, bot) => {
          await bot.say('Returning you to the main menu');
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
    { key: 'menuOption' },
  );
  VulnIPSelect.addGotoDialog('MainMenu');

  // Keyword 'vuln', can be used at anytime to start code
  controller.addDialog(VulnIPSelect);
  controller.hears('vuln', 'message', async (bot, message) => {
    await bot.beginDialog('VulnScanConvo', message);
  });
}
