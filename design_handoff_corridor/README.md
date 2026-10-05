# Handoff: 30 Days — Corridor (v2)

## Overview
4인 팀(오세령 · 우민선 · 팜뚜안끼엣 · 조단비)이 30일 동안(2026.09.28 – 10.27) 매일 AI로 만든 영상 작업물을 올리는 포트폴리오 사이트.
사이트 전체가 **1인칭 3D 복도**다. 스크롤하면 복도를 따라 앞으로 걸어 들어가고, 양쪽 벽에 Day 1–30의 문이 번갈아 있다(홀수 = 왼쪽, 짝수 = 오른쪽). 작업물이 있는 날의 문을 열면 그날의 "방"(상세 화면)이 열린다.

## About the Design Files
`reference/` 안의 파일은 **HTML로 만든 디자인 레퍼런스(동작하는 프로토타입)**이며, 그대로 배포할 프로덕션 코드가 아니다.
작업은 이 디자인을 **기존 사이트의 환경(React / Next.js / Vue 등)과 패턴으로 다시 구현하는 것**이다. 기존 코드베이스가 없다면 React(+ Vite 또는 Next.js)를 권장한다.

- `30 Days Corridor v2.dc.html` — 전체 디자인. 마크업(인라인 스타일) + 하단 `class Component` 로직(React 클래스 컴포넌트와 동일한 패턴: `state`, `setState`, `renderVals()`가 템플릿에 값을 공급).
- `works-data.js` — 작업물 데이터와 헬퍼(`window.D30`). 실제 사이트에서는 CMS/DB/JSON으로 대체.
- `support.js` — 프로토타입 런타임. 브라우저에서 HTML 파일을 직접 열어보기 위해서만 필요하고, 구현 대상이 아니다.

**로컬에서 열기:** `reference/` 폴더를 정적 서버로 띄운 뒤(`npx serve reference`) 브라우저로 열면 동작을 그대로 확인할 수 있다.

## Fidelity
**High-fidelity.** 색, 타이포, 간격, 3D 수치, 인터랙션이 최종안이다. 아래 수치와 레퍼런스 파일을 기준으로 픽셀 단위로 재현할 것.

---

## 화면 구성

### 1. 복도 (메인, 스크롤 3D 씬)
**구조**
- 페이지 높이 = `100vh + (depthOf(30) − VIEW + 700) × K` px. 내부에 `position: sticky; top:0; height:100vh; overflow:hidden; perspective:700px` 무대.
- 무대 안에 `transform-style: preserve-3d`인 world(`left:50%; top:50%; width:0; height:0`). 스크롤 시 world에 `translateZ(scrollY / K px)`를 적용해 앞으로 이동한다. **rAF로 스로틀하고 DOM style을 직접 써서 리렌더 없이 갱신**.
- 상수: `SEG = 150`(문 간격, Day당), `START = 320`(Day1 깊이), `K = 1.15`(스크롤 → 깊이 비율), `VIEW = 520`(문 앞에 섰을 때 카메라 거리).
  - `depthOf(n) = START + (n−1) × SEG`
  - 문 n 앞으로 이동: `scrollTo(max(0, (depthOf(n) − VIEW) × K))`
  - 복도 길이 `L = depthOf(30) + 700`
- 크기: `W = max(320, innerWidth)`, `H = max(440, innerHeight)`. 문 `dH = round(min(300, H×0.5))`, `dW = round(dH×0.48)`.

**면(plane) 구성** — 모두 world 기준 absolute
| 면 | 위치/크기 | transform |
|---|---|---|
| 왼쪽 벽 | left −W/2, top −H/2, w L, h H | `transform-origin:0 50%; rotateY(90deg)` |
| 오른쪽 벽 | left W/2 − L, top −H/2, w L, h H | `transform-origin:100% 50%; rotateY(-90deg)` |
| 천장 | left −W/2, top −H/2, w W, h L | `transform-origin:50% 0; rotateX(-90deg)` |
| 바닥 | left −W/2, top H/2, w W, h L | `transform-origin:50% 0; rotateX(90deg) scaleY(-1)` |
| 끝 벽 | left −W/2, top −H/2, w W, h H | `translateZ(−L)` |
| 안개 판 | 끝 벽과 같은 크기, `floor(L/380)`장 | `translateZ(−(i+1)×380)`, `background: rgba(212,211,207,.075)`, `pointer-events:none` |

