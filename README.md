<div align="center">
  <h1>🌊 Tidal</h1>
  <p><strong>블룸버그 터미널 감성의 고밀도 한국 주식/금융 대시보드</strong></p>
  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
</div>

<br />

## 📖 소개 (Introduction)

**Tidal**은 한국 주식 투자자들을 위해 설계된 **오픈소스 기반 금융 터미널 및 대화형 AI 리서치 도구**입니다.
기존 포털 금융 사이트들의 분산된 정보와 느린 화면 전환에서 벗어나, Bloomberg 터미널처럼 **마우스 스크롤 없이 한 화면에서 시장의 모든 핵심 정보를 조망**할 수 있도록 고밀도(High-density) 패널 레이아웃으로 제작되었습니다.

네이버 금융, 한국은행 ECOS, 금융감독원 DART 등의 무료 API를 통합하고, Gemini AI를 연결하여 증권사 리포트 요약 및 투자 어시스턴트 기능을 제공합니다.

---

## ✨ 주요 기능 (Key Features)

- **📈 고밀도 레이아웃 & 테마**: `react-resizable-panels`를 활용하여 사용자가 자유롭게 패널 크기를 조절할 수 있습니다.
- **📊 실시간 차트 및 시세**: `lightweight-charts`를 사용한 빠르고 부드러운 캔들 차트(일/주/월봉 지원) 제공.
- **📰 AI 기반 리서치 & 뉴스**: 네이버 증권 리포트를 스크래핑하여 Gemini AI가 핵심만 3줄로 요약해 주는 기능.
- **🏦 매크로 & 공시 데이터**: 한국은행 ECOS 금리 데이터 및 DART OpenAPI를 통한 실시간 기업 공시 연동.
- **☁️ 클라우드 호환(Serverless Ready)**: 브라우저 CORS 제약을 우회하기 위한 백엔드 로직이 Vercel Serverless Functions(`api/`)로 내장되어 있어 **원클릭 배포**가 가능합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React 18, TypeScript, Vite, React Router DOM, Zustand
- **Backend / Proxy**: Node.js, Vercel Serverless Functions (`@vercel/node`), Axios, Cheerio
- **UI & Visualization**: CSS Modules, Lightweight Charts (TradingView)
- **AI Integration**: Google Gemini API (`@google/genai`)

---

## 🚀 시작하기 (Getting Started)

### 1. 로컬 환경에서 실행하기

Node.js (v18 이상 권장) 환경이 필요합니다.

```bash
# 1. 패키지 설치
npm install

# 2. 로컬 개발 서버 + 프록시 서버 동시 실행
# (터미널 2개를 띄워서 각각 실행하거나, Vercel CLI가 있다면 vercel dev를 사용하세요)
npm run dev
# 다른 터미널 창에서 프록시 실행 (CORS 우회용)
cd proxy-server && npm start
```

### 2. 환경 변수 (API 키 설정)

루트 디렉토리에 `.env` 파일을 생성하거나, 앱 접속 후 **'설정' 탭에서 브라우저 내부 스토리지에 직접 저장**할 수 있습니다.

```env
# DART OpenAPI 인증키 (공시 데이터 조회)
VITE_DART_API_KEY=your_dart_key_here

# ECOS 인증키 (한국은행 거시경제 데이터)
VITE_ECOS_API_KEY=your_ecos_key_here

# Gemini API 키 (AI 리포트 요약 및 챗봇)
VITE_GEMINI_API_KEY=your_gemini_key_here
```

*(참고: 설정 페이지에서 입력한 API 키는 본인의 브라우저 로컬 스토리지에만 안전하게 저장되며, 외부 서버로 전송되지 않습니다.)*

---

## 🌐 Vercel 원클릭 배포 가이드

Tidal은 **Vercel** 배포에 완벽하게 최적화되어 있습니다. Vercel 플랫폼 하나만으로 프론트엔드와 CORS 우회 프록시(Serverless Functions)를 동시에 호스팅할 수 있습니다.

1. 이 저장소를 본인의 GitHub에 **Fork** 하거나 **Push** 합니다.
2. [Vercel](https://vercel.com)에 로그인 후 `[Add New Project]`를 선택합니다.
3. 내 GitHub에서 `Tidal` 저장소를 **Import** 합니다.
4. **Framework Preset**이 `Vite`로 잡혀 있는지 확인 후 `Deploy` 버튼을 클릭합니다.
5. 1~2분 뒤 나만의 금융 터미널 배포가 완료됩니다! 🎉

---

## 📚 문서 (Documentation)

데이터 수집 출처 및 저작권 관련 상세 안내는 아래 문서를 참고해 주세요.
* [DATA_SOURCES.md](./docs/DATA_SOURCES.md)

---

## 📄 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자유롭게 활용 및 수정하셔도 좋습니다. 단, API 제공처(네이버, ECOS, DART 등)의 이용 약관을 준수해 주세요.
