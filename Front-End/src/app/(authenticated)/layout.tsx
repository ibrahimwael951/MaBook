import WithAuth from "@/middleware/WithAuth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WithAuth>{children}</WithAuth>;
}
