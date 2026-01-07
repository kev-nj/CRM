"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  relationships: string[]
}

export interface SearchFilters {
  searchIn: "all" | "names" | "conversations" | "context"
  relationship: string
}

export function AdvancedSearch({ onSearch, relationships }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    searchIn: "all",
    relationship: "all",
  })

  const handleSearch = (query: string, newFilters?: SearchFilters) => {
    const currentFilters = newFilters || filters
    setSearchQuery(query)
    onSearch(query, currentFilters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    handleSearch(searchQuery, newFilters)
  }

  const handleClear = () => {
    setSearchQuery("")
    setFilters({
      searchIn: "all",
      relationship: "all",
    })
    onSearch("", {
      searchIn: "all",
      relationship: "all",
    })
  }

  const hasActiveFilters = filters.searchIn !== "all" || filters.relationship !== "all"

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts and conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={isExpanded || hasActiveFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {(searchQuery || hasActiveFilters) && (
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-in">Search in</Label>
              <Select value={filters.searchIn} onValueChange={(value) => handleFilterChange("searchIn", value)}>
                <SelectTrigger id="search-in">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everything</SelectItem>
                  <SelectItem value="names">Names only</SelectItem>
                  <SelectItem value="conversations">Conversations only</SelectItem>
                  <SelectItem value="context">Context only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship-filter">Relationship</Label>
              <Select value={filters.relationship} onValueChange={(value) => handleFilterChange("relationship", value)}>
                <SelectTrigger id="relationship-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All relationships</SelectItem>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
