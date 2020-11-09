import { Botkit, BotkitConversation } from 'botkit';

export default function VulnScanner(controller: Botkit) {
  /**
   * Controls conversation for the vulnerability scanner. Use vuln to start it!
   * @returns nothing (all conversation displayed to user)
   */

  // Convosation to store main menu
  const VulnScanConvo = new BotkitConversation('VulnScanConvo', controller);
  VulnScanConvo.ask(
    'Welcome to the Vulnerability Scanner!\n\n 1. Quick Scan\n 2. Normal Scan\n 3. In-depth Scan\n4. Custom Scan\n\nPlease enter a number:',
    [
      {
        // Quick Scan
        pattern: '1',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          await bot.say('You selected Quick Scan');
        },
      },
      {
        // Normal Scan
        pattern: '2',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected Normal Scan');
        },
      },
      {
        // In-depth scan
        pattern: '3',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected In-depth Scan');
        },
      },
      {
        // Custom Scan
        pattern: '4',
        type: 'string',
        handler: async (_ScanType, _VulnMenu, bot) => {
          await bot.say('You selected In-depth Scan');
          await bot.beginDialog('VulnCustom');
        },
      },
      {
        default: true,
        handler: async (_VulnMenu, FailedValidation, bot) => {
          await bot.say('Please enter a number between 1 and 4');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'VulnScanType' },
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
    'Are you sure you wish to proceed? [Y/N]',
    [
      {
        pattern: 'Y',
        type: 'string',
        handler: async (_Proceed, _VulnIPSelect, bot) => {
          await bot.say('Starting Scan!');
        },
      },
      {
        pattern: 'N',
        type: 'string',
        handler: async (_VulnIPSelect, _Typo, bot) => {
          await bot.beginDialog('VulnIPSelect');
        },
      },
      {
        default: true,
        handler: async (_VulnIPSelect, FailedValidation, bot) => {
          await bot.say('Please enter Y or N');
          return FailedValidation.repeat();
        },
      },
    ],
    { key: 'TargetIP' },
  );

  VulnIPSelect.say('Results:');
  VulnIPSelect.say('High Severity: 23');
  VulnIPSelect.say('Medium Severity: 45');
  VulnIPSelect.say('Low Severity: 87');
  VulnIPSelect.ask(
    'Would you like to save the report? [Y/N]',
    [
      {
        pattern: 'Y',
        type: 'string',
        handler: async (_SaveReport, _VulnIPSelect, bot) => {
          await bot.say('Report Saved! Returning you to the main menu.');
          await bot.say('Head to the Archived Report Section to view more detailed scan results!');
        },
      },
      {
        pattern: 'N',
        type: 'string',
        handler: async (_SaveReport, _VulnIPSelect, bot) => {
          await bot.say('Returning you to the main menu');
        },
      },
      {
        default: true,
        handler: async (_VulnIPSelect, FailedValidation, bot) => {
          await bot.say('Please enter Y or N');
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
