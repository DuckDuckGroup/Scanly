import { Botkit, BotkitConversation } from 'botkit';

export default function welcome(controller: Botkit) {
    //Welcome shows greeting, legal & collects user info
    const welcomeMessage = new BotkitConversation('welcomeMessage', controller);
    welcomeMessage.say("Hi I'm Scanly and I am here to simplify your security")
    welcomeMessage.say('Does this work?');
    welcomeMessage.say('By continuing to use Scanley, you consent to our terms of use. These can be found on our website: https://duckduckgroup.github.io/');
    welcomeMessage.ask('What is your full name?', async(response, welcomeMessage, bot) => {
        await bot.say('Thanks ' + response);
    }, {key: 'name'});
    welcomeMessage.ask('What is your email address?', async(response, welcomeMessage, bot) => {
        await bot.say('Ok, saving ' + response);
    }, {key: 'email'});
    welcomeMessage.addGotoDialog('mainMenu')
    welcomeMessage.addAction('complete')
    controller.addDialog(welcomeMessage);

    //Display main menu - will loop until a valid choice is chosen
    const mainMenu = new BotkitConversation('mainMenu', controller);
    mainMenu.ask('Welcome to the main menu!\n\n 1. Account Breach Dectection\n 2. Network Enummeration\n 3. Network Vulnerability Scan\n4. View Archived Reports\n\nPlease enter a number:', [
        {
            pattern: '1',
            type: 'string',
            handler: async(response_text, mainMenu, bot) => {
                //Change to new conversation (waiting to be built)
                //return await mainMenu.gotoThread('yes_taco');
                await bot.say('Go to Account Breach')
            }
        },
        {
            pattern: '2',
            type: 'string',
            handler: async(response_text, mainMenu, bot) => {
                //return await mainMenu.gotoThread('no_taco');
                await bot.say('Go to Network Enumeration')
            }
         },
         {
             default: true,
             handler: async(mainMenu, failedValidation, bot) => {
                 await bot.say('Please enter a number between 1 and 4');
                 return await failedValidation.repeat();
             }
         }
       ], {key: 'menuOption'});
    controller.addDialog(mainMenu)

    controller.hears(['hi','hello','hey','howdy','start','restart'],'message', async (bot, message) => {
        await bot.beginDialog('welcomeMessage',message);
    });

    //Can write menu at anytime to view it
    controller.hears(['menu','options'],'message', async (bot, message) => {
        await bot.beginDialog('mainMenu', message);
    })
}