'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type FadeInProps = HTMLMotionProps<'div'>;

export function FadeIn({ children, transition, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        ...transition,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
