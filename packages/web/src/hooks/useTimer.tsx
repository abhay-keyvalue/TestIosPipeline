import {useEffect, useState} from 'react';

export const useTimer = (
  isForward: boolean,
  timeOffset: number | string
): {elapsedTime: number; remainingTime: number} => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const dueTime = new Date(timeOffset).getTime() + 48 * 60 * 60 * 1000; // 48 hours from the startTime

  const [remainingTime, setRemainingTime] = useState(dueTime - Date.now());

  useEffect(() => {
    if (isForward) {
      // Convert the startTime to a Date object if it's not already
      const startDate = new Date(timeOffset)?.getTime();

      const updateTimer = () => {
        const now = new Date()?.getTime();
        const diffInMs = now - startDate;

        setElapsedTime(diffInMs);
      };

      // Update the timer every second
      const timerId = setInterval(updateTimer, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(timerId);
    } else {
      const updateTimer = () => {
        const now = new Date()?.getTime();
        const timeLeft = dueTime - now;

        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(timerId); // Stop the timer when time is up

          setRemainingTime(0); // Ensure it shows zero when time is up
        }
      };

      // Update the timer every second
      const timerId = setInterval(updateTimer, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(timerId);
    }
  }, []);

  return {elapsedTime, remainingTime};
};
