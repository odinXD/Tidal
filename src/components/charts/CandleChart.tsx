import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import type { ChartData } from '../../services/naverFinance';

interface CandleChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
}

export default function CandleChart({ data, width, height = 400 }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 생성 및 스타일 설정 (다크 테마)
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#111827' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: width || chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
    });

    chartRef.current = chart;

    // 캔들 시리즈 추가 (한국식: 상승 빨강, 하락 파랑)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#3b82f6',
      borderVisible: false,
      wickUpColor: '#ef4444',
      wickDownColor: '#3b82f6',
    });

    seriesRef.current = candlestickSeries;

    // 데이터 매핑 및 세팅
    if (data && data.length > 0) {
      const formattedData = data.map(item => ({
        // lightweight-charts는 time 속성을 요구함. yyyy-mm-dd 형식
        time: item.date.length === 8 
          ? `${item.date.slice(0,4)}-${item.date.slice(4,6)}-${item.date.slice(6,8)}`
          : item.date, 
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      // 데이터를 시간순으로 정렬 (필수)
      formattedData.sort((a, b) => (a.time > b.time ? 1 : -1));
      candlestickSeries.setData(formattedData);
      chart.timeScale().fitContent();
    }

    // 리사이즈 핸들러
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    // ResizeObserver for panel resizes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, width, height]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
}
