import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/login/LoginStyles";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/src/auth/services/AuthService";

const MENU_ITEMS = [
  {
    id: "recipes",
    title: "Рецепты",
    imageUri: "https://img.spoonacular.com/recipes/716429-312x231.jpg",
  },
  {
    id: "popular",
    title: "Популярные",
    imageUri: "https://img.spoonacular.com/recipes/715538-312x231.jpg",
  },
] as const;

export default function ProfileView() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const displayName =
    user?.displayName ?? user?.email?.split("@")[0] ?? "Гость";

  const { AuthService } = useAuth();

  return (
    <ScreenTransition>
      <AppBackground>
        <SafeAreaView style={[Styles.safeArea, styles.safe]}>
          <BackButton onPress={() => AuthService.logout()} />

        {/* Шапка: приветствие слева, аватар справа */}
        <View style={styles.header}>
          <View style={styles.greetingBlock}>
            <Text style={[Styles.whiteText, styles.greetingLabel]}>
              Привет,
            </Text>
            <Text
              style={[Styles.whiteText, styles.greetingName]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.avatarWrapper}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={40} color="rgba(255,255,255,0.9)" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Две ячейки по центру: картинка + заголовок снизу */}
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCell}
              activeOpacity={0.85}
              onPress={() => {
                if (item.id === "recipes") router.push("/(main)/reciept-list");
                if (item.id === "popular") router.push("/(main)/popular-recipes");
              }}
            >
              <View style={styles.menuImageWrap}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.menuImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 28,
    zIndex: 10,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 56,
    marginBottom: 32,
  },
  greetingBlock: {
    flex: 1,
    marginRight: 16,
  },
  greetingLabel: {
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: "700",
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  menuGrid: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  menuCell: {
    flex: 1,
    maxWidth: "48%",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  menuImageWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  menuImage: {
    width: "100%",
    height: "100%",
  },
  menuTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
