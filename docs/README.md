# Tidal (한국 주식 시장 금융 터미널)

한국 주식 투자자를 위한 고밀도 금융 터미널 및 대화형 AI 리서치 에이전트 프로젝트입니다. Bloomberg 터미널의 고밀도 레이아웃과 감성을 차용하여, 마우스 스크롤 없이 한 화면에서 모든 분석을 마칠 수 있도록 설계되었습니다.

## 핵심 특징
* **고밀도 패널 레이아웃**: 드래그로 패널 너비를 자유롭게 조절 (`react-resizable-panels`)
* **실시간(혹은 근실시간) 시세**: 네이버 금융 API 연동을 통한 주식/차트 데이터 시각화
* **전문가용 차트**: TradingView의 `lightweight-charts`를 사용한 빠르고 부드러운 캔들스틱 렌더링
* **매크로 경제 보드**: 한국은행 ECOS 및 Frankfurter API를 활용한 금리, 환율 모니터링
* **DART 공시 연동**: DART OpenAPI를 통한 기업 공시 및 재무제표 원문 조회
* **AI 리서치 에이전트**: Gemini API를 연동하여 시황 분석, 뉴스 감성 분석, 종목 딥다이브 수행

## 시작하기

### 1. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 발급받은 API 키를 입력합니다.
```env
VITE_PROXY_URL=http://localhost:3001
VITE_DART_API_KEY=발급받은키
VITE_ECOS_API_KEY=발급받은키
VITE_GEMINI_API_KEY=발급받은키
```
*(참고: API 키는 앱 내 '설정' 페이지에서도 입력/저장할 수 있습니다.)*

### 2. 의존성 설치 및 실행
프론트엔드와 프록시 서버(CORS 우회용)를 각각 실행해야 합니다.

**터미널 1 (프록시 서버):**
```bash
cd proxy-server
npm install
npm start
# http://localhost:3001 에서 실행됨
```

**터미널 2 (프론트엔드 웹앱):**
```bash
npm install
npm run dev
# http://localhost:5173 에서 실행됨
```

### 3. 접속
브라우저에서 `http://localhost:5173` 에 접속합니다.
데스크탑 환경(최소 가로 해상도 1280px)에 최적화되어 있습니다.

## 주요 문서
- [데이터 소스 안내 (DATA_SOURCES.md)](./DATA_SOURCES.md)
- [API 키 발급 가이드 (API_KEYS.md)](./API_KEYS.md)
- [배포 가이드 (DEPLOYMENT.md)](./DEPLOYMENT.md)
