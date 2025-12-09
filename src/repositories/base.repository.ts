import { Entity } from "dynamodb-toolbox";

export abstract class BaseRepository<T extends Record<string, any>> {
  protected entity: Entity<any>;
  protected entityName: string;
  protected abstract getPartitionKey(): string;

  constructor(entity: Entity<any>, entityName: string) {
    this.entity = entity;
    this.entityName = entityName;
  }

  async create(item: T): Promise<T> {
    try {
      await this.entity.put(item, {
        conditions: { attr: this.getPartitionKey(), exists: false }
      });
      return item;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}