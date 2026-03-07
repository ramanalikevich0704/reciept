import { recieptBackgroundImage } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import {
  searchInput,
  Styles
} from "@/components/login/LoginStyles";
import { searchRecipes, type RecipeItem } from "@/src/api/spoonacular";
import { useAuth } from "@/src/auth/services/AuthService";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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

const DEBOUNCE_MS = 1000;
const numColumns = 2;
const LEFT_RIGHT_PADDING = 20;
const GAP = 15;
const size =
  (Dimensions.get("window").width - LEFT_RIGHT_PADDING * 2 - GAP) / numColumns;

type RecipeRow = { id: string; title: string; image: string };

function toRow(r: RecipeItem): RecipeRow {
  return { id: String(r.id), title: r.title, image: r.image };
}

export default function MainView() {
  const { AuthService } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRecipes = useCallback(
    async (query: string, offset: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      try {
        const res = await searchRecipes(query, offset);
        const rows = res.results.map(toRow);
        setTotalResults(res.totalResults);
        setRecipes((prev) => (append ? [...prev, ...rows] : rows));
      } catch (e) {
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      console.log("fetchRecipes(searchQuery, 0, false);");
      fetchRecipes(searchQuery, 0, false);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, fetchRecipes]);

  const onEndReached = useCallback(() => {
    if (loadingMore || loading) return;
    if (recipes.length >= totalResults || totalResults === 0) return;
    fetchRecipes(searchQuery, recipes.length, true);
  }, [
    loadingMore,
    loading,
    recipes.length,
    totalResults,
    searchQuery,
    fetchRecipes,
  ]);

  const openRecipeDetail = (recipeId: string) => {
    router.push({ pathname: "/(main)/recipe-detail", params: { id: recipeId } });
  };

  const renderItem = ({ item }: { item: RecipeRow }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openRecipeDetail(item.id)}
      style={[
        styles.item,
        styles.cellShadow,
        {
          width: size,
          padding: 15,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          gap: 15,
          borderRadius: 10,
          borderWidth: 0.5,
          borderColor: "rgba(180, 194, 211, 0.2)",
          backgroundColor: "white",
        },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        style={{ width: 48, height: 48, borderRadius: 10 }}
      />
      <Text
        style={{ flex: 1, flexShrink: 1 }}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenTransition>
      <SafeAreaView
        style={[
          Styles.safeArea,
          {
            backgroundColor: "white",
            // paddingHorizontal: 20,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
        <View style={{ position: "relative" }}>
          <Image
            source={recieptBackgroundImage}
            resizeMode="cover"
            style={{ width: "100%", borderRadius: 10 }}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              bottom: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <BackButton onPress={() => router.back()} />
              <View style={{ gap: 12 }}>
                <Text
                  style={[
                    Styles.mediumStandardText,
                    Styles.boldCustomText,
                    Styles.whiteText,
                  ]}
                >
                  Search by Recipe
                </Text>
                <View style={styles.searchInputWrapper}>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[searchInput, styles.searchInputWithIcon]}
                    placeholder={"What recipe are you looking for?"}
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
        </View>
        <View
          key="reciept-list"
          style={{
            flex: 1,
            marginTop: -25,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
          }}
        >
          <FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            style={{ paddingHorizontal: 20, paddingTop: 15 }}
            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    style={{ marginVertical: 12 }}
                  />
                ) : (
                  <View style={{ alignSelf: "flex-start" }}>
                    <Text
                      style={[
                        Styles.smallCustomText,
                        {
                          color: "rgba(136, 148, 162, 1)",
                          borderWidth: 0.5,
                          borderColor: "rgba(180, 194, 211, 1)",
                          borderRadius: 12,
                          padding: 10,
                        },
                      ]}
                    >
                      {totalResults} Recipes found
                    </Text>
                  </View>
                )}
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  style={{ marginVertical: 16 }}
                />
              ) : null
            }
            columnWrapperStyle={
              numColumns > 1 ? styles.columnWrapper : undefined
            }
          />
          {/* <TouchableOpacity
            style={[
              Styles.button,
              Styles.centerPosition,
              Styles.element,
              Styles.centerPosition
            ]}
            onPress={onSubmit}
          >
            <Text style={[Styles.greenText]}>Logout</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 48,
    left: 8,
    zIndex: 10,
    padding: 8,
    marginLeft: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginTop: 44,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  searchInputWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  searchInputWithIcon: {
    paddingRight: 44,
  },
  searchInputIcon: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    marginBottom: 16,
  },
  // listHeaderTitle: {
  //   fontSize: 20,
  //   fontWeight: "600",
  // },
  columnWrapper: {
    gap: 15,
    marginBottom: 20,
  },
  separator: {
    height: 12,
  },
  cellShadow: {
    // iOS: x, y, blur (spread в RN нет — можно усилить shadowRadius + shadowOpacity)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 }, // x, y
    shadowOpacity: 0.08,
    shadowRadius: 10, // blur
    // Android: elevation даёт и смещение, и размытие (отдельно x/y/blur нет)
    elevation: 5,
  },
});
