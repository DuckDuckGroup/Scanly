import { Botkit, BotkitConversation } from 'botkit';

export default function NetScanFunction(controller: Botkit) {
  const ScanRange = new BotkitConversation('ScanRangeConvo', controller);
  ScanRange.ask(
    {
      text: ['Please Choose an IP Range Below:'],
      quick_replies: [
        {
          content_type: 'text',
          title: '10.0.0.0/8',
          payload: '8range',
        },
        {
          content_type: 'text',
          title: '172.16.0.0/16',
          payload: '16range',
        },
        {
          content_type: 'text',
          title: '192.168.1.0/24',
          payload: '24range',
        },
        // {
        //   content_type: 'text',
        //   title: 'Custom',
        //   payload: 'cusrange',
        // },
      ],
    },
    [
      {
        pattern: '8range',
        type: 'string',
        handler: async () => {},
      },
      {
        pattern: '16range',
        type: 'string',
        handler: async () => {},
      },
      {
        pattern: '24range',
        type: 'string',
        handler: async () => {},
      },
      // {
      //   pattern: 'cusrange',
      //   type: 'string',
      //   handler: async () => {},
      // },
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
  controller.addDialog(ScanRange);

  const PostScan = new BotkitConversation('PostScanConvo', controller);
  PostScan.ask(
    {
      text: ['Scan Complete. What would you like to do?'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Save Result',
          payload: 'save',
        },
        {
          content_type: 'text',
          title: 'Scan Again',
          payload: 'rescan',
        },
        {
          content_type: 'text',
          title: 'Analyse',
          payload: 'analyse',
        },
        {
          content_type: 'text',
          title: 'Main Menu',
          payload: 'mmenu',
        },
      ],
    },
    [
      {
        pattern: 'save',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.say('Scan Saved! Returning you to the main menu.');
          await bot.say('Head to the Archived Report Section to view more detailed scan results!');
          await bot.beginDialog('MainMenu');
        },
      },
      {
        pattern: 'rescan',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.beginDialog('NetScanConvo');
        },
      },
      {
        pattern: 'analyse',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.say(
            'Port analysis:\n\n .\n\n 21 | TCP:\n\n FTP version found: vsftpd 2.3.4\n\n Anonymous FTP login enabled \n\n .\n\n 80 | TCP:\n\n Webserver found: Apache httpd 2.2.8 (Ubuntu)\n\n HTTP Page title: TEST SITE \n\n .\n\n 2222 | TCP:\n\n SSH Service found: OpenSSH 4.7 (Debian Ubuntu)\n\n SSH hostkey:\n\n 1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)\n\n 2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)',
          );
          await bot.beginDialog('MainMenu');
        },
      },
      {
        pattern: 'mmenu',
        type: 'string',
        handler: async (_1, _2, bot) => {
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
  controller.addDialog(PostScan);

  const PingScan = new BotkitConversation('PingScanConvo', controller);
  PingScan.say('You selected the ping scan');
  PingScan.addChildDialog('ScanRangeConvo', 'range');
  PingScan.say('Scan Started');
  PingScan.say('Machines found: \n\n |IP Address | \n\n |-----------| \n\n | 10.0.0.24 |');
  PingScan.addGotoDialog('PostScanConvo');
  controller.addDialog(PingScan);
  const GenScan = new BotkitConversation('GenScanConvo', controller);
  GenScan.say('You selected the general scan');
  GenScan.addChildDialog('ScanRangeConvo', 'range');
  GenScan.say('Scan Started');
  GenScan.say(
    'Machines found: \n\n |IP Address | \n\n |-----------| \n\n | 10.0.0.24 | \n\n |Port|Prtcl|Type| \n\n |----|-----|----| \n\n | 21 | TCP |FTP | \n\n | 80 | TCP |HTTP| \n\n |2222| TCP |SSH |',
  );
  GenScan.addGotoDialog('PostScanConvo');
  controller.addDialog(GenScan);
  const CompScan = new BotkitConversation('CompScanConvo', controller);
  CompScan.say('You selected the comprehensive scan');
  CompScan.addChildDialog('ScanRangeConvo', 'range');
  CompScan.say('Scan Started');
  CompScan.say(
    'Machines found: \n\n |IP Address | \n\n |-----------| \n\n | 10.0.0.24 | \n\n |Port|Prtcl|Type|Version--------------------| \n\n |----|-----|----|---------------------------| \n\n | 21 | TCP |FTP |vsftpd 2.3.4---------------| \n\n | 80 | TCP |HTTP|Apache httpd 2.2.8 (Ubuntu)| \n\n |2222| TCP |SSH |OpenSSH 4.7 (Debian Ubuntu)| \n\n Operating system: Ubuntu (89%), Debian (74%), Other linux (45%), BSD/Unix (13%)',
  );
  CompScan.addGotoDialog('PostScanConvo');
  controller.addDialog(CompScan);
  // const CusScan = new BotkitConversation('CusScanConvo', controller);
  // CusScan.say('');
  // controller.addDialog(CusScan);

  const NetScan = new BotkitConversation('NetScanConvo', controller);
  NetScan.ask(
    {
      text: ['This is the enumeration module \n\n Please Choose a Scan Below:'],
      quick_replies: [
        {
          content_type: 'text',
          title: 'Ping Scan',
          payload: 'pingScan',
        },
        {
          content_type: 'text',
          title: 'General Scan',
          payload: 'genScan',
        },
        {
          content_type: 'text',
          title: 'Comprehensive Scan',
          payload: 'compScan',
        },
        // {
        //   content_type: 'text',
        //   title: 'Custom Scan',
        //   payload: 'custScan',
        // },
      ],
    },
    [
      {
        pattern: 'pingScan',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.beginDialog('PingScanConvo');
        },
      },
      {
        pattern: 'genScan',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.beginDialog('GenScanConvo');
        },
      },
      {
        pattern: 'compScan',
        type: 'string',
        handler: async (_1, _2, bot) => {
          await bot.beginDialog('CompScanConvo');
        },
      },
      // {
      //   pattern: 'custScan',
      //   type: 'string',
      //   handler: async (_1, _2, bot) => {
      //     await bot.beginDialog('CusScanConvo');
      //   },
      // },
      {
        default: true,
        handler: async (_1, FailedValidation, bot) => {
          await bot.say('Please select one of the presented options');
          return FailedValidation.repeat();
        },
      },
    ],
    null,
  );
  controller.addDialog(NetScan);

  controller.hears(['netscan'], 'message', async (bot, message) => {
    await bot.beginDialog('NetScanConvo', message);
  });
}
