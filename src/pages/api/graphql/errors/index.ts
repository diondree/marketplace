import { createError } from 'apollo-errors';

export const InvalidEmailError = createError('InvalidEmail', {
  message: 'Invalid email address provided',
});

export const InvalidPasswordError = createError('InvalidPassword', {
  message: 'Invalid password. Password must be at least 6 characters.',
});

export const DuplicateEmailError = createError('DuplicateEmail', {
  message: 'A user with this email address already exists.',
});

export const InvalidCredentialsError = createError('InvalidCredentials', {
  message: 'Email address or password incorrect.',
});

export const InvalidTokenError = createError('InvalidToken', {
  message: 'Invalid JWT provided.',
});

export const AddProductError = createError('AddProductError', {
  message: 'Something went wrong adding your product. Please try again later',
});

export const ImageUploadError = createError('ImageUpload', {
  message:
    'Image failed to upload. Please ensure image(s) is in the correct format and try again!',
});

export const InvalidImageError = createError('InvalidImage', {
  message: 'Invalid Image type. You are only allowed to upload valid image(s)',
});
