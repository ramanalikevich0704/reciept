import { Colors } from "@/constants/ColorConstants";
import { StyleSheet } from "react-native";

export const RecieptDetailsStyles = StyleSheet.create({
  safe: {
    backgroundColor: Colors.WHITE,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.MUTED_TEXT,
  },
  errorText: {
    color: Colors.ERROR_RED,
    textAlign: "center",
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {},
  backButtonWrapper: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  titleText: {
    fontFamily: "Apercu Pro",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 31,
    letterSpacing: 0.28,
    color: Colors.TITLE_DARK,
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
    color: Colors.SLATE_TEXT,
  },
  authorName: {
    color: Colors.GREEN_PRIMARY,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starWrapper: {
    marginRight: 4,
  },
  heroImageWrap: {
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 260,
    backgroundColor: Colors.PLACEHOLDER_BG,
    borderRadius: 10,
  },
  content: {
    paddingTop: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: Colors.GREEN_TINT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.GREEN_PRIMARY,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.TITLE_DARK,
    marginBottom: 10,
  },
  ingredientsSectionTitle: {
    fontFamily: "Apercu Pro",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 31,
    letterSpacing: 0.14,
    color: Colors.NEAR_BLACK,
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
    color: Colors.GRAY_80,
  },
  bodyText: {
    color: Colors.SLATE_TEXT,
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
    backgroundColor: Colors.GRAY_BULLET,
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientBulletText: {
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 11,
    backgroundColor: Colors.GRAY_BULLET,
    color: Colors.NEAR_BLACK,
  },
  ingredientText: {
    flex: 1,
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
    color: Colors.SLATE_TEXT,
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
    backgroundColor: Colors.GREEN_PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    color: Colors.SLATE_TEXT,
    lineHeight: 22,
  },
});
