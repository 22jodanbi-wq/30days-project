# 30 Days of Drift

Team 7 — 2026.09.28 ~ 10.27 · 하루에 한 편

AI기반영상제작워크샵 30일 프로젝트 아카이브. 30일치 영상과 프롬프트, 작업 일지를 한 페이지에 모읍니다.

사이트는 **3D 복도(Thirty Doors)** 입니다. 스크롤하면 복도를 걸어 들어가고, 양쪽 벽에 Day 1–30 의 문이 있습니다(홀수 = 왼쪽, 짝수 = 오른쪽). 영상이 올라온 날의 문을 누르면 그날의 방이 열립니다.

**사이트** → https://22jodanbi-wq.github.io/30days-project/

---

## 팀원용 — 내 영상 올리는 방법

영상 파일은 **유튜브**에 있고, 이 저장소에는 **주소만** 적습니다.

### 1단계 · 유튜브에 올리기

공개 범위를 **공개** 또는 **일부공개** 로 하세요.

> **비공개(Private)는 안 됩니다.** 올린 본인만 볼 수 있어서 사이트에서 재생되지 않습니다.
> 남들에게 검색되는 게 싫으면 **일부공개**를 쓰세요. 링크를 아는 사람만 볼 수 있습니다.

올린 뒤 주소를 복사합니다. 아래 어떤 형태든 다 됩니다.

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/shorts/dQw4w9WgXcQ
```

### 2단계 · `days.js` 에 붙여넣기

1. 이 저장소에서 **`days.js`** 파일을 클릭합니다
2. 오른쪽 위 **연필 아이콘**(Edit this file)을 누릅니다
3. 자기 날짜 줄을 찾습니다. 줄 끝에 날짜가 주석으로 적혀 있습니다

   ```js
   { day:  3, youtube: "", title: "", duration: "", ai: "", makers: "", prompt: "", log: "" },  // 09.30 (수)
   ```

4. **따옴표 사이에만** 내용을 채웁니다

   ```js
   { day:  3, youtube: "https://youtu.be/dQw4w9WgXcQ", title: "Petals in morning fog",
     duration: "00:15", ai: "Midjourney, Runway", makers: "오세령, 조단비",
     prompt: "soft focus, faint film grain, slow 24fps camera drift",
     log: "채도를 낮추고 블러를 한 단계 올렸다. 두 번째 생성본을 최종으로 골랐다." },  // 09.30 (수)
   ```

5. 아래 **Commit changes** 를 누릅니다

1\~2분 뒤 사이트에 반영됩니다.

### 채우는 항목

| 항목 | 설명 |
|---|---|
| `youtube` | 유튜브 주소. **비우면 "업로드 대기"로 표시됩니다** |
| `title` | 영상 제목. 영문 권장 (디자인이 영문 기준) |
| `duration` | 길이. 비우면 `00:15` |
| `ai` | 사용한 AI. 여러 개면 쉼표로 `"Midjourney, Runway"` |
| `makers` | 만든 사람. 여러 명이면 쉼표로 `"오세령, 조단비"`. 이름을 정확히 써야 MAP 필터에 잡힙니다 |
| `prompt` | 그날 사용한 생성 프롬프트 |
| `log` | 작업 일지. 한국어로 쓰세요 |

비워둔 항목은 자동으로 안내 문구가 들어갑니다. 한 번에 다 채우지 않아도 됩니다.

### 주의할 점 딱 두 개

**따옴표를 지우지 마세요.** 내용은 `"` 와 `"` **사이**에 넣습니다.

```js
title: "Petals in morning fog",     ← 맞음
title: Petals in morning fog,       ← 페이지가 깨집니다
```

**내용에 `"` 를 쓰려면 `\"` 로 적으세요.** 아니면 작은따옴표 `'` 를 쓰면 됩니다.

```js
log: "\"느리게\" 가는 느낌을 살렸다.",     ← 맞음
log: "'느리게' 가는 느낌을 살렸다.",       ← 이것도 맞음
```

