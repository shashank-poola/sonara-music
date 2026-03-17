import { Redirect, type Href } from "expo-router";

export default function Index() {
  // With typed routes enabled, explicitly type the target route.
  const home: Href = "/(tabs)/home";
  return <Redirect href={home} />;
}
