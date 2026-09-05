import { readFile } from "node:fs/promises";
import path from "node:path";

// The default OG-image renderer's built-in font is missing glyphs we need --
// notably the Naira sign (₦) -- so we load a font with full Unicode coverage.
export async function ogFonts() {
  const dir = path.join(process.cwd(), "src", "app", "fonts");
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, "NotoSans-Regular.ttf")),
    readFile(path.join(dir, "NotoSans-Bold.ttf")),
  ]);

  return [
    { name: "Noto Sans", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Noto Sans", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}