**재질 (모두 CSS 그라데이션 + SVG feTurbulence 노이즈 data URI)**
- 노이즈 2종(레퍼런스 파일에서 그대로 복사 가능):
  - fine: `feTurbulence fractalNoise baseFrequency .9, numOctaves 3`, 회색 α .55, 타일 180–220px
  - blot(얼룩): `baseFrequency .006 .012, numOctaves 4, seed 7`, 900×600 타일
- 벽: 베이스 `#cbcac6` + blot + fine + 조명 띠 `repeating-linear-gradient(90deg[오른쪽은 270deg], rgba(255,255,255,0) 0, rgba(255,255,255,.26) 172px, rgba(255,255,255,0) 300px)` + 위/아래 AO(위 rgba(0,0,0,.32)→투명 14%, 아래 70%→.12) + 걸레받이(아래 15px `#5e5e5b`, 2px 하이라이트 `#9a9a97`, 그 위 그림자).
- 천장: `#d9d8d4` + fine(140px) + 타일 줄눈 `#a9a8a4` 2px(가로 150px, 세로 12.5% 간격) + 양 끝 AO + 조명 띠(180deg).
- 조명: 천장 중앙 `left:37.5%; width:25%; height:64px`, `top = 140 + i×300 px`, 개수 `ceil(L/300)`. 배경 `#ffffff`, 테두리 링 `0 0 0 5px #bdbcb8`, 글로우 `0 0 50px 16px rgba(255,255,255,.75)`. 5개 중 1개(i%5===3)는 꺼진 등(`#dcdcd8`, 글로우 없음).
- 바닥(폴리싱 콘크리트): `linear-gradient(90deg,#7c7b77,#8f8e8a 50%,#7c7b77)` + blot + fine + 양쪽 벽쪽 AO(.42) + 중앙 32% 폭의 조명 반사 띠(벽과 같은 300px 주기, `filter: blur(10px)`).
- 화면 전체 오버레이: 비네트 `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 50%, rgba(20,20,20,.45))` + fine 노이즈(200px).

**문** (벽 안에 absolute, 왼쪽 벽은 `left: depthOf(n)`, 오른쪽 벽은 `right: depthOf(n)`, `bottom: 18px`, `dW × dH`)
레이어(아래→위):
1. 벽 그림자: 문보다 상 −24 / 좌우 −14 / 하 −30, `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,0,0,.16), transparent 70%)`
2. 문틀: inset −9px(하단 0), `linear-gradient(90deg,#8d8c89,#c2c1bd 18%,#b1b0ac 82%,#8a8986)`
3. 문 안쪽(열렸을 때 보이는 빛): 작업물 있음 `linear-gradient(90deg,#f6f6f4,#ffffff)` + 글로우 `0 0 70px 14px rgba(255,255,255,.65)`, 없음 `#2c2c2a`
4. 문짝(leaf): 경첩 쪽이 `transform-origin`(왼쪽 벽 `0 50%`, 오른쪽 벽 `100% 50%`). `rotateY(ang)`(오른쪽 벽은 −ang), `transition: transform .6s cubic-bezier(.2,.7,.2,1)`.
   - 배경: 노이즈 + 작업물 있음 `linear-gradient(90deg,#b4b3af,#cdccc8 45%,#b9b8b4)`, 지난 빈 날 `#8a8986→#9c9b98`, 미래 `#c2c1bd→#d0cfcb`
   - 망입유리 창: left/right 20%, top 10%, height 24%. 배경 = 썸네일(`w.thumb`, cover) 또는 회색 팔레트 `['#d9d9d6','#bdbdba','#e8e8e6','#a8a8a5','#cfcfcc','#f0f0ee','#b5b5b2','#c7c7c4'][n % 8]`. 빈 날 `#1e1e1d`. 위에 반사 하이라이트 + 45°/−45° 철망 패턴(9px).
   - 아래 패널 홈(top 42% ~ bottom 20%), 킥플레이트(하단 8%), 레버 손잡이(경첩 반대쪽).
   - 지난 빈 날: 종이 테이프 X자(12px, ±28°).
5. 문패: 문 위 46px, 금속 그라데이션 `#f1f1ef→#b8b8b5`, 글자 `#2a2a29`, DM Mono 500 12px/24px, letter-spacing .08em. **오늘**은 배경 `#d23b2a`, 글자 흰색, 텍스트 `"07 NOW"`.

