import connectMongoDB from "../config/mongodb";
import sequelize from "../config/db";

import seedProducts from "./seed-products";
import seedUsers from "./seed_users";

async function seedAll() {
  try {
    console.log("Starting seeding...");

    await connectMongoDB();
    await sequelize.sync();

    // active/deactive seeding as needed
    const seedMongo = false;
    const seedPostgres = true;

    if (seedMongo) {
      await seedProducts();
    }

    if (seedPostgres) {
      await seedUsers();
    }

    console.log("Seeding completed ");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedAll();