
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

const emojis = [
  '💰', '💵', '💳', '🏠', '🚗', '🍔', '🛒', '🎮', '📱', '💻',
  '🎵', '🎬', '👕', '💄', '🏥', '📚', '✈️', '🎁', '🏦', '📊'
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const EmojiPicker = ({ onEmojiSelect, selectedEmoji }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10">
          {selectedEmoji || <Smile className="h-5 w-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="hover:bg-accent p-2 rounded-md transition-colors"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
