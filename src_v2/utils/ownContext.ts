export const ownContext = <T extends OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D>(
    context: T,
    fn: (context: T) => void
) => {
    context.save()
    fn(context)
    context.restore()
}
