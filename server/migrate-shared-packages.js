/**
 * migrate-shared-packages.js — Migração única: pacotes do GP → shared_packages.
 *
 * Copia os pacotes ativos (não deletados) do site_content do GP Experience
 * para a tabela compartilhada, com origem 'gp' e esporte 'automobilismo'.
 * Os pacotes atuais de torcida/emais são testes e NÃO são migrados (decisão
 * de jul/2026) — os portais passam a exibir os pacotes compartilhados.
 *
 * Uso (na pasta do projeto, com .env configurado com DB_* e SHARED_DB_*):
 *   node server/migrate-shared-packages.js          → simulação (dry-run)
 *   node server/migrate-shared-packages.js --run    → executa a migração
 *
 * Idempotência: se já existirem pacotes de origem 'gp' na tabela, o script
 * aborta (rode com --force junto de --run para migrar mesmo assim).
 */
import pool from './db.js';
import { sharedPool, sharedDbEnabled, migrateSharedDb } from './shared-db.js';

const RUN = process.argv.includes('--run');
const FORCE = process.argv.includes('--force');

async function main() {
  if (!sharedDbEnabled()) {
    console.error('❌ SHARED_DB_NAME não configurado no .env — nada a fazer.');
    process.exit(1);
  }

  await migrateSharedDb();

  const [rows] = await pool.query('SELECT packages FROM site_content WHERE id = 1');
  if (!rows.length) {
    console.error('❌ site_content vazio no banco do GP.');
    process.exit(1);
  }
  const packages = JSON.parse(rows[0].packages || '[]');
  const ativos = packages.filter(p => !p.deletedAt);
  console.log(`📦 Pacotes no GP: ${packages.length} (${ativos.length} ativos, ${packages.length - ativos.length} na lixeira)`);

  const [existing] = await sharedPool.query("SELECT COUNT(*) AS c FROM shared_packages WHERE origem = 'gp'");
  if (existing[0].c > 0 && !FORCE) {
    console.error(`❌ Já existem ${existing[0].c} pacote(s) de origem 'gp' na tabela compartilhada. Use --run --force para migrar mesmo assim.`);
    process.exit(1);
  }

  for (let i = 0; i < ativos.length; i++) {
    const pkg = ativos[i];
    const emAlta = pkg.isTrending === true ? 1 : 0;
    console.log(`  ${RUN ? '→ migrando' : '· (simulação)'} [${i}] "${pkg.title}" (slug: ${pkg.slug || '—'}, em alta GP: ${emAlta ? 'sim' : 'não'})`);
    if (RUN) {
      await sharedPool.query(
        `INSERT INTO shared_packages
           (origem, esporte, payload, em_alta_gp, ordem_gp, ordem_emais, ordem_torcida)
         VALUES ('gp', 'automobilismo', ?, ?, ?, ?, ?)`,
        [JSON.stringify(pkg), emAlta, i, i, i]
      );
    }
  }

  console.log(RUN
    ? `\n✅ Migração concluída: ${ativos.length} pacote(s) do GP na tabela compartilhada.`
    : `\nℹ️ Simulação concluída (nada gravado). Rode com --run para executar.`);
  process.exit(0);
}

main().catch(err => { console.error('❌ Erro na migração:', err); process.exit(1); });
