import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface TimerDurationSelectorProps {
  onDurationSelect: (minutes: number) => void;
  disabled?: boolean;
}

export const TimerDurationSelector = ({ onDurationSelect, disabled = false }: TimerDurationSelectorProps) => {
  const [customMinutes, setCustomMinutes] = useState(25);
  
  const presetDurations = [15, 25, 30, 45, 60];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presetDurations.map((minutes) => (
          <Button
            key={minutes}
            onClick={() => onDurationSelect(minutes)}
            variant="outline"
            size="sm"
            disabled={disabled}
            className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
          >
            {minutes}m
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="custom-duration" className="text-sm text-gray-300">
          Custom:
        </Label>
        <Input
          id="custom-duration"
          type="number"
          min="1"
          max="120"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 25)}
          className="w-20 bg-gray-800 border-gray-600 text-white"
          disabled={disabled}
        />
        <span className="text-sm text-gray-300">minutes</span>
        <Button
          onClick={() => onDurationSelect(customMinutes)}
          variant="outline"
          size="sm"
          disabled={disabled}
          className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
        >
          Start
        </Button>
      </div>
    </div>
  );
};