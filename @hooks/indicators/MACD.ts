import { useEMA } from "./EMA";

/**
 * 计算平滑异同移动平均线 (MACD)
 * @param source - 源数据
 * @param fastPeriod - 快线周期
 * @param slowPeriod - 慢线周期
 * @param signalPeriod - 信号线周期
 */
export const useMACD = (
  source: Series,
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) => {
  const fastEMA = useEMA(source, fastPeriod);
  const slowEMA = useEMA(source, slowPeriod);
  useEffect(() => {
    fastEMA.tags.display = "none";
    slowEMA.tags.display = "none";
  }, []);
  const DIF = useSeries(
    `MACD.DIF(${source.name}, ${fastPeriod}, ${slowPeriod}, ${signalPeriod})`,
    source,
    { display: "line", chart: "new" }
  );
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    DIF[i] = fastEMA[i] - slowEMA[i];
  });
  const DEA = useEMA(DIF, signalPeriod);
  useEffect(() => {
    DEA.name = `MACD.DEA(${source.name}, ${fastPeriod}, ${slowPeriod}, ${signalPeriod})`;
    DEA.tags.chart = DIF.series_id;
  }, []);
  const MACD = useSeries(
    `MACD.MACD(${source.name}, ${fastPeriod}, ${slowPeriod}, ${signalPeriod})`,
    source,
    {
      display: "hist",
      chart: DIF.series_id,
    }
  );
  useEffect(() => {
    const i = source.length - 1;
    if (i < 0) return;
    MACD[i] = DIF[i] - DEA[i];
  });
  return { DIF, DEA, MACD };
};
