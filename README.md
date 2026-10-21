# COWORK.
한국어 HRD·HRM 개인 포트폴리오. React 19, Vite, TypeScript, Tailwind CSS 4, Motion for React.

## 개발
Node.js 24 권장.
```sh
npm ci
npm run dev
```
개발 경로는 `/portfolio_cowork/`입니다.
```sh
npm run build
npm run preview
npx playwright install chromium
# 이미 설치된 Chromium 사용 시:
# PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e
npm run test:e2e
```
빌드는 TypeScript 검사를 포함합니다. 브라우저 테스트는 데스크톱 및 모바일에서 기관 선택, 사업명 표시, 키보드, 가로 넘침, 기관 간 겹침과 모션 감소 설정을 확인합니다.

## 콘텐츠 수정
- `src/data/organizations.ts`: 기관명, 공식 로고 상대 경로, 수행 사업. 제공된 사업명을 그대로 유지합니다.
- `public/logos/`: `kma.png`, `science-museum.png`, `garak.png`, `ibk.png`, `kiat.png`, `mg.png` 이름으로 공식 원본을 추가하면 자동 표시됩니다. 파일 미등록 및 이미지 오류 시 기관명으로 대체합니다. 기관별 크기는 데이터의 `logoWidth`로 조정합니다. 현재 공식 파일은 포함하지 않았습니다. 자세한 내용은 `public/logos/README.md`를 참고하세요.
- `src/data/portfolio.ts`: 소개, 경력, 프로젝트, 연락처 및 이력서. `contact.email`, `contact.resume`을 등록하면 링크가 표시됩니다. 이력서는 public 하위 상대 경로를 사용합니다.
- `src/styles.css`: 팔레트, 데스크톱 배치, 모바일 2열 레이아웃.

기관은 마우스 호버, 터치 또는 키보드 포커스로 탐색할 수 있습니다. 클릭/Enter로 선택 유지 및 해제, 다른 기관 선택으로 전환, Escape로 선택 해제가 가능합니다. 사업명 영역은 미리 확보해 배치 이동을 방지합니다. 모션 감소 환경에서는 부유와 등장 모션을 중지합니다.

## GitHub Pages
저장소 Settings → Pages → Source를 **GitHub Actions**로 지정하세요. main 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 빌드 및 배포합니다. 실제 배포는 GitHub에서 실행되며 로컬 빌드만으로 배포되지는 않습니다.
저장소 이름 변경 시 `vite.config.ts`의 `base`도 변경하세요. 사용자 도메인 루트 배포는 `/`로 설정합니다. 별도 API나 비밀키는 필요하지 않습니다. Paperlogy는 자체 호스팅하여 외부 폰트 서비스 없이 동작합니다.

## Hero 디자인과 폰트
워드마크는 800 굵기, 기존 데스크톱 12vw에서 9.6vw로 축소했습니다. 데스크톱에서 워드마크 자체가 화면 중앙에 오며 C/O 설명은 28px 아래, 48px 간격의 중앙 그룹입니다. 1100px 이하에서는 설명이 세로로 정렬되고 기관은 2열로 배치됩니다.

`src/components/Constellation.tsx`는 외곽을 잇는 SVG 선 6개를 렌더링합니다. 실제 로고 버튼의 변환된 경계를 측정해 부유·확대·리사이즈·이미지 로딩에 맞춰 끝점을 이동하며, 중앙 텍스트 영역을 가로지르지 않습니다. 선택과 연결된 선 두 개만 강조합니다. 모션 감소 환경에서는 연속 프레임을 중단합니다.

Paperlogy 원본 WOFF2의 400/500/600/700/800을 `public/fonts/paperlogy/`에서 제공합니다. 요청된 CDN과 동일한 fonts-archive/Paperlogy 배포본입니다. 클라우드 Chromium의 CDN 인증서 신뢰 문제를 피하기 위해 TLS 검증을 유지한 Git HTTPS 경로로 원본을 확보하고 자체 호스팅했습니다. 외부 요청 없이 영문·한글이 표시되며 실패 시 sans-serif로 대체됩니다. 출처와 라이선스는 해당 폴더의 SOURCE.md 및 OFL.txt에 포함합니다.
