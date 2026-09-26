#!/usr/bin/env python3
"""Extract every <table> from a legacy HTML page into CSV files.

Used to migrate hand-written results tables into the Astro content folders.

    python3 scripts/legacy-tables-to-csv.py legacy/bush-turkey-classic-2024.html out_dir/

Each table is written as NN-<slug-of-preceding-heading>.csv so you can rename
files and wire them into the event's `results.tables` list.
"""
import csv
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []  # (heading, rows)
        self.heading = ""
        self._in_heading = False
        self._heading_buf = ""
        self._rows = None
        self._row = None
        self._cell = None

    def handle_starttag(self, tag, attrs):
        if tag in ("h1", "h2", "h3", "h4") and self._rows is None:
            self._in_heading = True
            self._heading_buf = ""
        elif tag == "table":
            self._rows = []
        elif tag == "tr" and self._rows is not None:
            self._row = []
        elif tag in ("td", "th") and self._row is not None:
            self._cell = ""
        elif tag == "br" and self._cell is not None:
            self._cell += " "

    def handle_endtag(self, tag):
        if tag in ("h1", "h2", "h3", "h4") and self._in_heading:
            self._in_heading = False
            self.heading = " ".join(self._heading_buf.split())
        elif tag in ("td", "th") and self._cell is not None:
            self._row.append(" ".join(self._cell.split()))
            self._cell = None
        elif tag == "tr" and self._row is not None:
            if any(self._row):
                self._rows.append(self._row)
            self._row = None
        elif tag == "table" and self._rows is not None:
            self.tables.append((self.heading, self._rows))
            self._rows = None

    def handle_data(self, data):
        if self._cell is not None:
            self._cell += data
        elif self._in_heading:
            self._heading_buf += data


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "table"


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    parser = TableParser()
    parser.feed(src.read_text(encoding="utf-8"))
    for i, (heading, rows) in enumerate(parser.tables, 1):
        path = out / f"{i:02d}-{slugify(heading)}.csv"
        with path.open("w", newline="", encoding="utf-8") as f:
            csv.writer(f).writerows(rows)
        print(f"{path}  ({len(rows) - 1} rows)  <- {heading!r}")


if __name__ == "__main__":
    main()