### 잘못 고쳤으면

복도의 문이 전부 닫혀 있고 MAP 에 `00 ROOMS OPEN` 이 뜨면 `days.js` 문법이 깨진 겁니다. 당황하지 마세요.

저장소 **Commits** 탭 → 자기 커밋 → 오른쪽 **Revert** 를 누르면 되돌아갑니다. 그 다음 다시 고치면 됩니다.

---

## 관리자용

### 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 사이트 전체. 이거 하나가 페이지입니다 |
| `days.js` | 30일치 콘텐츠. **팀원이 고치는 유일한 파일** |
| `assets/cosmos-bg.*` | 이전 디자인 배경 (지금 사이트는 안 씀) |
| `build.py` | claude.ai 아트팩트 발행용 단일 파일 생성 |
| `design_handoff_corridor/` | 지금 디자인(Corridor)의 시안과 사양 (참고용, 사이트와 무관) |
| `30 Days Portfolio.dc.html` | 이전 디자인 시안 (참고용, 사이트와 무관) |
| `support.js` | 디자인 캔버스 런타임 (사이트와 무관) |

`dist/` 는 아트팩트 발행 전용이라 `.gitignore` 에 있습니다. 깃허브 페이지는 `index.html` 을 직접 씁니다.

### 로컬에서 보기

```sh
open index.html
```

빌드 불필요. `file://` 로 바로 열립니다.

### 깃허브 페이지 설정

1. 깃허브에서 새 저장소 생성 (Public)
2. 이 폴더를 push
3. 저장소 **Settings → Pages**
4. Source: **Deploy from a branch** / Branch: **main** / 폴더: **/ (root)**
5. Save. 1\~2분 뒤 주소가 나옵니다

### 팀원에게 쓰기 권한 주기

**Settings → Collaborators → Add people** 에서 팀원 깃허브 계정을 추가합니다. 초대를 수락해야 `days.js` 를 고칠 수 있습니다.

### 진행 일수

시작일은 `index.html` 의 `START_DATE = new Date(2026, 8, 28)` (2026-09-28) 이고, 오늘 날짜에서 자동 계산해 `01/30` ~ `30/30` 으로 표시됩니다. 손으로 고칠 필요 없습니다.

업로드 완료 판정은 **날짜가 아니라 영상 유무**로 합니다. 하루 밀려도 페이지가 거짓말하지 않습니다. 오늘 이후 날짜에 미리 채운 영상은 그날이 되면 문이 열립니다.

다른 날짜 기준으로 미리 보려면 주소 뒤에 `?today=N` 을 붙이세요. 예: `index.html?today=12`

### 데이터 연결

`days.js` 의 필드는 디자인 사양(`design_handoff_corridor/README.md` 의 Data)으로 이렇게 바뀌어 쓰입니다.

| days.js | 디자인 스키마 |
|---|---|
| `youtube` | 문 창·CCTV·방의 썸네일과 영상 (유튜브 임베드) |
| `log` | `note` |
| `duration` `"00:15"` | `duration` 초 |
| `ai`, `makers` `"A, B"` | 배열 |
| 공유 DB 의 `updatedAt` | `uploaded` (MAP 의 최신순 정렬) |

### 바로가기 주소

`#day-07` 은 7일차 방으로 바로, `#cctv` 는 영상 모아보기로 바로 열립니다. 방 안의 **링크 복사**가 이 주소를 복사합니다.

### 아트팩트 발행본

`python3 build.py` → `dist/portfolio.html`. 발행본은 `days.js` 대신 공유 DB 에서 내용을 읽고, 쓰기 권한이 있는 팀원에게는 오른쪽 위에 **EDIT** 버튼이 보여 페이지에서 바로 채울 수 있습니다.

---

## 팀

오세령 · 우민선 · 조단비 · 팜뚜안끼엣
