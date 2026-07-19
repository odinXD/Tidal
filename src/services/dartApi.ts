import axios from 'axios';

// 실제 사용 시에는 환경변수나 설정에서 가져옵니다.
// localStorage를 통한 사용자 설정에서 가져오는 로직은 Zustand Store 등에서 주입받는 것이 좋습니다.
// 여기서는 기본 환경변수를 fallback으로 사용합니다.
const getDartApiKey = () => localStorage.getItem('DART_API_KEY') || import.meta.env.VITE_DART_API_KEY;

const API_BASE = 'https://opendart.fss.or.kr/api';

export const dartApi = {
  // 1. 공시 검색
  getDisclosureList: async (corpCode: string = '', bgnDe: string, endDe: string) => {
    const key = getDartApiKey();
    if (!key) throw new Error('DART API Key is missing');

    try {
      const response = await axios.get(`${API_BASE}/list.json`, {
        params: {
          crtfc_key: key,
          corp_code: corpCode,
          bgn_de: bgnDe,
          end_de: endDe,
          page_no: 1,
          page_count: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch DART disclosure list', error);
      throw error;
    }
  },

  // 2. 단일회사 주요 재무제표
  getFinancialStatement: async (corpCode: string, bsnsYear: string, reprtCode: string = '11011') => {
    const key = getDartApiKey();
    if (!key) throw new Error('DART API Key is missing');

    try {
      const response = await axios.get(`${API_BASE}/fnlttSinglAcnt.json`, {
        params: {
          crtfc_key: key,
          corp_code: corpCode,
          bsns_year: bsnsYear,
          reprt_code: reprtCode // 11011(사업보고서), 11012(반기), 11013(1분기), 11014(3분기)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch DART financial statement', error);
      throw error;
    }
  }
};
