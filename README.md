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
- `public/logos/`: 확보한 공식 로고만 저장하세요. `logo: 'logos/example.svg'`를 지정하면 원본 비율로 표시합니다. 미등록 및 이미지 오류 시 기관명을 표시하며, 현재 모든 기관은 텍스트 대체 상태입니다.
- `src/data/portfolio.ts`: 소개, 경력, 프로젝트, 연락처 및 이력서. `contact.email`, `contact.resume`을 등록하면 링크가 표시됩니다. 이력서는 public 하위 상대 경로를 사용합니다.
- `src/styles.css`: 팔레트, 데스크톱 배치, 모바일 2열 레이아웃.

기관은 마우스 호버, 터치 또는 키보드 포커스로 탐색할 수 있습니다. 클릭/Enter로 선택 유지 및 해제, 다른 기관 선택으로 전환, Escape로 선택 해제가 가능합니다. 사업명 영역은 미리 확보해 배치 이동을 방지합니다. 모션 감소 환경에서는 부유와 등장 모션을 중지합니다.

## GitHub Pages
저장소 Settings → Pages → Source를 **GitHub Actions**로 지정하세요. main 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 빌드 및 배포합니다. 실제 배포는 GitHub에서 실행되며 로컬 빌드만으로 배포되지는 않습니다.
저장소 이름 변경 시 `vite.config.ts`의 `base`도 변경하세요. 사용자 도메인 루트 배포는 `/`로 설정합니다. 별도 API, 비밀키, 외부 폰트 서비스는 필요하지 않습니다.
