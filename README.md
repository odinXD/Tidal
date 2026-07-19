# Tidal

Tidal은 고밀도 한국 주식 시장 데이터 모니터링을 위한 금융 터미널 애플리케이션입니다.
터미널 레이아웃을 차용하여 단일 화면에서 시장의 핵심 데이터를 직관적으로 조망할 수 있도록 설계되었습니다.

## Features

- **실시간 시장 데이터**: 국내 주식 및 지수 시세, 캔들 차트 (네이버 금융 연동)
- **증권사 리포트 및 공시**: DART OpenAPI 및 증권사 리서치 스크래핑
- **AI 리서치 어시스턴트**: Gemini API를 활용한 리포트 요약 및 챗봇 기능
- **커스텀 레이아웃**: 자유롭게 크기 조절이 가능한 패널 인터페이스

## Getting Started

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 프론트엔드 개발 서버 실행
npm run dev

# 3. 백엔드 프록시 서버 실행 (별도 터미널 창)
cd proxy-server && npm start
```

## Environment Variables

루트 경로에 `.env` 파일을 생성하여 API 키를 입력하거나, 웹 브라우저 접속 후 '설정' 페이지에서 직접 입력할 수 있습니다.

```env
VITE_DART_API_KEY=your_dart_api_key
VITE_ECOS_API_KEY=your_ecos_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Deployment (Vercel)

이 프로젝트는 Vercel 배포 환경에 최적화되어 있습니다.

1. 저장소를 Fork하거나 본인의 계정으로 Push합니다.
2. Vercel에서 해당 저장소를 Import 합니다. (Framework Preset: `Vite`)
3. 코드가 배포되면 `api/` 폴더 내의 라우팅이 Vercel Serverless Functions로 자동 구성되어 프록시 서버 역할을 수행합니다.
