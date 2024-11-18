const prisma = require("./index");

const seed = async () => {
  const users = [];
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        name: `USer ${i + 1}`,
        playlists: {
          create: Array.from({ length: 5}).map((_, j) => ({
            name: `Playlist ${j + 1} for user ${i + 1}`
          }))
        }
      }
    });
    users.push(user);
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async(e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })