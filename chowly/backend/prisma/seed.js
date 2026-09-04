// Seeds the database with one live restaurant, its menu, and its staff.
// This is the "menu loaded into the database by you" and "staff list you loaded
// yourself" the assignment asks for. Run with: npm run prisma:seed
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Chowly database...");

  // Clear existing data (safe for re-seeding a demo environment)
  await prisma.feedback.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.waiter.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.bartender.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "The Grand Plate",
      address: "12 Adeola Odeku St, Victoria Island, Lagos",
      phoneNumber: "+2348012345678",
      email: "info@grandplate.com",
      openingHours: "10:00 - 23:00 (Mon-Fri), Closed weekends",
    },
  });

  const food = await prisma.menuCategory.create({ data: { categoryName: "Food" } });
  const drinks = await prisma.menuCategory.create({ data: { categoryName: "Drinks" } });

  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        categoryId: food.id,
        itemName: "Jollof Rice & Grilled Chicken",
        description: "Smoky party jollof rice with a herb-grilled chicken thigh.",
        price: 8500,
        avgPreparationTimeMins: 20,
      },
      {
        restaurantId: restaurant.id,
        categoryId: food.id,
        itemName: "Suya Platter",
        description: "Spiced grilled beef skewers with onions and pepper mix.",
        price: 6500,
        avgPreparationTimeMins: 15,
      },
      {
        restaurantId: restaurant.id,
        categoryId: food.id,
        itemName: "Egusi Soup & Pounded Yam",
        description: "Melon-seed soup with assorted meat, served with pounded yam.",
        price: 9000,
        avgPreparationTimeMins: 25,
      },
      {
        restaurantId: restaurant.id,
        categoryId: food.id,
        itemName: "Grilled Tilapia",
        description: "Whole grilled tilapia with pepper sauce and plantain.",
        price: 10500,
        avgPreparationTimeMins: 22,
      },
      {
        restaurantId: restaurant.id,
        categoryId: drinks.id,
        itemName: "Chapman",
        description: "The house mocktail — citrus, grenadine, a little fizz.",
        price: 3000,
        avgPreparationTimeMins: 5,
      },
      {
        restaurantId: restaurant.id,
        categoryId: drinks.id,
        itemName: "Zobo",
        description: "Chilled hibiscus drink with ginger and pineapple.",
        price: 2000,
        avgPreparationTimeMins: 4,
      },
      {
        restaurantId: restaurant.id,
        categoryId: drinks.id,
        itemName: "Fresh Fruit Juice",
        description: "Watermelon, pineapple or orange, pressed to order.",
        price: 2500,
        avgPreparationTimeMins: 5,
      },
      {
        restaurantId: restaurant.id,
        categoryId: drinks.id,
        itemName: "Espresso",
        description: "Double shot, pulled fresh.",
        price: 1500,
        avgPreparationTimeMins: 3,
      },
    ],
  });

  await prisma.waiter.createMany({
    data: [
      { restaurantId: restaurant.id, fullName: "Femi Johnson", phoneNumber: "+2348040000001", shiftSchedule: "Morning Shift" },
      { restaurantId: restaurant.id, fullName: "Grace Udo", phoneNumber: "+2348040000002", shiftSchedule: "Evening Shift" },
    ],
  });

  await prisma.chef.createMany({
    data: [
      { restaurantId: restaurant.id, fullName: "Bola Martins", specialty: "Continental & Local Dishes", phoneNumber: "+2348050000001" },
      { restaurantId: restaurant.id, fullName: "Marco Rossi", specialty: "Grills & Italian Cuisine", phoneNumber: "+2348050000002" },
    ],
  });

  await prisma.bartender.createMany({
    data: [
      { restaurantId: restaurant.id, fullName: "Kunle Adeyemi", phoneNumber: "+2348060000001" },
      { restaurantId: restaurant.id, fullName: "Ifeoma Nwosu", phoneNumber: "+2348060000002" },
    ],
  });

  console.log("Seed complete. Restaurant ID:", restaurant.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
