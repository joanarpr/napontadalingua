// Endpoint de inscrição no grupo de conversação.
// O site é estático e servido por este Worker; tudo o que não seja /api/signup
// segue para os ficheiros, com o comportamento de 404 já configurado.
// O token da MailerLite vive em MAILERLITE_TOKEN (Settings → Variables and Secrets).
// Sem token, responde 503 e o formulário mostra o email em vez de falhar em silêncio.

const GRUPO_POR_DEFEITO = '203312840646329545'; // MailerLite: "6. Conversação semanal"

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function emailValido(e) {
  return typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

// Aviso interno (só para a escola) quando entra uma inscrição.
// Nunca deve estragar a inscrição: se falhar, ignora-se.
async function avisar(env, dados, quando) {
  const chave = (env.BREVO_API_KEY || '').trim();
  if (!chave) return;
  const hora = new Date(quando).toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
  const linhas = [
    `<p><strong>Nova inscrição no grupo de conversação.</strong></p>`,
    `<p>Email: <strong>${dados.email}</strong></p>`,
    dados.nome ? `<p>Nome: ${dados.nome}</p>` : '',
    `<p>Já tem aulas connosco: ${dados.estatuto === "I'm a student" ? 'sim' : 'não'}</p>`,
    `<p>Quando: ${hora}</p>`,
    `<p style="color:#666">A pessoa entrou (ou já estava) no grupo «6. Conversação semanal» na MailerLite.</p>`,
  ].join('');
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': chave, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Na Ponta da Língua', email: 'aulas.napontadalingua@gmail.com' },
        to: [{ email: 'aulas.napontadalingua@gmail.com' }],
        replyTo: { email: dados.email },
        subject: `Nova inscrição no grupo: ${dados.email}`,
        htmlContent: linhas,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.log('brevo falhou', r.status, await r.text());
  } catch (e) {
    console.log('brevo erro', String(e));
  }
}

async function inscricao(request, env, ctx) {
  let dados;
  try {
    dados = await request.json();
  } catch {
    return json(400, { ok: false, code: 'bad-json' });
  }

  // honeypot: campo invisível que humanos não preenchem
  if (dados && typeof dados.website === 'string' && dados.website.trim() !== '') {
    return json(200, { ok: true, code: 'ignored' });
  }

  const email = (dados.email || '').trim().toLowerCase();
  const nome = (dados.name || '').trim().slice(0, 120);
  // os valores têm de coincidir com os do formulário antigo, senão os segmentos não os apanham
  const estatuto = dados.student === 'student' ? "I'm a student" : "I'm not a student";
  const token = (env.MAILERLITE_TOKEN || '').trim();
  const grupo = (env.MAILERLITE_GROUP_ID || GRUPO_POR_DEFEITO).trim();

  if (!emailValido(email)) return json(400, { ok: false, code: 'bad-email' });
  if (!token) return json(503, { ok: false, code: 'no-token' });

  const corpo = {
    email,
    fields: { name: nome || undefined, student_status: estatuto },
    status: 'active',
  };
  if (grupo) corpo.groups = [grupo];

  const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(corpo),
  });

  if (r.ok) {
    if (ctx && ctx.waitUntil) ctx.waitUntil(avisar(env, { email, nome, estatuto }, Date.now()));
    return json(200, { ok: true });
  }
  // 409/422: já existe. Para quem se inscreve, o resultado é o mesmo.
  if (r.status === 409 || r.status === 422) {
    if (ctx && ctx.waitUntil) ctx.waitUntil(avisar(env, { email, nome, estatuto }, Date.now()));
    return json(200, { ok: true, code: 'already' });
  }
  return json(502, { ok: false, code: 'mailerlite', status: r.status });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/signup') {
      if (request.method === 'POST') return inscricao(request, env, ctx);
      return json(405, { ok: false, code: 'method' });
    }
    return env.ASSETS.fetch(request);
  },
};
