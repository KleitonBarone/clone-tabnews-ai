import { Suspense } from "react";
import OpeningConfetti from "./opening-confetti";

const contentsUrl =
  "https://www.tabnews.com.br/api/v1/contents?strategy=new&per_page=1";
const formatCount = new Intl.NumberFormat("pt-BR");

async function getPublishedCount() {
  try {
    const response = await fetch(contentsUrl, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const total = response.headers.get("x-pagination-total-rows");

    if (response.ok && total && /^\d+$/.test(total)) {
      const count = Number(total);
      if (Number.isSafeInteger(count)) {
        return count;
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function PublishedCount() {
  const count = await getPublishedCount();

  if (count === null) {
    return <p>O total de publicações está indisponível no momento.</p>;
  }

  return (
    <p>
      <strong>{formatCount.format(count)}</strong>
      {count === 1 ? " conteúdo publicado" : " conteúdos publicados"} no TabNews
    </p>
  );
}

export default function Home() {
  return (
    <main>
      <OpeningConfetti />
      <section className="construction" aria-labelledby="page-title">
        <h1 id="page-title">Em construção</h1>
        <p className="intro">
          Estamos neste exato momento reconstruindo o TabNews, um lugar na
          internet para quem trabalha com tecnologia e precisa consumir
          conteúdos com valor concreto.
        </p>
        <div className="published-count" aria-live="polite">
          <Suspense fallback={<p>Consultando o total de publicações…</p>}>
            <PublishedCount />
          </Suspense>
        </div>
        <a
          className="official-link"
          href="https://www.tabnews.com.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Acessar o TabNews oficial <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
