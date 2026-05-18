export const getRandomImage = () => {
  const seed = Date.now() + Math.random();
  return `https://picsum.photos/seed/${seed}/1920/1080`;
};
