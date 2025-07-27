
interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isActive,
  startTimer,
  pauseTimer,
  resumeTimer,
}) => {
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="text-xl font-bold">{formatTime()}</div>
      <div className="flex space-x-2">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start
          </button>
        ) : (
          <>
            <button
              onClick={pauseTimer}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Pause
            </button>
            <button
              onClick={resumeTimer}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
};
