"use client";

import { setRemainingTime } from '@/store/assessmentSlice';
import { RootState } from '@/store/store';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface TimerProps {
  initialDuration: number; 
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialDuration, onTimeUp }) => {
  const dispatch = useDispatch();
  const { remainingTime } = useSelector((state: RootState) => state.assessment);
  const [time, setTime] = useState(remainingTime ?? initialDuration);

  const memoizedOnTimeUp = useCallback(onTimeUp, [onTimeUp]);

  useEffect(() => {
    if (remainingTime !== null && remainingTime !== undefined) {
      setTime(remainingTime);
    }
  }, [remainingTime]);

  useEffect(() => {
    if (time === null || time === undefined) return;

    if (time <= 0) {
      memoizedOnTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = Math.max(0, prev - 1);
        
        setTimeout(() => {
          dispatch(setRemainingTime(newTime));
        }, 0);
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, memoizedOnTimeUp, dispatch]); 

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="font-mono text-2xl font-bold p-2 bg-gray-100 rounded-lg shadow-inner">
      {formatTime(time)}
    </div>
  );
};