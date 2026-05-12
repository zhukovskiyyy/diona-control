import {
  Monitor,
  CircleCheck,
  TriangleAlert,
  DollarSign
} from 'lucide-react';

import {
  motion
} from 'framer-motion';

import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function DashboardCards() {

  const [stats, setStats] =
    useState({});

  /*
    LOAD STATS
  */

  async function loadStats() {

    const result =
      await ipcRenderer.invoke(
        'get-statistics'
      );

    setStats(result);

  }

  useEffect(() => {

    loadStats();

    const interval =
      setInterval(
        loadStats,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /*
    ROOMS
  */

  const totalRooms = 7;

  const submittedRooms =

    Object.keys(stats)
      .filter(

        (room) =>

          stats[room]
            ?.length > 0

      ).length;

  const missingRooms =
    totalRooms -
    submittedRooms;

  /*
    TOTALS
  */

  function extractTotal(
    text
  ) {

    const match =
      text.match(
        /total\s*:?\s*(\d+)/i
      );

    return match
      ? Number(match[1])
      : 0;

  }

  const totalShift =

    Object.values(stats)
      .flat()
      .reduce(

        (sum, msg) =>

          sum +
          extractTotal(
            msg.text
          ),

        0

      );

  /*
    CARDS
  */

  const cards = [

    {
      title:
        'Комнат',

      value:
        totalRooms,

      icon:
        <Monitor size={26} />,

      gradient:
        'linear-gradient(135deg,#ff2fd1,#8f45ff)'
    },

    {
      title:
        'Подали статистику',

      value:
        `${submittedRooms}/${totalRooms}`,

      icon:
        <CircleCheck size={26} />,

      gradient:
        'linear-gradient(135deg,#00ffae,#00c3ff)'
    },

    {
      title:
        'Не подали',

      value:
        missingRooms,

      icon:
        <TriangleAlert size={26} />,

      gradient:
        'linear-gradient(135deg,#ff5f6d,#ffc371)'
    },

    {
      title:
        'Общий total',

      value:
        `${totalShift.toLocaleString()} tk`,

      icon:
        <DollarSign size={26} />,

      gradient:
        'linear-gradient(135deg,#7f5cff,#5f9dff)'
    }

  ];

  return (

    <div className="cards-grid">

      {cards.map(

        (card, index) => (

          <motion.div

            key={card.title}

            className="dashboard-card"

            initial={{
              opacity: 0,
              y: 30
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay:
                index * 0.08
            }}

            whileHover={{
              y: -8,
              scale: 1.02
            }}

            style={{
              background:
                card.gradient
            }}

          >

            <div className="card-glow"></div>

            <div className="card-icon">
              {card.icon}
            </div>

            <div className="card-title">
              {card.title}
            </div>

            <div className="card-value">
              {card.value}
            </div>

          </motion.div>

        )

      )}

    </div>

  );
}

export default DashboardCards;