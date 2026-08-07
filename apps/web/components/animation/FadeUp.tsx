'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type FadeUpProps = HTMLMotionProps<'div'>;

export function FadeUp({ children, transition, ...props }: FadeUpProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        ...transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
