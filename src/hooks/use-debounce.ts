"use client";

import { useEffect, useState } from "react";

/**
 * useDebounce Hook:
 * Trì hoãn việc cập nhật giá trị cho đến khi người dùng ngừng thay đổi trong một khoảng thời gian (delay).
 * Rất hữu ích cho ô input search để tránh gọi API liên tục mỗi khi gõ phím.
 *
 * @param value Giá trị cần debounce (ví dụ: chuỗi tìm kiếm)
 * @param delay Thời gian chờ (mili-giây), mặc định là 400ms
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
