import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dsaCategories } from "@/data/dsaTopics";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border">
      <Button
        variant={activeCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className={cn(
          "transition-all duration-300",
          activeCategory === null && "bg-gradient-primary"
        )}
      >
        All Topics
      </Button>
      
      {Object.entries(dsaCategories).map(([key, category]) => (
        <Button
          key={key}
          variant={activeCategory === key ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(key)}
          className={cn(
            "transition-all duration-300 flex items-center space-x-2",
            activeCategory === key && "bg-gradient-primary"
          )}
        >
          <span className="text-sm">{category.icon}</span>
          <span>{category.name}</span>
        </Button>
      ))}
    </div>
  );
};