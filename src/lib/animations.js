export const SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const EASE_OUT = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

export const STAGGER = (i) => ({
  delay: i * 0.04,
});

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: EASE_OUT,
};

export const slideIn = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  transition: EASE_OUT,
};

export const slideInRight = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  transition: EASE_OUT,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: EASE_OUT,
};

export const buttonPress = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.1 },
};

export const cardHover = {
  whileHover: { scale: 1.01 },
  transition: SPRING,
};
