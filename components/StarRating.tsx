import { Colors } from "@/constants/ColorConstants";
import { RecieptDetailsStyles } from "@/components/styles/RecieptDetailsStyles";
import { StyleProp, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export interface StarRatingProps {
  /** Рейтинг в процентах (0–100) */
  rating: number;
  /** Количество звёзд */
  totalStars?: number;
  /** Размер иконки в пикселях */
  size?: number;
  /** Стиль контейнера (ряд звёзд) */
  style?: StyleProp<ViewStyle>;
  /** Цвет пустой звезды */
  emptyColor?: string;
  /** Цвет заполненной звезды */
  filledColor?: string;
}

const DEFAULT_TOTAL = 5;
const DEFAULT_SIZE = 18;
const DEFAULT_EMPTY = Colors.STAR_EMPTY;
const DEFAULT_FILLED = Colors.STAR_FILLED;

export function StarRating({
  rating,
  totalStars = DEFAULT_TOTAL,
  size = DEFAULT_SIZE,
  style,
  emptyColor = DEFAULT_EMPTY,
  filledColor = DEFAULT_FILLED,
}: StarRatingProps) {
  const ratingPercent = Math.max(0, Math.min(100, rating));
  const ratingAsStars = (ratingPercent / 100) * totalStars;

  return (
    <View style={[RecieptDetailsStyles.ratingRow, style]}>
      {Array.from({ length: totalStars }).map((_, index) => {
        const starNumber = index + 1;
        let fill = 0;
        if (ratingAsStars >= starNumber) {
          fill = 1;
        } else if (ratingAsStars + 1 <= starNumber) {
          fill = 0;
        } else {
          fill = ratingAsStars - (starNumber - 1);
        }
        return (
          <View
            key={index}
            style={[
              RecieptDetailsStyles.starWrapper,
              { width: size, height: size },
            ]}
          >
            <Icon name="star" size={size} color={emptyColor} />
            {fill > 0 && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: size * fill,
                  overflow: "hidden",
                }}
              >
                <Icon name="star" size={size} color={filledColor} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
