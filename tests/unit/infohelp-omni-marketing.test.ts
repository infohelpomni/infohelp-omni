import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const raiz = process.cwd();
const inicio = fs.readFileSync(path.join(raiz, "app/page.tsx"), "utf8");
const landing = fs.readFileSync(path.join(raiz, "components/marketing/OmniLanding.tsx"), "utf8");
const login = fs.readFileSync(path.join(raiz, "app/(public)/login/page.tsx"), "utf8");
const shell = fs.readFileSync(path.join(raiz, "app/(public)/layout.tsx"), "utf8");

describe("InfoHelp Omni — marketing sem regressão na autenticação", () => {
  it("mantém a raiz pública e redireciona sessão válida para /app", () => {
    expect(inicio).toContain('export const dynamic = "force-dynamic"');
    expect(inicio).toContain("supabase.auth.getUser()");
    expect(inicio).toContain('if (user) redirect("/app")');
    expect(inicio).toContain("<OmniLanding nome={marca.nome} />");
  });

  it("a landing possui CTA real, login e documentos legais", () => {
    expect(landing).toContain("mailto:");
    expect(landing).toContain('href="/login"');
    expect(landing).toContain('href="/legal/privacy"');
    expect(landing).toContain('href="/legal/terms"');
    expect(landing).toContain("Representação ilustrativa da experiência");
    expect(landing).not.toMatch(/\b\d+[,.]?\d*%\s*(?:de\s*)?(?:aumento|redução|crescimento)/i);
  });

  it("a personalização visual não remove recuperação, cadastro, MFA ou Google", () => {
    expect(login).toContain("<LoginForm next={next} email={convite?.email} />");
    expect(login).toContain("<EntrarComGoogle next={next} />");
    expect(login).toContain('href="/login/forgot"');
    expect(login).toContain('"/signup"');
    expect(login).toContain("verifyInviteToken(invite)");
    expect(login).toContain('error === "link_invalido"');
    expect(login).toContain('error === "cadastro_por_convite"');
    expect(login).toContain('error === "entrada_com_google"');
  });

  it("mantém o logo da marca configurado no banco para todas as telas públicas", () => {
    expect(shell).toContain("marcaDaSaida(null)");
    expect(shell).toContain("marca.logoUrl");
    expect(shell).toContain("marca.logoDarkUrl");
  });
});
