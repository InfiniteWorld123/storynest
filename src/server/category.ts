import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storyCategory } from "#/db/schema";
import { conflictError } from "#/errors/app-error";
import { catchAsyncFn } from "#/errors/error-handler";
import type { ServerOk } from "#/server/_types";
import { createCategorySchema } from "#/validation/category.schema";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

type CategoryPayload = {
  id: string;
  name: string;
  slug: string;
};

export const getCategories = createServerFn({ method: "GET" }).handler(
  catchAsyncFn(async (): ServerOk<{ categories: CategoryPayload[] }> => {
    const categories = await db
      .select({
        id: storyCategory.id,
        name: storyCategory.name,
        slug: storyCategory.slug,
      })
      .from(storyCategory)
      .orderBy(asc(storyCategory.name));

    return jsonOk({
      data: {
        categories,
      },
      message: "Categories loaded successfully",
    });
  }),
);

export const createCategory = createServerFn({ method: "POST" })
  .inputValidator(createCategorySchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<{ category: CategoryPayload }> => {
      const existingCategories = await db
        .select({ id: storyCategory.id })
        .from(storyCategory)
        .where(eq(storyCategory.slug, data.slug))
        .limit(1);

      if (existingCategories[0]) {
        throw conflictError("Category already exists");
      }

      const categoryId = crypto.randomUUID();

      await db.insert(storyCategory).values({
        id: categoryId,
        name: data.name,
        slug: data.slug,
      });

      return jsonOk({
        data: {
          category: {
            id: categoryId,
            name: data.name,
            slug: data.slug,
          },
        },
        status: HttpStatusCode.CREATED,
        message: "Category created successfully",
      });
    }),
  );
