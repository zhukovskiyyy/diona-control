const fs =
  require('fs');

const cron =
  require('node-cron');

const path =
  require('path');

const TelegramBot =
  require(
    'node-telegram-bot-api'
  );

const token =
  '8754615229:AAH1T55b_pUfpi4c96nk_vA1McYyK82ae5I';

const ADMIN_CHAT_ID =
  869376046;

const bot =
  new TelegramBot(token, {
    polling: true
  });

/*
  ROOM MAP
*/

const roomMap = {

  8774392985: 'Cloud',

  6703949145: 'Cosmo',

  8229757918: 'Heaven',

  8742764395: 'Hell',

  7240023275: 'Jungle',

  8274834580: 'Play',

  7163344610: 'Study'

};

/*
  ACTIVE STATISTICS
*/

const statistics = {};

/*
  NOTIFICATIONS
*/

const notifications = [];

/*
  ARCHIVE
*/

const archivePath =
  path.join(
    __dirname,
    'statistics-archive.json'
  );

let archive = [];

if (
  fs.existsSync(
    archivePath
  )
) {

  archive =
    JSON.parse(
      fs.readFileSync(
        archivePath,
        'utf8'
      )
    );

}

/*
  BOT STARTED
*/

console.log(
  'Diona Statistics Bot Started'
);

/*
  SAVE ARCHIVE
*/

function saveArchive() {

  fs.writeFileSync(

    archivePath,

    JSON.stringify(
      archive,
      null,
      2
    )

  );
}

/*
  FORMAT TEXT
*/

function normalizeText(
  text
) {

  return text
    .replace(/\r/g, '')
    .trim();

}

/*
  CREATE NOTIFICATION
*/

function createNotification({

  title,

  message,

  type = 'success'

}) {

  notifications.unshift({

    title,

    message,

    type,

    time:
      new Date()
        .toLocaleTimeString()

  });

  /*
    KEEP LAST 20
  */

  if (
    notifications.length > 20
  ) {

    notifications.pop();

  }

}

/*
  EXTRACT TOTAL
*/

function extractTotal(
  text
) {

  const match =
    text.match(

      /(total|Total|TOTAL|тотал|Тотал|ТОТАЛ|итого|Итого|ИТОГО|всього|Всього|ВСЬОГО|загалом|Загалом|ЗАГАЛОМ|сумма|Сумма|СУММА)\s*:?\s*(\d+)/i

    );

  return match
    ? Number(match[2])
    : 0;

}

/*
  MESSAGE HANDLER
*/

bot.on(

  'message',

  async (msg) => {

    const rawText =
      msg.text || '';

    const userId =
      msg.from.id;

    /*
      START MESSAGE
    */

    if (
      rawText === '/start'
    ) {

      await bot.sendMessage(

        msg.chat.id,

`🌌 Diona Statistics System

Добро пожаловать.

📊 Отправьте статистику одним сообщением.

Пример:

Luna — 1200tk
Kate — 900tk

total:2100

━━━━━━━━━━━━━━

✅ После отправки:
• статистика сохранится
• попадёт админу
• автоматически удалится

🚀 Система готова к работе.`,

        {

          reply_markup: {

            keyboard: [

              [
                {
                  text:
                    '📊 Подать статистику'
                }
              ]

            ],

            resize_keyboard: true

          }

        }

      );

      return;

    }

    /*
      STAT BUTTON
    */

    if (
      rawText ===
      '📊 Подать статистику'
    ) {

      await bot.sendMessage(

        msg.chat.id,

`📊 Отправьте статистику одним сообщением.

Пример:

Luna — 1200tk
Kate — 900tk

total:2100`

      );

      return;

    }

    /*
      IGNORE COMMANDS
    */

    if (
      rawText.startsWith('/')
    ) {

      return;

    }

    /*
      IGNORE SHORT
    */

    if (
      rawText.length < 3
    ) {

      return;

    }

    /*
      IGNORE UNKNOWN USERS
    */

    if (
      !roomMap[userId]
    ) {

      console.log(
        'Unknown user:',
        userId
      );

      return;

    }

    /*
      CLEAN TEXT
    */

    const text =
      normalizeText(
        rawText
      );

    const room =
      roomMap[userId];

    /*
      CREATE ROOM
    */

    if (
      !statistics[room]
    ) {

      statistics[room] = [];

    }

    /*
      STAT OBJECT
    */

    const stat = {

      text,

      time:
        new Date()
          .toLocaleTimeString(),

      date:
        new Date()
          .toLocaleDateString()

    };

    /*
      SAVE ACTIVE
    */

    statistics[room].push(
      stat
    );

    /*
      EXTRACT TOTAL
    */

    const total =
      extractTotal(
        text
      );

    /*
      NOTIFICATION
    */

    createNotification({

      title:
        `${room} submitted statistics`,

      message:
        `Total: ${total} tk`,

      type: 'success'

    });

    /*
      SEND TO ADMIN
    */

    await bot.sendMessage(

      ADMIN_CHAT_ID,

      `📊 ${room}\n\n${text}`

    );

    /*
      DELETE USER MESSAGE
    */

    try {

      await bot.deleteMessage(

        msg.chat.id,

        msg.message_id

      );

    } catch (err) {

      console.log(
        'Delete error'
      );

    }

    /*
      SUCCESS MESSAGE
    */

    const success =
      await bot.sendMessage(

        msg.chat.id,

        `✅ Статистика принята\nКомната: ${room}`

      );

    /*
      AUTO DELETE SUCCESS
    */

    setTimeout(

      async () => {

        try {

          await bot.deleteMessage(

            msg.chat.id,

            success.message_id

          );

        } catch {}

      },

      3000

    );

  }

);

