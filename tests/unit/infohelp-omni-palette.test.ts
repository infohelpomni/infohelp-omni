import { describe, expect, it } from "vitest";
import { PALETTES } from "@/app/design/lib/tokens";

const omni = PALETTES.omni;

function luminancia(hex: string): number {
  const rgb = [1, 3, 5].map((i) => {
    const n = parseInt(hex.slice(i, i + 2), 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!;
}

function contraste(a: string, b: string): number {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe("paleta InfoHelp Omni 2.0", () => {
  it("mantém as cores oficiais da identidade no design system", () => {
    expect(omni.accent[400].toLowerCase()).toBe("#50e6ed");
    expect(omni.accent[500].toLowerCase()).toBe("#1588e8");
    expect(omni.surfaces.light.text.toLowerCase()).toBe("#0b2439");
    expect(omni.surfaces.dark.bg.toLowerCase()).toBe("#06101d");
  });

  it("preserva as paletas originais do DeskComm", () => {
    expect(Object.keys(PALETTES)).toEqual(
      expect.arrayContaining(["sage", "clay", "mist", "plum", "olive", "omni"]),
    );
  });

  it("usa azul acessível no botão claro e ciano com tinta escura no tema noturno", () => {
    expect(contraste(omni.accent[600], "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contraste(omni.accent[400], omni.surfaces.dark.text)).toBeLessThan(4.5);
    expect(contraste(omni.accent[400], omni.surfaces.light.text)).toBeGreaterThanOrEqual(4.5);
  });

  it("mantém contraste AA para textos principais e secundários nos dois temas", () => {
    for (const tema of [omni.surfaces.light, omni.surfaces.dark]) {
      expect(contraste(tema.text, tema.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(tema.textMuted, tema.bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
