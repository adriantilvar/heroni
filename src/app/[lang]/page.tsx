import { getDictionary } from "@/i18n/get-dictionary";

type HomeParams = Promise<{
  lang: string;
}>;

export default async function Home({ params }: { params: HomeParams }) {
  const { lang } = await params;
  const { landing } = await getDictionary(lang);

  return (
    <div className="mx-auto mt-[20%] size-fit bg-orange-100 p-2 font-mono text-orange-900 text-xl">
      🚧 {landing.hello}👷🏼‍♂️ 🚧
    </div>
  );
}
