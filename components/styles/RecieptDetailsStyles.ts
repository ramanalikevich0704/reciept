import { StyleSheet } from "react-native";

export const RecieptDetailsStyles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },
  centered: {
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
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {},
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
    backgroundColor: "rgba(196, 196, 196, 1)",
    color: "rgba(1, 2, 5, 1)",
  },
  ingredientText: {
    flex: 1,
    fontFamily: "Apercu Pro",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0.08,
    color: "rgba(180, 194, 211, 1)",
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
