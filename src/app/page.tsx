import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { StatsSection } from "@/components/home/stats-section";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <HeroSection />
      <FeaturedCourses />
      <StatsSection />
    </div>
  );
}
