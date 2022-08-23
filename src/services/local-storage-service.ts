const LocalStorageService = {
    getPsi: (): string | null => localStorage.getItem("PsiData"),
    setPsi: (psiToSave: string): void => localStorage.setItem("PsiData", psiToSave),
};

export default LocalStorageService;