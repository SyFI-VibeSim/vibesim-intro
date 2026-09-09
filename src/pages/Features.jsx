import { PageHero } from "../components/PageHero";
import { Advantages } from "../sections/Advantages";

export function Features() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Fast to explore.
            <br />
            Clear about the evidence.
          </>
        }
        description="Test more configurations in less time, understand what limits performance, and use the Agent to investigate without writing simulation code."
        image="hero-datacenter-a.webp"
        href="#advantages"
        linkLabel="Explore the features"
      />
      <Advantages standalone />
    </>
  );
}
