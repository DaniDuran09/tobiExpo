
interface DerwomersPageProps {
    isLoading: boolean
    derwomersBrands: string[]
    dewormersFrequency?: { text: string; days: number }[]
    selectedPet: Pet
    allDerwomers: any[]
    refreshData: () => void
}


    