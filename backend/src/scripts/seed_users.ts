import bcrypt from "bcrypt";
import User from "../models/user";
import { Roles } from "../enums/role.enum";

export default async function seedUsers() {
  try {
    
    const count = await User.count();

    if (count > 0) {
      console.log("Users already exist, skipping seed");
      return;
    }

    console.log("Seeding users...");

    const users = [
      {
        u_name: "Jens Kohler",
        u_email: "jens.kohler@example.com",
        password: "Kohler",
        u_role: Roles.ADMIN,
      },
      {
        u_name: "Test Admin",
        u_email: "test.admin@example.com",
        password: "TestAdmin",
        u_role: Roles.ADMIN,
      },
      {
        u_name: "Test User",
        u_email: "test.user@example.com",
        password: "user",
        u_role: Roles.USER,
      },
      {
        u_name: "Test User A",
        u_email: "testa@example.com",
        password: "userA",
        u_role: Roles.USER,
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        u_name: user.u_name,
        u_email: user.u_email,
        u_password: hashedPassword,
        u_role: user.u_role,
      });

      console.log(`Inserted: ${user.u_email}`);
    }

    console.log("Users seeding completed ");
  } catch (error) {
    console.error("Seed users error:", error);
  }
}