import { recieptBackgroundImage } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import {
  searchInput,
  Styles,
} from "@/components/login/LoginStyles";
import { getRecipeInformation, type RecipeInformation } from "@/src/api/spoonacular";
import { getFavoriteIds } from "@/src/storage/favoriteRecipes";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const numColumns = 2;
const LEFT_RIGHT_PADDING = 20;
const GAP = 15;
const size =
  (Dimensions.get("window").width - LEFT_RIGHT_PADDING * 2 - GAP) / numColumns;

export default function PopularRecipesScreen() {
  const [recipes, setRecipes] = useState<RecipeInformation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await getFavoriteIds();
      if (ids.length === 0) {
        setRecipes([]);
        return;
      }
      const results = await Promise.all(
        ids.map((id) => getRecipeInformation(id))
      );
      setRecipes(results);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((r) => r.title.toLowerCase().includes(q));
  }, [recipes, searchQuery]);

  const openRecipeDetail = (recipeId: number) => {
    router.push({
      pathname: "/(main)/recipe-detail",
      params: { id: String(recipeId) },
    });
  };

  const renderItem = ({ item }: { item: RecipeInformation }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openRecipeDetail(item.id)}
      style={[
        styles.card,
        styles.cellShadow,
        { width: size },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        style={styles.cardImage}
      />
      <Text
        style={styles.cardTitle}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
      <View style={styles.heartBadge} pointerEvents="none">
        <Icon name="heart" size={21} color="#FF3B30" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenTransition>
      <SafeAreaView style={[Styles.safeArea, styles.safe]}>
        <View style={styles.container}>
          <View style={styles.headerImageWrap}>
            <Image
              source={recieptBackgroundImage}
              resizeMode="cover"
              style={styles.headerImage}
            />
            <View style={styles.headerOverlay}>
              <BackButton onPress={() => router.back()} />
              <View style={styles.headerTextBlock}>
                <Text
                  style={[
                    Styles.mediumStandardText,
                    Styles.boldCustomText,
                    Styles.whiteText,
                  ]}
                >
                  Популярные рецепты
                </Text>
                <View style={styles.searchInputWrapper}>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[searchInput, styles.searchInputWithIcon]}
                    placeholder="Поиск по списку..."
                    placeholderTextColor={Styles.darkGrayText.color}
                  />
                  <View style={styles.searchInputIcon}>
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
          <View style={styles.listWrap}>
            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={[Styles.ordinaryCustomText, styles.loadingText]}>
                  Загрузка избранного...
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredRecipes}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                numColumns={numColumns}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={
                  <View style={styles.listHeader}>
                    <Text
                      style={[
                        Styles.smallCustomText,
                        styles.countText,
                      ]}
                    >
                      {filteredRecipes.length} из {recipes.length} рецептов
                    </Text>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.emptyWrap}>
                    <Text style={[Styles.ordinaryCustomText, styles.emptyText]}>
                      {recipes.length === 0
                        ? "Нет избранных рецептов. Добавьте их в деталях рецепта."
                        : "Ничего не найдено по запросу"}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "white" },
  container: { flex: 1 },
  headerImageWrap: { position: "relative" },
  headerImage: { width: "100%", borderRadius: 10 },
  headerOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    justifyContent: "space-between",
  },
  headerTextBlock: { gap: 12 },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  searchInputWrapper: {
    position: "relative",
    marginTop: 8,
  },
  searchInputWithIcon: { paddingRight: 44 },
  searchInputIcon: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  listWrap: {
    flex: 1,
    marginTop: -25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  list: { paddingHorizontal: LEFT_RIGHT_PADDING, paddingTop: 15 },
  listContent: { paddingBottom: 24, flexGrow: 1 },
  listHeader: { marginBottom: 16 },
  countText: {
    color: "rgba(136, 148, 162, 1)",
    borderWidth: 0.5,
    borderColor: "rgba(180, 194, 211, 1)",
    borderRadius: 12,
    padding: 10,
    alignSelf: "flex-start",
  },
  columnWrapper: { gap: GAP, marginBottom: 20 },
  card: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(180, 194, 211, 0.2)",
    backgroundColor: "white",
  },
  cardImage: { width: 48, height: 48, borderRadius: 10 },
  cardTitle: { flex: 1, flexShrink: 1 },
  heartBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 21,
    height: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  cellShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { color: "rgba(136, 148, 162, 1)" },
  emptyWrap: { flex: 1, justifyContent: "center", paddingVertical: 48 },
  emptyText: { color: "rgba(136, 148, 162, 1)", textAlign: "center" },
});
