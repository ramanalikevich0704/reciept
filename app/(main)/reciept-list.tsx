import { recieptBackgroundImage } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { searchInput, Styles } from "@/components/styles/LoginStyles";
import { RecipeStyles } from "@/components/styles/RecipeStyles";
import {
  getRecipeInformation,
  searchRecipes,
  type RecipeInformation,
  type RecipeItem,
} from "@/src/api/spoonacular";
import { getFavoriteIds } from "@/src/storage/favoriteRecipes";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const DEBOUNCE_MS = 1000;
const numColumns = 2;
const LEFT_RIGHT_PADDING = 20;
const GAP = 15;
const size =
  (Dimensions.get("window").width - LEFT_RIGHT_PADDING * 2 - GAP) / numColumns;

type ListItem = { id: string; title: string; image: string };

function toListItem(r: RecipeItem): ListItem {
  return { id: String(r.id), title: r.title, image: r.image };
}

function toListItemFromInfo(r: RecipeInformation): ListItem {
  return { id: String(r.id), title: r.title, image: r.image };
}

export default function RecipeListScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isPopular = mode === "popular";

  // Search mode state
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<ListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Popular mode state
  const [popularRecipes, setPopularRecipes] = useState<RecipeInformation[]>([]);
  const [popularLoading, setPopularLoading] = useState(isPopular);

  const fetchRecipes = useCallback(
    async (query: string, offset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await searchRecipes(query, offset);
        const rows = res.results.map(toListItem);
        setTotalResults(res.totalResults);
        setRecipes((prev) => (append ? [...prev, ...rows] : rows));
      } catch {
        if (!append) setRecipes([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isPopular) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // fetchRecipes(searchQuery, 0, false);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchRecipes, isPopular]);

  const loadFavorites = useCallback(async () => {
    setPopularLoading(true);
    try {
      const ids = await getFavoriteIds();
      if (ids.length === 0) {
        setPopularRecipes([]);
        return;
      }
      const results = await Promise.all(
        ids.map((id) => getRecipeInformation(id)),
      );
      setPopularRecipes(results);
    } catch {
      setPopularRecipes([]);
    } finally {
      setPopularLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isPopular) loadFavorites();
    }, [isPopular, loadFavorites]),
  );

  const filteredPopular = useMemo(() => {
    if (!isPopular) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return popularRecipes;
    return popularRecipes.filter((r) => r.title.toLowerCase().includes(q));
  }, [isPopular, popularRecipes, searchQuery]);

  const listData: ListItem[] = isPopular
    ? filteredPopular.map(toListItemFromInfo)
    : recipes;

  const onEndReached = useCallback(() => {
    if (isPopular || loadingMore || loading) return;
    if (recipes.length >= totalResults || totalResults === 0) return;
    // fetchRecipes(searchQuery, recipes.length, true);
  }, [
    isPopular,
    loadingMore,
    loading,
    recipes.length,
    totalResults,
    searchQuery,
    fetchRecipes,
  ]);

  const openRecipeDetail = (recipeId: string) => {
    router.push({
      pathname: "/(main)/recipe-detail",
      params: { id: recipeId },
    });
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openRecipeDetail(item.id)}
      style={[RecipeStyles.card, RecipeStyles.cellShadow, { width: size }]}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        style={RecipeStyles.cardImage}
      />
      <Text
        style={RecipeStyles.cardTitle}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
      {isPopular && (
        <View style={RecipeStyles.favoriteButton} pointerEvents="none">
          <Icon name="heart" size={21} color="#FF3B30" />
        </View>
      )}
    </TouchableOpacity>
  );

  const title = isPopular ? "Популярные рецепты" : "Search by Recipe";
  const searchPlaceholder = isPopular
    ? "Поиск по списку..."
    : "What recipe are you looking for?";

  const listHeader = isPopular ? (
    <View style={RecipeStyles.listHeader}>
      <Text style={[Styles.smallCustomText, RecipeStyles.countText]}>
        {filteredPopular.length} из {popularRecipes.length} рецептов
      </Text>
    </View>
  ) : (
    <View style={RecipeStyles.listHeader}>
      {loading ? (
        <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
      ) : (
        <View style={{ alignSelf: "flex-start" }}>
          <Text style={[Styles.smallCustomText, RecipeStyles.countText]}>
            {totalResults} Recipes found
          </Text>
        </View>
      )}
    </View>
  );

  const listEmpty = isPopular ? (
    <View style={[Styles.container, RecipeStyles.emptyWrap]}>
      <Text style={[Styles.ordinaryCustomText, RecipeStyles.emptyText]}>
        {popularRecipes.length === 0
          ? "Нет избранных рецептов. Добавьте их в деталях рецепта."
          : "Ничего не найдено по запросу"}
      </Text>
    </View>
  ) : null;

  if (isPopular && popularLoading) {
    return (
      <ScreenTransition>
        <SafeAreaView style={[Styles.safeArea, RecipeStyles.safe]}>
          <View style={Styles.container}>
            <View style={RecipeStyles.headerImageWrap}>
              <Image
                source={recieptBackgroundImage}
                resizeMode="cover"
                style={RecipeStyles.headerImage}
              />
              <View style={RecipeStyles.headerOverlay}>
                <BackButton
                  onPress={() => router.back()}
                  style={Styles.backButton}
                />
                <View style={RecipeStyles.headerTextBlock}>
                  <Text
                    style={[
                      Styles.mediumStandardText,
                      Styles.boldCustomText,
                      Styles.whiteText,
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[Styles.container, RecipeStyles.centered]}>
              <ActivityIndicator size="large" />
              <Text
                style={[Styles.ordinaryCustomText, RecipeStyles.loadingText]}
              >
                Загрузка избранного...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition>
      <SafeAreaView style={[Styles.safeArea, RecipeStyles.safe]}>
        <View style={Styles.container}>
          <View style={RecipeStyles.headerImageWrap}>
            <Image
              source={recieptBackgroundImage}
              resizeMode="cover"
              style={RecipeStyles.headerImage}
            />
            <View style={RecipeStyles.headerOverlay}>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <BackButton
                  onPress={() => router.back()}
                  style={Styles.backButton}
                />
                <Text
                  style={[
                    Styles.mediumStandardText,
                    Styles.boldCustomText,
                    Styles.whiteText,
                  ]}
                >
                  {title}
                </Text>
                <View style={RecipeStyles.searchInputWrapper}>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[searchInput, RecipeStyles.searchInputWithIcon]}
                    placeholder={searchPlaceholder}
                    placeholderTextColor={Styles.darkGrayText.color}
                  />
                  <View style={RecipeStyles.searchInputIcon}>
                    <Icon
                      name="search"
                      size={22}
                      color={Styles.darkGrayText.color}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[Styles.container, RecipeStyles.listWrap]}>
            <FlatList
              data={listData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              style={[Styles.contentPadding, RecipeStyles.list]}
              contentContainerStyle={[
                Styles.scrollContent,
                RecipeStyles.listContent,
              ]}
              onEndReached={isPopular ? undefined : onEndReached}
              onEndReachedThreshold={0.4}
              ListHeaderComponent={listHeader}
              ListFooterComponent={
                !isPopular && loadingMore ? (
                  <ActivityIndicator
                    size="small"
                    style={{ marginVertical: 16 }}
                  />
                ) : null
              }
              ListEmptyComponent={listEmpty}
              columnWrapperStyle={
                numColumns > 1 ? RecipeStyles.columnWrapper : undefined
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenTransition>
  );
}
