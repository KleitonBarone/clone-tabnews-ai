import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import OpeningConfetti from "./opening-confetti";

const contentsUrl =
  "https://www.tabnews.com.br/api/v1/contents?strategy=new&per_page=1";
const formatCount = new Intl.NumberFormat("pt-BR");

async function fetchPublishedCount() {
  const response = await fetch(contentsUrl, {
    method: "HEAD",
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`TabNews count request failed with HTTP ${response.status}`);
  }

  const total = response.headers.get("x-pagination-total-rows");
  if (!total || !/^\d+$/.test(total)) {
    throw new Error("TabNews returned an invalid publication count header");
  }

  const count = Number(total);
  if (!Number.isSafeInteger(count)) {
    throw new Error("TabNews publication count exceeds the safe integer range");
  }

  return count;
}

// Cache validated values so failed refreshes preserve the last good count.
const getPublishedCount = unstable_cache(
  fetchPublishedCount,
  ["tabnews-published-count", contentsUrl],
  { revalidate: 60 },
);

function PublishedCountMessage({ value }) {
  return (
    <p>
      <strong>{value}</strong>
      <span>Total de publicações no TabNews</span>
    </p>
  );
}

async function PublishedCount() {
  let value = "Indisponível";

  try {
    value = formatCount.format(await getPublishedCount());
  } catch (error) {
    console.error("Unable to load the TabNews publication count:", error);
  }

  return <PublishedCountMessage value={value} />;
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
          <Suspense fallback={<PublishedCountMessage value="Consultando…" />}>
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
