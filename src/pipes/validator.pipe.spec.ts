import { ValidationError } from '@nestjs/common';
import { APP_VALIDATION_PIPE } from './validator.pipe';
const validationErrors: ValidationError[] = [
  {
    target: { name: undefined, age: undefined, breed: undefined },
    value: undefined,
    property: 'name',
    children: [],
    constraints: { isString: 'name must be a string' },
  },
  {
    target: { name: undefined, age: undefined, breed: undefined },
    value: undefined,
    property: 'age',
    children: [],
    constraints: {
      isNumber: 'age must be a number conforming to the specified constraints',
    },
  },
  {
    target: { name: undefined, age: undefined, breed: undefined },
    value: undefined,
    property: 'breed',
    children: [],
    constraints: { isString: 'breed must be a string' },
  },
];

describe('AppValidationPipe', () => {
  it('should translate and format validation errors', () => {
    const result = APP_VALIDATION_PIPE['exceptionFactory'](validationErrors);
    expect(result).toEqual([
      { property: 'name', message: 'name deve ser uma string' },
      {
        property: 'age',
        message: 'age deve ser uma number conforme as regras especificadas',
      },
      { property: 'breed', message: 'breed deve ser uma string' },
    ]);
  });

  it('should stop at the first validation error', () => {
    const result = APP_VALIDATION_PIPE['exceptionFactory']([
      validationErrors[0],
    ]);
    expect(result).toEqual([
      { property: 'name', message: 'name deve ser uma string' },
    ]);
  });
});
