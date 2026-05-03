/**
 * Calculate student profile completion percentage.
 * Formula: filled fields / 14 * 100
 *
 * The 14 fields are:
 *  1. name
 *  2. email
 *  3. phoneNumber
 *  4. university
 *  5. specialty
 *  6. currentYear
 *  7. country
 *  8. githubPortfolio
 *  9. baccalaureate
 * 10. bio
 * 11. degreeName
 * 12. expectedGraduationDate
 * 13. skills (at least 1)
 * 14. experience (at least 1)
 */
export const getProfileCompletion = (user) => {
    if (!user) return 0;

    const fields = [
        user.name,
        user.email,
        user.phoneNumber,
        user.university,
        user.specialty,
        user.currentYear,
        user.country,
        user.githubPortfolio,
        user.baccalaureate,
        user.bio,
        user.degreeName,
        user.expectedGraduationDate,
    ];

    let filled = fields.filter(f => f && String(f).trim() !== '').length;

    // skills counts as 1 field (filled if at least 1 skill)
    if (user.skills && user.skills.length > 0) filled++;

    // Academic Projects OR Experience counts as 1 field
    // Only one needs to be filled — having both and removing one won't decrease the score
    const hasProjects = user.academicProjects && user.academicProjects.length > 0;
    const hasExperience = user.experience && user.experience.length > 0;
    if (hasProjects || hasExperience) filled++;

    return Math.round((filled / 13) * 100);
};