문 상태:
| 상태 | 각도 ang | opacity | 커서 |
|---|---|---|---|
| 작업물 있음 · 필터 통과 | 9° (hover 34°, 여는 중 72°) | 1 | pointer |
| 작업물 있음 · 필터 탈락 | 0° | .28 | default |
| 지난 빈 날 | 0° + 테이프 X | .85 | default |
| 미래 | 0° | .6 | default |

**타이틀 (입구)** — 화면 중앙, 스크롤 0→200px 동안 opacity 1→0, 0이면 visibility hidden
- `LEVEL 0 · 09.28 — 10.27` — DM Mono 400 12px, letter-spacing .12em, opacity .8
- `THIRTY DOORS` — Bebas Neue, `clamp(54px,10vw,140px)/0.9`, letter-spacing −.045em, margin-top 14px
- `ENTER ↓` 버튼 — 40px 높이, 패딩 0 20px, 배경 `#1e1e1d`, 글자 `#ececea`, DM Mono 13px → 클릭 시 Day1 문 앞으로 스크롤

**상단 바** (padding 16px clamp(14px,3vw,32px), DM Mono 12px)
- 왼쪽: 빨간 점(9px `#d23b2a`) + `REC · (07/30) IN PROGRESS`, 아래 줄에 실시간 시계 `PM 03:42:10 · OCT.05 2026`(1초 간격, DOM 직접 갱신), opacity .7
- 오른쪽: `CCTV` 버튼(배경 `rgba(30,30,29,.14)`, 빨간 점 8px) + `MAP` 버튼(배경 `#1e1e1d`, 글자 `#ececea`, 필터 사용 중이면 `MAP · 3`, 열리면 `CLOSE`). 높이 36px.

**오른쪽 진행 레일 (진행 현황판)** — 세로 중앙, 높이 `min(60vh,520px)`
- Day 1–30 눈금: 작업물 있음 22×5px 진한색, 없음 14px(지난 날은 점선 테두리), 오늘은 `#d23b2a` 2px outline. 1, 5의 배수, 오늘에만 숫자 라벨(DM Mono 10px).
- 빨간 `▶` 마커가 현재 스크롤 위치의 Day를 가리킴(`nearest = round((z + VIEW − START)/SEG) + 1`).
- 눈금 클릭 → 그 문 앞으로 스크롤(smooth) → 850ms 후 문 열기.

**하단 바** — 왼쪽 `ENTRANCE`(z<120) 또는 `DAY 07 근처`, 오른쪽 `↑↓ 이동 · 문을 눌러 들어가기` / 필터 사용 시 `FILTER ON · 03 ROOMS`. DM Mono 12px.

### 2. MAP 패널 (검색 · 필터 · 정렬)
- 오른쪽 고정 패널: right clamp(8px,2vw,24px), top 64px, bottom 16px, width `min(420px, 100vw−16px)`, padding 20px, 배경 `#e6e6e3`, 그림자 `0 20px 50px rgba(20,20,20,.35)`. 뒤 배경 클릭 시 닫힘(`rgba(30,30,29,.2)` 딤).
- 내용 순서:
  1. `FLOOR PLAN` / `07 ROOMS OPEN`
  2. 평면도: 15칸 × 2줄(위 = 홀수/왼쪽 벽, 아래 = 짝수/오른쪽 벽), 사이에 점선 복도. 칸 3:4 비율. 작업물 있음 = 진한 배경 + 밝은 숫자, 지난 빈 날 = 점선, 오늘 = 빨간 outline, 미래 = opacity .5. 클릭 → 해당 문으로 이동.
  3. 검색창(38px, 배경 `rgba(30,30,29,.1)`, placeholder `제목, 노트, 프롬프트 검색`)
  4. AI 칩(다중 선택), 제작자 칩(다중 선택). 선택 = 진한 배경/밝은 글자.
  5. 정렬 `Day순` / `최신순` + `전체 초기화`(필터가 있을 때만)
  6. 결과 목록: `07` · 제목(Archivo Narrow 500 17px) · 이름(Pretendard 12px) · 길이. 클릭 → 이동 후 문 열기.
  7. 결과 없음: `NO ROOMS FOUND` + `조건에 맞는 방이 없어요. 검색어나 필터를 바꿔 보세요.`
