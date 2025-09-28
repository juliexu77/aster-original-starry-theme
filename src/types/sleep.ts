export interface SleepDataDay {
  date: string;
  fullDate: Date;
  sleepBlocks: boolean[];
  hasData: boolean;
  startHour: number;
  totalHours: number;
}

export interface AverageDailySummary {
  feeds: number;
  diapers: number;
}

export interface SleepData {
  sleepData: SleepDataDay[];
  averageDailySummary: AverageDailySummary;
  ageInWeeks: number;
}