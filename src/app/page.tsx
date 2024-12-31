import { Button } from "@/components/ui/button";
import envConfig from "@/config";

export default function Home() {
  console.log(envConfig.NEXT_PUBLIC_API_ENDPOINT);
  return (
    <>
      <Button>Click me</Button>
    </>
  );
}
