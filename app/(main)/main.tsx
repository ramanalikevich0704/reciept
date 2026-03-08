import { AppBackground } from "@/components/AppBackground";
import { BackButton } from "@/components/BackButton";
import { ScreenTransition } from "@/components/ScreenTransition";
import { Styles } from "@/components/styles/LoginStyles";
import { MainStyles } from "@/components/styles/MainStyles";
import { useAuth } from "@/src/auth/services/AuthService";
import { useAuthStore } from "@/src/auth/store/useAuthStore";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

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
        <SafeAreaView
          style={[Styles.safeArea, Styles.contentPadding, MainStyles.safe]}
        >
          <BackButton
            onPress={() => AuthService.logout()}
            style={Styles.backButton}
          />
          <View style={MainStyles.header}>
            <View style={[Styles.container, MainStyles.greetingBlock]}>
              <Text style={[Styles.whiteText, MainStyles.greetingLabel]}>
                Привет,
              </Text>
              <Text
                style={[Styles.whiteText, MainStyles.greetingName]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayName}
              </Text>
            </View>
            <TouchableOpacity
              style={MainStyles.avatarWrapper}
              activeOpacity={0.8}
              onPress={() => {}}
            >
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={MainStyles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={MainStyles.avatarPlaceholder}>
                  <Icon name="person" size={40} color="rgba(255,255,255,0.9)" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={[Styles.container, MainStyles.menuGrid]}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[Styles.container, MainStyles.menuCell]}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.id === "recipes")
                    router.push("/(main)/reciept-list");
                  if (item.id === "popular")
                    router.push({
                      pathname: "/(main)/reciept-list",
                      params: { mode: "popular" },
                    });
                }}
              >
                <View style={MainStyles.menuImageWrap}>
                  <Image
                    source={{ uri: item.imageUri }}
                    style={MainStyles.menuImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={MainStyles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </AppBackground>
    </ScreenTransition>
  );
}
