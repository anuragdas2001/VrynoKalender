import Head from "next/head";

export function VrynoHead({ title }: { title: string }) {
  const titleUpdate = `Vryno - ${title}`;
  return (
    <Head>
      <title key="vryno-title">{titleUpdate}</title>;
    </Head>
  );
}
