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

const ADMIN_CHAT_IDS = [
  869376046,
  7209700362
];

const bot =
  new TelegramBot(token, {
    polling: true
  });

/*
  ROOM MAP
*/

const roomMap = {

  7280312795: 'Cloud',

  6703949145: 'Cosmo',

  8229757918: 'Heaven',

  8742764395: 'Hell',

  7240023275: 'Jungle',

  8274834580: 'Play',

  7163344610: 'Study',

  8774392985: 'admin test'

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

  id: Date.now(),

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

  if (!text) {
    return 0;
  }

  const lines =
    text
      .replace(/\r/g, '')
      .split('\n');

  for (
    const line of lines
  ) {

    const clean =
      line.trim();

    const isTotalLine =

      /total|тотал|итого|всього|загалом|сумма/i
        .test(clean);

    if (
      isTotalLine
    ) {

      const number =
        clean.match(/\d+/);

      if (
        number
      ) {

        return Number(
          number[0]
        );

      }

    }

  }

  return 0;

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

    for (const adminId of ADMIN_CHAT_IDS) {

  await bot.sendMessage(

    adminId,

    `📊 ${room}\n\n${text}`

  );

}

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
  DYNAMIC REMINDERS
*/

function getReminderTimes() {

  try {

    const remindersPath =
      path.join(
        __dirname,
        'reminders.json'
      );

    if (
      !fs.existsSync(
        remindersPath
      )
    ) {

      const defaults = [

        '14:45',
        '17:45',
        '20:45',
        '06:45'

      ];

      fs.writeFileSync(

        remindersPath,

        JSON.stringify(
          defaults,
          null,
          2
        )

      );

      return defaults;

    }

    return JSON.parse(

      fs.readFileSync(
        remindersPath,
        'utf8'
      )

    );

  } catch (err) {

    console.log(err);

    return [];

  }

}

/*
  CHECK REMINDERS
*/

let lastReminderMinute =
  null;

cron.schedule(

  '* * * * *',

  async () => {

    try {

      const reminders =
        getReminderTimes();

      const now =
        new Date();

      const current =
        `${String(
          now.getHours()
        ).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;

      if (
        lastReminderMinute ===
        current
      ) {

        return;

      }

      if (
        reminders.includes(
          current
        )
      ) {

        lastReminderMinute =
          current;

        console.log(
          'Dynamic reminder:',
          current
        );

        await remindAll();

      }

    } catch (err) {

      console.log(
        'Reminder error:',
        err
      );

    }

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


function deleteNotification(
  id
) {

  const index =
    notifications.findIndex(
      (n) => n.id === id
    );

  if (index !== -1) {

    notifications.splice(
      index,
      1
    );

  }

}


module.exports = {

  statistics,

  notifications,

  archive,

  remindAll,

  clearRoomStatistics,

clearArchive,
  
  archiveStatistics,

deleteNotification,

};