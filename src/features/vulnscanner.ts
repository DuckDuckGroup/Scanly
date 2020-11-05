import { Botkit, BotkitConversation } from 'botkit';

export default function VulnScanner(controller: Botkit) {
  // Welcome shows greeting to the VulnScanner page
  const VulnScanConvo = new BotkitConversation('VulnScanConvo', controller);

  VulnScanConvo.say('Welcome to the Vulnerability Scanner!')
  VulnScanConvo.ask(
    'Welcome to the Vulnerability Scanner!\n\n 1. Quick Scan\n 2. Normal Scan\n 3. In-depth Scan\n4. Custom Scan\n\nPlease enter a number:',
    [
      {
        pattern: '1',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // Change to new conversation (waiting to be built)
          // return await mainMenu.gotoThread('yes_taco');
          await bot.say('You selected Quick Scan')
          await bot.beginDialog('VulnIPSelect');
        },
      },
      {
        pattern: '2',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.say('You selected Normal Scan')
          await bot.beginDialog('VulnIPSelect');
        },
      },
      {
        pattern: '3',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.say('You selected In-depth Scan')
          await bot.beginDialog('VulnIPSelect');
        },
      },
      {
        pattern: '4',
        type: 'string',
        handler: async (_ResponseText, _MainMenu, bot) => {
          // return await mainMenu.gotoThread('no_taco');
          await bot.say('You selected In-depth Scan')
          await bot.beginDialog('VulnCustom');
          // need to fix!!!!!!!!!!!!!
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
   
   VulnScanConvo.addAction('complete')

   const VulnCustom= new BotkitConversation('VulnCustom', controller);
   VulnCustom.ask('Enter custom flags',
   async (response, _VulnCustom, bot) => {
     await bot.beginDialog('VulnIPSelect');
   },
   { key: 'Customflags' },
 );
  controller.addDialog(VulnCustom)

  controller.addDialog(VulnScanConvo)
  const VulnIPSelect = new BotkitConversation('VulnIPSelect', controller);
  VulnIPSelect.ask('Enter IP or IP Range', async(response, _VulnIPSelect, bot)=> {
      await bot.say(`Target to scan: ${response}`)
  },{key:'TargetIP'})

  VulnIPSelect.ask('Are you sure you wish to proceed? {Y/N}', 
  [
    {
      pattern: 'Y',
      type: 'string',
      handler: async (_ResponseText, _VulnIPSelect, bot) => {
        // Change to new conversation (waiting to be built)
        // return await mainMenu.gotoThread('yes_taco');
        await bot.say('Go to Account Breach');
      },
    },
    {
      pattern: 'N',
      type: 'string',
      handler: async (_VulnIPSelect, Typo, bot) => {
        // return await mainMenu.gotoThread('no_taco');
      await bot.beginDialog('VulnIPSelect')
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
VulnIPSelect.say('Scan running...')
VulnIPSelect.say('Results:')
VulnIPSelect.say('High Severity: 23')
VulnIPSelect.say('Medium Severity: 45')
VulnIPSelect.say('Low Severity: 87')

VulnIPSelect.ask('Would you like to save a report? {Y/N}', 
  [
    {
      pattern: 'Y',
      type: 'string',
      handler: async (_ResponseText, _VulnIPSelect, bot) => {
        // Change to new conversation (waiting to be built)
        // return await mainMenu.gotoThread('yes_taco');
        await bot.say('Go to Report Area');
      },
    },
    {
      pattern: 'N',
      type: 'string',
      handler: async (_VulnIPSelect, Typo, bot) => {
        // return await mainMenu.gotoThread('no_taco');
      await bot.say('Returning you to the main menu')
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
VulnIPSelect.addGotoDialog('MainMenu')

  controller.addDialog(VulnIPSelect)
  controller.hears('vuln', 'message', async(bot,message)=> {
      await bot.beginDialog('VulnScanConvo', message)
  })
 }

