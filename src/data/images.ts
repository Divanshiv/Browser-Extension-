export const getRandomImage = (): string => {
  const seed = Date.now() + Math.random();
  return `https://picsum.photos/seed/${seed}/1920/1080`;
};
