import prisma from "../../prisma/prisma";

prisma.order
  .deleteMany()
  .then(() => {
    console.log("Database reseted");
  })
  .catch((e) => {
    console.log(e);
  });
prisma.orderProducts
  .deleteMany()
  .then(() => {
    console.log("Database reseted");
  })
  .catch((e) => {
    console.log(e);
  });
prisma.product
  .deleteMany()
  .then(() => {
    console.log("Database reseted");
  })
  .catch((e) => {
    console.log(e);
  });
