interface IndividualDieResult {
    sides: number
    groupId: number
    rollId: number
    theme: string
    themeColor: string
    value: number
}

declare module '@3d-dice/dice-box' {
    export default class DiceBox {
        constructor(
            id: string,
            settings: { assetPath: string; theme?: string; themeColor?: string; throwForce?: number; gravity?: number }
        )

        init(): Promise<void>
        roll(notation: string[], options?: { theme: string; newStartPoint: boolean }): Promise<IndividualDieResult[]>
        clear()
        hide()
        show()
    }
}
