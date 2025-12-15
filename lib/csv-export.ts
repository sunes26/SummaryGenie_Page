// lib/csv-export.ts
/**
 * CSV 내보내기 유틸리티
 */

/**
 * 데이터를 CSV 형식으로 변환
 * @param data - 객체 배열
 * @param headers - 헤더 매핑 { key: 'Display Name' }
 * @returns CSV 문자열
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: Record<keyof T, string>
): string {
  if (data.length === 0) {
    return '';
  }

  // 헤더 행
  const headerKeys = Object.keys(headers) as Array<keyof T>;
  const headerRow = headerKeys.map(key => headers[key]).join(',');

  // 데이터 행
  const dataRows = data.map(row => {
    return headerKeys
      .map(key => {
        const value = row[key];

        // null, undefined 처리
        if (value === null || value === undefined) {
          return '';
        }

        // 문자열 처리 (쉼표, 따옴표 이스케이프)
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * CSV 파일 다운로드
 * @param csv - CSV 문자열
 * @param filename - 파일명 (확장자 제외)
 */
export function downloadCSV(csv: string, filename: string): void {
  // BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 메모리 정리
  URL.revokeObjectURL(url);
}

/**
 * 데이터를 CSV로 내보내기 (올인원)
 * @param data - 객체 배열
 * @param headers - 헤더 매핑
 * @param filename - 파일명
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: Record<keyof T, string>,
  filename: string
): void {
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, filename);
}

/**
 * 날짜를 CSV용 문자열로 포맷
 * @param date - Date 또는 ISO 문자열
 * @returns 포맷된 날짜 문자열
 */
export function formatDateForCSV(date: Date | string | null): string {
  if (!date) return '';

  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * 숫자를 CSV용 문자열로 포맷
 * @param num - 숫자
 * @param decimals - 소수점 자리수
 * @returns 포맷된 숫자 문자열
 */
export function formatNumberForCSV(num: number | null | undefined, decimals = 0): string {
  if (num === null || num === undefined) return '';
  return num.toFixed(decimals);
}

/**
 * 가격을 CSV용 문자열로 포맷
 * @param amount - 금액
 * @param currency - 통화
 * @returns 포맷된 가격 문자열
 */
export function formatPriceForCSV(amount: number, currency: string = 'KRW'): string {
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
