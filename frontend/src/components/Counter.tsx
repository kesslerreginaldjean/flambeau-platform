import { useEffect, useState, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface CounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}

const Counter = ({ from = 0, to, duration = 2, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: duration,
        onUpdate: (value) => setCount(Math.round(value)),
        ease: "easeOut",
      });
      return () => controls.stop();
    }
    return () => {};
  }, [isInView, from, to, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

export default Counter;