- 필터 결과는 복도의 문에도 그대로 반영(탈락한 문은 opacity .28, 클릭 불가).

### 3. 방 (상세 화면)
- 진입: 문 클릭 → leaf 72° 회전 450ms → 방 오버레이(`position:fixed; inset:0; z-index:50`)가 opacity 0→1(.45s), scale .92→1(.6s cubic-bezier(.2,.7,.2,1)). URL hash `#day-07` 설정.
  - 구현 주의: 진입 애니메이션 시작 플래그는 rAF 2회 뒤에 켜되, **setTimeout 30ms 폴백도 함께 둘 것**(백그라운드 탭에서 opacity 0으로 남는 문제 방지).
- 배경: 벽과 같은 질감(밝은 회색), 하단 22px 걸레받이.
- 최대 폭 1240px, 패딩 18px clamp(14px,3vw,40px) 70px.
- 상단: `← 복도로 (ESC)` / `◀ 06` `ROOM 07`(빨간 배경) `08 ▶` — 이전/다음 작업물로 이동(작업물 있는 날만 순환).
- 영상: 16:9, 어두운 액자(padding clamp(10px,1.4vw,18px), 배경 `#1e1e1d`, 주변 글로우). 좌상단 `● PLAY · 00:18`, 우하단 `10.04.2026`. `video` 경로가 있으면 `<video controls playsinline>`, 없으면 재생 아이콘 플레이스홀더.
- 영상 아래 한 줄: 제목(Archivo Narrow 500 `clamp(34px,4.6vw,58px)/0.95`) + 이름(`오세령 · 팜뚜안끼엣`, Pretendard 15px) + `링크 복사`(13px, opacity .65, 클릭 시 1.6초간 `복사됨`).
- 그 아래 2단(구분선 위): 
  - 왼쪽: `AI` 태그(DM Mono, 배경 `rgba(30,30,29,.12)`) → `NOTE`(Pretendard 15px/1.8)
  - 오른쪽: `PROMPT` 박스(배경 `rgba(255,255,255,.55)`, 테두리 없음). 우상단 `복사` 버튼 → 1.6초 `복사됨`. 본문 DM Mono 13px/1.7, `white-space: pre-wrap`. **200자 초과 시** max-height 5.4em + 하단 마스크 `linear-gradient(180deg,#000 40%,transparent)` + `more ↓`, 펼치면 `접기 ↑`.

### 4. CCTV (영상 모아보기)
- `position:fixed; inset:0; z-index:40`, 배경 `#121212`, 글자 `#e4e4e2`. URL hash `#cctv`로 직접 진입 가능.
- 상단 sticky 바: `● SECURITY ROOM · 07 TAPES · DAY 01—07` / 필터 사용 시 `03 / 07 TAPES` + `필터 해제` / `← 복도로 (ESC)`.
- 그리드: `repeat(auto-fill, minmax(min(100%,250px),1fr))`, gap clamp(10px,1.6vw,18px).
- 모니터 카드: 4:3 베젤(`#333333→#1f1f1f`, radius 6px, padding 8px), 화면 radius 14px/10px + 주사선. 좌상단 `CAM 07`, 우상단 빨간 점 + 길이, 우하단 날짜, 아래 제목 + 이름.
  - 영상이 있으면 `muted autoplay loop playsinline`로 동시 재생.
  - Day 1~오늘 중 업로드 없는 날은 `NO SIGNAL`(지직거리는 회색 화면).
  - 클릭 → 해당 방으로 바로 진입.

---

## Interactions & Behavior
- **키보드**: ESC = 방 닫기 → CCTV 닫기 → MAP 닫기 순서. 방 안에서 ←/→ = 이전/다음 방. 복도에서 ↑/↓ = 한 칸(SEG×K) 스크롤. input 포커스 중에는 무시.
- **딥링크**: `#day-NN`으로 들어오면 200ms 후 해당 문으로 스크롤 → 문 열기 → 방. `hashchange`도 처리. 방을 닫으면 hash 제거. `#cctv`는 CCTV 열기.
- **링크 복사**: `location.href(해시 제거) + '#day-NN'`. Clipboard API 실패 시 textarea + `execCommand('copy')` 폴백.
- **검색**: 제목 + 노트 + 프롬프트, 대소문자 무시. AI/제작자 필터는 각각 OR, 검색·AI·제작자 사이는 AND.
- **오늘**: `progress` 값(0이면 실제 날짜 기준, 09.28 = Day1, 1–30으로 clamp). 오늘 이후 작업물은 숨김.
- **반응형**: 복도·방·MAP 모두 뷰포트 기준으로 자동 계산(ResizeObserver + resize). MAP은 모바일에서 전체 폭 가까이(100vw−16px). CCTV 그리드는 1열까지 줄어듦.

