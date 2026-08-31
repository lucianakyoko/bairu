import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "atLeastOneField", async: false })
class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const object = args.object as Record<string, unknown>;

    return args.constraints.some(
      (field: string) => object[field] !== undefined,
    );
  }

  defaultMessage(): string {
    return "At least one field must be provided.";
  }
}

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
): ClassDecorator {
  return (target) => {
    registerDecorator({
      target,
      propertyName: "__atLeastOneField",
      name: "atLeastOneField",
      constraints: fields,
      ...(validationOptions !== undefined
        ? { options: validationOptions }
        : {}),
      validator: AtLeastOneFieldConstraint,
    });
  };
}
