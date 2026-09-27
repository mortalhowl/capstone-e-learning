/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành chuỗi không dấu ngăn cách bằng gạch nối (Slug).
 * Ví dụ: "Lập trình ReactJS Pro" -> "lap-trinh-reactjs-pro"
 */
export function slugify(str: string): string {
  if (!str) return "";

  return str
    .toLowerCase()
    .normalize("NFD") // Tách các ký tự có dấu thành ký tự gốc + dấu
    .replace(/[\u0300-\u036f]/g, "") // Xóa tất cả dấu
    .replace(/[đĐ]/g, "d") // Chuyển chữ đ, Đ thành d
    .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch nối
    .replace(/-+/g, "-"); // Xóa các dấu gạch nối liên tiếp
}
