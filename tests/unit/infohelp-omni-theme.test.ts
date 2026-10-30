import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.join(process.cwd(), "app/omni-theme.css"), "utf8");
const layout = fs.readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf8");

type ThemeMap = Map<string, string>;

function temas(): ThemeMap[] {
  const blocos = [...css.matchAll(/:root\[data-omni-theme\][^{]*\{([^}]*)\}/g)];
  return blocos.map(([, corpo]) => new Map(
    [...(corpo ?? "").matchAll(/(--[a-z-]+):\s*(#[0-9a-f]{6})\s*;/g)]
      .map(([, nome, valor]) => [nome!, valor!]),
  ));
}

function luminancia(hex: string): number {
  const canais = [1, 3, 5].map((i) => {
    const n = parseInt(hex.slice(i, i + 2), 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canais[0]! + 0.7152 * canais[1]! + 0.0722 * canais[2]!;
}

function contraste(a: string, b: string): number {
  const x = luminancia(a);
  const y = luminancia(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe("tema Omni nas telas reais", () => {
  it("carrega o CSS após o sistema-base sem alterar os tokens globais do DeskComm", () => {
    expect(layout).toMatch(/import "\.\/globals\.css";\s*import "\.\/omni-theme\.css";/);
    expect(layout).toContain('data-omni-theme=""');
    expect(temas()).toHaveLength(2);
  });

  it("preserva o accent que a marca própria resolve no banco em runtime", () => {
    // O CSS de instalação e de organização têm de continuar podendo mudar a cor.
    expect(css).not.toMatch(/--color-accent(?:-[a-z0-9]+)?\s*:/);
    expect(css).not.toMatch(/--color-brand\s*:/);
  });

  it("redefine os mesmos papéis nos dois temas", () => {
    const [claro, escuro] = temas();
    expect(claro).toBeDefined();
    expect(escuro).toBeDefined();
    expect([...claro!.keys()].sort()).toEqual([...escuro!.keys()].sort());
    expect(claro!.get("--color-bg")).toBe("#f6fbff");
    expect(escuro!.get("--color-bg")).toBe("#06101d");
    expect(claro!.get("--color-text")).toBe("#0b2439");
    expect(escuro!.get("--color-text")).toBe("#f6fbff");
  });

  it("mantém WCAG AA para texto principal, secundário e estados sobre o fundo", () => {
    for (const tema of temas()) {
      const bg = tema.get("--color-bg")!;
      for (const chave of [
        "--color-text", "--color-text-muted", "--color-success-fg",
        "--color-warning-fg", "--color-error-fg", "--color-info-fg",
      ]) {
        const fg = tema.get(chave)!;
        expect(contraste(fg, bg), `${chave} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
