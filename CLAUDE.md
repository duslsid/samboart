# 삼보아트 사이트 작업 규칙

- 인천 앵글·진열대 업체 홍보 사이트 (Vite + React + Supabase, GitHub Pages 배포)
- 기준 문서는 `samboart-spec.md` (기획서). 로컬에만 있고 저장소에는 올리지 않는다. (.gitignore 등록)
- 모든 응답은 한국어로 한다.
- 기획서에 없는 기능이나 효과를 임의로 더하지 않는다. 기획서에 없는 부분은 판단해서 진행하되, 판단한 내용을 목록으로 알려준다.

## 기획서
- 사이트를 수정할 때마다 기획서(`samboart-spec.md`)도 같이 고친다.
- 기능을 삭제했을 때는 본문에서 지우고, 12장 "변경 이력"에만 남긴다.

## 작업 진행
- 수정이 여러 개이거나 큰 작업은 계획(바뀌는 파일, 판단이 필요한 부분)을 먼저 보여주고, 승인을 받은 뒤 진행한다. 판단이 필요한 건 고치기 전에 묻는다.
- 여러 항목을 묶어서 맡길 때(묶음 작업)는 작은 단위 하나가 끝날 때마다 커밋하고, 사용자가 따로 말하지 않아도 커밋 메시지 앞에 `[SB 12]`처럼 진행 번호를 항상 붙인다. 번호는 `git log`에서 마지막 `[SB n]`을 확인하고 이어서 붙인다.

## 컴퓨터 사용 제한
- 이 컴퓨터는 무거운 작업에서 꺼지므로, 사용자가 따로 허락하지 않는 한 다음을 하지 않는다: npm i·패키지 설치(임시 폴더 포함), 빌드, 개발 서버, 브라우저 자동 검사(puppeteer·playwright 등). 확인이 필요하면 사용자에게 확인 항목을 알려준다.
- 그래서 import·문법은 눈으로 확인하고, 빌드 결과는 push 후 GitHub Actions에서 확인한다.
- 임시 파일은 프로젝트 폴더 밖(스크래치패드)에 만들고 끝나면 지운다. `/tmp`는 윈도우 임시 폴더라 다른 프로그램의 파일이 섞여 있으므로, 내가 만든 파일만 골라서 지운다.

## 코드 작성 주의
- 정규식·역슬래시(`\`)가 들어간 코드는 셸(heredoc, `node -e` 등)로 쓰지 말고 Edit/Write 도구로 쓴다. 셸을 거치면 역슬래시가 사라져 정규식이 깨진 적이 있다.
- CSS는 `src/main.jsx`의 순서(global → layout → home → products → pages)로 불러온다. 우선순위가 같으면 나중 파일·나중 줄이 이긴다. 모바일(768px 하나) 규칙은 같은 선택자의 기본 규칙보다 뒤에 둔다.
- 배포는 GitHub Pages(GitHub Actions)이고 접속 주소는 https://samboart.com 이다. 도메인이 사이트 루트라서 Vite base는 `/`이고, 주소에 `#` 없이 BrowserRouter를 쓴다. 라우터를 바꾸지 않는다. 공개 페이지는 배포 빌드(`npm run build`) 뒤에 `scripts/generate-pages.mjs`가 페이지마다 `dist/<주소>/index.html` 사본을 만들어 200으로 응답하게 하고(제목·설명·og·canonical·noscript 포함), `scripts/generate-sitemap.mjs`가 `sitemap.xml`을 만든다. 사본 주소는 끝 슬래시(`/privacy/`)가 대표 주소이므로 코드에서 `pathname`을 비교할 때는 끝 슬래시를 뗀 값으로 비교한다. `public/404.html` 우회(`pathSegmentsToKeep = 0`)는 없는 주소용으로만 남아 있다. DNS는 Cloudflare가 관리하고 모든 레코드를 DNS only(프록시 꺼짐)로 유지한다. 저장소에 CNAME 파일은 두지 않는다(Actions 배포는 저장소 Pages 설정의 Custom domain을 쓴다).
- 새 공개 페이지(라우트)를 만들면 `scripts/site-pages.mjs`의 `STATIC_PAGES`에도 제목·설명을 추가한다. (분류·중분류 페이지는 `src/data/categories.js`에서 자동으로 만들어진다.) `index.html`의 `seo:start`~`seo:end` 구간은 빌드 스크립트가 페이지마다 교체하므로 이 구간 표시를 지우지 않고, 검색엔진 소유 확인 태그는 구간 밖의 지정된 자리에 둔다. 사진·설명을 관리자에서 바꾼 뒤 공유 미리보기(og)에 반영하려면 GitHub Actions에서 "Deploy to GitHub Pages"를 수동 실행(Run workflow)한다.
- 로컬 이미지는 `public/image/` 아래에 두고 `localImage()`로 불러온다. 제품·시공·메인·팝업 사진은 Supabase에서 불러오고 코드에 사진 경로를 적지 않는다.

## 보안
- 저장소가 공개라서 키·비밀번호·개인 정보를 코드, 문서, 커밋 메시지에 넣지 않는다. `.env` 값은 출력하지 않는다. (연결 문제를 진단할 때도 길이·형식만 확인한다.)

## 커밋·push
- 커밋할 때 `git add -A`, `git add .`를 쓰지 않는다. 바꾼 파일만 경로를 직접 지정해서 add 한다.
- push 하기 전에 이번에 올라갈 커밋의 파일 목록 전체를 먼저 보여주고, 사용자가 직접 확인할 항목(폰·PC)도 함께 알려준 뒤, 확인을 받고 push 한다.
- push 한 뒤에는 Actions 결과(성공·실패)를 알려준다. 확인은 GitHub 쪽 조회로만 하고 브라우저 검사는 하지 않는다.
- 사용자가 폴더에 넣어둔 사진·참고 파일(예: `public/image/` 아래 파일, 그 밖에 새로 생긴 파일)은 사용자가 말하기 전에는 커밋하지 않는다.
- `.env`, `samboart-spec.md`, `supabase-schema.sql`은 저장소에 올리지 않는다.
- force push는 사용자가 명시적으로 요청했을 때만 한다.
