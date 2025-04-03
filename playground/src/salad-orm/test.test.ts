import { expect, test } from "vitest";
import { collection, relations, setupDatabase, string } from ".";

const users = collection("users", {
  id: string("id", ""),
});

const pets = collection("pets", {
  id: string("id", ""),
  user_id: string("id", ""),
});

const usersRelations = relations(users, ({ hasMany }) => ({
  pets: hasMany(pets, "user_id"),
}));

const petsRelations = relations(pets, ({ belongsTo }) => ({
  user: belongsTo(users, "user_id"),
}));

const db = setupDatabase(
  // @ts-ignore
  {},
  {
    users,
    pets,
    usersRelations,
    petsRelations,
  }
);

test("test", () => {
  console.error(db.schema.users.relations.pets);
  expect(db.schema.pets.dbName).toBe("pets");
});
