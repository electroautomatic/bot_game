const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./option')
const toket = '5871752665:AAEwtQWq57PHr5a9Cz1nxge95DZx5nRKbVg'

const bot = new TelegramApi(toket, {polling: true})
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Давай поиграем в игру, угадай число от 0 до 9`);
    const rundomNumber = Math.floor(Math.random() * 10);            
    chats[chatId] = rundomNumber;
    await bot.sendMessage(chatId, `Отгадай`, gameOptions);
}

const start = () => {
    
    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Информация'},
        {command: '/game', description: 'Игра угадай цифру'}
    ]);
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start'){
            bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/8.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в Игру`);
        }
        if (text === '/info') 
            return bot.sendMessage(chatId, `Привет ${msg.from.first_name} ${msg.from.last_name}`);
        if (text === '/game') {
            return startGame(chatId);
        }
        
        return bot.sendMessage(chatId, `Я тебя не понимаю`);    
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру ${chats[chatId]} попробуй еще раз`, againOptions);
        }
    });
    
    }
    
    start();