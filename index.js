const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option')
const sequelize = require('./db')
const UserModel = require('./models')


const toket = '5871752665:AAEwtQWq57PHr5a9Cz1nxge95DZx5nRKbVg'

const bot = new TelegramApi(toket, {polling: true})
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Давай поиграем в игру, угадай число от 0 до 9`);
    const rundomNumber = Math.floor(Math.random() * 10);            
    chats[chatId] = rundomNumber;
    await bot.sendMessage(chatId, `Отгадай`, gameOptions);
}

const start = async () => {
    
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
      } catch (error) {
        console.error('Unable to conzzznect to the databasee:', error);
      }

    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Игра угадай цифру'}
    ]);
    

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        
        try {
            if (text === '/start'){
                const UserSession = UserModel.build({chatId})
             
                bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/8.webp');
                return bot.sendMessage(chatId, `Добро пожаловать в Игру`);
            }
            
            if (text === '/info'){
                const user = await UserModel.findOne({chatId});
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}, в игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            
            return bot.sendMessage(chatId, `Я тебя не понимаю`);    
        } 
        catch (e) {
            console.log(e);
            return bot.sendMessage(chatId, 'Error!!!')
        }

        
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();
    });
    
    }
    
    start();