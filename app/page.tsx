import { redirect } from "next/navigation";

import { marcaDaSaida } from "@/lib/branding/saida";
import { createClient } from "@/lib/supabase/server";
import { OmniLanding } from "@/components/marketing/OmniLanding";

/**
 * A página inicial pública.
 *
 * Quem tem sessão segue direto para o painel, como sempre foi. Quem não tem vê
 * uma página que diz o que o produto é e leva à política de privacidade e aos
 * termos — sem pedir login. A verificação de um app que pede dados de conta
 * Google exige exatamente isso: o revisor abre o endereço principal sem entrar e
 * precisa ver o nome do produto, o que ele faz e o link da política.
 *
 * `/` já é caminho público no `proxy` (`lib/auth/public-paths.ts`), então nada
 * lá muda. O nome vem da marca resolvida (`marcaDaSaida`: banco acima do
 * `.env`), nunca de texto fixo: uma imagem serve todas as marcas.
 *
 * `getUser()` e nunca `getSession()`: o redirecionamento só vale para sessão que
 * o servidor de autenticação confirmou.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");

  const marca = await marcaDaSaida(null);
  return <OmniLanding nome={marca.nome} />;
}
