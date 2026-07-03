declare module 'react-date-range' {
  import * as React from 'react';

  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface RangeKeyDict {
    [key: string]: Range;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (ranges: RangeKeyDict) => void;
    editableDateInputs?: boolean;
    moveRangeOnFirstSelection?: boolean;
    locale?: object | undefined;
  }

  export class DateRange extends React.Component<DateRangeProps> {}
}
