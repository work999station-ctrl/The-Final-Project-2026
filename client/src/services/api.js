export const updateProfileData = async (fieldName, value) => {
    const formData = new FormData();
    let key = fieldName.replace(/\s+/g, '_');
    if (fieldName === 'profile_picture' || fieldName === 'profilePicture') {
        key = 'profile_picture';
    }

    if (Array.isArray(value)) {
        value.forEach(item => {
            formData.append(key, item);
        });
    } else {
        formData.append(key, value);
    }

    try {
        const response = await fetch('/api/student/profile', {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            console.log(`Successfully updated profile field: ${key}`);
            return await response.json();
        } else {
            console.error(`Failed to update profile field: ${key}`, response.statusText);
            throw new Error(`Failed to update profile field: ${key}`);
        }
    } catch (error) {
        console.error('Error updating profile information:', error);
        throw error;
    }
};

export const submitStudentSignup = async (formData) => {
    try {
        const res = await fetch('/api/studentSignup', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error('Error in signing up:', err);
        throw err;
    }
};
