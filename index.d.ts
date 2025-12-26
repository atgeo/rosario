export type Mystery =
    | 'joyful'
    | 'sorrowful'
    | 'glorious'
    | 'luminous'

export interface RosarioOptions {
    mystery?: Mystery
    lang?: string
}

export interface RosarioCurrent {
    prayer: string
    text: string
}

export interface RosarioSession {
    next(): void

    current(): RosarioCurrent

    done(): boolean

    reset(): void
}

export default function rosario(
    options?: RosarioOptions
): Promise<RosarioSession>
