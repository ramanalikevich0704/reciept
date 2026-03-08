import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/styles/LoginStyles";
import { RecieptDetailsStyles } from "@/components/styles/RecieptDetailsStyles";
import { RecipeStyles } from "@/components/styles/RecipeStyles";
import { LABELS, RECIPE_DETAIL_TEXT } from "@/constants/constants";
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
  Text,
  TouchableOpacity,
  View,
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
      setError(RECIPE_DETAIL_TEXT.INVALID_ID);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRecipeInformation(recipeId);
      setRecipe(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : RECIPE_DETAIL_TEXT.LOAD_FAILED);
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
        <SafeAreaView
          style={[Styles.container, RecieptDetailsStyles.safe]}
          edges={["top"]}
        >
          <View style={[Styles.container, RecieptDetailsStyles.centered]}>
            <ActivityIndicator size="large" />
            <Text
              style={[
                Styles.ordinaryCustomText,
                RecieptDetailsStyles.loadingText,
              ]}
            >
              {RECIPE_DETAIL_TEXT.LOADING}
            </Text>
          </View>
        </SafeAreaView>
      </ScreenTransition>
    );
  }

  if (error || !recipe) {
    return (
      <ScreenTransition>
        <SafeAreaView
          style={[Styles.container, RecieptDetailsStyles.safe]}
          edges={["top"]}
        >
          <BackButton
            onPress={() => router.back()}
            iconColor="rgba(1, 2, 5, 1)"
            backgroundColor="rgba(196, 196, 196, 1)"
          />
          <View style={[Styles.container, RecieptDetailsStyles.centered]}>
            <Text
              style={[Styles.mediumCustomText, RecieptDetailsStyles.errorText]}
            >
              {error ?? RECIPE_DETAIL_TEXT.NOT_FOUND}
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

  const ratingPercent =
    typeof recipe.spoonacularScore === "number"
      ? Math.max(0, Math.min(100, recipe.spoonacularScore))
      : 0;

  const starsTotal = 5;
  const ratingAsStars = (ratingPercent / 100) * starsTotal;

  return (
    <ScreenTransition>
      <SafeAreaView
        style={[Styles.container, RecieptDetailsStyles.safe]}
        edges={["top"]}
      >
        <ScrollView
          style={Styles.container}
          contentContainerStyle={Styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              Styles.contentPadding,
              RecieptDetailsStyles.headerContainer,
            ]}
          >
            <View style={[Styles.container, RecieptDetailsStyles.headerLeft]}>
              <View style={RecieptDetailsStyles.backButtonWrapper}>
                <BackButton
                  onPress={() => router.back()}
                  iconColor="rgba(1, 2, 5, 1)"
                  backgroundColor="rgba(196, 196, 196, 1)"
                />
              </View>
              <Text style={RecieptDetailsStyles.titleText}>{recipe.title}</Text>
              {recipe.creditsText ? (
                <Text style={RecieptDetailsStyles.authorText}>
                  <Text style={RecieptDetailsStyles.authorPrefix}>
                    {LABELS.RECIPE_BY}{" "}
                  </Text>
                  <Text style={RecieptDetailsStyles.authorName}>
                    {recipe.creditsText}
                  </Text>
                </Text>
              ) : null}
              <View style={RecieptDetailsStyles.ratingRow}>
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
                      style={[
                        RecieptDetailsStyles.starWrapper,
                        { width: starSize, height: starSize },
                      ]}
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
                          <Icon name="star" size={starSize} color="#F99716" />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
            <TouchableOpacity
              style={[RecipeStyles.favoriteButton, RecipeStyles.bigFavouriteButtonSize]}
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

          <View style={RecieptDetailsStyles.heroImageWrap}>
            <Image
              source={{ uri: recipe.image }}
              style={RecieptDetailsStyles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View style={[Styles.contentPadding, RecieptDetailsStyles.content]}>
            {}

            {summaryText ? (
              <View style={RecieptDetailsStyles.section}>
                <Text
                  style={[
                    Styles.mediumCustomText,
                    Styles.boldCustomText,
                    RecieptDetailsStyles.sectionTitle,
                  ]}
                >
                  {LABELS.SECTION_ABOUT}
                </Text>
                <Text style={RecieptDetailsStyles.summaryText}>
                  {summaryText}
                </Text>
              </View>
            ) : null}

            {recipe.extendedIngredients?.length > 0 ? (
              <View style={RecieptDetailsStyles.section}>
                <Text style={RecieptDetailsStyles.ingredientsSectionTitle}>
                  {LABELS.SECTION_INGREDIENTS}
                </Text>
                {recipe.extendedIngredients.map((ing, idx) => (
                  <View
                    key={`ing-${idx}`}
                    style={RecieptDetailsStyles.ingredientRow}
                  >
                    <View style={RecieptDetailsStyles.ingredientBullet}>
                      <Text style={RecieptDetailsStyles.ingredientBulletText}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={RecieptDetailsStyles.ingredientText}>
                      {ing.original || `${ing.amount} ${ing.unit} ${ing.name}`}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {steps.length > 0 ||
            (recipe.instructions && recipe.instructions.trim()) ? (
              <View style={RecieptDetailsStyles.section}>
                <Text
                  style={[
                    Styles.mediumCustomText,
                    Styles.boldCustomText,
                    RecieptDetailsStyles.sectionTitle,
                  ]}
                >
                  {LABELS.SECTION_INSTRUCTIONS}
                </Text>
                {steps.length > 0 ? (
                  steps.map((step, idx) => (
                    <View key={idx} style={RecieptDetailsStyles.stepRow}>
                      <View style={RecieptDetailsStyles.stepNumber}>
                        <Text
                          style={[
                            Styles.smallCustomText,
                            RecieptDetailsStyles.stepNumberText,
                          ]}
                        >
                          {step.number}
                        </Text>
                      </View>
                      <Text
                        style={[
                          Styles.ordinaryCustomText,
                          RecieptDetailsStyles.stepText,
                        ]}
                      >
                        {step.step}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[
                      Styles.ordinaryCustomText,
                      RecieptDetailsStyles.bodyText,
                    ]}
                  >
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
