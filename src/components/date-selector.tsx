'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface DateSelectorProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  isEndDate?: boolean;
  onPresentToggle?: (isPresent: boolean) => void;
  isPresent?: boolean;
  placeholder?: string;
}

export function DateSelector({
  value,
  onChange,
  className,
  isEndDate = false,
  onPresentToggle,
  isPresent = false,
  placeholder = "Select date"
}: DateSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 text-xs justify-start text-gray-600 hover:text-gray-900",
            !value && !isPresent && "text-gray-400",
            className
          )}
        >
          <CalendarDays className="mr-2 h-3.5 w-3.5" />
          {isPresent ? "Present" : value ? format(value, 'MMM yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-2" align="start">
        <div className="space-y-4">
          {/* Month Grid */}
          <div className="grid grid-cols-4 gap-1">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={value?.getMonth() === index ? 'default' : 'ghost'}
                className="h-7 text-xs"
                onClick={() => {
                  const newDate = value ? new Date(value) : new Date();
                  newDate.setMonth(index);
                  newDate.setDate(1);
                  onChange(newDate);
                }}
              >
                {month}
              </Button>
            ))}
          </div>
          
          {/* Year List */}
          <div className="grid grid-cols-4 gap-1 max-h-[200px] overflow-y-auto">
            {years.map(year => (
              <Button
                key={year}
                variant={value?.getFullYear() === year ? 'default' : 'ghost'}
                className="h-7 text-xs"
                onClick={() => {
                  const newDate = value ? new Date(value) : new Date();
                  newDate.setFullYear(year);
                  onChange(newDate);
                }}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* Present Option for End Date */}
          {isEndDate && onPresentToggle && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Checkbox
                id="present"
                checked={isPresent}
                onCheckedChange={(checked) => {
                  onPresentToggle(checked as boolean);
                  if (checked) {
                    onChange(null);
                  }
                }}
              />
              <label
                htmlFor="present"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Present
              </label>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 