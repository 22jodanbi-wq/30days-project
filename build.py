#!/usr/bin/env python3
"""index.html 을 아트팩트로 발행할 단일 파일로 묶는다.

로컬 index.html 은 days.js 를 따로 읽지만, 아트팩트는 파일 하나여야 한다.
그래서 days.js 참조는 떼어내고, 배경 이미지가 있으면 data URI 로 박는다.
(Corridor 디자인은 질감을 전부 CSS 로 만들어서 지금은 박을 이미지가 없다.)
배포본에서는 콘텐츠가 days.js 가 아니라 공유 DB 에서 온다.

    python3 build.py        ->  dist/portfolio.html
"""

import base64
import mimetypes
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "index.html"
OUT = ROOT / "dist" / "portfolio.html"


def inline_image(html: str) -> str:
    """<img class="bg" src="assets/..."> 가 있으면 data URI 로 치환한다."""
    match = re.search(r'<img class="bg" src="([^"]+)"', html)
    if not match:
        print("  배경 이미지 없음 (건너뜀)")
        return html

    rel = match.group(1)
    path = ROOT / rel
    if not path.exists():
        sys.exit(f"배경 이미지가 없습니다: {rel}")

    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    print(f"  배경 인라인  {rel}  {path.stat().st_size:,} bytes -> base64 {len(data):,}")
    return html.replace(match.group(1), f"data:{mime};base64,{data}", 1)


def drop_local_data(html: str) -> str:
    """days.js 참조 제거. 배포본의 콘텐츠 출처는 공유 DB 다."""
    out = re.sub(r'\s*<script src="days\.js"></script>', "", html, count=1)
    if out == html:
        print("  days.js 참조 없음 (건너뜀)")
    else:
        print("  days.js 참조 제거")
    return out


def main() -> None:
    if not SRC.exists():
        sys.exit(f"원본이 없습니다: {SRC}")

    print(f"빌드: {SRC.name}")
    html = SRC.read_text(encoding="utf-8")
    html = drop_local_data(inline_image(html))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")

    size = OUT.stat().st_size
    print(f"  완료  {OUT.relative_to(ROOT)}  {size:,} bytes ({size / 1048576:.2f} MB / 16 MB 제한)")


if __name__ == "__main__":
    main()
