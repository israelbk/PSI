const LocalStorageService = {
    getPsi: (): string | null => localStorage.getItem("PsiData"),
    setPsi: (psiToSave: string): void => void 0,
};

export default LocalStorageService;