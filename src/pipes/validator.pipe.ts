import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const APP_VALIDATION_PIPE = new ValidationPipe({
  exceptionFactory: (errors) => {
    console.log(errors);

    const result = errors.map((error) => {
      const [key] = Object.keys(error.constraints);
      error.constraints[key] = error.constraints[key]
        .replace('must be a', 'deve ser uma')
        .replace(
          'conforming to the specified constraints',
          'conforme as regras especificadas',
        );
      return {
        property: error.property,
        message: error.constraints[key],
      };
    });
    return new BadRequestException(result);
  },
  stopAtFirstError: true,
});
