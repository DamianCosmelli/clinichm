declare module 'apexcharts' {
  export interface ApexOptions {
    chart?: {
      height?: number;
      type?: string;
      zoom?: {
        enabled?: boolean;
      };
    };
    dataLabels?: {
      enabled?: boolean;
    };
    stroke?: {
      curve?: string;
    };
    title?: {
      text?: string;
      align?: string;
    };
    grid?: {
      row?: {
        colors?: string[];
        opacity?: number;
      };
    };
    xaxis?: {
      categories?: string[];
    };
  }

  export type ApexAxisChartSeries = Array<{
    name: string;
    data: number[];
  }>;

  export type ApexNonAxisChartSeries = number[];

  export default class ApexCharts {
    constructor(el: HTMLElement, options: ApexOptions);
    render(): Promise<void>;
    updateOptions(options: ApexOptions, redrawPaths?: boolean, animate?: boolean): Promise<void>;
    updateSeries(
      newSeries: ApexAxisChartSeries | ApexNonAxisChartSeries,
      animate?: boolean
    ): Promise<void>;
    destroy(): void;
  }
}
