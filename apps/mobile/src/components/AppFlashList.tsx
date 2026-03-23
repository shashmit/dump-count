import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import { forwardRef, type ForwardedRef } from "react";

function AppFlashListInner<ItemT>(
  {
    estimatedItemSize = 120,
    showsHorizontalScrollIndicator = false,
    showsVerticalScrollIndicator = false,
    ...props
  }: FlashListProps<ItemT> & { estimatedItemSize?: number },
  ref: ForwardedRef<FlashListRef<ItemT>>
) {
  return (
    <FlashList
      ref={ref}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    />
  );
}

export const AppFlashList = forwardRef(AppFlashListInner) as <ItemT>(
  props: FlashListProps<ItemT> & { estimatedItemSize?: number; ref?: ForwardedRef<FlashListRef<ItemT>> }
) => ReturnType<typeof AppFlashListInner>;
