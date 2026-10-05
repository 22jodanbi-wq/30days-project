// 30 Days — 공용 작업물 데이터. 팀원이 직접 입력/수정.
// ai: 자유 입력 · makers: 1~4명 · duration: 초 · thumb/video: 파일 경로(선택)
(function () {
  const MEMBERS = ['오세령', '우민선', '팜뚜안끼엣', '조단비'];
  const WORKS = [
    { day: 1, title: 'Petals in morning fog', ai: ['Midjourney', 'Runway'], makers: ['오세령', '조단비'], duration: 15, uploaded: '2026-09-28T22:10',
      prompt: 'petals drifting in morning fog, soft focus, faint film grain, muted teal and dusty coral palette, slow 24fps camera drift, 15 seconds',
      note: '채도를 낮추고 블러를 한 단계 올려 시리즈 전체 톤에 맞췄다. 두 번째 생성본을 최종으로 골랐다.' },
    { day: 2, title: 'Butterflies on a paper sky', ai: ['Midjourney', 'Kling'], makers: ['우민선'], duration: 12, uploaded: '2026-09-29T23:05',
      prompt: 'a flock of translucent butterflies crossing a sky made of handmade paper, fibers visible in the paper texture, backlit by a low evening sun, wings catching warm rim light, shallow depth of field, gentle parallax between three layers of butterflies, slow upward camera tilt, muted sage, peach and pale blue palette, soft film grain, 24fps, 12 seconds, no text, no people',
      note: '카메라 움직임이 너무 빨라서 slow drift로 다시 뽑았다. 세 번째 시도가 가장 자연스러웠다.' },
    { day: 3, title: 'Walking past the green stairwell', ai: ['Sora'], makers: ['팜뚜안끼엣', '우민선', '오세령'], duration: 20, uploaded: '2026-10-01T09:30',
      prompt: 'first-person walk past an old apartment stairwell painted sage green, late afternoon light through frosted glass, dust floating in the beams, handheld but steady, subtle breathing motion, ambient room tone, faded 16mm look with soft halation on highlights, the camera pauses at the landing and slowly turns toward a window, 20 seconds',
      note: '배경색을 세이지 그린으로 고정하니 앞선 날들의 영상과 이어지는 느낌이 생겼다. 업로드가 하루 늦었다.' },
    { day: 5, title: 'Glass helmet, crystal bloom', ai: ['Midjourney', 'Runway', 'Suno'], makers: ['오세령', '우민선', '팜뚜안끼엣', '조단비'], duration: 30, uploaded: '2026-10-02T21:00',
      prompt: 'portrait of a figure wearing a clear glass helmet filled with slowly blooming crystal flowers, refractions scattering pastel light across the face, dark navy studio backdrop, soft key light from the left, petals unfolding in real time, macro detail shots intercut with a slow push-in, ambient choir pad soundtrack, muted blue and coral palette, film grain, 30 seconds',
      note: '네 명이 처음으로 함께 만든 날. 이미지는 Midjourney, 움직임은 Runway, 음악은 Suno로 나눠 작업했다.' },
    { day: 6, title: 'Light through linen curtains', ai: ['Kling', 'Suno'], makers: ['조단비'], duration: 10, uploaded: '2026-10-03T20:45',
      prompt: 'linen curtains moving in a slow breeze, morning light, warm haze, static camera, 10 seconds',
      note: '10초 안에 전환 없이 한 컷으로만 구성했다. 여백이 많을수록 차분해 보인다.' },
    { day: 7, title: 'Orange haze over still water', ai: ['Runway'], makers: ['오세령', '팜뚜안끼엣'], duration: 18, uploaded: '2026-10-04T18:20',
      prompt: 'an orange haze settling over perfectly still lake water at dusk, a single reed in the foreground, mirror-like reflections, very slow dolly forward, soft bloom on the horizon, faint film grain, muted coral and deep blue palette, 18 seconds',
      note: '프롬프트에 film grain을 넣으니 질감이 살아났다. 대신 수평선이 흐려져 조명 묘사를 보강했다.' },
    { day: 8, title: 'Soft static, pastel noise', ai: ['Sora', 'Suno'], makers: ['우민선', '조단비'], duration: 24, uploaded: '2026-10-05T22:40',
      prompt: 'abstract pastel static resolving into a quiet bedroom scene, analog TV noise, slow crossfade, 24 seconds',
      note: '노이즈에서 장면으로 넘어가는 타이밍을 세 번 조정했다.' },
    { day: 9, title: 'A room full of slow birds', ai: ['Midjourney', 'Kling'], makers: ['팜뚜안끼엣'], duration: 15, uploaded: '2026-10-06T21:15',
      prompt: 'paper birds hovering in a sunlit empty room, slow motion, soft shadows on the wall, 15 seconds',
      note: '새의 개수를 줄일수록 화면이 덜 복잡해졌다.' },
    { day: 11, title: 'Moth wings at dusk', ai: ['Runway'], makers: ['오세령', '우민선', '조단비'], duration: 22, uploaded: '2026-10-08T23:50',
      prompt: 'extreme close-up of moth wings at dusk, dust scales catching light, slow rack focus, 22 seconds',
      note: '마감 직전에 올렸다. 초점 이동 속도를 절반으로 줄였다.' },
    { day: 12, title: 'Paper moon in the stairwell', ai: ['Sora', 'Midjourney'], makers: ['조단비', '팜뚜안끼엣'], duration: 16, uploaded: '2026-10-09T20:30',
      prompt: 'a paper moon hanging in the green stairwell from day 3, gentle sway, 16 seconds',
      note: '3일차 계단을 다시 불러와 시리즈를 연결했다.' },
  ];
  const pad = n => String(n).padStart(2, '0');
  const START = new Date(2026, 8, 28);
  const D = {
    MEMBERS, WORKS, pad,
    today(progress) {
      const auto = Math.floor((Date.now() - START.getTime()) / 864e5) + 1;
      return Math.min(30, Math.max(1, progress || auto));
    },
    dateOf(day) { const d = new Date(2026, 8, 28 + day - 1); return pad(d.getMonth() + 1) + '.' + pad(d.getDate()); },
    dur(s) { return pad(Math.floor(s / 60)) + ':' + pad(s % 60); },
    works(progress) { const P = D.today(progress); return WORKS.filter(w => w.day <= P); },
    aiNames(list) { return [...new Set(list.flatMap(w => w.ai))].sort((a, b) => a.localeCompare(b)); },
    match(w, f) {
      const q = (f.q || '').trim().toLowerCase();
      return (!q || [w.title, w.note, w.prompt].join(' ').toLowerCase().includes(q)) &&
        (!f.ai || !f.ai.length || w.ai.some(a => f.ai.includes(a))) &&
        (!f.makers || !f.makers.length || w.makers.some(m => f.makers.includes(m)));
    },
    link(day) { return location.href.split('#')[0] + '#day-' + pad(day); },
    hashDay() { const m = /day-?(\d{1,2})/i.exec(location.hash || ''); return m ? +m[1] : null; },
    setHash(day) { try { history.replaceState(null, '', day ? '#day-' + pad(day) : location.pathname + location.search); } catch (e) {} },
    copy(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(() => D._fallback(text));
      D._fallback(text); return Promise.resolve();
    },
    _fallback(text) {
      const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove();
    },
  };
  window.D30 = D;
  window.dispatchEvent(new Event('d30-ready'));
})();
