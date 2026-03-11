import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

type AdaptiveContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Пропсы, передаваемые в ScrollView при использовании прокрутки (напр. keyboardShouldPersistTaps) */
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;
};

/**
 * Контейнер, который рендерит либо View, либо ScrollView:
 * - если высота содержимого не больше доступной высоты — статичный View;
 * - иначе — ScrollView.
 * Выбор делается после измерения контейнера и содержимого.
 */
export function AdaptiveContainer({
  children,
  style,
  contentContainerStyle,
  scrollViewProps = {},
}: AdaptiveContainerProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setContainerHeight(height);
  }, []);

  const onContentLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    setContentHeight(height);
  }, []);

  const ready = containerHeight > 0 && contentHeight > 0;
  const useScroll = ready && contentHeight > containerHeight;

  return (
    <View style={[{ flex: 1 }, style]} onLayout={onContainerLayout}>
      {!ready && (
        <View
          style={{ position: "absolute", left: 0, right: 0, top: 0 }}
          onLayout={onContentLayout}
        >
          {children}
        </View>
      )}
      {ready &&
        (useScroll ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            {...scrollViewProps}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
        ))}
    </View>
  );
}
