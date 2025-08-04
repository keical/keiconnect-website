import { Head } from "@unhead/react";

export default function HomePage() {
  const { VITE_APP_SITENAME } = import.meta.env;
  
  return (
    <div>
      <Head>
        <title>Home - {VITE_APP_SITENAME}</title>
      </Head>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
}