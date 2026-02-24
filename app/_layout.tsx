import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthRouter from "@/app/router/AuthRouter";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return <AuthRouter />//add fabric for routers when add main
}
