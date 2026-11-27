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

async function inscricao(request, env) {
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
  const estatuto = dados.student === 'student' ? 'student' : 'not_student';
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

  if (r.ok) return json(200, { ok: true });
  // 409/422: já existe. Para quem se inscreve, o resultado é o mesmo.
  if (r.status === 409 || r.status === 422) return json(200, { ok: true, code: 'already' });
  return json(502, { ok: false, code: 'mailerlite', status: r.status });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/signup') {
      if (request.method === 'POST') return inscricao(request, env);
      return json(405, { ok: false, code: 'method' });
    }
    return env.ASSETS.fetch(request);
  },
};
