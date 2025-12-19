export type Mystery =
    | 'joyful'
    | 'sorrowful'
    | 'glorious'
    | 'luminous'

export interface RosarioOptions {
    mystery?: Mystery
}

export interface RosarioSession {
    next(): void

    current(): string

    done(): boolean
}

export default function rosario(
    options?: RosarioOptions
): RosarioSession
