import { useState, useEffect, useRef } from 'react';

/**
 * 값이 변경될 때마다 애니메이션 클래스를 반환하는 훅
 * @param value 추적할 값 (가격 등)
 * @returns [cssClass, currentValue]
 */
export function usePriceTick(value: number | string | undefined): string {
  const [tickClass, setTickClass] = useState<string>('');
  const prevValueRef = useRef<number | string | undefined>(value);

  useEffect(() => {
    if (value === undefined || prevValueRef.current === undefined) {
      prevValueRef.current = value;
      return;
    }

    const currentNum = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    const prevNum = typeof prevValueRef.current === 'string' 
      ? parseFloat(prevValueRef.current.replace(/,/g, '')) 
      : prevValueRef.current;

    if (currentNum > prevNum) {
      setTickClass('flash-up');
      setTimeout(() => setTickClass(''), 1000);
    } else if (currentNum < prevNum) {
      setTickClass('flash-down');
      setTimeout(() => setTickClass(''), 1000);
    }

    prevValueRef.current = value;
  }, [value]);

  return tickClass;
}
