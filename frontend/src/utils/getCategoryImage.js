export const getCategoryImage = (name) => ({
  src: `/categories/${name}-360.webp`,

  srcSet: `
    /categories/${name}-360.webp 360w,
    /categories/${name}-480.webp 480w,
    /categories/${name}-600.webp 600w
  `,

  sizes: `
    (max-width: 640px) 90vw,
    (max-width: 1024px) 45vw,
    360px
  `,

  width: 360,
  height: 200,
});
