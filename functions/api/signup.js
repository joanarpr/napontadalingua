// Registo no grupo de conversação sem depender do JavaScript da MailerLite.
// Corre no Cloudflare Pages (Functions). Recebe POST JSON e fala com a API da MailerLite
// do lado do servidor, com o token em MAILERLITE_TOKEN (variável de ambiente/segredo).
//
// Sem token configurado devolve 503 {code:"no-token"} e a página mostra o email em vez do formulário.

const ML_SUBSCRIBERS = 'https://connect.mailerlite.com/api/subscribers';

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function emailValido(e) {
  return typeof e === 'string' && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

export async function onRequestPost({ request, env }) {
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
  const grupo = (env.MAILERLITE_GROUP_ID || '203312840646329545').trim();
  const token = (env.MAILERLITE_TOKEN || '').trim();

  if (!emailValido(email)) return json(400, { ok: false, code: 'bad-email' });
  if (!token) return json(503, { ok: false, code: 'no-token' });

  const corpo = {
    email,
    fields: { name: nome || undefined, student_status: estatuto },
    status: 'active',
  };
  if (grupo) corpo.groups = [grupo];

  const r = await fetch(ML_SUBSCRIBERS, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(corpo),
  });

  if (r.ok) return json(200, { ok: true });
  if (r.status === 422 || r.status === 409) {
    // já existe: para a pessoa, o resultado é o mesmo
    return json(200, { ok: true, code: 'already' });
  }
  return json(502, { ok: false, code: 'mailerlite', status: r.status });
}

export async function onRequestGet() {
  return json(405, { ok: false, code: 'method' });
}
