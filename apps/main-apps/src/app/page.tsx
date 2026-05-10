import { redirect } from "next/navigation";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";

export default async function Home() {
    const locale = await getLocaleFromHeaders();
      redirect(`/${locale}`);
}
