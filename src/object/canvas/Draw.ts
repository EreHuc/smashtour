export abstract class Draw {
    abstract draw: (...args: any[]) => { canvas: OffscreenCanvas; shouldDraw?: boolean }
}
