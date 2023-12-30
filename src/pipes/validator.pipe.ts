import { ValidationPipe } from '@nestjs/common';
import { translateToPtBR } from './translate-to-pt-br';

export const APP_VALIDATION_PIPE = new ValidationPipe({
  exceptionFactory: (errors) => {
    const result = errors.map((error) => {
      const [key] = Object.keys(error.constraints);
      error.constraints[key] = translateToPtBR(error.constraints[key]);

      return {
        property: error.property,
        message: error.constraints[key],
      };
    });
    return result;
  },
  stopAtFirstError: true,
});
