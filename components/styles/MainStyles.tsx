import { Colors } from "@/constants/ColorConstants";
import { StyleSheet } from "react-native";

export const MainStyles = StyleSheet.create({
  safe: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 56,
    marginBottom: 32,
  },
  greetingBlock: {
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
    backgroundColor: Colors.WHITE_20,
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
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  menuCell: {
    maxWidth: "48%",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  menuImageWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.WHITE_15,
  },
  menuImage: {
    width: "100%",
    height: "100%",
  },
  menuTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.WHITE,
  },
});
