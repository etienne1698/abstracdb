import { Database } from "./Database";
import { Model } from "./Model";
import { OperatorValueType, Query, QueryType } from "./Query";
import type { ModelConstructor, RelationsOf } from "./types";

export class QueryBuilder<M extends Model> {
  #database!: Database;
  #model!: ModelConstructor<M>;

  declare query: Query;

  #fnFilters: Array<(m: M) => boolean> = [];

  constructor(database: Database, model: ModelConstructor<M>, type: QueryType) {
    this.#database = database;
    this.#model = model;
    this.query = {
      filters: {
        $eq: {},
        $in: {},
        $ne: {},
      },
      with: new Set<string>(),
      type,
    };
  }

  with(...relations: RelationsOf<M>[]) {
    relations.forEach((r) => {
      this.query.with.add(r);
    });
    return this;
  }

  filter(f: (m: M) => boolean) {
    this.#fnFilters.push(f);
    return this;
  }

  where<T extends keyof OperatorValueType>(
    field: string,
    op: T,
    value: OperatorValueType[T]
  ) {
    // @ts-ignore
    this.query.filters[op][field] = value;
    return this;
  }

  whereEq(field: string, value: any) {
    return this.where(field, "$eq", value);
  }

  whereNe(field: string, value: any) {
    return this.where(field, "$ne", value);
  }

  whereIn(field: string, value: Array<any>) {
    return this.where(field, "$in", value);
  }


  get() {
   return this.#database.get(this.#model, this.query);
  }

  getFirst() {
    return this.get()?.[0];
  }
}
