import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export const NameValidator = (fieldName: string) => {
  const minLength = 1;
  const maxLength = 15;
  return (
    IsString({ message: `${fieldName} is invalid!` }) &&
    IsNotEmpty({ message: `${fieldName} cannot be empty!` }) &&
    Length(minLength, maxLength, {
      message: `${fieldName} length must be between ${minLength} and ${maxLength}!`,
    }) &&
    Matches('^([0-9a-z\\-\\_])+$', undefined, {
      message: `${fieldName} is invalid!`,
    })
  );
};
