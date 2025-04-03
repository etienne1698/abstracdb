import type { Datastore } from "../database/datastore";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import type { Schema } from "../schema/schema";
import type { InferModelFieldName, InferNormalizedSchema } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  SRelated extends Schema = Schema
> extends Relation<SRelated> {
  override getFor<From extends Model>(
    model: From,
    _data: any,
    store: Datastore
  ): InferNormalizedSchema<SRelated> {
    return (
      new QueryBuilder(store, this.related)
        // @ts-ignore
        .byPrimary([model[this.field]])
        .getFirst()
    );
  }
}

export function belongsTo<From extends Model, M extends Model = Model>(
  model: M,
  field: string
) {
  return new BelongsToRelation(model, field);
}
