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

  async delete(id: string): Promise<boolean> {
    try {
      const key = { [this.getPartitionKey()]: id };
      await this.entity.delete(key);
      return true;
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const key = { [this.getPartitionKey()]: id };
      const result = await this.entity.get(key) as { Item?: T };

      return result.Item ? (result.Item as T) : null;
    } catch (e: any) {
      throw e;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const result = await this.entity.scan();
      return (result.Items || []) as T[];
    } catch (e) {
      throw e;
    }
  }

  async findByIdOrFail(id: string): Promise<T> {
    const item = await this.findById(id);
    if (!item) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  async update(item: Partial<T> & { [key: string]: any }): Promise<T | null> {
    try {
      const result = await this.entity.update(item, { returnValues: 'ALL_NEW'}) as any;
      return result.Attributes ? (result.Attributes as T) : null;
    } catch (e) {
      throw e;
    }
  }
}
