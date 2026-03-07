import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/login/LoginStyles";
import {
  getRecipeInformation,
  type RecipeInformation,
} from "@/src/api/spoonacular";
import {
  isFavorite as checkIsFavorite,
  toggleFavorite,
} from "@/src/storage/favoriteRecipes";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const recipeId = id ? parseInt(id, 10) : NaN;

  const fetchRecipe = useCallback(async () => {
    if (!id || isNaN(recipeId)) {
      setError("Invalid recipe id");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipeInformation(recipeId);
      setRecipe(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  }, [id, recipeId]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  useEffect(() => {
    if (isNaN(recipeId)) return;
    let cancelled = false;
    checkIsFavorite(recipeId).then((fav) => {
      if (!cancelled) setIsFavorite(fav);
    });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  if (loading) {
    return (
      <ScreenTransition>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text style={[Styles.ordinaryCustomText, styles.loadingText]}>
              Loading recipe...
            </Text>
          </View>
        </SafeAreaView>
      </ScreenTransition>
    );
  }

  if (error || !recipe) {
    return (
      <ScreenTransition>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <BackButton
          onPress={() => router.back()}
          iconColor="rgba(1, 2, 5, 1)"
          backgroundColor="rgba(196, 196, 196, 1)"
        />
          <View style={styles.centered}>
            <Text style={[Styles.mediumCustomText, styles.errorText]}>
              {error ?? "Recipe not found"}
            </Text>
          </View>
        </SafeAreaView>
      </ScreenTransition>
    );
  }

  const summaryText = recipe.summary ? stripHtml(recipe.summary) : "";
  const hasAnalyzedSteps =
    recipe.analyzedInstructions?.length > 0 &&
    recipe.analyzedInstructions.some((i) => i.steps?.length > 0);
  const steps = hasAnalyzedSteps
    ? recipe.analyzedInstructions.flatMap((i) => i.steps)
    : [];

  const ratingPercent = typeof recipe.spoonacularScore === "number"
    ? Math.max(0, Math.min(100, recipe.spoonacularScore))
    : 0;

  const starsTotal = 5;
  const ratingAsStars = (ratingPercent / 100) * starsTotal;

  return (
    <ScreenTransition>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <View style={styles.backButtonWrapper}>
              <BackButton
                onPress={() => router.back()}
                iconColor="rgba(1, 2, 5, 1)"
                backgroundColor="rgba(196, 196, 196, 1)"
              />
            </View>
            <Text style={styles.titleText}>
              {recipe.title}
            </Text>
            {recipe.creditsText ? (
              <Text style={styles.authorText}>
                <Text style={styles.authorPrefix}>Recipe by </Text>
                <Text style={styles.authorName}>{recipe.creditsText}</Text>
              </Text>
            ) : null}
            <View style={styles.ratingRow}>
              {Array.from({ length: starsTotal }).map((_, index) => {
                const starNumber = index + 1;
                let fill = 0;
                if (ratingAsStars >= starNumber) {
                  fill = 1;
                } else if (ratingAsStars + 1 <= starNumber) {
                  fill = 0;
                } else {
                  fill = ratingAsStars - (starNumber - 1);
                }
                const starSize = 18;
                return (
                  <View
                    key={index}
                    style={[styles.starWrapper, { width: starSize, height: starSize }]}
                  >
                    <Icon
                      name="star"
                      size={starSize}
                      color="rgba(180, 194, 211, 0.3)"
                    />
                    {fill > 0 && (
                      <View
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: starSize * fill,
                          overflow: "hidden",
                        }}
                      >
                        <Icon
                          name="star"
                          size={starSize}
                          color="#F99716"
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.7}
            onPress={async () => {
              const next = await toggleFavorite(recipeId);
              setIsFavorite(next);
            }}
          >
            <Icon
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? "#FF3B30" : "rgba(180, 194, 211, 1)"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.heroImageWrap}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          {/* <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={[Styles.smallCustomText, styles.badgeText]}>
                ⏱ {recipe.readyInMinutes} min
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={[Styles.smallCustomText, styles.badgeText]}>
                🍽 {recipe.servings} servings
              </Text>
            </View>
          </View> */}

          {summaryText ? (
            <View style={styles.section}>
              <Text style={[Styles.mediumCustomText, Styles.boldCustomText, styles.sectionTitle]}>
                About
              </Text>
              <Text style={styles.summaryText}>
                {summaryText}
              </Text>
            </View>
          ) : null}

          {recipe.extendedIngredients?.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.ingredientsSectionTitle}>
                Ingredients
              </Text>
              {recipe.extendedIngredients.map((ing, idx) => (
                <View key={ing.id ?? idx} style={styles.ingredientRow}>
                  <View style={styles.ingredientBullet}>
                    <Text style={styles.ingredientBulletText}>
                      {idx + 1}
                    </Text>
                  </View>
                  <Text style={styles.ingredientText}>
                    {ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {(steps.length > 0 || (recipe.instructions && recipe.instructions.trim())) ? (
            <View style={styles.section}>
              <Text style={[Styles.mediumCustomText, Styles.boldCustomText, styles.sectionTitle]}>
                Instructions
              </Text>
              {steps.length > 0 ? (
                steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={[Styles.smallCustomText, styles.stepNumberText]}>
                        {step.number}
                      </Text>
                    </View>
                    <Text style={[Styles.ordinaryCustomText, styles.stepText]}>
                      {step.step}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[Styles.ordinaryCustomText, styles.bodyText]}>
                  {recipe.instructions}
                </Text>
              )}
            </View>
          ) : null}
        </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "rgba(136, 148, 162, 1)",
  },
  errorText: {
    color: "#c00",
    textAlign: "center",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  backButtonWrapper: {
    marginBottom: 12,
  },
  titleText: {
    fontFamily: "Apercu Pro",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 31,
    letterSpacing: 0.28,
    color: "#1a1a1a",
  },
  authorText: {
    marginTop: 4,
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
  },
  authorPrefix: {
    color: "rgba(180, 194, 211, 1)",
  },
  authorName: {
    color: "rgba(52, 168, 83, 1)",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starWrapper: {
    marginRight: 4,
  },
  favoriteButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(242, 244, 247, 1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  heroImageWrap: {
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "rgba(52, 168, 83, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: "rgba(52, 168, 83, 1)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#1a1a1a",
    marginBottom: 10,
  },
  ingredientsSectionTitle: {
    fontFamily: "Apercu Pro",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 31,
    letterSpacing: 0.14,
    color: "rgba(1, 2, 5, 1)",
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
    color: "rgba(80, 80, 80, 1)",
  },
  bodyText: {
    color: "rgba(180, 194, 211, 1)",
    lineHeight: 22,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    gap: 12,
  },
  ingredientBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(196, 196, 196, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientBulletText: {
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 11,
    backgroundColor: 'rgba(196, 196, 196, 1)',
    color: "rgba(1, 2, 5, 1)",
  },
  ingredientText: {
    flex: 1,
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
    // color: "rgba(60, 60, 60, 1)",
    color: 'rgba(180, 194, 211, 1)'
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(52, 168, 83, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    color: "rgba(180, 194, 211, 1)",
    lineHeight: 22,
  },
});
