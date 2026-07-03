declare module 'react-apexcharts' {
  import { Component } from 'react';
  import { ApexOptions } from 'apexcharts';

  interface Props {
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'radar' | 'rangeBar';
    width?: string | number;
    height?: string | number;
  }

  export default class ReactApexChart extends Component<Props> {}
}
