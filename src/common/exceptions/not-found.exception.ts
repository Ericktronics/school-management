import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`);
  }
}

export class EntityByFieldNotFoundException extends NotFoundException {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} with ${field} "${value}" not found`);
  }
}
