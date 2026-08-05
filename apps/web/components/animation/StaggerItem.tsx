'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

type StaggerItemProps = HTMLMotionProps<'div'>;

export function StaggerItem({ children, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
