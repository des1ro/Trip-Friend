type ErrorName = "CATEGORY_NOT_FOUND";
export class CategoryError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}
