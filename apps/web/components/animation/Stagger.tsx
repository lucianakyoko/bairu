'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type StaggerProps = HTMLMotionProps<'div'>;

export function Stagger({ children, ...props }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
