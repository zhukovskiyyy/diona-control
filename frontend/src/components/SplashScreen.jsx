import {
  motion
} from 'framer-motion';

function SplashScreen() {
  return (
    <motion.div
      className="splash-screen"
      initial={{
        opacity: 1
      }}
      animate={{
        opacity: 1
      }}
    >
      <motion.div
        className="splash-logo"
        initial={{
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: 0.6
        }}
      >
        Diona
      </motion.div>

      <motion.div
        className="splash-subtitle"
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 0.4
        }}
      >
        Инициализация модулей 
        инфраструктуры...
      </motion.div>

      <motion.div
        className="loading-bar"
        initial={{
          width: 0
        }}
        animate={{
          width: 260
        }}
        transition={{
          duration: 2
        }}
      />
    </motion.div>
  );
}

export default SplashScreen;