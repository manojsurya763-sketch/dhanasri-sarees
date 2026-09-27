export function placeholderImage(title: string, variant = 1) {
  return `https://placehold.co/800x1000/7A1F2B/FBEEDD.png?text=${encodeURIComponent(title)}+${variant}`;
}

export function productImage(images: string[] | undefined, title: string, index = 0) {
  return images?.[index] ?? placeholderImage(title, index + 1);
}
