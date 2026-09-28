# 30 Days of Drift

Team 7 — 2026.09.28 ~ 10.27 · 하루에 한 편

AI기반영상제작워크샵 30일 프로젝트 아카이브. 30일치 영상과 프롬프트, 작업 일지를 한 페이지에 모읍니다.

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
   { day:  3, youtube: "", title: "", duration: "", prompt: "", log: "" },  // 09.30 (수)
   ```

4. **따옴표 사이에만** 내용을 채웁니다

   ```js
   { day:  3, youtube: "https://youtu.be/dQw4w9WgXcQ", title: "Petals in morning fog",
     duration: "00:15", prompt: "soft focus, faint film grain, slow 24fps camera drift",
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

사이트의 30일 카드가 전부 `Not yet` 으로 보이면 `days.js` 문법이 깨진 겁니다. 당황하지 마세요.

저장소 **Commits** 탭 → 자기 커밋 → 오른쪽 **Revert** 를 누르면 되돌아갑니다. 그 다음 다시 고치면 됩니다.

---

## 관리자용

### 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 사이트 전체. 이거 하나가 페이지입니다 |
| `days.js` | 30일치 콘텐츠. **팀원이 고치는 유일한 파일** |
| `assets/cosmos-bg.jpg` | 배경 (136KB, 실사용) |
| `assets/cosmos-bg.png` | 배경 원본 (1.2MB, 사이트는 안 씀) |
| `build.py` | claude.ai 아트팩트 발행용 단일 파일 생성 |
| `30 Days Portfolio.dc.html` | 원본 디자인 시안 (참고용, 사이트와 무관) |
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

시작일은 `index.html` 의 `START = new Date(2026, 8, 28)` (2026-09-28) 이고, 오늘 날짜에서 자동 계산해 `01/30` ~ `30/30` 으로 표시됩니다. 손으로 고칠 필요 없습니다.

업로드 완료 판정은 **날짜가 아니라 영상 유무**로 합니다. 하루 밀려도 페이지가 거짓말하지 않습니다.

### 배경 사진을 바꿀 때

`index.html` 의 `--bg-aspect` 값을 새 사진의 **가로÷세로** 로 고쳐주세요. 이 값으로 배경 높이를 계산해서 넓은 화면에서 사진 좌우가 잘리지 않게 맞춥니다.

```css
.backdrop{--bg-aspect:1.787;   /* cosmos-bg.jpg = 1344x752 */
```

세로로 긴 사진을 쓰면 잘림 문제 자체가 없어집니다.

---

## 팀

오세령 · 우민선 · 조단비 · 팜뚜안끼엣
