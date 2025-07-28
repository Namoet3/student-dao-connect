import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ProjectFilters as FilterType } from '@/hooks/useProjects';

interface ProjectFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
] as const;

export const ProjectFilters = ({ filters, onFiltersChange }: ProjectFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleStatusChange = (status: FilterType['status']) => {
    onFiltersChange({ ...filters, status });
  };

  const handleBudgetChange = (range: number[]) => {
    onFiltersChange({
      ...filters,
      budgetMin: range[0],
      budgetMax: range[1],
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.budgetMin !== undefined || filters.budgetMax !== undefined;

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search projects</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label>Status</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {statusOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.status === option.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <Label>Budget Range (ETH)</Label>
          <div className="px-3 pt-4">
            <Slider
              value={[filters.budgetMin || 0, filters.budgetMax || 10]}
              max={10}
              step={0.1}
              onValueChange={handleBudgetChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{(filters.budgetMin || 0).toFixed(1)} ETH</span>
              <span>{(filters.budgetMax || 10).toFixed(1)} ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};