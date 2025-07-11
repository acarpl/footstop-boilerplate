import apiClient from '../apiClient';

export const updateMyProfile = async (profileData: any) => {
    try {
        const response = await apiClient.get('/profile', profileData);
        return response.data;
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
    }
};