import { useMemo } from 'react';
import styles from './OrderBook.module.css';

interface OrderBookProps {
  currentPrice?: string;
}

export default function OrderBook({ currentPrice }: OrderBookProps) {
  const priceNum = currentPrice ? parseInt(currentPrice.replace(/,/g, '')) : 0;
  
  // 가격 단위(호가단위) 결정 (코스피 기준 간소화)
  const getTickSize = (p: number) => {
    if (p < 2000) return 1;
    if (p < 5000) return 5;
    if (p < 20000) return 10;
    if (p < 50000) return 50;
    if (p < 200000) return 100;
    if (p < 500000) return 500;
    return 1000;
  };

  const tickSize = getTickSize(priceNum);

  // 현재가 기반 가상 호가 데이터 생성
  const { asks, bids } = useMemo(() => {
    if (priceNum === 0) return { asks: [], bids: [] };
    
    const askArr = [];
    const bidArr = [];
    
    // 매도 10호가 (높은 가격부터)
    for (let i = 10; i >= 1; i--) {
      askArr.push({
        price: priceNum + (tickSize * i),
        volume: Math.floor(Math.random() * 50000) + 1000
      });
    }
    
    // 매수 10호가 (낮은 가격부터)
    for (let i = 1; i <= 10; i++) {
      bidArr.push({
        price: priceNum - (tickSize * i),
        volume: Math.floor(Math.random() * 50000) + 1000
      });
    }
    
    return { asks: askArr, bids: bidArr };
  }, [priceNum, tickSize]);

  if (priceNum === 0) {
    return <div style={{ padding: 12, color: 'var(--text-muted)' }}>호가 정보가 없습니다.</div>;
  }

  const maxVolume = Math.max(
    ...asks.map(a => a.volume),
    ...bids.map(b => b.volume)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.volCol}>매도잔량</div>
        <div className={styles.priceCol}>호가</div>
        <div className={styles.volCol}>매수잔량</div>
      </div>
      
      <div className={styles.book}>
        {/* 매도호가 영역 */}
        {asks.map((ask, i) => (
          <div key={`ask-${i}`} className={styles.row}>
            <div className={styles.volCol} style={{ position: 'relative' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>{ask.volume.toLocaleString()}</span>
              <div 
                className={styles.barAsk} 
                style={{ width: `${(ask.volume / maxVolume) * 100}%` }} 
              />
            </div>
            <div className={`${styles.priceCol} ${styles.askPrice}`}>
              {ask.price.toLocaleString()}
            </div>
            <div className={styles.volCol}></div>
          </div>
        ))}
        
        {/* 매수호가 영역 */}
        {bids.map((bid, i) => (
          <div key={`bid-${i}`} className={styles.row}>
            <div className={styles.volCol}></div>
            <div className={`${styles.priceCol} ${styles.bidPrice}`}>
              {bid.price.toLocaleString()}
            </div>
            <div className={styles.volCol} style={{ position: 'relative' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>{bid.volume.toLocaleString()}</span>
              <div 
                className={styles.barBid} 
                style={{ width: `${(bid.volume / maxVolume) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
