const ValidationsService = {
    validateSinglePsiJson: (data?: string): boolean => {
        return data!= null && data.startsWith('psiData');
    },
};

export default ValidationsService;