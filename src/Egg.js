import React, { useState, useEffect } from "react";
import EggCanvas from "./EggCanvas";

const Egg = ({ start }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setTick(tick + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    setTick(0);
    return () => {};
  }, [start, tick]);

  if (start) return <EggCanvas tick={tick} />;
  return null;
};
export default Egg;
