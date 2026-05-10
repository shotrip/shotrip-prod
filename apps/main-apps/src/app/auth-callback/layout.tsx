import AmplifyConfigure from "@/components/en_only/amplifyConfigure";

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AmplifyConfigure />
      {children}
    </>
  );
}