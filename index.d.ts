export type Mystery =
    | 'joyful'
    | 'sorrowful'
    | 'glorious'
    | 'luminous'

export type Language =
    | 'en'
    | 'la'
    | 'it'
    | 'ar'

export interface RosarioOptions {
    mystery?: Mystery
    lang?: Language
    includeConcludingPrayers?: boolean
}

export interface RosarioCurrent {
    type: 'prayer' | 'mystery'
    key: string
    text: string
}

export interface RosarioSession {
    next(): void

    current(): RosarioCurrent

    done(): boolean

    reset(): void

    getDailyMystery(): string
}

export default function rosario(
    options?: RosarioOptions
): Promise<RosarioSession>
