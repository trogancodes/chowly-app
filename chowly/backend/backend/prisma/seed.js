// Seeds the database with two live restaurants, each with its own menu and staff.
// This is the "menu loaded into the database by you" and "staff list you loaded
// yourself" the assignment asks for.
//
// Every "ensure" helper below is idempotent: it looks for an existing row before
// creating one. This matters because the free Render plan has no Shell access, so
// this script runs automatically every time the server starts (see the Start
// Command). Without idempotency, every restart would either wipe live orders or
// duplicate the menu — instead, re-running this is always safe.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function ensureCategory(categoryName) {
  const existing = await prisma.menuCategory.findFirst({ where: { categoryName } });
  if (existing) return existing;
  return prisma.menuCategory.create({ data: { categoryName } });
}

async function ensureRestaurant(data) {
  const existing = await prisma.restaurant.findFirst({ where: { name: data.name } });
  if (existing) return existing;
  return prisma.restaurant.create({ data });
}

async function ensureMenuItem(restaurantId, categoryId, item) {
  const existing = await prisma.menuItem.findFirst({
    where: { restaurantId, itemName: item.itemName },
  });
  if (existing) return existing;
  return prisma.menuItem.create({ data: { restaurantId, categoryId, ...item } });
}

async function ensureWaiter(restaurantId, data) {
  const existing = await prisma.waiter.findFirst({ where: { restaurantId, fullName: data.fullName } });
  if (existing) return existing;
  return prisma.waiter.create({ data: { restaurantId, ...data } });
}

async function ensureChef(restaurantId, data) {
  const existing = await prisma.chef.findFirst({ where: { restaurantId, fullName: data.fullName } });
  if (existing) return existing;
  return prisma.chef.create({ data: { restaurantId, ...data } });
}

async function ensureBartender(restaurantId, data) {
  const existing = await prisma.bartender.findFirst({ where: { restaurantId, fullName: data.fullName } });
  if (existing) return existing;
  return prisma.bartender.create({ data: { restaurantId, ...data } });
}

async function seedRestaurant(restaurantData, menuItems, waiters, chefs, bartenders) {
  const restaurant = await ensureRestaurant(restaurantData);
  const food = await ensureCategory("Food");
  const drinks = await ensureCategory("Drinks");

  for (const item of menuItems) {
    const categoryId = item.category === "Food" ? food.id : drinks.id;
    const { category, ...rest } = item;
    await ensureMenuItem(restaurant.id, categoryId, rest);
  }
  for (const w of waiters) await ensureWaiter(restaurant.id, w);
  for (const c of chefs) await ensureChef(restaurant.id, c);
  for (const b of bartenders) await ensureBartender(restaurant.id, b);

  return restaurant;
}

async function main() {
  console.log("Seeding Chowly database (safe to run repeatedly)...");

  const grandPlate = await seedRestaurant(
    {
      name: "The Grand Plate",
      address: "12 Adeola Odeku St, Victoria Island, Lagos",
      phoneNumber: "+2348012345678",
      email: "info@grandplate.com",
      openingHours: "10:00 - 23:00 (Mon-Fri), Closed weekends",
    },
    [
      { itemName: "Jollof Rice & Grilled Chicken", description: "Smoky party jollof rice with a herb-grilled chicken thigh.", price: 8500, avgPreparationTimeMins: 20, category: "Food" },
      { itemName: "Suya Platter", description: "Spiced grilled beef skewers with onions and pepper mix.", price: 6500, avgPreparationTimeMins: 15, category: "Food" },
      { itemName: "Egusi Soup & Pounded Yam", description: "Melon-seed soup with assorted meat, served with pounded yam.", price: 9000, avgPreparationTimeMins: 25, category: "Food" },
      { itemName: "Grilled Tilapia", description: "Whole grilled tilapia with pepper sauce and plantain.", price: 10500, avgPreparationTimeMins: 22, category: "Food" },
      { itemName: "Chapman", description: "The house mocktail — citrus, grenadine, a little fizz.", price: 3000, avgPreparationTimeMins: 5, category: "Drinks" },
      { itemName: "Zobo", description: "Chilled hibiscus drink with ginger and pineapple.", price: 2000, avgPreparationTimeMins: 4, category: "Drinks" },
      { itemName: "Fresh Fruit Juice", description: "Watermelon, pineapple or orange, pressed to order.", price: 2500, avgPreparationTimeMins: 5, category: "Drinks" },
      { itemName: "Espresso", description: "Double shot, pulled fresh.", price: 1500, avgPreparationTimeMins: 3, category: "Drinks" },
    ],
    [
      { fullName: "Femi Johnson", phoneNumber: "+2348040000001", shiftSchedule: "Morning Shift" },
      { fullName: "Grace Udo", phoneNumber: "+2348040000002", shiftSchedule: "Evening Shift" },
    ],
    [
      { fullName: "Bola Martins", specialty: "Continental & Local Dishes", phoneNumber: "+2348050000001" },
    ],
    [
      { fullName: "Kunle Adeyemi", phoneNumber: "+2348060000001" },
    ]
  );

  const cafeRoma = await seedRestaurant(
    {
      name: "Cafe Roma",
      address: "5 Allen Avenue, Ikeja, Lagos",
      phoneNumber: "+2348023456789",
      email: "hello@caferoma.com",
      openingHours: "08:00 - 22:00 (Mon-Fri), 14:00 - 22:00 (Sat-Sun)",
    },
    [
      { itemName: "Margherita Pizza", description: "San Marzano tomato, fior di latte, fresh basil.", price: 7200, avgPreparationTimeMins: 15, category: "Food" },
      { itemName: "Spaghetti Carbonara", description: "Guanciale, pecorino, black pepper, no cream.", price: 7800, avgPreparationTimeMins: 18, category: "Food" },
      { itemName: "Caprese Salad", description: "Buffalo mozzarella, heirloom tomato, basil oil.", price: 5200, avgPreparationTimeMins: 8, category: "Food" },
      { itemName: "Tiramisu", description: "Espresso-soaked sponge, mascarpone, cocoa.", price: 4000, avgPreparationTimeMins: 5, category: "Food" },
      { itemName: "Espresso", description: "Double shot, pulled fresh.", price: 1500, avgPreparationTimeMins: 3, category: "Drinks" },
      { itemName: "Aperol Spritz", description: "Aperol, prosecco, soda, orange slice.", price: 4500, avgPreparationTimeMins: 4, category: "Drinks" },
      { itemName: "Fresh Fruit Juice", description: "Watermelon, pineapple or orange, pressed to order.", price: 2500, avgPreparationTimeMins: 5, category: "Drinks" },
    ],
    [
      { fullName: "Grace Udo", phoneNumber: "+2348040000002", shiftSchedule: "Evening Shift" },
    ],
    [
      { fullName: "Marco Rossi", specialty: "Grills & Italian Cuisine", phoneNumber: "+2348050000002" },
    ],
    [
      { fullName: "Ifeoma Nwosu", phoneNumber: "+2348060000002" },
    ]
  );

  console.log("Seed complete. Restaurants:", grandPlate.id, cafeRoma.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
