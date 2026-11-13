import * as echarts from 'echarts';

export interface ChartData {
  labels: string[];
  series: { name: string; values: number[] }[];
}

// 4:3 matches the shape of a dashboard tile.
const WIDTH = 480;
const HEIGHT = 360;

export function barChart({ labels, series }: ChartData): string {
  return renderSvg({
    legend: { bottom: 0 },
    grid: { top: 16, right: 8, bottom: 48, left: 8, containLabel: true },
    xAxis: { type: 'category', data: labels, axisLabel: { fontSize: 14 } },
    yAxis: { type: 'value', minInterval: 1, axisLabel: { fontSize: 14 } },
    series: series.map((s) => ({ type: 'bar', name: s.name, data: s.values })),
  });
}

export function pieChart({ labels, series }: ChartData): string {
  return renderSvg({
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        label: { formatter: '{b}: {c}' },
        data: labels.map((name, i) => ({ name, value: series[0].values[i] })),
      },
    ],
  });
}

/**
 * Renders the chart on the server: ECharts produces an SVG string
 * without needing a browser.
 */
function renderSvg(option: echarts.EChartsOption): string {
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: WIDTH,
    height: HEIGHT,
  });
  chart.setOption({
    animation: false,
    color: ['#5c44e4', '#f637e3'],
    textStyle: { fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 14 },
    ...option,
  });
  const svg = chart.renderToSVGString();
  chart.dispose();
  return svg;
}
