import Link from "next/link";
import {
  Code2,
  Smartphone,
  Database,
  Palette,
  Cloud,
  ShieldCheck,
  GraduationCap,
  LineChart,
  Binary,
  Atom,
} from "lucide-react";

const iconMap = {
  "web-development": Code2,
  "mobile-development": Smartphone,
  "data-science": Database,
  design: Palette,
  devops: Cloud,
  security: ShieldCheck,
  education: GraduationCap,
  business: LineChart,
  programming: Binary,
  science: Atom,
};

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    slug: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.slug as keyof typeof iconMap] || GraduationCap;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-start transition-colors"
    >
      <div className="rounded-md bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          {category.description.length > 80
            ? category.description.slice(0, 80) + "..."
            : category.description}
        </p>
      </div>
    </Link>
  );
}
