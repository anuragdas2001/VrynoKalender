import Head from "next/head";
import { ReactNode } from "react";

const BaseLayout = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const finalTitle = `Vryno - ${title}`;
  return (
    <>
      <Head>
        <title key="vryno-title">{finalTitle}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/vryno_logo.svg"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/vryno_logo.svg"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="">{children}</div>
    </>
  );
};

export default BaseLayout;
