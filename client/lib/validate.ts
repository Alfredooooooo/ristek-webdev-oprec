import {
    BioDataProps,
    LoginProps,
    ProfilePictureDataProps,
    ProfilePictureErrorProps,
    RegisterDataProps,
} from '@/lib/interface';

export function validateLogin(values: LoginProps) {
    const errors: Partial<LoginProps> = {};
    if (!values.email) {
        errors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password = 'Password must be between 6 and 20 characters';
    } else if (values.password.includes(' ')) {
        errors.password = "Password can't contain spaces";
    }

    return errors;
}

export function validateRegister(values: RegisterDataProps) {
    const errors: Partial<RegisterDataProps> = {};

    if (!values.fullName) {
        errors.fullName = 'Username is required';
    } else if (values.fullName.length < 3 || values.fullName.length > 20) {
        errors.fullName = 'Username must be between 3 and 20 characters';
    }

    if (!values.email) {
        errors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password = 'Password must be between 6 and 20 characters';
    } else if (values.password.includes(' ')) {
        errors.password = "Password can't contain spaces";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

export function validateBio(values: BioDataProps) {
    const errors: Partial<BioDataProps> = {};

    if (!values.bio) {
        errors.bio = 'Bio is required';
    } else if (values.bio.length < 10) {
        errors.bio = 'Bio must be at least 10 characters';
    }

    return errors;
}

export function validateProfilePicture(values: ProfilePictureDataProps) {
    const errors: Partial<ProfilePictureErrorProps> = {};

    if (!values.profilePicture) {
        errors.profilePicture = 'Profile Picture is required';
    }

    return errors;
}
