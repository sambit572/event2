export const getCategoryImage = (name) => ({
  src: `/categories/${name}-480.webp`,
  srcSet: `
    /categories/${name}-320.webp 320w,
    /categories/${name}-480.webp 480w,
    /categories/${name}-768.webp 768w,
    /categories/${name}-1024.webp 1024w
  `,
});