## State
- `open`(열린 방 Day | null), `roomIn`(진입 애니메이션), `opening`(여는 중인 문), `hover`, `map`, `cctv`
- `q`, `ai[]`, `makers[]`, `sort: 'day' | 'latest'`
- `promptOpen`, `copied: 'link' | 'prompt' | null`
- `vw`, `vh`
- 스크롤 위치는 state에 넣지 말고 ref로 DOM 직접 갱신(world transform, 타이틀 opacity, 레일 마커, 하단 Day 라벨).

## Data
작업물 1건 (`works-data.js`의 `WORKS`):
```js
{ day: 7, title: 'Orange haze over still water', ai: ['Runway'], makers: ['오세령', '팜뚜안끼엣'],
  duration: 18, uploaded: '2026-10-04T18:20', prompt: '...', note: '...',
  thumb: 'optional/path.jpg', video: 'optional/path.mp4' }
```
- `makers`: 1–4명, 팀원 고정 목록 `['오세령','우민선','팜뚜안끼엣','조단비']`
- `ai`: 자유 입력 문자열 배열(필터 옵션은 데이터에서 자동 수집)
- `duration`: 초 → `mm:ss`로 표시
- 기존 사이트에 업로드 기능이 있다면 이 스키마에 맞춰 연결.

## Design Tokens
**색**
- 잉크 `#1e1e1d` / 밝은 잉크 `#ececea` / 강조(REC·오늘·현재 방) `#d23b2a`
- 무대 배경 `radial-gradient(ellipse 30% 30% at 50% 50%, #f4f4f2, #c4c4c0 60%, #8e8e8a)`, body `#a9a9a6`
- 벽 `#cbcac6`, 천장 `#d9d8d4`, 바닥 `#7c7b77`/`#8f8e8a`, 문틀 `#8d8c89`–`#c2c1bd`, 문 `#b4b3af`–`#cdccc8`
- 패널 `#e6e6e3`, CCTV `#121212` / `#e4e4e2`, 끝 벽 `#fbfbfa`→`#d6d6d2`

**폰트** (Google Fonts + Pretendard CDN)
- `Bebas Neue` — 메인 타이틀만
- `Archivo Narrow` 500 — 작업물 제목
- `DM Mono` 400/500 — 라벨, 숫자, 버튼, 프롬프트 (10–13px 위주)
- `Pretendard` — 한글 본문, 이름, 노트 (12–15px)

**모션**: 문 `.6s cubic-bezier(.2,.7,.2,1)`, 방 진입 opacity .45s + scale .6s 같은 커브, 레일 마커 top `.2s`, 필터 opacity `.4s`.

## Assets
- 이미지 에셋 없음. 모든 질감은 CSS 그라데이션 + 인라인 SVG 노이즈(data URI)로 만들어짐 → 레퍼런스 파일에서 `NOISE` 상수와 벽/바닥 background 값을 그대로 복사해 사용.
- 실제 썸네일/영상은 작업물 데이터의 `thumb`, `video` 경로로 연결(문 창, CCTV, 방 영상에 자동 표시).

## Files
- `reference/30 Days Corridor v2.dc.html` — 전체 디자인 + 로직(파일 하단 `class Component`)
- `reference/works-data.js` — 샘플 데이터 + 헬퍼(today, match, link, copy, hash)
- `reference/support.js` — 프로토타입 실행용 런타임(구현 대상 아님)

## Claude Code에 줄 프롬프트 예시
> `design_handoff_corridor/README.md`와 `reference/` 파일을 읽고, 현재 사이트를 이 Corridor 디자인으로 바꿔줘. 기존 데이터(작업물 업로드/저장 방식)는 유지하고 README의 Data 스키마에 맞게 연결해. 3D 복도는 CSS 3D transform으로 구현하고, 스크롤 갱신은 rAF + ref로 리렌더 없이 처리해.
