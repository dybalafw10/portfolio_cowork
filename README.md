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

`src/data/constellations.ts`에서 독립 군집 4개의 nodes/edges를 관리합니다. 군집별로 5/6/5/7개의 점과 4/5/4/6개의 선을 가진 열린 트리입니다. 각 edge는 두 node의 ID를 참조하고, 렌더링 시 동일한 좌표 맵에서 점과 선을 함께 계산합니다. 따라서 임의 선분이나 서로 어긋난 연결 끝점이 생기지 않습니다.

`src/components/Constellation.tsx`는 기상기후인재개발원·국립중앙과학관 주변 상단 및 한국산업기술진흥원·MG새마을금고 주변 하단에 군집을 배치합니다. 군집끼리는 연결하지 않으며 중앙 타이틀/설명과 로고·사업명 영역은 비웁니다. 모바일에서는 위쪽 군집을 설명과 첫 기관 사이 여백에, 아래쪽 군집을 마지막 기관의 사업명 예약 영역 아래에 배치합니다. 기존 Hero의 모바일 높이 확장과 자연스러운 스크롤을 유지합니다.

선은 #A8B8CE, 0.8px, 기본 불투명도 20%입니다. 점은 반지름 1.7px, 기본 28%입니다. 해당 기관 호버·선택 시 군집 전체의 선과 점만 40%로 강조하며 350ms에 복귀합니다. 그룹 자체 opacity를 사용하지 않아 점·선 투명도가 중복 적용되지 않습니다. 배경 자체는 움직이지 않고 ResizeObserver/폰트 로딩/반응형 크기 변경 시에만 재계산합니다. 모션 감소 환경에서는 전환을 비활성화합니다. 기존 기관 로고 부유·확대는 그대로입니다.

Paperlogy 원본 WOFF2의 400/500/600/700/800을 `public/fonts/paperlogy/`에서 제공합니다. 요청된 CDN과 동일한 fonts-archive/Paperlogy 배포본입니다. 클라우드 Chromium의 CDN 인증서 신뢰 문제를 피하기 위해 TLS 검증을 유지한 Git HTTPS 경로로 원본을 확보하고 자체 호스팅했습니다. 외부 요청 없이 영문·한글이 표시되며 실패 시 sans-serif로 대체됩니다. 출처와 라이선스는 해당 폴더의 SOURCE.md 및 OFL.txt에 포함합니다.


## 풀페이지 탐색
`src/components/FullPageExperience.tsx`가 실제 문서의 5개 섹션을 관리합니다. 섹션은 최소 100svh이며 긴 콘텐츠만큼 늘어납니다. 데스크톱(1101px 이상·정밀 포인터)에서는 CSS scroll-snap proximity와 Motion for React의 페이드/세로 이동을 조합하여 760ms에 전환합니다. 퇴장은 16px, 등장은 40px이며 회전·확대는 사용하지 않습니다. 현재 PROJECTS는 콘텐츠 대기 상태라 카드 데이터나 가짜 프로젝트를 추가하지 않았습니다.

휠 제어는 섹션 경계에서만 사용합니다. 35px의 의도적 입력을 모은 뒤 한 섹션 이동하고, 전환 중 입력과 180ms 이상 쉬지 않는 관성 꼬리를 소비하여 연속 건너뛰기를 방지합니다. 긴 섹션과 내부 스크롤 영역에서는 기본 스크롤을 허용합니다. 긴 섹션 경계를 넘는 큰 입력만 경계에 제한합니다. 모바일·거친 포인터·모션 감소 환경에서는 휠 가로채기와 전환 애니메이션을 사용하지 않습니다.

내비게이션과 스킵 링크는 동일한 섹션 경로를 사용하고 제목으로 포커스를 옮깁니다. PageUp/PageDown은 긴 콘텐츠 안에서는 기본 페이지 스크롤을 유지하며 경계에서 섹션을 이동합니다. Home/End는 첫/마지막 섹션으로 이동합니다. URL 해시, 직접 링크, 새로고침, 뒤로/앞으로 가기를 지원하며 라우터 서버 설정은 필요하지 않습니다. 오른쪽 숫자 인디케이터는 모바일에서 숨깁니다.

`tests/scroll.spec.ts`는 휠, 트랙패드 연속 입력 시뮬레이션, 키보드, 해시/히스토리, 긴 콘텐츠, 큰 휠 입력의 경계 제한, 모바일 터치 스와이프와 모션 감소를 검증합니다. 실제 트랙패드 하드웨어 및 Safari/Firefox 검증은 포함하지 않습니다.


## 별자리 브라우저 검증
`tests/constellation.spec.ts`에서 네 군집 모두의 실제 선 픽셀을 숨긴 화면과 비교합니다. 점은 픽셀 비교에서 제외하여 점만 보이고 선은 그려지지 않는 경우도 잡습니다. 그래프 연결성, 노드 수/간선 수, 최대 분기 수, 순환 없음, edge 양 끝점과 node 좌표의 정확한 일치, SVG viewBox, 화면 내부 배치와 UI 겹침을 검사합니다. 네 기관을 각각 호버하여 해당 군집만 강조되는지도 확인합니다. 데스크톱·모바일 Hero 스크린샷은 test-results/*-constellation-final.png에 생성됩니다.

기존 단독 선분에서 지나치게 낮은 대비가 발생했던 문제를 재발 방지하기 위해 실제 페이지 픽셀 검사를 유지합니다. SVG 0 / 기관 및 하단 UI 1 / 워드마크 2의 명시적인 레이어 순서와 동적 viewBox도 유지합니다. 라이브 GitHub Pages는 이 작업 환경에서 HTTP 403으로 접근이 차단된 바 있어 배포 결과와 로컬 프로덕션 검증을 구분해야 합니다.