/*
  REMIND ALL
*/

async function remindAll() {

  const ids =
    Object.keys(
      roomMap
    );

  for (
    const id of ids
  ) {

    try {

      await bot.sendMessage(

        id,

`📊 Diona Reminder

Пожалуйста отправьте статистику смены.

━━━━━━━━━━━━━━

✅ Одним сообщением
✅ Полная статистика
✅ Без скриншотов`

      );

      console.log(
        'Reminder sent:',
        id
      );

    } catch (err) {

      console.log(
        'Reminder error:',
        err.message
      );

    }

  }

  /*
    NOTIFICATION
  */

  createNotification({

    title:
      'Reminder sent',

    message:
      'Statistics reminder delivered',

    type: 'warning'

  });

}

/*
  CLEAR ROOM
*/

function clearRoomStatistics(
  room
) {

  statistics[room] = [];

  createNotification({

    title:
      `${room} cleared`,

    message:
      'Statistics deleted',

    type: 'danger'

  });

}

/*
  ARCHIVE SHIFT
*/

function archiveStatistics() {

  const entry = {

    createdAt:
      new Date()
        .toLocaleString(),

    statistics:
      JSON.parse(
        JSON.stringify(
          statistics
        )
      )

  };

  archive.push(
    entry
  );

  /*
    KEEP LAST 7
  */

  if (
    archive.length > 7
  ) {

    archive.shift();

  }

  saveArchive();

  /*
    CLEAR ACTIVE
  */

  for (
    const room in statistics
  ) {

    statistics[room] = [];

  }

  createNotification({

    title:
      'Shift archived',

    message:
      'Statistics saved successfully',

    type: 'success'

  });

}

/*
  AUTO REMINDERS
*/

cron.schedule(

  '50 14 * * *',

  async () => {

    console.log(
      'Auto reminder 14:50'
    );

    await remindAll();

  }

);

cron.schedule(

  '50 17 * * *',

  async () => {

    console.log(
      'Auto reminder 17:50'
    );

    await remindAll();

  }

);

cron.schedule(

  '50 20 * * *',

  async () => {

    console.log(
      'Auto reminder 20:50'
    );

    await remindAll();

  }

);

cron.schedule(

  '50 6 * * *',

  async () => {

    console.log(
      'Auto reminder 06:50'
    );

    await remindAll();

  }

);

/*
  EXPORTS
*/

/*
  CLEAR ARCHIVE
*/

function clearArchive() {

  archive.length = 0;

  saveArchive();

  createNotification({

    title:
      'Archive cleared',

    message:
      'All archive deleted',

    type: 'danger'

  });

}


module.exports = {

  statistics,

  notifications,

  archive,

  remindAll,

  clearRoomStatistics,

clearArchive,
  
  archiveStatistics

};