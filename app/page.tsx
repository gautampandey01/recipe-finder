"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Moon, Sun, ChefHat, Clock, Users, ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strInstructions: string
  strCategory: string
  strArea: string
  strYoutube?: string
  strSource?: string
}

interface ApiResponse {
  meals: Recipe[] | null
}

export default function RecipeFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError("")
    setHasSearched(true)

    try {
      // Using TheMealDB API as it's free and doesn't require authentication
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch recipes")
      }

      const data: ApiResponse = await response.json()
      setRecipes(data.meals || [])
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.")
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchRecipes()
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-sans text-foreground">Recipe Finder</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-accent/20">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-sans text-foreground mb-6">
            Discover Amazing <span className="text-primary">Recipes</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search through thousands of delicious recipes from around the world. Find your next favorite dish in
            seconds.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base bg-input border-border focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              onClick={searchRecipes}
              disabled={loading || !searchQuery.trim()}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {loading ? <div className="animate-pulse-gentle">Searching...</div> : "Search"}
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-6xl">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-lg">Finding delicious recipes...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          {hasSearched && !loading && !error && recipes.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No recipes found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else like "cake", "chicken", or "burger"
                </p>
              </div>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold font-sans text-foreground mb-2">
                  Found {recipes.length} delicious recipe{recipes.length !== 1 ? "s" : ""}
                </h3>
                <p className="text-muted-foreground">Click on any recipe to view the full details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                  <Card
                    key={recipe.idMeal}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => {
                      if (recipe.strSource) {
                        window.open(recipe.strSource, "_blank")
                      } else if (recipe.strYoutube) {
                        window.open(recipe.strYoutube, "_blank")
                      }
                    }}
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={recipe.strMealThumb || "/placeholder.svg"}
                        alt={recipe.strMeal}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold font-sans text-lg text-card-foreground mb-2 line-clamp-2">
                        {recipe.strMeal}
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.strCategory}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{recipe.strArea}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {recipe.strInstructions.substring(0, 120)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 hover:bg-accent/20 bg-transparent"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Recipe
                        </Button>
                        {recipe.strYoutube && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(recipe.strYoutube, "_blank")
                            }}
                          >
                            Watch Video
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-bold font-sans text-foreground">Recipe Finder</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Discover amazing recipes from around the world. Made with ❤️ by Gautam Pandey.
          </p>
          
        </div>
      </footer>
    </div>
  )
}
